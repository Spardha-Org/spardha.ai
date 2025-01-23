import asyncio
import logging

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
    metrics,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import deepgram, openai, silero,google
import json
import os
from utils.django_client import DjangoapiClient
from utils.schemas import *

load_dotenv()
logger = logging.getLogger("voice-assistant")

SERVER_URL = os.getenv("SERVER_URL")
# Initialize the server API client
serverapi = DjangoapiClient(base_url=SERVER_URL)
print("this is server url ",SERVER_URL)


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):

    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    participant = await ctx.wait_for_participant()
    participant_name = participant.name if participant.name else participant.identity or "User"
    logger.info(f"starting voice assistant for participant {participant.identity}") 

    try:
        metadata = json.loads(participant.metadata)
        print("Metadata parsed successfully:", metadata)
        
        # Access the metadata using dictionary keys
        usecase_id = metadata.get('usecase_id')  # Using .get() is safer to avoid KeyError
        lang = metadata.get('lang')

        # Ensure the keys exist
        if not usecase_id or not lang:
            raise ValueError("Missing usecase_id or lang in metadata")

        try:
            # Proceed with the API call using the correct values
            agent_prompts = await serverapi.get(
                endpoint=f"/api/get-primary-prompt/{usecase_id}/{lang}/",
                model=PrimaryPromptResponse
            )
            primary_prompt = agent_prompts.primary_prompt

        except Exception as api_error:
            # Handle any errors related to the API call
            print(f"Error occurred during the API call: {api_error}")

    except ValueError as e:
        print(f"Error: {e}")
    except json.JSONDecodeError as e:
        print(f"Error parsing metadata: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        logging.error(f"Unexpected error: {e}")

    initial_ctx = llm.ChatContext().append(
        role="system",
        text=primary_prompt,
    )

    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=google.TTS(credentials_file="./cred.json",voice_name="en-US-Journey-D"),
        chat_ctx=initial_ctx,
    )

    agent.start(ctx.room, participant)

    usage_collector = metrics.UsageCollector()

    @agent.on("metrics_collected")
    def _on_metrics_collected(mtrcs: metrics.AgentMetrics):
        metrics.log_metrics(mtrcs)
        usage_collector.collect(mtrcs)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: ${summary}")

    ctx.add_shutdown_callback(log_usage)
    
    chat = rtc.ChatManager(ctx.room)

    async def answer_from_text(txt: str):
        chat_ctx = agent.chat_ctx.copy()
        chat_ctx.append(role="user", text=txt)
        stream = agent.llm.chat(chat_ctx=chat_ctx)
        await agent.say(stream)

    @chat.on("message_received")
    def on_chat_received(msg: rtc.ChatMessage):
        agent._interrupt_if_possible()
        if msg.message:
            asyncio.create_task(answer_from_text(msg.message))

    async def shutdown_hook():
        logger.info("Shutdown hook called, saving state.")
        conversations = []
        
        for msg in agent.chat_ctx.messages:
            if msg.role != "system":
                conversation = {"role": msg.role, "content": msg.content, "name": "agent" if msg.role == "assistant" else participant_name}
                conversations.append(conversation)

        end_session_request = {"session_id" : session_id, "conversations" : json.dumps(conversations)}
        await serverapi.post(endpoint="/session/end", model = EndSessionResponse, json = end_session_request)

    ctx.add_shutdown_callback(shutdown_hook)

    await agent.say("Hey, how can I help you today?", allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        ),
    )   
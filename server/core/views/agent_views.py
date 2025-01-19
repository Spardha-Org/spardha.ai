import os
import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pydantic import BaseModel, ValidationError
from dotenv import load_dotenv
from livekit import api

# Load environment variables
load_dotenv()

# Set up logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Define a model for the request body
class TokenRequest(BaseModel):
    userName: str
    room_name: str
    usecase_id:str
    lang:str

@csrf_exempt
def generate_access_token(request):
    if request.method == "POST":
        try:
            # Parse and validate the request body
            body = json.loads(request.body)
            token_request = TokenRequest(**body)

            # Log request details
            logger.info(f"Request received for user: {token_request.userName}")

            api_key = os.getenv("LIVEKIT_API_KEY")
            api_secret = os.getenv("LIVEKIT_API_SECRET")
            livekit_url = os.getenv("LIVEKIT_URL")      

            if not api_key or not api_secret or not livekit_url:
                logger.error("Missing required environment variables for LiveKit.")
                return JsonResponse({"error": "Server configuration error"}, status=500)

            # Generate metadata
            metadata = json.dumps({"userName": token_request.userName,"usecase_id":token_request.usecase_id,"lang":token_request.lang})

            # Create the access token
            token = api.AccessToken(api_key, api_secret) \
                .with_identity(token_request.userName) \
                .with_name(token_request.userName) \
                .with_metadata(metadata) \
                .with_grants(api.VideoGrants(
                    room=token_request.room_name,
                    room_join=True,
                    can_publish=True,
                    can_publish_data=True,
                    can_subscribe=True,
                )).to_jwt()

            # Respond with the generated token
            return JsonResponse({
                "access_token": token,
                "url": livekit_url,
                "room_name": token_request.room_name,
            })

        except ValidationError as ve:
            logger.error(f"Validation error: {ve}")
            return JsonResponse({"error": "Invalid request data", "details": ve.errors()}, status=400)
        except Exception as e:
            logger.exception("Error generating access token")
            return JsonResponse({"error": "Internal server error", "details": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)

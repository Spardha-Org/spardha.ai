# dbapp/views.py
from django.http import HttpResponse,JsonResponse
import requests
from .models import *
from django.shortcuts import get_object_or_404
import json
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime


def hello_world(request):
    return HttpResponse("Hello, World!")


def get_daily_quote(request):
    try:
        # Call the ZenQuotes API
        response = requests.get("https://zenquotes.io/api/random")
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx and 5xx)

        # Parse the response JSON
        data = response.json()
        quote = data[0].get("q", "Quote not found")
        author = data[0].get("a", "Unknown Author")

        # Return the quote and author as JSON
        return JsonResponse({"quote": quote, "author": author})
    except requests.RequestException as e:
        return JsonResponse(
            {"error": "Failed to fetch the quote", "details": str(e)}, status=500
        )
    
def get_primary_prompt(request, agent_id, language):
    # Validate the language parameter
    if language not in [lang.value for lang in LanguageEnum]:
        return JsonResponse({'error': 'Invalid language'}, status=400)

    # Fetch the prompt matching the agent ID and language
    prompt = get_object_or_404(Prompt, agent_id=agent_id, language=language)

    # Return the primary prompt
    return JsonResponse({'primary_prompt': prompt.primary_prompt,"summary_promopt":prompt.summary_prompt,"suggestion_prompt":prompt.suggestion_prompt})

@csrf_exempt
def session(request):
    if request.method == 'POST':
        try:
            # Parse the request body
            data = json.loads(request.body)
            user_email = data.get('email')
            agent_id = data.get('agent_id')

            # Validate required fields
            if not user_email or not agent_id:
                return JsonResponse({'error': 'email and agent_id are required.'}, status=400)

            # Check if user exists
            user = get_object_or_404(User, email=user_email)

            # Check if agent exists
            agent = get_object_or_404(Agent, id=agent_id)

            # Create a new session
            session = Session.objects.create(
                id=uuid.uuid4(),
                user=user,
                agent=agent,
                conversation='',  # Empty initially
                summary='',       # Empty initially
                status='active',
                created_at=datetime.now(),
                updated_at=datetime.now()
            )

            return JsonResponse({'session_id': str(session.id)}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input.'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'PUT':
        try:
            # Parse the request body
            data = json.loads(request.body)
            session_id = data.get('session_id')
            conversation = data.get('conversation')
            summary = data.get('summary')

            # Validate required fields
            if not session_id or (not conversation and not summary):
                return JsonResponse({'error': 'session_id and at least one of conversation or summary are required.'}, status=400)

            # Check if session exists
            session = get_object_or_404(Session, id=session_id)

            # Update fields if provided
            if conversation is not None:
                session.conversation = conversation
            if summary is not None:
                session.summary = summary

            session.save()  # Save updates to the database

            return JsonResponse({'message': 'Session updated successfully.'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input.'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method. Use POST or PUT.'}, status=405)

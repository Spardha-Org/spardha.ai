# session_views.py

from django.http import JsonResponse
from ..models.session import Session
from ..models.user import User
from ..models.agent import Agent
from django.shortcuts import get_object_or_404
import json
import uuid
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt


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

# dbapp/views.py
from django.http import HttpResponse,JsonResponse
import requests
from .models import *
from django.shortcuts import get_object_or_404


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
    return JsonResponse({'primary_prompt': prompt.primary_prompt})
from django.http import HttpResponse,JsonResponse
import requests
from ..models.user import User
from ..models.agent import Agent
from ..models.prompt import Prompt
from ..models.prompt import LanguageEnum
from ..models.session import Session
from ..models.session import Session
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
# prompt_views.py

from django.http import JsonResponse
from ..models.prompt import Prompt
from ..models.prompt import LanguageEnum
from django.shortcuts import get_object_or_404

def get_primary_prompt(request, agent_id, language):
    # Validate the language parameter
    if language not in [lang.value for lang in LanguageEnum]:
        return JsonResponse({'error': 'Invalid language'}, status=400)

    # Fetch the prompt matching the agent ID and language
    prompt = get_object_or_404(Prompt, agent_id=agent_id, language=language)

    # Return the primary prompt
    return JsonResponse({'primary_prompt': prompt.primary_prompt, "summary_prompt": prompt.summary_prompt, "suggestion_prompt": prompt.suggestion_prompt})

from django.db import models
import uuid
from enum import Enum

class LanguageEnum(Enum):
    ENGLISH = 'en'
    KANNADA = 'kn'

# Prompt model with separate fields for each language
class Prompt(models.Model):
    # UUID field for primary key
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    # ForeignKey to link this prompt to an agent
    agent = models.ForeignKey(
        'Agent',
        on_delete=models.CASCADE,
        related_name="prompts"
    )

    # Language field for the prompt (using Enum)
    language = models.CharField(
        max_length=2,
        choices=[(lang.value, lang.name) for lang in LanguageEnum],  # Updated to use lang.value
        default=LanguageEnum.ENGLISH.value  # Default now uses the actual string value
    )

    # Three different prompt text fields for each type (primary, suggestion, summary)
    primary_prompt = models.TextField(null=True, blank=True, help_text="Primary prompt text")
    suggestion_prompt = models.TextField(null=True, blank=True, help_text="Suggestion prompt text")
    summary_prompt = models.TextField(null=True, blank=True, help_text="Summary prompt text")

    def __str__(self):
        return f"{self.agent.specialization_name} ({self.language})"

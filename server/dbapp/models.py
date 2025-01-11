from django.db import models
import uuid
from enum import Enum

class User(models.Model):
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False
    )  # Use UUID as the primary key
    username = models.CharField(max_length=150, unique=True)  # Unique username
    email = models.EmailField(unique=True)  # Unique email
    hashed_password = models.CharField(max_length=128)  # Store hashed passwords
    created_at = models.DateTimeField(auto_now_add=True)  # CAT - Created At
    updated_at = models.DateTimeField(auto_now=True)  # UAT - Updated At
    first_name = models.CharField(max_length=50, blank=True, null=True)  # Optional
    last_name = models.CharField(max_length=50, blank=True, null=True)  # Optional
    is_active = models.BooleanField(default=True)  # Active status
    is_admin = models.BooleanField(default=False)  # Admin privileges

    def __str__(self):
        return self.username

class Agent(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    specialization_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.specialization_name

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

    
class Session(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(
        'User',  # Assuming 'User' model is in the same app
        on_delete=models.CASCADE,
        related_name="sessions"
    )  # Link to User table
    agent = models.ForeignKey(
        'Agent',  # Assuming 'Agent' model is in the same app
        on_delete=models.CASCADE,
        related_name="sessions"
    )  # Link to Agent table
    conversation = models.TextField()  # Stores conversation details
    summary = models.TextField(null=True, blank=True)  # Summary of the session (optional)
    status = models.CharField(
        max_length=50,
        choices=[('active', 'Active'), ('completed', 'Completed'), ('inactive', 'Inactive')],
        default='active'
    )  # Status of the session (active, completed, etc.)
    created_at = models.DateTimeField(auto_now_add=True)  # CAT - Created At
    updated_at = models.DateTimeField(auto_now=True)  # UAT - Updated At

    def __str__(self):
        return f"Session {self.id} - {self.status}"
    
class UserDetails(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.OneToOneField(
        'User',  # Link to the User model
        on_delete=models.CASCADE,
        related_name="details"
    )
    exam_preparing_for = models.CharField(
        max_length=50,
        choices=[('UPSC', 'UPSC'), ('KPSC', 'KPSC'), ('both', 'Both')],
        default='UPSC'
    )
    preparation_stage = models.CharField(
        max_length=50,
        choices=[('Prelims', 'Prelims'), ('Mains', 'Mains'), ('Interview', 'Interview')],
        default='Prelims'
    )
    challenging_topics = models.TextField(null=True, blank=True)  # Topics user finds challenging
    preferred_learning_method = models.CharField(
        max_length=50,
        choices=[('Reading articles', 'Reading articles'), ('Interactive quizzes', 'Interactive quizzes'), ('Voice commands', 'Voice commands')],
        default='Reading articles'
    )
    wants_reminders = models.BooleanField(default=False)  # Whether user wants daily reminders
    personalized_study_plan = models.BooleanField(default=False)  # Whether user wants personalized study plans

    def __str__(self):
        return f"Details for {self.user.username}"
from django.db import models
import uuid

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

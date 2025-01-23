from django.db import models
import uuid

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

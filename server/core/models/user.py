from django.db import models
import uuid

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

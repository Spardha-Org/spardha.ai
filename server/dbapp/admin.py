from django.contrib import admin
from .models import User, Agent, Prompt, Session, UserDetails

# Register the models with the admin site

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_active', 'is_admin', 'created_at', 'updated_at')
    search_fields = ('username', 'email')
    list_filter = ('is_active', 'is_admin')

@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('id','specialization_name', 'created_at', 'updated_at', 'is_active')
    search_fields = ('specialization_name',)
    list_filter = ('is_active',)

@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    list_display = ('id','agent', 'language', 'primary_prompt', 'suggestion_prompt', 'summary_prompt')
    search_fields = ('agent__specialization_name', 'language')
    list_filter = ('language',)

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'agent', 'status', 'created_at', 'updated_at')
    search_fields = ('user__username', 'agent__specialization_name')
    list_filter = ('status',)

@admin.register(UserDetails)
class UserDetailsAdmin(admin.ModelAdmin):
    list_display = ('user', 'exam_preparing_for', 'preparation_stage', 'challenging_topics', 'preferred_learning_method')
    search_fields = ('user__username',)
    list_filter = ('exam_preparing_for', 'preparation_stage')

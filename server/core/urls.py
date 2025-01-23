# dbapp/urls.py
from django.urls import path
from .views.prompt_views import get_primary_prompt
from .views.agent_views import generate_access_token
from .views.session_views import session
from .views.util_views import hello_world,get_daily_quote



urlpatterns = [
    path('hello/', hello_world, name="hello_world"),
    path("daily-quote/", get_daily_quote, name="daily_quote"),
    path('get-primary-prompt/<uuid:agent_id>/<str:language>/', get_primary_prompt, name='get_primary_prompt'),
    path('session/', session, name='session'),
    path('token/', generate_access_token, name="generate_access_token"),
]

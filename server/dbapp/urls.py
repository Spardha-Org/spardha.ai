# dbapp/urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('hello/', views.hello_world, name="hello_world"),
    path("daily-quote/", views.get_daily_quote, name="daily_quote"),
    path('get-primary-prompt/<uuid:agent_id>/<str:language>/', views.get_primary_prompt, name='get_primary_prompt'),
    path('session/', views.session, name='session'),
]


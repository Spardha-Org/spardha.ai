# dbapp/urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('token/', views.generate_access_token, name="generate_access_token"),
]

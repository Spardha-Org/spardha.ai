from django.shortcuts import render

def homepage(request):
    return render(request, 'index.html')  # Assuming your React build is served from 'index.html'
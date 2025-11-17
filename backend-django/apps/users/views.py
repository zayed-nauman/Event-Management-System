from django.shortcuts import render
from django.http import JsonResponse
from .models import User
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        return JsonResponse({'id': user.id, 'username': user.username}, status=201)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.filter(username=data['username']).first()
        if user and user.check_password(data['password']):
            return JsonResponse({'id': user.id, 'username': user.username}, status=200)
        return JsonResponse({'error': 'Invalid credentials'}, status=400)

def user_profile(request, user_id):
    user = User.objects.get(id=user_id)
    return JsonResponse({'id': user.id, 'username': user.username, 'email': user.email})
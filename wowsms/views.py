from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def index(request):
	return render(request, 'index.html')

def login(request):
	return render(request, 'login.html')

def register(request):
	return render(request, 'register.html')

def dashboard(request, user_id):
	return render(request, 'dashboard.html', {'user':user_id})

def pricing(request, user_id):
	return render(request, 'pricing.html', {'user':user_id})
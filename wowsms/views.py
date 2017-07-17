from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


def index(request):
	return render(request, 'index.html')


def login(request):
	return render(request, 'login.html')

def register(request):
	return render(request, 'register.html')
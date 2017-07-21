from django.shortcuts import render
from django.shortcuts import redirect
from .utils import MakeRequest
from .utils import PostRequest
from .utils import Authenticate


def index(request):
	if request.method == 'GET':
		if Authenticate(request).logged_in:
			return render(request, 'index.html')
		else:
			return render(request, 'landing.html')
	else:
		print("yay")

def register(request):
	return render(request, 'register.html')

def dashboard(request, user_id):
	return render(request, 'dashboard.html', {'user':user_id})

def pricing(request, user_id):
	return render(request, 'pricing.html', {'user':user_id})
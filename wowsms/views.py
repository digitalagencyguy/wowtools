from .utils import Request
from .utils import Model
from django.shortcuts import render
from django.shortcuts import redirect
from django.shortcuts import HttpResponse

def index(request):
	response = Request(request, 'index', 'landing')
	return render(request, response.template, response.context)

def audience(request):
	response = Request(request, 'audience')
	return render(request, response.template, response.context)

def settings(request):
	response = Request(request, 'settings')
	return render(request, response.template, response.context)

def sequences(request):
	response = Request(request, 'sequences')
	return render(request, response.template, response.context)

def campaigns(request):
	response = Request(request, 'campaigns')
	return render(request, response.template, response.context)

def sms(request):
	response = Request(request, 'sms')
	return render(request, response.template, response.context)

def schedule(request):
	response = Request(request, 'schedule')
	return render(request, response.template, response.context)

def logout(request):
	request.session.clear()
	return redirect('/')

def login(request):
	if request.session.get('user'):
		return redirect('/')
	response = Request(request, 'login', 'error', False)
	return render(request, response.template, response.context)

def register(request):
	if request.session.get('user'):
		return redirect('/')
	return render(request,'register.html')

def error(request):
	return render(request, 'error.html')

#$kil1ion
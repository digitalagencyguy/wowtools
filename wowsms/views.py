from .utils import Request
from django.shortcuts import render
from django.shortcuts import redirect

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
	request.session['user'] = '1'
	return redirect('/')

def register(request):
	response = Request(request, 'register', 'landing', False)
	return render(request, response.template, response.context)

#$kil1ion
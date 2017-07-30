from .utils import Request
from django.shortcuts import render
from django.shortcuts import redirect
from .models import Customer

def index(request):
	response = Request(request, 'index', 'landing')
	template = response.template()
	context = response.context()
	return render(request, template, context)

def audience(request):
	response = Request(request, 'audience')
	template = response.template()
	context = response.context()
	return render(request, template, context)

def settings(request):
	response = Request(request, 'settings')
	template = response.template()
	context = response.context()
	return render(request, template, context)

def sequences(request):
	response = Request(request, 'sequences')
	template = response.template()
	context = response.context()
	return render(request, template, context)

def campaigns(request):
	response = Request(request, 'campaigns')
	template = response.template()
	context = response.context()
	return render(request, template, context)

def sms(request):
	response = Request(request, 'sms')
	template = response.template()
	context = response.context()
	return render(request, template, context)

def schedule(request):
	response = Request(request, 'schedule')
	template = response.template()
	context = response.context()
	return render(request, template, context)

def logout(request):
	request.session.clear()
	return redirect('/')

def login(request):
	request.session['user'] = '4224'
	return redirect('/')

#$kil1ion
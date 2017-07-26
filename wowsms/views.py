import json
from .data import user_data
from .utils import Process
from .utils import Context
from .utils import Authenticate
from django.shortcuts import render
from django.shortcuts import redirect

def index(request):
	response = Process(request).index('index')
	return render(request, response.template, response.context)

def audience(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('audience')
		return render(request, response.template, response.context)

def settings(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('settings')
		return render(request,response.template, response.context)

def sequences(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('sequences')
		return render(request, response.template, response.context)

def campaigns(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('campaigns')
		return render(request, response.template, response.context)

def sms(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('sms')
		return render(request, response.template, response.context)


def schedule(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('schedule')
		return render(request, response.template, response.context)

def logout(request):
	request.session.clear()
	return redirect('/')

def login(request):
	request.session['user'] = '4224'
	return redirect('/')

def me(request):
	user = Authenticate(request).user
	destination = request.GET.get('dest')
	if user:
		return redirect('/{}/{}'.format(user,destination))
	else:
		return redirect('/')

#$kil1ion
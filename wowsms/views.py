from django.shortcuts import render
from django.shortcuts import redirect
from django.views.decorators.http import require_http_methods as methods
from .utils import Request
from .utils import Authenticate
from .utils import createContext
from .utils import Object
from .utils import Process
from .data import user_data
import json

@methods(["GET"])
def index(request):
	response = Process(request).index('index', None)
	return render(request, response.template, response.context)

@methods(["GET", "POST"])
def audience(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('audience', None)
		return render(request, response.template, response.context)

@methods(["GET", "POST"])
def settings(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('settings', None)
		return render(request,response.template, response.context)
	elif request.method == 'POST':
		return redirect('/')

@methods(["GET", "POST"])
def sequences(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('sequences', None)
		return render(request, response.template, response.context)

@methods(["GET", "POST"])
def campaigns(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('campaigns',None)
		return render(request, response.template, response.context)

@methods(["GET", "POST"])
def sms(request, user_id):
	if request.method == 'GET':
		response = Process(request, user_id).main('sms', None)
		return render(request, response.template, response.context)

@methods(["GET"])
def logout(request):
	request.session.clear()
	return redirect('/')

@methods(["GET","POST"])
def login(request):
	request.session['user'] = '1777'
	return redirect('/')

def me(request):
	user_id = Authenticate(request).user
	destination = request.GET.get('dest')
	if user_id:
		return redirect('/{}/{}'.format(user_id,destination))
	else:
		return redirect('/')

#$kil1ion
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import logout as authLogout
from .utils import Request
from .utils import Authenticate
from .utils import createContext
import json

def index(request):
	print(request.user)
	'''
	Landing page if user is not logged in.
	If there is a user session already, then bring them to their home page
	'''
	if request.user.is_authenticated():
		user = Authenticate(request.user).json
		context = createContext(['user'],[user]).context
		return render(request, 'index.html', context)
	else:
		return render(request, 'landing.html')

def audience(request, user_id):
	'''
	Display audience page with multiple views
	'''
	if request.method == 'GET':
		user = Authenticate(request.user).json
		context = createContext(['user'],[user]).context
		return render(request, 'audience.html', context)

def settings(request, user_id):
	if request.method == 'GET':
		user = Authenticate(request.user).json
		context = createContext(['user'],[user]).context
		return render(request,'settings.html',context)
	elif request.method == 'POST':
		return redirect('/')

def sequences(request, user_id):
	if request.method == 'GET':
		user = Authenticate(request.user).json
		context = createContext(['user'],[user]).context
		return render(request, 'sequences.html',context)

def campaigns(request, user_id):
	if request.method == 'GET':
		user = Authenticate(request.user).json
		context = createContext(['user'],[user]).context
		return render(request, 'campaigns.html', context)

def sms(request, user_id):
	if request.method == 'GET':
		user = Authenticate(request.user).json
		context = createContext(['user'],[user]).context
		return render(request, 'sms.html', context)

def mao(request):
	user = Authenticate(request.user).json
	context = createContext(['user'],[user]).context
	context['mao'] = 'is awesome'
	return render(request, 'mao.html', context)

def logout(request):
	authLogout(request)
	return redirect('/')

def login(request):
	return redirect('/')

def me(request):
	user = Authenticate(request.user).json
	user_id = user.get('id')
	destination = request.GET.get('dest')
	if user_id:
		return redirect('/{}/{}'.format(user_id,destination))
	else:
		return redirect('/')

#$kil1ion
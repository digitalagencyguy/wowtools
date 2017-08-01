from django.shortcuts import render
from django.shortcuts import redirect
from django.shortcuts import HttpResponse
from .utils import Request
from.utils import Model
import json


globalBaseUrl = 'http://api.wowsms.io/v1/'

def new(url):
	return globalBaseUrl + url

newUserUrl = new('entity/new')
loginUserUrl = new('entity/login')


def apiTest(request):
	print('api Test')
	message = "API is up and running"
	return HttpResponse(message)

def details(request):
	pass

def apiKey(request):
	pass

def subscriptions(request):
	pass

def register(request):
	if request.method == 'GET':
		return redirect('/register')
	response = Request(newUserUrl, request.POST).response
	if response['status']['success'] == False:
		return redirect('/error')
	request.session['user'] = response['User']
	return redirect('/')

def login(request):
	if request.method == 'GET':
		return redirect('/login')
	response = Request(loginUserUrl, request.POST).response
	if response['status']['success'] == False:
		return redirect('/error')
	request.session['user'] = response['User']
	return redirect('/')

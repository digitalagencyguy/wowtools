from .utils import Request
from django.shortcuts import render
from django.shortcuts import redirect
from django.views.decorators.cache import cache_page as cache
from .models import Customer

global_cache_time = 60 * 15

@cache(global_cache_time)
def index(request):
	response = Request(request, 'index', 'landing')
	template = response.template()
	context = response.context()
	return render(request, template, context)

@cache(global_cache_time)
def audience(request):
	response = Request(request, 'audience')
	template = response.template()
	context = response.context()
	return render(request, template, context)

@cache(global_cache_time)
def settings(request):
	response = Request(request, 'settings')
	template = response.template()
	context = response.context()
	return render(request, template, context)

@cache(global_cache_time)
def sequences(request):
	response = Request(request, 'sequences')
	template = response.template()
	context = response.context()
	return render(request, template, context)

@cache(global_cache_time)
def campaigns(request):
	response = Request(request, 'campaigns')
	template = response.template()
	context = response.context()
	return render(request, template, context)

@cache(global_cache_time)
def sms(request):
	response = Request(request, 'sms')
	template = response.template()
	context = response.context()
	return render(request, template, context)

@cache(global_cache_time)
def schedule(request):
	response = Request(request, 'schedule')
	template = response.template()
	context = response.context()
	return render(request, template, context)

@cache(global_cache_time)
def logout(request):
	request.session.clear()
	return redirect('/')

@cache(global_cache_time)
def login(request):
	request.session['user'] = '4224'
	return redirect('/')

#$kil1ion
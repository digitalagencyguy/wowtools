from django.shortcuts import render
from django.shortcuts import redirect
from .utils import Request
from .utils import PostRequestHandler
from .utils import Authenticate
from .data import user_data
import json


#index - should show landing page or logged in session.
def index(request):
	if request.method == 'GET':
		if Authenticate(request).logged_in:
			data = user_data[request.session['user']]
			return render(request, 'index.html', {'user': data})
		else:
			return render(request, 'landing.html')
	else:
		request.session['user'] = request.POST.get('name')
		return redirect('/')

def audience(request, user_id):
	if request.method == 'GET':
		data = user_data[user_id]
		return render(request, 'audience.html', {'user':data})

def settings(request, user_id):
	if request.method == 'GET':
		data = user_data[user_id]
		return render(request,'settings.html',{'user':data})
	elif request.method == 'POST':
		return redirect('/')

def sequences(request, user_id):
	if request.method == 'GET':
		data = user_data[user_id]
		return render(request, 'sequences.html',{'user':data})

def logout(request):
	request.session.clear();
	return redirect('/')

def login(request):
	request.session['user'] = '4224'
	return redirect('/')

def me(request):
	user = Authenticate(request).get_me()
	user_id = [key for key in user.keys()][0]
	destination = request.GET.get('dest')
	if user_id:
		return redirect('/{}/{}'.format(user_id,destination))
	else:
		return redirect('/')

#$kil1ion
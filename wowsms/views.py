from django.shortcuts import render
from django.shortcuts import redirect
from .utils import MakeRequest
from .utils import PostRequest
from .utils import Authenticate
import json


#fake data until endpoints are up
user_data = {
	'1777': {
		'firstname': 'Nathan',
		'lastname': 'Hague'
	},
	'4224' : {
		'firstname': 'William',
		'lastname': 'Hicks'
	},
	'8888' : {
		'firstname': 'Eric',
		'lastname': 'Kornia'
	}
}

def index(request):
	if request.method == 'GET':
		request.session['user'] = '4224'
		if Authenticate(request).logged_in:
			return render(request, 'index.html')
		else:
			return render(request, 'landing.html')
	else:
		request.session['user'] = request.POST.get('name')
		return redirect('/')

def audience(request, user_id):
	if request.method == 'GET':
		data = user_data[user_id]
		return render(request, 'audience.html', {'user':data})

def me(request):
	user = Authenticate(request).get_me()
	user_id = [key for key in user.keys()][0]
	destination = request.GET.get('dest')
	if user_id:
		return redirect('/{}/{}'.format(user_id,destination))
	else:
		return redirect('/')
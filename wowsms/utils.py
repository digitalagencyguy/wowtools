import requests
import json
import re
from .data import user_data

def Object(template, context):
	return {'template':template, 'context':context}

class Response:

	def __init__(self, template, context):
		self.template = template
		self.context = context

class Request:

	def __init__(self, url, payload={}, headers={'Content-type':'application/json'}):
		self.url = url
		self.payload = json.dumps(payload)
		self.headers = headers
		self.response = self.request()

	def request(self):
		if json.loads(self.payload):
			thing = requests.post(self.url,data=self.payload, headers=self.headers)
			return thing
		else:
			thing = requests.get(self.url)
			return thing

class Authenticate:

	def __init__(self, request):
		self.request = request

	@property
	def user(self):
		user = self.request.session.get('user')
		return user

	def login_required(self, alpha, beta):
		if self.user:
			return Response(alpha.get('template'), alpha.get('context'))
		else:
			return Response(beta.get('template'), beta.get('context'))

	def conditionalResponse(self, alpha, beta, condition):
		if condition:
			return Response(alpha.get('template'), alpha.get('context'))
		else:
			return Response(beta.get('template'), beta.get('context'))

class createContext:

	def __init__(self, keys, payloads): 
		self.keys = keys
		self.payloads = payloads

	@property
	def context(self):
		context = {}
		for key in self.keys:
			index = self.keys.index(key)
			context[key] = self.payloads[index]
		return context


class Process:

	def __init__(self, request, *user_id):
		self.request = request
		if user_id:
			self.user_id = user_id[0]

	def main(self, preferred, context, other='error.html'):
		authenticate = Authenticate(self.request)
		alpha = Object(preferred+'.html', context=context)
		if other != 'error.html':
			beta = Object(other+'html', context=context)
		else:
			beta = Object(other, context=context)
		response = authenticate.conditionalResponse(alpha, beta, self.user_id==authenticate.user)
		return response

	def index(self, preferred, context, other='landing.html'):
		authenticate = Authenticate(self.request)
		alpha = Object(preferred+'.html', context=context)
		beta = Object(other, context=context)
		response = authenticate.login_required(alpha, beta)
		return response
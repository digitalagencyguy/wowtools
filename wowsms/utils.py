import requests
import json
import re
from .data import user_data


#returns an object for processing by Authentication class
def Object(template, context):
	return {'template':template, 'context':context}

#a context object for processing by Authentication class
def Context(keys, payloads):
	context = {}
	for key in keys:
		index = keys.index(key)
		context[key] = payloads[index]
	return context

#returns a response object for rendering as a template
class Response:

	def __init__(self, template, context):
		self.template = template
		self.context = context

#automatically process requests to the database
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

#authenticate requests and return Response objects
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

#process all main data flow
class Process:

	def __init__(self, request, *user_id):
		self.request = request
		if user_id:
			self.user_id = user_id[0]

	def main(self, preferred, other='error.html'):
		authenticate = Authenticate(self.request)
		context = Context(['user'],[user_data[authenticate.user]])
		alpha = Object(preferred+'.html', context=context)
		if other != 'error.html':
			beta = Object(other+'html', context=context)
		else:
			beta = Object(other, context=context)
		response = authenticate.conditionalResponse(alpha, beta, self.user_id==authenticate.user)
		return response

	def index(self, preferred, other='landing.html'):
		authenticate = Authenticate(self.request)
		context = Context(['user'],[user_data[authenticate.user]])
		alpha = Object(preferred+'.html', context=context)
		beta = Object(other, context=context)
		response = authenticate.login_required(alpha, beta)
		return response
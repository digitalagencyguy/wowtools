import requests
import json
from .data import user_data

#create a class to handle all JSON passing to the database
class MakeRequest:

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

#Authentication class for loggging in
class Authenticate:

	def __init__(self, request):
		self.request = request

	@property
	def logged_in(self):
		if self.request.session.get('user'):
			return True
		else:
			return False

	def get_me(self):
		me = self.request.session.get('user')
		return {me: user_data[me]}

class PostRequest:

	def __init__(self, request):
		self.request = request
		self.data = request.POST
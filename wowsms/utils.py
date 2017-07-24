import requests
import json
import re

#create a class to handle all JSON passing to the database
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

	def __init__(self, user):
		self.user = user

	@property
	def json(self):
		payload = {}
		fullname = self.user.get_full_name()
		firstname = re.search('\w+\s',fullname).group()[:-1]
		lastname = re.search('\s\w+',fullname).group()[1:]
		payload.update(
			fullname=fullname,
			firstname=firstname,
			lastname=lastname,
			email=self.user.email,
			username=self.user.username,
			authenticated=str(self.user.is_authenticated()).lower(),
			id=self.user.id)
		payload = json.dumps(payload)
		return json.loads(payload)


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


class validateUrl:

	def __init__(self):
		pass
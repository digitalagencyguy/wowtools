import json 
import requests

class Model:

	def __init__(self, json_):
		for key in json_:
			setattr(self, key, json_[key])

#automatically process requests to the database
class Request:

	def __init__(self, url, payload={}, headers={'Content-type':'application/json'}):
		self.url = url
		self.payload = json.dumps(payload)
		self.headers = headers

	@property
	def response(self):
		if json.loads(self.payload):
			thing = requests.post(self.url, data=self.payload, headers=self.headers)
			return json.loads(thing.content)
		else:
			thing = requests.get(self.url)
			return json.loads(thing.content)
import json

class Model:

	def __init__(self, json_):
		for key in json_:
			if type(json_) == list:
				for item in json_:
					for key in item:
						setattr(self, key, item[key])
			else:
				setattr(self, key, json_[key])

class Data:

	def __init__(self, request):
		categories = ['user', 'contacts', 'business', 'sendout', 'calendar', 'managers', 'status', 'contacts']
		for category in categories:
			if request.session.get(category):
				setattr(self, category, Model(request.session[category]))
			else:
				setattr(self, category, None)

class Request:

	def __init__(self, request, primary, secondary='error', login_required=True):
		self.primary = primary + '.html'
		self.secondary = secondary + '.html'
		self.login_required = login_required
		self.data = Data(request)
		self.user = self.data.user

	@property
	def context(self):
		context = {}
		properties = [prop for prop in dir(self.data) if not prop.startswith('__')]
		for prop in properties:
			context[prop] = getattr(self.data, prop)
		print(context)
		return context

	@property
	def template(self):
		if self.login_required and self.user:
			return self.primary
		elif self.login_required and not self.user:
			return self.secondary
		else:
			return self.primary
	
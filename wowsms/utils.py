from .data import USER

class Model:

	def __init__(self, json_):
		for key in json_:
			setattr(self, key, json_[key])

class Data:

	def __init__(self, request):
		self.request = request
		self.user = request.session.get('user')

	@property
	def customer(self):
		if self.user:
			thing = USER.get(self.user)
			obj = Model(thing)
			return obj
		else:
			return None

class Request:

	def __init__(self, request, primary, secondary='error', login_required=True):
		self.request = request
		self.primary = primary + '.html'
		self.secondary = secondary + '.html'
		self.login_required = login_required
		self.data = Data(request)
		self.user = self.data.user

	@property
	def context(self):
		context = {
			'user': self.data.customer
		}
		return context

	@property
	def template(self):
		if self.login_required and self.user:
			return self.primary
		elif self.login_required and not self.user:
			return self.secondary
		else:
			return self.primary
	
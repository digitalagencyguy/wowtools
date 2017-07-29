import json
from .objects import User
from .data import user_data

class Request:

	def __init__(self, request, primary, secondary='error'):
		self.request = request
		self.user = request.session.get('user')
		self.primary = primary + '.html'
		self.secondary = secondary + '.html'

	def context(self, *args, **kwargs):
		context = {}
		defaults = {'user': User}
		for default in defaults:
			attribute = getattr(self, default)
			if attribute:
				model = defaults[default]
				json_ = user_data[attribute]
				context[default] = model(json_)
		return context

	def template(self, login_required=True):
		if login_required and self.user:
			return self.primary
		elif login_required and not self.user:
			return self.secondary
		else:
			return self.primary
	
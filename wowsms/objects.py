
#returns a user model
class User:

	def __init__(self, json_):
		for key in json_:
			setattr(self, key, json_[key])

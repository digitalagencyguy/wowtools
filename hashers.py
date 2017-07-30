from django.contrib.auth.hashers import PBKDF2PasswordHasher

class Hasher(PBKDF2PasswordHasher):

	iterations = PBKDF2PasswordHasher.iterations * 100
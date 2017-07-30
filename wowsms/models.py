from django.db import models

class Customer(models.Model):

	firstname = models.TextField()
	lastname = models.TextField()
	credit = models.FloatField()
	queue = models.IntegerField()
	trial = models.BooleanField()
	countryCode = models.IntegerField(default=61)
	mobile = models.TextField()
	businessName = models.TextField()
	businessAddress = models.TextField()
	timezone = models.TextField()
	street1 = models.TextField()
	street2 = models.TextField()
	town = models.TextField()
	zipCode = models.IntegerField()
	country = models.TextField()

	class Meta:

		db_table = 'customers'
		ordering = ['firstname','lastname']
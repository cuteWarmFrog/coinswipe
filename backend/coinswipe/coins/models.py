from django.db import models

class Coin(models.Model):
	name = models.CharField(max_length=100)
	symbol = models.CharField(max_length=100)
	address	= models.CharField(max_length=100)
	def __str__(self):
		return f"{self.name} ({self.symbol})"

	def get_icon_url(self):
		return f'https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/{ self.address }/logo.png'

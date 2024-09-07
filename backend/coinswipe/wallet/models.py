from django.db import models

# Create your models here.
class AppUser(models.Model):
	private_key = models.CharField(max_length=100, unique=True, null=True, blank=True)
	address = models.CharField(max_length=100, unique=True, null=True, blank=True)
	telegram_id = models.CharField(max_length=100, unique=True, null=True, blank=True)

	def __str__(self):
		return self.telegram_id

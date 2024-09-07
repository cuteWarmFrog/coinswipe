from eth_account import Account
import json
from .models import AppUser
from django.http import JsonResponse

def user_profile(request, telegram_id):
	user, created = AppUser.objects.get_or_create(telegram_id=telegram_id)
	if created:
		account = Account.create()
		user.private_key = account.key.hex()
		user.address = account.address
		user.telegram_id = telegram_id
		return JsonResponse({'message': 'User created', 'telegram_id': user.telegram_id}, status=201)
	else:
		return JsonResponse({'message': 'User exists', 'telegram_id': user.telegram_id}, status=200)

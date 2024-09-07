from django.shortcuts import render
from django.http import JsonResponse
from .models import Coin
import random

def get_coin_info(request):
	try:
		coins = Coin.objects.all()
		random_coin = random.choice(coins)
		data = {
			'name': random_coin.name,
			'symbol': random_coin.symbol,
			'address': random_coin.address,
			'icon_url': random_coin.get_icon_url()
		}
		return JsonResponse(data)
	except Coin.DoesNotExist:
		return JsonResponse({'error': 'Coin not found'}, status=404)

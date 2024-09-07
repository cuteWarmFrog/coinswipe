import requests
from django.core.management.base import BaseCommand
from coins.models import Coin
import os
from dotenv import load_dotenv

load_dotenv()

class Command(BaseCommand):
	help = 'Populate Coin model with data from API'

	def handle(self, *args, **kwargs):
		url = os.getenv('TOKENS_API')
		response = requests.get(url)
		data = response.json()
		coins = [
			'SEIYAN',
			'MILLI',
			'POPO',
			'BALLZ',
			'SeiPepe',
			'GOKU',
			'NINJA',
			'RED',
			'JOG',
			'FROY',
			'SEIYUN',
			'JAYJEO',
			'REX',
			'CHUCK',
			'$gonad',
			'$SEIS',
			'SeiWhale',
			'SAKE',
			'BOOBLE',
			'Pepei'
			]
		for item in data['tokens']:
			if item['symbol'] not in coins:
				continue
			coin, created = Coin.objects.update_or_create(
				symbol=item['symbol'],
				name=item['name'],
				address=item['address'],
			)
			if created:
				self.stdout.write(self.style.SUCCESS(f'Created coin: {coin.name}'))
			else:
				self.stdout.write(self.style.SUCCESS(f'Updated coin: {coin.name}'))


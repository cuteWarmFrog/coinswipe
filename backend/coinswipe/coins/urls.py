from django.urls import path
from . import views

app_name = "coins"

urlpatterns = [
	path('coin/random/', views.get_coin_info, name='get_coin_info'),
]

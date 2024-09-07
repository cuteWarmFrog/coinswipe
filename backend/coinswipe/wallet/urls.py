from django.urls import path
from .views import user_profile

app_name = "wallet"

urlpatterns = [
	path('profile/<str:telegram_id>/', user_profile, name='user_profile'),
]

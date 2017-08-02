from django.conf.urls import url 
from . import views


urlpatterns = [
	url('^$', views.apiTest, name='apiTest'),
	url('settings/details/?$', views.details, name='settings_details'),
	url('settings/apiKey/?$', views.apiKey, name='apiKey'),
	url('settings/subscriptions/?$',views.subscriptions, name='subscriptions'),
	url('register/?$', views.register, name='register'),
	url('login/?$',views.login, name='login')
]
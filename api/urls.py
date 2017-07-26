from django.conf.urls import url 
from . import views


urlpatterns = [
	url(r'^$', views.apiTest, name='apiTest'),
	url(r'settings/details/?$', views.details, name='settings-details'),
	url(r'settings/apiKey/?$', views.apiKey, name='apiKey'),
	url(r'settings/subscriptions/?$',views.subscriptions, name='subscriptions')
]
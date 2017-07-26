from django.conf.urls import url 
from . import views

urlpatterns = [
	url(r'^$',views.index, name='index'),
	url(r'(?P<user_id>\w+)/audience/?$', views.audience, name='audience'),
	url(r'(?P<user_id>\w+)/settings/?$',views.settings, name='settings'),
	url(r'(?P<user_id>\w+)/sequences/?$', views.sequences, name='sequences'),
	url(r'(?P<user_id>\w+)/campaigns/?$', views.campaigns, name='campaigns'),
	url(r'(?P<user_id>\w+)/sms/?$', views.sms, name='sms'),
	url(r'(?P<user_id>\w+)/schedule/?$', views.schedule, name='schedule'),
	url(r'me?/$', views.me, name='me'),
	url(r'logout/?$',views.logout, name='logout'),
	url(r'login/?$',views.login, name='login')
]
from django.conf.urls import url
from . import views

urlpatterns = [
	url('^$',views.index, name='index'),
	url('audience/?$', views.audience, name='audience'),
	url('settings/?$',views.settings, name='settings'),
	url('sequences/?$', views.sequences, name='sequences'),
	url('campaigns/?$', views.campaigns, name='campaigns'),
	url('sms/?$', views.sms, name='sms'),
	url('schedule/?$', views.schedule, name='schedule'),
	url('logout/?$',views.logout, name='logout'),
	url('login/?$',views.login, name='login'),
	url('register/?$', views.register, name='register')
]
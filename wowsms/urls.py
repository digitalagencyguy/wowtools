from django.conf.urls import url 
from . import views

urlpatterns = [
	url(r'^$',views.index, name='index'),
	url(r'(?P<user>\w+)/audience/?$', views.audience, name='audience'),
	url(r'(?P<user>\w+)/settings/?$',views.settings, name='settings'),
	url(r'(?P<user>\w+)/sequences/?$', views.sequences, name='sequences'),
	url(r'(?P<user>\w+)/campaigns/?$', views.campaigns, name='campaigns'),
	url(r'(?P<user>\w+)/sms/?$', views.sms, name='sms'),
	url(r'(?P<user>\w+)/schedule/?$', views.schedule, name='schedule'),
	url(r'logout/?$',views.logout, name='logout'),
	url(r'login/?$',views.login, name='login')
]
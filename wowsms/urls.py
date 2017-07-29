from django.conf.urls import url 
from . import views

urlpatterns = [
	url(r'^$',views.index, name='index'),
	url(r'audience/?$', views.audience, name='audience'),
	url(r'settings/?$',views.settings, name='settings'),
	url(r'sequences/?$', views.sequences, name='sequences'),
	url(r'campaigns/?$', views.campaigns, name='campaigns'),
	url(r'sms/?$', views.sms, name='sms'),
	url(r'schedule/?$', views.schedule, name='schedule'),
	url(r'logout/?$',views.logout, name='logout'),
	url(r'login/?$',views.login, name='login')
]
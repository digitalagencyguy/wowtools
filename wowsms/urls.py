from django.conf.urls import url 
from . import views

urlpatterns = [
	url(r'^$',views.index, name='index'),
	url(r'(?P<user_id>\w+)/audience/?$', views.audience, name='audience'),
	url(r'me?/$', views.me, name='me'),
	url(r'logout/?$',views.logout, name='logout')
]
from django.conf.urls import url 
from . import views

urlpatterns = [
	url(r'^$',views.index, name='index'),
	url(r'login/$',views.login, name='login'),
	url(r'register/$',views.register, name='register'),
	url(r'(?P<user_id>\w+)/dashboard/$', views.dashboard, name='dashboard'),
	url(r'(?P<user_id>\w+)/pricing/$', views.pricing, name='pricing')
]
from django.conf.urls import url
from django.conf.urls import include
from django.contrib import admin

admin.autodiscover()

urlpatterns = [
    url(r'^', include('wowsms.urls'))
]
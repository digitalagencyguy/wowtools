from django.conf.urls import url
from django.conf.urls import include
from django.contrib import admin

admin.autodiscover()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include('wowsms.urls')),
    #url(r'', include('social.apps.django_app.urls',namespace='social')),
    #url(r'', include('django.contrib.auth.urls', namespace='auth'))
]
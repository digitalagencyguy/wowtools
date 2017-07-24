from django.conf.urls import url
from django.conf.urls import include

urlpatterns = [
    url(r'^', include('wowsms.urls')),
    url(r'^api/v1/', include('api.urls'))
]
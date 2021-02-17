from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings

from .views import (store_view, cart_view,checkout_view)

app_name = 'database'
urlpatterns = [

    # Back end and Database urls
    path('store/', store_view, name='store'),
    path('cart/', cart_view, name='cart'),
    path('checkout/', checkout_view, name='checkout'),
]

urlpatterns += staticfiles_urlpatterns()

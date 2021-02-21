from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from database.views import (store_view, cart_view, checkout_view, update_item_view)

app_name = 'database'
urlpatterns = [

    # Back end and Database urls
    path('store/', store_view, name='store'),
    path('cart/', cart_view, name='cart'),
    path('checkout/', checkout_view, name='checkout'),
    path('update_item/', update_item_view, name='update_item'),
]

urlpatterns += staticfiles_urlpatterns()

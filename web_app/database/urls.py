from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from .views import (create_invoice_view, create_client_view,
                    list_clients_view, list_invoice_view,
                    client_update_view, invoice_update_view,
                    delete_invoice_view, delete_client_view
                    )

app_name = 'database'
urlpatterns = [

    # Back end and Database urls
    path('client/<str:my_name>/',
         client_update_view, name='client-detail'),
    path('invoice/<int:fid>/',
         invoice_update_view, name='invoice-detail'),

    path('create_invoice/', create_invoice_view, name='create-invoice'),
    path('create_client/', create_client_view, name='create-client'),

    path('delete_invoice/<int:my_fid>/',
         delete_invoice_view, name='delete-invoice'),
    path('delete_client/<str:my_name>/',
         delete_client_view, name='delete-client'),

    path('list_invoices/', list_invoice_view, name='list-invoices'),
    path('list_clients/', list_clients_view, name='list-clients'),
]

urlpatterns += staticfiles_urlpatterns()

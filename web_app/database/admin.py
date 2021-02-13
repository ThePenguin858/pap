from django.contrib import admin

from .models import Invoice, Client
# Register your models here.

admin.site.register(Invoice)
admin.site.register(Client)

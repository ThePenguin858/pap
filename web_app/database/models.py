from django.db import models
from django.urls import reverse

# Create your models here.


class Client(models.Model):
    name = models.CharField(primary_key=True, unique=True, max_length=120)
    nif = models.CharField(max_length=9, unique=True)
    address = models.CharField(max_length=500, blank=True)
    zip_code = models.CharField(max_length=16)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=13, blank=True)

    def get_absolute_url(self):
        return reverse('database:client-detail', kwargs={'my_name': self.name})


class Invoice(models.Model):
    fid = models.AutoField(unique=True, primary_key=True)
    client = models.ForeignKey(
        Client, on_delete=models.SET_NULL, null=True)
    provider_name = models.CharField(max_length=120)
    provider_nif = models.DecimalField(max_digits=9, decimal_places=0)
    service_value = models.PositiveIntegerField()
    emission_date = models.DateField()
    iva = models.DecimalField(blank=True, null=True,
                              decimal_places=2, max_digits=10)
    tax_explanation = models.TextField(blank=True, null=True)
    service_date = models.DateField(blank=True, null=True)

    def get_absolute_url(self):
        return reverse('database:invoice-detail', kwargs={'fid': self.fid})

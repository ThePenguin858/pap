from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse

# Create your models here.
class Customer(models.Model):
    "Represents a store customer"
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=True)
    email = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Product(models.Model):
    "Represents a store item in stock"
    name = models.CharField(max_length=200)
    price = models.FloatField()
    digital = models.BooleanField(default=False, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)

    @property
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = ""
        return url

    def __str__(self):
        return self.name

class Order(models.Model):
    "Represents a cart of a user"
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False)
    transaction_id = models.CharField(max_length=100, null=True)

    @property
    def get_cart_items(self):
        "Returns the number of items in the cart"
        orderitems = self.orderitem_set.all()
        total = sum([item.quantity for item in orderitems])
        return total

    @property
    def get_cart_total(self):
        "Gets the total price of the cart"
        orderitems = self.orderitem_set.all()
        total = sum([item.get_total for item in orderitems])
        return total

    @property
    def shipping(self):
        "Returns if a order requires shipping"
        shipping = False
        orderitems = self.orderitem_set.all()
        for i in orderitems:
            if i.product.digital == False:
                shipping = True
        return shipping

    def __str__(self):
        return str(self.id)

class OrderItem(models.Model):
    "Represents a item that is in the cart of a user"
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    @property
    def get_total(self):
        "Gets the total price of a cart item, according to its price and quantity"
        return self.product.price * self.quantity

class ShippingAddress(models.Model):
    "Represents a shipping adress of a user and a order"
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    address = models.CharField(max_length=200, null=True)
    city = models.CharField(max_length=200, null=True)
    zip_code = models.CharField(max_length=200, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    country = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.address

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
import json

from database.models import Product, Order, OrderItem
# from .forms import EditClientForm, ClientForm, InvoiceForm
# Create your views here.

def update_item_view(request):
    data = json.loads(request.body)
    productID = data['productID']
    action = data['action']

    customer = request.user.customer
    product = Product.objects.get(id=productID)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)
    order_item, created = OrderItem.objects.get_or_create(order=order, product=product)

    if action == "add":
        order_item.quantity = (order_item.quantity + 1)
    elif action == "rem":
        order_item.quantity = (order_item.quantity - 1)

    order_item.save()

    if order_item.quantity <= 0:
        order_item.delete()


    return JsonResponse("Item as been added to the cart", safe=False)

def store_view(request):
    """ List all of the invoices """
    queryset = Product.objects.all()
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
    else:
        items = []
        order = {
            'get_cart_total':0,
            'get_cart_items':0,
            'shipping': False
        }
        cartItems = order['get_cart_items']


    context = {
        'items': items,
        'order': order,
        'cartItems': cartItems
    }
    return render(request, 'database/store.html', context)

def cart_view(request):

    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
    else:
        items = []
        order = {
            'get_cart_total':0,
            'get_cart_items':0,
            'shipping': False
        }
        cartItems = order['get_cart_items']


    context = {
        'items': items,
        'order': order,
        'cartItems': cartItems
    }

    return render(request, 'database/cart.html', context)

def checkout_view(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
        cartItems = order.get_cart_items
    else:
        items = []
        order = {
            'get_cart_total':0,
            'get_cart_items':0,
            'shipping': False
        }
        cartItems = order['get_cart_items']


    context = {
        'items': items,
        'order': order,
        'cartItems': cartItems
    }
    return render(request, 'database/checkout.html', context)

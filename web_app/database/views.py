from django.shortcuts import render, get_object_or_404, redirect

# from .forms import EditClientForm, ClientForm, InvoiceForm
from pages.views import home_view
from .models import *
# Create your views here.


def store_view(request):
    """ List all of the invoices """
    queryset = Product.objects.all()

    if request.method == 'POST':
        OrderItem.objects.append({'product': product, 'order': order,'quantity': 1})

    context = {
        'products': queryset
    }
    return render(request, 'database/store.html', context)

def cart_view(request):
    queryset = Product.objects.all()

    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []
        order = {'get_cart_total':0, 'get_cart_items':0}

    context = {
        'items': items,
        'order': order
    }

    return render(request, 'database/cart.html', context)

def checkout_view(request):
    if request.user.is_authenticated:
        customer = request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        items = order.orderitem_set.all()
    else:
        items = []
        order = {'get_cart_total':0, 'get_cart_items':0}

    context = {
        'items': items,
        'order': order
    }
    return render(request, 'database/checkout.html', context)

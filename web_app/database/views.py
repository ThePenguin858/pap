from django.shortcuts import render, get_object_or_404, redirect

# from .forms import EditClientForm, ClientForm, InvoiceForm
from pages.views import home_view
from .models import Product
# Create your views here.


def store_view(request):
    """ List all of the invoices """
    queryset = Product.objects.all()

    context = {
        'products': queryset
    }
    return render(request, 'database/store.html', context)

def cart_view(request):
    context = {}
    return render(request, 'database/cart.html', context)

def checkout_view(request):
    context = {}
    return render(request, 'database/checkout.html', context)

# def list_clients_view(request):
#     """ List all of the clients """
#     queryset = Client.objects.all()

#     context = {
#         'object_list': queryset
#     }

#     return render(request, 'database/list_views/list_client.html', context)


# def create_invoice_view(request, *args, **kwargs):
#     """ View for creating receipts urls=create_invoice """

#     my_form = InvoiceForm(request.POST or None)

#     if request.method == 'POST':
#         if my_form.is_valid():
#             my_form.save()
#             my_form = InvoiceForm()

#     context = {'form': my_form}

#     return render(request, 'database/forms/invoice_create.html', context)


# def create_client_view(request, *args, **kwargs):
#     """ View for creating client urls=create """

#     new_form = ClientForm(request.POST or None)

#     if request.method == 'POST':
#         if new_form.is_valid():
#             new_form.save()
#             new_form = ClientForm()

#     context = {'Form': new_form}

#     return render(request, 'database/forms/client_create.html', context)


# def client_update_view(request, my_name):
#     obj = Client.objects.get(name=my_name)
#     form = EditClientForm(instance=obj)
#     if request.method == 'POST':
#         form = EditClientForm(request.POST, instance=obj)
#         if form.is_valid():
#             form.save()
#             return redirect('/database/list_clients')

#     context = {
#         'object': form
#     }
#     return render(request, 'database/forms/client_view.html', context)


# def invoice_update_view(request, fid):
#     obj = Invoice.objects.get(fid=fid)
#     form = InvoiceForm(instance=obj)
#     if request.method == 'POST':
#         form = InvoiceForm(request.POST, instance=obj)
#         if form.is_valid():
#             form.save()
#             return redirect('/database/list_invoices')

#     context = {
#         'object': form
#     }
#     return render(request, 'database/forms/invoice_view.html', context)


# def delete_invoice_view(request, my_fid):
#     obj = Invoice.objects.get(fid=my_fid)

#     if request.method == "POST":
#         obj.delete()
#         return redirect('database:list-invoices')

#     context = {
#         'object': obj,
#     }
#     return render(request, 'database/forms/delete_invoice.html', context)


# def delete_client_view(request, my_name):
#     obj = Client.objects.get(name=my_name)

#     if request.method == 'POST':
#         obj.delete()
#         return redirect('/database/list_clients')
#     context = {'object': obj, }

#     return render(request, 'database/forms/delete_client.html', context)

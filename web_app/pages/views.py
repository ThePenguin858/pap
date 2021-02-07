from django.http import HttpResponse

from django.shortcuts import render
from django.core.mail import send_mail

# Create your views here.


def home_view(request, *args, **kwargs):
    """View for url home"""
    return render(request, 'pages/index.html')


def about_view(request, *args, **kwargs):
    """View for url about"""
    return render(request, 'pages/about.html', {})


def projects_view(request, *args, **kwargs):
    """View for url about"""
    return render(request, 'pages/projects.html', {})


def contact_view(request, *args, **kwargs):
    """View for url contactus"""
    if request.method == "POST":
        message_name = request.POST['message_name']
        message_email = request.POST['message_email']
        message_body = request.POST['message_body']

        message_body = "Sender Email: " + message_email + "\nMensagem: " + message_body
        send_mail(
            message_name,
            message_body,
            message_email,
            ['franciscoppontes369@gmail.com', 'francisco.perestrelo.pontes@gmail.com'])
        return render(request, 'pages/contactus.html', {'message_name': message_name, })
    else:
        return render(request, 'pages/contactus.html', {})

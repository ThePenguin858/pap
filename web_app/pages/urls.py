from django.urls import include, path

from .views import home_view, about_view, contact_view, projects_view

app_name = "pages"
urlpatterns = [
    path('home/', home_view, name='home-view'),
    path('', home_view),
    path('about/', about_view, name='about-view'),
    path('contact/', contact_view, name='contact-view'),
    path('projects/', projects_view, name='projects-view'),
]

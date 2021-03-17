
from django.urls import include, path

from .views import board_view

app_name = "game"
urlpatterns = [
    path('board', board_view, name='board'),
]

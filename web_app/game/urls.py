
from django.urls import include, path

from game.views import board_view

app_name = "game"
urlpatterns = [
    path('board', board_view, name='board'),
]

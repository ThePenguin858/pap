from django.shortcuts import render

# Create your views here.

def board_view(request):
    context = {
        "board": 1
    }
    return render(request, 'game/board.html', context)

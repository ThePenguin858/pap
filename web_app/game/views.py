from django.shortcuts import render

# Create your views here.

def board_view(request):
    context = {
        "board": 1
    }
    return render(request, 'chess_game/board.html', context)

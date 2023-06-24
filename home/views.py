from django.shortcuts import render
from users.models import Chef

# Create your views here.


def index(request):
    """A view to return the index page"""
    chef = Chef.objects.all()
    first_chef = chef[1].user_id
    logged_in_user = request.user.id
    print(first_chef)
    print(logged_in_user)
    return render(request, "home/index.html", {"chef": chef})

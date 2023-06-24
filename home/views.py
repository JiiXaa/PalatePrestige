from django.shortcuts import render
from users.models import Chef

# Create your views here.


def index(request):
    """A view to return the index page"""
    chef = Chef.objects.all()
    return render(request, "home/index.html", {"chef": chef})

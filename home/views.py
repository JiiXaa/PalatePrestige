from django.shortcuts import render
from users.models import Chef
from django.conf import settings


def index(request):
    """A view to return the index page"""
    all_chefs = Chef.objects.all()

    context = {
        "chefs": all_chefs,
        "MEDIA_URL": settings.MEDIA_URL,
    }

    return render(request, "home/index.html", context)

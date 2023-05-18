from django.shortcuts import render

from .models import Menu, Dish


def all_menus(request):
    """A view to display all menus, including sorting and search queries"""
    all_menus = Menu.objects.all()

    context = {
        "all_menus": all_menus,
    }

    return render(request, "menus/menus.html", context)

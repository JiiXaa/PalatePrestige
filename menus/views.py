from django.shortcuts import render, redirect

from .models import Menu, Dish
from .forms import MenuForm


def all_menus(request):
    """A view to display all menus, including sorting and search queries"""
    all_menus = Menu.objects.all()

    context = {
        "all_menus": all_menus,
    }

    return render(request, "menus/menus.html", context)


def add_menu(request):
    if request.method == "POST":
        form = MenuForm(request.POST)
        if form.is_valid():
            new_menu = form.save(commit=False)
            new_menu.chef = request.user.chef
            new_menu.save()
            return redirect("chef_detail", chef_id=request.user.chef.id)
    else:
        form = MenuForm()
    return render(request, "add_menu.html", {"form": form})

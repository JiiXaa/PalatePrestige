from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.exceptions import ValidationError

from .models import Menu, Dish
from .forms import MenuForm, MenuCategoryForm


def all_menus(request):
    """A view to display all menus, including sorting and search queries"""
    all_menus = Menu.objects.all()

    context = {
        "all_menus": all_menus,
    }

    return render(request, "menus/menus.html", context)


@login_required
def add_menu(request):
    """A view to add a menu to a chef's profile"""
    if request.method == "POST":
        form = MenuForm(request.POST)
        try:
            if form.is_valid():
                new_menu = form.save(commit=False)
                new_menu.chef = request.user.chef
                new_menu.save()
                messages.success(request, "Menu successfully added!")
                return redirect("chef_detail", chef_id=request.user.chef.id)
        except ValidationError as e:
            messages.error(request, f"Error adding menu: {e}")
    else:
        form = MenuForm()
    return render(request, "add_menu.html", {"form": form})


@login_required
def add_menu_category(request):
    """A view to add a menu category to the database (admin only))"""
    if not request.user.is_superuser and not request.user.is_staff:
        messages.error(request, "Only staff can add menu category.")
        return redirect("menus")

    if request.method == "POST":
        form = MenuCategoryForm(request.POST)
        if form.is_valid():
            try:
                form.save()
                messages.success(request, "Menu category successfully added.")
                return redirect("add_menu_category")
            except Exception as e:
                messages.error(request, f"Error adding menu category: {e}")
    else:
        form = MenuCategoryForm()

    return render(request, "add_menu_category.html", {"form": form})


@login_required
def edit_menu(request, menu_id):
    """A view to edit a menu"""
    menu = get_object_or_404(Menu, id=menu_id)

    if request.method == "POST":
        form = MenuForm(request.POST, instance=menu)
        if form.is_valid():
            try:
                form.save()
                messages.success(request, "Menu successfully updated!")
                return redirect("chef_detail", chef_id=request.user.chef.id)
            except ValidationError as e:
                messages.error(request, f"Error updating menu: {e}")
    else:
        form = MenuForm(instance=menu)
    return render(request, "edit_menu.html", {"form": form, "menu": menu})


@login_required
def delete_menu(request, menu_id):
    """A view to delete a menu"""
    menu = get_object_or_404(Menu, id=menu_id)

    try:
        menu.delete()
        messages.success(request, "Menu successfully deleted!")
        return redirect("chef_detail", chef_id=request.user.chef.id)
    except Exception as e:
        messages.error(request, f"Error deleting menu: {e}")
        return redirect("chef_detail", chef_id=request.user.chef.id)

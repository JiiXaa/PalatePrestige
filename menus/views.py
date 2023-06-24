from django.shortcuts import render, redirect, get_object_or_404, reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.db.models import Q

from .models import Menu, Dish, MenuCategory
from .forms import MenuForm, MenuCategoryForm, DishForm


def all_menus(request):
    """A view to display all menus, including sorting and search queries"""
    all_menus = Menu.objects.all()
    query = None
    categories = None

    if request.GET:
        if "category" in request.GET:
            categories = request.GET["category"].split(",")
            all_menus = all_menus.filter(menu_category__name__in=categories)
            categories = MenuCategory.objects.filter(name__in=categories)

    if "q" in request.GET:
        query = request.GET["q"]
        if not query:
            messages.error(request, "You didn't enter any search criteria!")
            return redirect(reverse("menus"))
        queries = Q(title__icontains=query) | Q(description__icontains=query)

        all_menus = all_menus.filter(queries)

    context = {
        "all_menus": all_menus,
        "search_term": query,
        "current_categories": categories,
    }

    return render(request, "menus.html", context)


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
                return redirect("chef_detail", chef_id=request.user.chef.user_id)
        except ValidationError as e:
            messages.error(request, f"Error adding menu: {e}")
    else:
        form = MenuForm()
    return render(request, "add_menu.html", {"form": form})


@login_required
def add_menu_category(request):
    """A view to add a menu category to the database (admin only)"""

    # Only staff can add menu categories
    if not request.user.is_superuser and not request.user.is_staff:
        messages.error(request, "Only staff can add menu categories.")
        return redirect("home")

    if request.method == "POST":
        form = MenuCategoryForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            # Check if a menu category with the same name already exists (case insensitive) Found solution here: https://stackoverflow.com/questions/9983391/how-do-i-use-iexact-to-check-if-an-item-matches-case-insensitively-in-django
            if MenuCategory.objects.filter(name__iexact=name).exists():
                messages.error(
                    request, "A menu category with the same name already exists."
                )
            else:
                try:
                    form.save()
                    messages.success(request, "Menu category successfully added!")
                    return redirect("add_menu_category")
                except Exception as e:
                    messages.error(request, f"Error adding menu category: {e}")
    else:
        form = MenuCategoryForm()

    return render(request, "add_menu_category.html", {"form": form})


def menu_detail(request, menu_id):
    """A view to display a single menu"""
    # Get menu
    menu = get_object_or_404(Menu, id=menu_id)
    # Filter dishes by menu
    dishes = Dish.objects.filter(menu=menu)

    context = {
        "menu": menu,
        "dishes": dishes,
    }

    return render(request, "menu_detail.html", context)


@login_required
def add_dish(request, menu_id):
    """A view to add a dish to a menu"""
    menu = get_object_or_404(Menu, id=menu_id)

    if request.method == "POST":
        form = DishForm(request.POST)
        if form.is_valid():
            new_dish = form.save(commit=False)
            new_dish.menu = menu
            new_dish.save()
            messages.success(request, "Dish successfully added!")
            return redirect("menu_detail", menu_id=menu.id)
    else:
        form = DishForm()

    context = {
        "form": form,
        "menu": menu,
    }

    return render(request, "add_dish.html", context)


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
                return redirect("chef_detail", chef_id=request.user.chef.user_id)
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
        return redirect("chef_detail", chef_id=request.user.chef.user_id)
    except Exception as e:
        messages.error(request, f"Error deleting menu: {e}")
        return redirect("chef_detail", chef_id=request.user.chef.user_id)

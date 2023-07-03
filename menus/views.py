from django.shortcuts import render, redirect, get_object_or_404, reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.db.models import Q
import boto3
from django.conf import settings

from .models import Menu, Dish, MenuCategory
from .forms import MenuForm, MenuCategoryForm, DishForm


def all_menus(request):
    """A view to display all menus, including sorting and search queries"""
    all_menus = Menu.objects.all()
    query = None
    categories = None

    if request.GET:
        if "category" in request.GET:
            categories = request.GET.getlist("category")
            all_menus = all_menus.filter(menu_category__name__in=categories)
            categories = MenuCategory.objects.filter(name__in=categories)

        if "q" in request.GET:
            query = request.GET["q"]
            if not query:
                messages.error(request, "You didn't enter any search criteria!")
                return redirect(reverse("menus"))
            queries = Q(title__icontains=query) | Q(description__icontains=query)
            all_menus = all_menus.filter(queries)
            print("query: ", query)
            print("all_menus: ", all_menus)

    # Pagination
    # Show 4 menus per page
    paginator = Paginator(all_menus, 4)
    page_number = request.GET.get("page")
    menus = paginator.get_page(page_number)

    context = {
        "menus": menus,
        "search_term": query,
        "current_categories": categories,
    }

    return render(request, "menus.html", context)


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
                return redirect("add_dish", menu_id=new_menu.id)
        except ValidationError as e:
            messages.error(request, f"Error adding menu: {e}")
    else:
        form = MenuForm()
    return render(request, "add_menu.html", {"form": form})


@login_required
def edit_menu(request, menu_id):
    """A view to edit a menu"""
    menu = get_object_or_404(Menu, id=menu_id)

    if menu.chef != request.user.chef:
        messages.error(request, "You can only edit your own menus!")
        return redirect("menus")

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

    if menu.chef != request.user.chef:
        messages.error(request, "You can only delete your own menus!")
        return redirect("menus")

    if request.method == "POST":
        try:
            menu.delete()
            messages.success(request, "Menu successfully deleted!")
            return redirect("chef_detail", chef_id=request.user.chef.user_id)
        except Exception as e:
            messages.error(request, f"Error deleting menu: {e}")
            return redirect("chef_detail", chef_id=request.user.chef.user_id)

    context = {
        "menu": menu,
    }

    return render(request, "delete_menu.html", context)


@login_required
def add_menu_category(request):
    """A view to add a menu category to the database (admin only)"""

    # Only staff can add menu categories
    if not request.user.is_superuser and not request.user.is_staff:
        messages.error(request, "Only staff can add menu categories.")
        return redirect("menus")

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


@login_required
def add_dish(request, menu_id):
    """A view to add a dish to a menu"""
    menu = get_object_or_404(Menu, id=menu_id)

    if request.method == "POST":
        form = DishForm(request.POST, request.FILES)
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
def edit_dish(request, menu_id, dish_id):
    menu = get_object_or_404(Menu, id=menu_id)
    dish = get_object_or_404(Dish, id=dish_id)

    if dish.menu != menu:
        messages.error(request, "This dish does not belong to this menu!")
        return redirect("menu_detail", menu_id=menu.id)

    old_image_name = "media/" + dish.image.name  # Modify this line

    if request.method == "POST":
        form = DishForm(request.POST, request.FILES, instance=dish)
        if form.is_valid():
            dish = form.save()
            messages.success(request, "Dish successfully edited!")

            if dish.image and old_image_name != dish.image.name:
                s3 = boto3.resource("s3")
                s3.Object(settings.AWS_STORAGE_BUCKET_NAME, old_image_name).delete()

            return redirect("menu_detail", menu_id=menu.id)
    else:
        form = DishForm(instance=dish)

    context = {
        "form": form,
        "menu": menu,
        "dish": dish,
    }

    return render(request, "edit_dish.html", context)


@login_required
def delete_dish(request, menu_id, dish_id):
    menu = get_object_or_404(Menu, id=menu_id)
    dish = get_object_or_404(Dish, id=dish_id)

    if dish.menu != menu:
        messages.error(request, "This dish does not belong to this menu!")
        return redirect("menu_detail", menu_id=menu.id)

    if request.method == "POST":
        try:
            # Delete the dish and its associated image
            dish.delete()
            if dish.image:
                s3 = boto3.resource("s3")
                s3.Object(
                    settings.AWS_STORAGE_BUCKET_NAME, "media/" + dish.image.name
                ).delete()

            messages.success(request, "Dish successfully deleted!")
            return redirect("menu_detail", menu_id=menu.id)
        except Exception as e:
            messages.error(request, f"Error deleting dish: {e}")

    context = {
        "menu": menu,
        "dish": dish,
    }

    return render(request, "delete_dish.html", context)

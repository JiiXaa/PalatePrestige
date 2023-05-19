from django.shortcuts import render, get_object_or_404
from .models import Chef, Customer
from menus.models import Menu


def all_chefs(request):
    """A view to display all chefs, including sorting and search queries"""

    all_chefs = Chef.objects.all()

    context = {
        "all_chefs": all_chefs,
    }

    return render(request, "chefs/chefs.html", context)


def chef_detail(request, chef_id):
    """A view to show individual chef details and their menus"""

    # Get the chef or return 404 if not found
    chef = get_object_or_404(Chef, id=chef_id)
    # Get all menus associated with this chef
    menus = Menu.objects.filter(chef=chef)

    context = {
        "chef": chef,
        "menus": menus,
    }

    return render(request, "chefs/chef_detail.html", context)


def all_customers(request):
    """A view to display all customers, including sorting and search queries"""
    return render(request, "users/customers.html")


def customer_detail(request, customer_id):
    """A view to show individual customer details"""
    return render(request, "users/customer_detail.html")

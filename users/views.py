from django.shortcuts import render
from .models import Chef, Customer


def all_chefs(request):
    """A view to display all chefs, including sorting and search queries"""

    all_chefs = Chef.objects.all()

    context = {
        "all_chefs": all_chefs,
    }

    return render(request, "chefs/chefs.html", context)


def chef_detail(request, chef_id):
    """A view to show individual chef details"""
    return render(request, "users/chef_detail.html")


def all_customers(request):
    """A view to display all customers, including sorting and search queries"""
    return render(request, "users/customers.html")


def customer_detail(request, customer_id):
    """A view to show individual customer details"""
    return render(request, "users/customer_detail.html")

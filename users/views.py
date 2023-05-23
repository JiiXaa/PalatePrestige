from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group

from allauth.account.views import SignupView
from .forms import CustomSignupForm

from .models import Chef, Customer
from menus.models import Menu


class CustomSignupView(SignupView):
    form_class = CustomSignupForm

    # Override form_valid to save user_type and create Chef or Customer object
    def form_valid(self, form):
        response = super().form_valid(form)
        user_type = form.cleaned_data.get("user_type")

        # Create Chef or Customer object based on user_type
        if user_type == "chef":
            Chef.objects.create(user=self.user)
            group, created = Group.objects.get_or_create(name="Chef")
        else:
            # if user_type == "customer":
            Customer.objects.create(user=self.user)
            group, created = Group.objects.get_or_create(name="Customer")

        # Add user to Chef or Customer group
        self.user.groups.add(group)

        return response


def all_chefs(request):
    """A view to display all chefs, including sorting and search queries"""

    all_chefs = Chef.objects.all()

    context = {
        "all_chefs": all_chefs,
    }

    return render(request, "chefs/chefs.html", context)


def chef_detail(request, chef_id):
    """A view to display a single chef profile"""
    chef = get_object_or_404(Chef, id=chef_id)
    menus = Menu.objects.filter(chef=chef)

    if request.user.groups.filter(name="Chef").exists() and request.user == chef.user:
        # If the logged-in user is the Chef whose profile is being viewed
        context = {
            "chef": chef,
            "menus": menus,
            "is_owner": True,  # Additional context variable to control template rendering
        }
    elif request.user.groups.filter(name="Customer").exists():
        # If the logged-in user is a Customer
        context = {
            "chef": chef,
            "menus": menus,
            "is_owner": False,  # The Customer is not the owner of this Chef profile
        }
    else:
        messages.error(request, "Access Denied.")
        return redirect("home")

    return render(request, "chefs/chef_detail.html", context)


def all_customers(request):
    """A view to display all customers, including sorting and search queries"""
    return render(request, "users/customers.html")


@login_required
def customer_detail(request, customer_id):
    """A view to display a single customer profile"""
    # Ensure that the logged-in user is a Customer
    if request.user.groups.filter(name="Customer").exists():
        # Get the customer associated with the user or return 404 if not found
        customer = get_object_or_404(Customer, id=customer_id)

        # Check if the requested customer profile matches the logged-in user
        # User is allowed to view their own profile but not others
        if customer.user == request.user:
            context = {
                "customer": customer,
            }
            return render(request, "customers/customer_detail.html", context)
        else:
            messages.error(
                request, "Access Denied. You are not authorized to view this profile."
            )
            return redirect("home")
    else:
        messages.error(request, "Access Denied. You are not a Customer.")
        return redirect("home")

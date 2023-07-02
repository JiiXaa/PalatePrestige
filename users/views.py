from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.http import JsonResponse
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.urls import reverse
from django.conf import settings

import boto3
from .forms import ChefForm, EditUserForm


import json

from allauth.account.views import SignupView
from .forms import CustomSignupForm

from .models import Chef, Customer, Availability
from menus.models import Menu
from bookings.models import Booking
from reviews.models import ChefReview


class CustomSignupView(SignupView):
    form_class = CustomSignupForm

    # Override the form_valid method to add user_type to the form data before it is saved. Also, create Chef or Customer object based on user_type.
    def form_valid(self, form):
        response = super().form_valid(form)
        user_type = form.cleaned_data.get("user_type")

        # Create Chef or Customer object based on user_type
        if user_type == "chef":
            chef = Chef.objects.create(user=self.user)
            group, created = Group.objects.get_or_create(name="Chef")
            chef.user.profile_image = form.cleaned_data.get("profile_image")
            chef.user.save()
        else:
            Customer.objects.create(user=self.user)
            group, created = Group.objects.get_or_create(name="Customer")

        # Add user to Chef or Customer group
        self.user.groups.add(group)

        return response


def login_redirect(request):
    # Check user role and redirect accordingly
    if request.user.groups.filter(name="Chef").exists():
        return redirect(
            reverse("chef_detail", kwargs={"chef_id": request.user.chef.pk})
        )
    elif request.user.groups.filter(name="Customer").exists():
        return redirect("chefs")
    else:
        # Handle the case when the user does not have any role assigned
        messages.error(request, "Access Denied. You are not a Chef or a Customer.")
        return redirect("home")


def all_chefs(request):
    """A view to display all chefs, including sorting and search queries"""

    all_chefs = Chef.objects.all()

    context = {
        "all_chefs": all_chefs,
        "MEDIA_URL": settings.MEDIA_URL,
    }

    return render(request, "chefs/chefs.html", context)


def chef_detail(request, chef_id):
    """A view to display a single chef profile"""
    chef = get_object_or_404(Chef, user_id=chef_id)
    menus = Menu.objects.filter(chef=chef)
    check_availability = Availability.objects.filter(
        chef_id=chef_id,
        is_available=True,
    )
    chef_bookings = chef.booking_set.all()
    reviews = ChefReview.objects.filter(booking__chef=chef)
    logged_in_user_id = request.user.id

    # determine the user role of the logged-in user. This is used to determine which instance of the calendar to render
    user_role = None
    if request.user.groups.filter(name="Chef").exists():
        user_role = "chef"
    else:
        user_role = "customer"

    print("user_role", user_role)
    if request.user.groups.filter(name="Chef").exists() and request.user == chef.user:
        # If the logged-in user is the Chef whose profile is being viewed
        context = {
            "chef": chef,
            "menus": menus,
            "chef_availability": check_availability,
            "chef_bookings": chef_bookings,
            "user_role": user_role,
            "reviews": reviews,
            "logged_in_user_id": logged_in_user_id,
            "MEDIA_URL": settings.MEDIA_URL,
        }
    else:
        # If the logged-in user is a Customer or a not-logged-in user
        context = {
            "chef": chef,
            "menus": menus,
            "chef_bookings": chef_bookings,
            "chef_availability": check_availability,
            "user_role": user_role,
            "reviews": reviews,
            "logged_in_user_id": logged_in_user_id,
            "MEDIA_URL": settings.MEDIA_URL,
        }

    return render(request, "chefs/chef_detail.html", context)


@login_required
def edit_chef(request, chef_id):
    chef = get_object_or_404(Chef, user__id=chef_id)
    user = chef.user

    # If the logged in user is not the owner of the chef profile
    # Redirect them to the detail page with an error message
    if request.user != user:
        messages.error(request, "You do not have permission to edit this profile.")
        return redirect("chef_detail", chef_id=chef_id)

    if request.method == "POST":
        chef_form = ChefForm(request.POST, request.FILES, instance=chef)
        user_form = EditUserForm(request.POST, request.FILES, instance=user)

        if chef_form.is_valid() and user_form.is_valid():
            old_profile_image_name = chef.user.profile_image.name

            chef = chef_form.save(commit=False)
            user = user_form.save()

            chef.user = user
            chef.save()

            messages.success(request, "Chef details updated successfully.")

            if (
                chef.user.profile_image
                and old_profile_image_name != chef.user.profile_image.name
            ):
                # Delete the old profile image from the S3 bucket
                s3 = boto3.resource("s3")
                s3.Object(
                    settings.AWS_STORAGE_BUCKET_NAME, old_profile_image_name
                ).delete()

            return redirect("chef_detail", chef_id=chef.user.id)
    else:
        chef_form = ChefForm(instance=chef)
        user_form = EditUserForm(instance=user)

    context = {
        "chef_form": chef_form,
        "chef": chef,
        "user_form": user_form,
    }

    return render(request, "chefs/edit_chef.html", context)


def get_chef_availability(request, chef_id):
    # Get all availability instances for the given chef
    availability_entries = Availability.objects.filter(chef_id=chef_id)

    # Convert the entries to a format that can be serialized to JSON
    availability_data = []
    for entry in availability_entries:
        # Convert the start and end times to the timezone-aware ISO 8601 format
        start_time = entry.start_time.astimezone(timezone.utc).isoformat()
        end_time = entry.end_time.astimezone(timezone.utc).isoformat()

        availability_data.append(
            {
                "start": start_time,
                "end": end_time,
                "title": "Available" if entry.is_available else "Not Available",
                "editable": entry.is_available,
                "availability_id": entry.id,
            }
        )

    return JsonResponse(availability_data, safe=False)


def add_chef_availability(request):
    if request.method == "POST":
        # Get the data from the request body
        data = json.loads(request.body)
        chef_id = int(data["chef_id"])
        # Parse the start and end times from the request body
        start_time = parse_datetime(data["start_time"])
        end_time = parse_datetime(data["end_time"])

        print(chef_id)
        print(start_time)
        print(end_time)

        # Ensure only the chef can add availability
        if request.user.is_authenticated and request.user.id == chef_id:
            Availability.objects.create(
                chef_id=chef_id,
                start_time=start_time,
                end_time=end_time,
                is_available=True,
            )

            print("Availability added successfully.")

            return JsonResponse(
                {"message": "Availability added successfully."}, status=201
            )
        else:
            return JsonResponse(
                {"error": "You do not have permission to add availability."}, status=403
            )

    return JsonResponse({"error": "Invalid request method."}, status=400)


def delete_chef_availability(request, availability_id):
    if request.method == "DELETE":
        # Retrieve the availability instance
        availability = get_object_or_404(Availability, id=availability_id)

        # Ensure only the chef can delete availability
        if (
            request.user.is_authenticated
            and availability
            and availability.chef.user == request.user
        ):
            # Delete the availability instance
            availability.delete()
            return JsonResponse(
                {"message": "Availability deleted successfully."}, status=200
            )

        # If the availability instance was not found or the user is not the chef associated with the availability instance or the user is not authenticated
        return JsonResponse(
            {"error": "You do not have permission to delete availability."}, status=403
        )

    return JsonResponse({"error": "Invalid request method."}, status=400)


def update_chef_availability(request, availability_id):
    if request.method == "PUT":
        # Retrieve the availability instance
        availability = get_object_or_404(Availability, id=availability_id)

        # Ensure only the chef can update availability
        if (
            request.user.is_authenticated
            and availability
            and availability.chef.user == request.user
        ):
            # Parse the start and end times from the request body
            data = json.loads(request.body)
            availability_id = int(data["availability_id"])
            start_time = parse_datetime(data["start_time"])
            end_time = parse_datetime(data["end_time"])

            # Update the availability instance
            availability.start_time = start_time
            availability.end_time = end_time
            availability.save()

            return JsonResponse(
                {"message": "Availability updated successfully."}, status=200
            )

        # If the availability instance was not found or the user is not the chef associated with the availability instance or the user is not authenticated
        return JsonResponse(
            {"error": "You do not have permission to update availability."}, status=403
        )

    return JsonResponse({"error": "Invalid request method."}, status=400)


def remove_past_availabilities(request):
    print("Removing past availabilities...")
    now = timezone.now()
    past_availabilities = Availability.objects.filter(end_time__lt=now)
    print("Past availabilities count:", past_availabilities.count())
    past_availabilities.delete()
    print("Past availabilities deleted.")

    return JsonResponse(
        {"message": "Past availabilities removed successfully."}, status=200
    )


def all_customers(request):
    """A view to display all customers, including sorting and search queries"""
    customers = Customer.objects.all()

    return render(request, "customers/customers.html", {"customers": customers})


@login_required
def customer_detail(request, customer_id):
    """A view to display a single customer profile along with their bookings"""

    # Ensure that the logged-in user is a Customer
    if request.user.groups.filter(name="Customer").exists():
        # Get the customer associated with the user or return 404 if not found
        customer = get_object_or_404(Customer, user=request.user)

        # Check if the requested customer profile matches the logged-in user
        # User is allowed to view their own profile but not others
        if customer.user.id == int(customer_id):
            # Retrieve all bookings for the logged-in customer
            bookings = Booking.objects.filter(customer=customer)
            # Retrieve all reviews for the logged-in customer
            reviews = ChefReview.objects.filter(booking__customer=customer)
            print("reviews", reviews)
            # Pass the customer, bookings and reviews to the template context
            context = {"customer": customer, "bookings": bookings, "reviews": reviews}
            return render(request, "customers/customer_detail.html", context)
        else:
            messages.error(
                request, "Access Denied. You are not authorized to view this profile."
            )
            return redirect("home")
    else:
        messages.error(request, "Access Denied. You are not a Customer.")
        return redirect("home")

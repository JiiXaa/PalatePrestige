from django.http import JsonResponse
from .models import Booking
from users.models import Chef, Customer, Availability
from menus.models import Menu
import json


from datetime import datetime


def create_booking(request):
    if request.method == "POST":
        data = json.loads(request.body)
        chef_id = data.get("chef")
        menu_id = data.get("menu")
        booking_date_str = data.get("date")
        total_cost = data.get("totalPrice")
        number_of_people = data.get("numberOfGuests")

        # Convert booking_date string to datetime object
        try:
            booking_date = datetime.strptime(booking_date_str, "%Y-%m-%dT%H:%M:%S")
        except ValueError:
            return JsonResponse({"error": "Invalid date format"}, status=400)

        # Retrieve the chef instance
        try:
            chef = Chef.objects.get(id=chef_id)
        except Chef.DoesNotExist:
            return JsonResponse({"error": "Chef does not exist"}, status=400)

        # Retrieve the customer instance
        try:
            customer = request.user.customer
        except Customer.DoesNotExist:
            return JsonResponse({"error": "Customer does not exist"}, status=400)

        # Retrieve the menu instance
        try:
            menu = Menu.objects.get(id=menu_id)
        except Menu.DoesNotExist:
            return JsonResponse({"error": "Menu does not exist"}, status=400)

        # Create the booking
        booking = Booking.objects.create(
            customer=customer,
            chef=chef,
            menu=menu,
            booking_date=booking_date,
            total_cost=total_cost,
            number_of_people=number_of_people,
            status="pending",
        )

        # Update chef availability
        try:
            # Filter availabilities using the date part of booking_date
            availability = Availability.objects.filter(
                chef=chef, start_time__date=booking_date.date()
            )
            for avail in availability:
                avail.is_available = False
                avail.save()
        except Availability.DoesNotExist:
            return JsonResponse({"error": "Availability does not exist"}, status=400)

        return JsonResponse({"status": "booking_created", "booking_id": booking.id})

    return JsonResponse({"error": "Invalid request"}, status=400)

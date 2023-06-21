from django.http import JsonResponse
from django.utils import timezone
from django.db import IntegrityError
from .models import Booking
from users.models import Chef, Customer, Availability
from menus.models import Menu
import json


import stripe
from django.conf import settings


from datetime import datetime


def create_booking(request):
    stripe.api_key = settings.STRIPE_SECRET_KEY

    if request.method == "POST":
        data = json.loads(request.body)
        chef_id = data.get("chef")
        menu_id = data.get("menu")
        booking_date_str = data.get("date")
        total_cost = data.get("totalPrice")
        number_of_people = data.get("numberOfGuests")
        payment_method_id = data.get("paymentMethodId")

        # Convert booking_date string to datetime object
        try:
            booking_date = timezone.make_aware(
                datetime.strptime(booking_date_str, "%Y-%m-%dT%H:%M:%S")
            )
        except ValueError:
            print(f"Failed to convert date: {booking_date_str}")
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

        # Check for duplicate booking
        existing_booking = Booking.objects.filter(
            chef=chef, booking_date=booking_date
        ).exists()

        if existing_booking:
            return JsonResponse(
                {"error": "Booking already exists for this chef at the selected date"},
                status=200,
            )

        try:
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

            # Create the stripe payment intent
            payment_intent = stripe.PaymentIntent.create(
                amount=int(total_cost * 100),
                currency="gbp",
                payment_method=payment_method_id,
                confirm=False,
                metadata={"booking_id": str(booking.id)},
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
                return JsonResponse(
                    {"error": "Availability does not exist"}, status=400
                )

            # Return the PaymentIntent client_secret along with booking info
            # The client_secret is used to finalize the payment on the client-side
            return JsonResponse(
                {
                    "status": "booking_created",
                    "booking_id": booking.id,
                    "client_secret": payment_intent["client_secret"],
                }
            )
        except IntegrityError:
            return JsonResponse({"error": "Booking already exists"}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)

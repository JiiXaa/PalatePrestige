from django.urls import reverse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import ChefReview
from bookings.models import Booking
from django.contrib.auth.decorators import login_required


@login_required
def create_review(request, booking_id):
    booking = get_object_or_404(Booking, pk=booking_id)

    # Check if the user is the customer for this booking
    if request.user != booking.customer.user:
        messages.error(request, "You are not the customer for this booking.")
        return redirect("menus")

    # Check if review already exists for this booking
    existing_review = ChefReview.objects.filter(booking=booking).first()
    if existing_review:
        # If review already exists, e.g., by showing an error message.
        messages.error(request,
                       "You have already submitted a review for this booking.")
        customer_detail_url = reverse(
            "customer_detail", kwargs={"customer_id": booking.customer.user.id}
        )
        return redirect(customer_detail_url)

    if request.method == "POST":
        rating = request.POST.get("rating")
        review_text = request.POST.get("review")

        if not rating or not review_text:
            messages.error(request, "Rating and review are required fields.")
            return render(request, "create_review.html", {"booking": booking})

        review = ChefReview(booking=booking, rating=rating, review=review_text)
        review.save()

        # Redirect to the review_success view with the correct customer_id
        return redirect("review_success", customer_id=booking.customer.user.id)

    return render(request, "create_review.html", {"booking": booking})


@login_required
def review_success(request, customer_id):
    return render(request, "review_success.html", {"customer_id": customer_id})


@login_required
def update_review(request, booking_id):
    booking = get_object_or_404(Booking, pk=booking_id)

    # Check if the user is the customer for this booking
    if request.user != booking.customer.user:
        messages.error(request, "You are not the customer for this booking.")
        return redirect("menus")

    # Check if review exists for this booking
    review = ChefReview.objects.filter(booking=booking).first()
    if not review:
        messages.error(request, "No review exists for this booking.")
        customer_detail_url = reverse(
            "customer_detail", kwargs={"customer_id": booking.customer.user.id}
        )
        return redirect(customer_detail_url)

    if request.method == "POST":
        rating = request.POST.get("rating")
        review_text = request.POST.get("review")

        if not rating or not review_text:
            messages.error(request, "Rating and review are required fields.")
            return render(request, "create_review.html", {"booking": booking})

        review.rating = rating
        review.review = review_text
        review.save()

        return redirect("review_success", customer_id=booking.customer.user.id)

    return render(
        request, "update_review.html", {"booking": booking, "review": review})


def show_customer_reviews(request, customer_id):
    reviews = ChefReview.objects.filter(
        booking__customer__user__id=customer_id)
    return render(request, "customer_reviews.html", {"reviews": reviews})

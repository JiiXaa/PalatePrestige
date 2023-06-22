from django.db import models


class ChefReview(models.Model):
    """A model to represent a review of a chef"""

    booking = models.OneToOneField("bookings.Booking", on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.booking.customer.user.username} - {self.booking.chef.user.username} - {self.rating} - {self.created_at.date()}"

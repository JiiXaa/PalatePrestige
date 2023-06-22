from django.db import models


class Booking(models.Model):
    """A model to represent a booking"""

    customer = models.ForeignKey("users.Customer", on_delete=models.CASCADE)
    chef = models.ForeignKey("users.Chef", on_delete=models.CASCADE)
    menu = models.ForeignKey("menus.Menu", on_delete=models.CASCADE)
    booking_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="pending")
    is_paid = models.BooleanField(default=False)
    number_of_people = models.IntegerField()
    total_cost = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.customer.user.username} - {self.menu.title} - {self.booking_date.date()} - {self.booking_date.time()}"

from django.db import models


class Booking(models.Model):
    """A model to represent a booking"""

    customer = models.ForeignKey("users.Customer", on_delete=models.CASCADE)
    chef = models.ForeignKey("users.Chef", on_delete=models.CASCADE)
    menu = models.ForeignKey("menus.Menu", on_delete=models.CASCADE)
    booking_date = models.DateTimeField()
    status = models.CharField(max_length=20, default="pending")
    is_paid = models.BooleanField(default=False)
    total_cost = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.customer.user.username} - {self.menu.title} - {self.date} - {self.time}"

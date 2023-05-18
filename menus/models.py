from django.db import models


class Menu(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    chef = models.ForeignKey("users.Chef", on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Dish(models.Model):
    class Meta:
        verbose_name_plural = "dishes"

    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)

    menu = models.ForeignKey(Menu, related_name="dishes", on_delete=models.CASCADE)

    def __str__(self):
        return self.name
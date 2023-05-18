from django.db import models
from django.contrib.auth.models import User


class Chef(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200, blank=True)
    last_name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(max_length=200, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    cuisine_types = models.CharField(max_length=200, blank=True)
    is_super_chef = models.BooleanField(default=False)
    location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.user.username


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200, blank=True)
    last_name = models.CharField(max_length=200, blank=True)
    email = models.EmailField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.user.username

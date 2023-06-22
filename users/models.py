from django.db import models
from django.contrib.auth.models import User, Group
from django.db.models.signals import post_save
from django.dispatch import receiver


class Chef(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    cuisine_types = models.CharField(max_length=200, blank=True)
    is_super_chef = models.BooleanField(default=False)
    location = models.CharField(max_length=200, blank=True)

    def average_rating(self):
        total = sum(review.rating for review in self.reviews.all())
        count = self.reviews.count()
        return total / count if count > 0 else 0

    def __str__(self):
        return self.user.username


class Availability(models.Model):
    chef = models.ForeignKey(Chef, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    is_finalised = models.BooleanField(default=False)


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.user.username


# Group assignment on user creation using signals
@receiver(post_save, sender=Chef)
def add_to_chef_group(sender, instance, created, **kwargs):
    if created:
        group, created = Group.objects.get_or_create(name="Chef")
        instance.user.groups.add(group)


@receiver(post_save, sender=Customer)
def add_to_customer_group(sender, instance, created, **kwargs):
    if created:
        group, created = Group.objects.get_or_create(name="Customer")
        instance.user.groups.add(group)

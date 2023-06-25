from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver
from reviews.models import ChefReview
from PIL import Image
from io import BytesIO
import boto3
import os


class User(AbstractUser):
    profile_image = models.ImageField(upload_to="profile_images", blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.profile_image:
            image = Image.open(self.profile_image)
            if image.height > 300 or image.width > 300:
                output_size = (300, 300)
                image.thumbnail(output_size)
                image_buffer = BytesIO()
                image.save(image_buffer, format="JPEG")
                image_buffer.seek(0)
                filename = os.path.basename(self.profile_image.name)
                self.profile_image.save(filename, image_buffer, save=False)
                self.save()

                # Set ACL of the saved object to public-read
                s3 = boto3.client("s3")
                bucket_name = "palateprestigebucket"
                object_key = f"media/{self.profile_image.name}"
                print(f"Bucket: {bucket_name}, Key: {object_key}")
                s3.put_object_acl(Bucket=bucket_name, Key=object_key, ACL="public-read")


class Chef(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    bio = models.TextField(max_length=500, blank=True)
    cuisine_types = models.CharField(max_length=200, blank=True)
    is_super_chef = models.BooleanField(default=False)
    location = models.CharField(max_length=200, blank=True)

    def average_rating(self):
        reviews = ChefReview.objects.filter(booking__chef=self)
        total = sum(review.rating for review in reviews)
        count = reviews.count()
        average = total / count if count > 0 else 0
        return round(average, 1)

    def __str__(self):
        return self.user.username


class Availability(models.Model):
    chef = models.ForeignKey(Chef, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_available = models.BooleanField(default=True)
    is_finalised = models.BooleanField(default=False)


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
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

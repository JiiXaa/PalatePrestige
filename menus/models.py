from django.db import models
from PIL import Image
from io import BytesIO
import boto3
import os


class Menu(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    chef = models.ForeignKey("users.Chef", on_delete=models.CASCADE)
    menu_category = models.ForeignKey(
        "MenuCategory", related_name="menus", on_delete=models.SET_NULL, null=True
    )

    def __str__(self):
        return self.title


class MenuCategory(models.Model):
    class Meta:
        verbose_name_plural = "menu categories"

    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Dish(models.Model):
    class Meta:
        verbose_name_plural = "dishes"

    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    image = models.ImageField(upload_to="dishes_images", blank=True, null=True)

    menu = models.ForeignKey(Menu, related_name="dishes", on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image:
            image = Image.open(self.image)
            if image.height > 300 or image.width > 300:
                output_size = (300, 300)
                image.thumbnail(output_size)
                image_buffer = BytesIO()
                image.save(image_buffer, format="JPEG")
                image_buffer.seek(0)
                filename = os.path.basename(self.image.name)
                self.image.save(filename, image_buffer, save=False)
                self.save()

                # Set ACL of the saved object to public-read
                s3 = boto3.client("s3")
                bucket_name = "palateprestigebucket"
                object_key = f"media/{self.image.name}"
                s3.put_object_acl(Bucket=bucket_name, Key=object_key, ACL="public-read")

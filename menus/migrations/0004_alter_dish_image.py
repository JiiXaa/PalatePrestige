# Generated by Django 4.2.2 on 2023-06-25 20:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("menus", "0003_dish_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="dish",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="dishes_images"),
        ),
    ]

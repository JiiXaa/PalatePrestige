# Generated by Django 4.2.2 on 2023-06-25 09:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("users", "0001_initial"),
        ("menus", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="menu",
            name="chef",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="users.chef"
            ),
        ),
        migrations.AddField(
            model_name="menu",
            name="menu_category",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="menus",
                to="menus.menucategory",
            ),
        ),
        migrations.AddField(
            model_name="dish",
            name="menu",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="dishes",
                to="menus.menu",
            ),
        ),
    ]
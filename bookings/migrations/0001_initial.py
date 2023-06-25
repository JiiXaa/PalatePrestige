# Generated by Django 4.2.2 on 2023-06-25 09:05

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Booking",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("booking_date", models.DateTimeField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("status", models.CharField(default="pending", max_length=20)),
                ("is_paid", models.BooleanField(default=False)),
                ("number_of_people", models.IntegerField()),
                ("total_cost", models.DecimalField(decimal_places=2, max_digits=6)),
            ],
        ),
    ]

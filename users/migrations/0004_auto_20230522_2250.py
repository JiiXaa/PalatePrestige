# Generated by Django 3.2.19 on 2023-05-22 21:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20230518_2124'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chef',
            name='email',
        ),
        migrations.RemoveField(
            model_name='chef',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='chef',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='customer',
            name='email',
        ),
        migrations.RemoveField(
            model_name='customer',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='customer',
            name='last_name',
        ),
    ]
from django.contrib import admin

from .models import Menu, Dish, MenuCategory

admin.site.register(Menu)
admin.site.register(Dish)
admin.site.register(MenuCategory)

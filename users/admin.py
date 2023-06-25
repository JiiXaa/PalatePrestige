from django.contrib import admin
from .models import Chef, Customer
from django.contrib.auth.admin import UserAdmin
from .models import User


class ChefAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "bio",
        "cuisine_types",
        "is_super_chef",
        "location",
    )

    ordering = ("user",)


class CustomerAdmin(admin.ModelAdmin):
    list_display = ("user", "location")

    ordering = ("user",)


admin.site.register(Chef, ChefAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(User, UserAdmin)

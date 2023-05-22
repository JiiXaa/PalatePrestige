from django.contrib import admin
from .models import Chef, Customer


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

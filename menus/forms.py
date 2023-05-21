from django import forms
from .models import Menu, MenuCategory
from django.core.exceptions import ValidationError
from django.db.models.functions import Lower


class MenuForm(forms.ModelForm):
    class Meta:
        model = Menu
        fields = ["title", "description", "price", "menu_category"]
        widgets = {
            "title": forms.TextInput(
                attrs={
                    "autofocus": True,
                    "placeholder": "Enter menu title",
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "placeholder": "Enter menu description",
                }
            ),
        }


class MenuCategoryForm(forms.ModelForm):
    class Meta:
        model = MenuCategory
        fields = ["name"]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "autofocus": True,
                    "placeholder": "Enter menu category name",
                }
            )
        }

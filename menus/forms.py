from django import forms
from .models import Menu, MenuCategory, Dish


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


class DishForm(forms.ModelForm):
    class Meta:
        model = Dish
        fields = ["name", "description", "category", "image"]
        widgets = {
            "name": forms.TextInput(
                attrs={
                    "autofocus": True,
                    "placeholder": "Enter dish name",
                }
            ),
            "description": forms.Textarea(
                attrs={
                    "placeholder": "Enter dish description",
                }
            ),
        }

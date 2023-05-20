from django import forms
from .models import Menu, MenuCategory


class MenuForm(forms.ModelForm):
    class Meta:
        model = Menu
        fields = ["title", "description", "price", "menu_category"]


class MenuCategoryForm(forms.ModelForm):
    class Meta:
        model = MenuCategory
        fields = ["name"]

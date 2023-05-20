from django.urls import path
from . import views

urlpatterns = [
    path("", views.all_menus, name="menus"),
    path("add/", views.add_menu, name="add_menu"),
    path("add_category/", views.add_menu_category, name="add_menu_category"),
]

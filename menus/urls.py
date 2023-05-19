from django.urls import path
from . import views

urlpatterns = [
    path("", views.all_menus, name="menus"),
    path("add/", views.add_menu, name="add_menu"),
]

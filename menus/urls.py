from django.urls import path
from . import views

urlpatterns = [
    path("", views.all_menus, name="menus"),
    path("add/", views.add_menu, name="add_menu"),
    path("add_category/", views.add_menu_category, name="add_menu_category"),
    path("<int:menu_id>/add_dish/", views.add_dish, name="add_dish"),
    path("<int:menu_id>/edit_dish/<int:dish_id>/", views.edit_dish, name="edit_dish"),
    path("<int:menu_id>/", views.menu_detail, name="menu_detail"),
]

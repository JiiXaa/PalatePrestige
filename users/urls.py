from django.urls import path
from . import views

urlpatterns = [
    path("chefs/", views.all_chefs, name="chefs"),
    path("chefs/<int:chef_id>/", views.chef_detail, name="chef_detail"),
]

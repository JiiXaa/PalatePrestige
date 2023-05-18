from django.urls import path
from . import views

urlpatterns = [path("chefs/", views.all_chefs, name="chefs")]

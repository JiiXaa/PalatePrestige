from django.urls import path
from . import views

urlpatterns = [
    path("chefs/", views.all_chefs, name="chefs"),
    path("chefs/<int:chef_id>/", views.chef_detail, name="chef_detail"),
    path("customers/", views.all_customers, name="customers"),
    path("customers/<int:customer_id>/", views.customer_detail, name="customer_detail"),
    path("accounts/signup/", views.CustomSignupView.as_view(), name="account_signup"),
    path("login_redirect/", views.login_redirect, name="login_redirect"),
    # REST API's
    path(
        "chefs/remove_past_availabilities/",
        views.remove_past_availabilities,
        name="remove_past_availabilities",
    ),
    path(
        "chefs/get_chef_availability/<int:chef_id>/",
        views.get_chef_availability,
        name="get_chef_availability",
    ),
    path(
        "chefs/add_chef_availability/",
        views.add_chef_availability,
        name="add_chef_availability",
    ),
    path(
        "chefs/delete_chef_availability/<int:availability_id>/",
        views.delete_chef_availability,
        name="delete_chef_availability",
    ),
    path(
        "chefs/update_chef_availability/<int:availability_id>/",
        views.update_chef_availability,
        name="update_chef_availability",
    ),
]

from django.urls import path
from . import views

urlpatterns = [
    path("chefs/", views.all_chefs, name="chefs"),
    path("chefs/<int:chef_id>/", views.chef_detail, name="chef_detail"),
    path("customers/", views.all_customers, name="customers"),
    path("customers/<int:customer_id>/", views.customer_detail, name="customer_detail"),
    path("accounts/signup/", views.CustomSignupView.as_view(), name="account_signup"),
]

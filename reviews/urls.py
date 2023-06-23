from django.urls import path
from .views import create_review, review_success, update_review

urlpatterns = [
    path("create_review/<int:booking_id>/", create_review, name="create_review"),
    path("review_success/<int:customer_id>/", review_success, name="review_success"),
    path("update_review/<int:booking_id>", update_review, name="update_review"),
]

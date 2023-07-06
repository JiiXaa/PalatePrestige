"""palateprestige URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

handler404 = 'menus.views.handler404'


urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("", include("menus.urls")),
    path("users/", include("users.urls")),
    path("menus/", include("menus.urls")),
    path("bookings/", include("bookings.urls")),
    path("reviews/", include("reviews.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

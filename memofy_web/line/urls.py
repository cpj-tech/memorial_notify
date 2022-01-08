from django.urls import path
from . import views

urlpatterns = [
    path('contact/login/', views.line_login),
    path('calendar/login/', views.line_login),
    path('callback/', views.callback, name='callback'),
]
from django.urls import path
from . import views

urlpatterns = [
		path('', views.switch_status, name='switch_status'),
		path('alert', views.alert, name='alert'),
]
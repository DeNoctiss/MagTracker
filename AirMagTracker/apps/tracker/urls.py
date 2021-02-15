from django.urls import path
from django.conf import settings
from django.urls import re_path
from django.conf.urls.static import static
from . import views

urlpatterns = [
	path('',views.index, name = 'index'),
	path('dates/',views.getDates, name = 'getDates'),
	re_path(r'^routesday/(?P<data>\d{4}-\d{2}-\d{2})/', views.getRoutes, name='getRoutes'),
	re_path(r'^dataflight/(?P<routeId>\d+)/', views.getDataFlight, name='getDataFlight')
]
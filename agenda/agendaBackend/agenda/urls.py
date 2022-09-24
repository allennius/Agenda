from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register(r'users', views.UserView, 'users')
router.register(r'todoDay', views.TodoDayView, 'todoDay')
router.register(r'todos', views.TodosView, 'todos')

urlpatterns = [
    path('auth/login', views.Login.as_view(), name="login"),
    path('auth/logout', views.Logout.as_view(), name='logout'),
    path('auth/register', views.Register.as_view(), name='register'),
    path('loadTasks', views.LoadTasks.as_view(), name="loadTasks"),
    path('', include(router.urls)),
]
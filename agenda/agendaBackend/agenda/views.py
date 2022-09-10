from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UserSerializer, TodoDaySerializer, TodosSerializer
from .models import User, TodoDay, Todos


# Create your views here.

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class TodoDayView(viewsets.ModelViewSet):
    serializer_class = TodoDaySerializer
    queryset = TodoDay.objects.all()

class TodosView(viewsets.ModelViewSet):
    serializer_class = TodosSerializer
    queryset = Todos.objects.all()

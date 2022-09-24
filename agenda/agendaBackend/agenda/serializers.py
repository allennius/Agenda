from rest_framework import serializers
from .models import User, TodoDay, Todos


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class TodoDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoDay
        fields = ('id', 'completed', 'title', 'calendarDay', 'author')


class TodosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todos
        fields = ('id', 'todo', 'completed', 'day')
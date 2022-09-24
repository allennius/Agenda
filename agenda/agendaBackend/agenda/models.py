from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


# user
class User(AbstractUser):
    
    def __str__(self):
        return self.username

# todo
class TodoDay(models.Model):
    title = models.CharField(max_length=50)
    calendarDay = models.DateField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="todo_author")
    completed = models.BooleanField(default=False)


    def __str__(self):
        return f"Title: {self.title}, User: {self.author}, day: {self.calendarDay}, completed: {self.completed}"

# todos
class Todos(models.Model):
    todo = models.CharField(max_length=100)
    completed = models.BooleanField(default=False)
    day = models.ForeignKey(TodoDay, on_delete=models.CASCADE, related_name="todos")

    def __str__(self):
        return self.todo

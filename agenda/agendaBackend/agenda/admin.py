from django.contrib import admin
from .models import User, TodoDay, Todos


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username')

class TodoDayAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'calendarDay', 'author')

class TodosAdmin(admin.ModelAdmin):
    list_display = ('id', 'todo', 'day', 'completed')

# Register your models here.

admin.site.register(User, UserAdmin)
admin.site.register(TodoDay, TodoDayAdmin)
admin.site.register(Todos, TodosAdmin)
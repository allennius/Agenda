from http.client import ResponseNotReady
from os import stat
from sqlite3 import IntegrityError
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

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


class Login(APIView):
    
    def post(self, request):

        # attempt to sign in user
        username = request.data['username']
        password = request.data['password']
        print(username, password)
        user = authenticate(request, username=username, password=password)

        # check if authenticateion is succesful
        if user is not None:
            login(request, user)
            
            userData = UserSerializer(user)

            response = {
                'success': 'logged in',
                'userdata': userData.data
            }

            return Response(response, status=status.HTTP_200_OK)
        else:
            response = {
                "error": "username or password incorrect" 
            }
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class Logout(APIView):

    def post(self, request):
        logout(request)

        response = {
            'message': 'User logged out'
        }

        return Response(response, status=status.HTTP_200_OK)


class Register(APIView):

    def post(self, request):
        username = request.data['username']
        email = request.data['email']
        password = request.data['password']
        confirmPassword = request.data['confirmPassword']

        # check if password is same as confirmation else send error
        if password != confirmPassword:
            response = {'error': 'password does not match confirmation'}
            return Response(response, status=status.HTTP_406_NOT_ACCEPTABLE)

        # try to create user, else send error message
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            response = {'error': 'User already exists'}
            return Response(response, status=status.HTTP_406_NOT_ACCEPTABLE)
        
        # login user and return success
        login(request, user)
        response = {
            'success': 'User registered and signed in',
            'userData': UserSerializer(user).data
            }
        return Response(response, status=status.HTTP_201_CREATED)


class LoadTasks(APIView):

    def post(self,request):

        # get userid from request
        userId = request.data['userId']

        # lists for response
        response = []

        # if month in request then get data for calander
        if 'month' and 'year' in request.data:
            calendarMonth = request.data['month']
            calendarYear = request.data['year']

            # filter so only calendarmonth is collected
            tasks = TodoDay.objects.all().filter(author=userId, completed=False, calendarDay__year=calendarYear, calendarDay__month=calendarMonth+1)

            # for task in tasks:
            for task in tasks:
                response.append({
                    'title': task.title,
                    'day': task.calendarDay.day
                })
            
            return Response(response, status=status.HTTP_200_OK)
            # month = data[0].calendarDay.month - 1
            # return Response(tasks, status=status.HTTP_200_OK)



        # if no month in request get data for tasks page
        # loop through days 
        for day in TodoDay.objects.all().filter(author=userId, completed=False):
            todosList = []
            thisday = TodoDaySerializer(day).data

            # loop through day todos in each day
            for todo in day.todos.all():
                todosList.append(TodosSerializer(todo).data)

            # add response to response
            response.append({
                "id": thisday['id'],
                "title": thisday['title'],
                "date": thisday['calendarDay'],
                "todos": todosList
            })
        
        return Response(response, status=status.HTTP_200_OK)


class ToggleCompletedTasks(APIView):

    def put(self,request):
        # get data from request
        dayId = request.data['dayId']
        todoId = request.data['todoId']
        completed = request.data['completed']

        # day object
        day = TodoDay.objects.get(id=dayId)

        # if tododay is checked, complete whole day
        if not todoId:
            for todo in day.todos.all():
                todo.completed = completed
                todo.save()

            day.completed = completed
            day.save()

        # if todo is checked, complete todo
        if todoId:
            todo = day.todos.get(id=todoId)
            todo.completed = completed
            todo.save()

        return Response({'message': 'toggle completed'}, status=status.HTTP_200_OK)

import datetime as dt
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError


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


        # if request comes from calendarDay
        if 'calendarDay' in request.data:
            calendarYear = request.data['year']
            calendarMonth = request.data['month']
            calendarDay = request.data['date']
            
            # loop through tasks and add to response
            for day in TodoDay.objects.all().filter(author=userId, completed=False, calendarDay__year=calendarYear, calendarDay__month=calendarMonth+1, calendarDay__day=calendarDay):
                todosList = []

                # loop thorugh todos in task and add to response 
                for todo in day.todos.all():
                    todosList.append(TodosSerializer(todo).data)

                response.append({
                    'task': TodoDaySerializer(day).data,
                    "todos": todosList
                })

            return Response(response, status=status.HTTP_200_OK)


        # if request comes from calendarDays
        if 'calendarDays' in request.data:
            calendarYear = request.data['year']
            calendarMonth = request.data['month']

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


        # if request comes from tasks
        if 'tasks' in request.data:
            # loop through days 
            for day in TodoDay.objects.all().filter(author=userId, completed=False):
                todosList = []

                # loop through day todos in each day
                for todo in day.todos.all():
                    todosList.append(TodosSerializer(todo).data)

                # add response to response
                response.append({
                    'task': TodoDaySerializer(day).data,
                    "todos": todosList
                })
            
            return Response(response, status=status.HTTP_200_OK)


        # else send back failed response
        response = [{'error': 'failed request'}]
        return Response(response, status=status.HTTP_400_BAD_REQUEST)


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


class AddTask(APIView):

    def post(self,request):

        # get variables needed to add task
        user = User.objects.get(pk=request.data['userId'])
        task = request.data['task']
        todos = request.data['todos']

        date = request.data['date']
        month = request.data['month']
        year = request.data['year']

        # adding calendarday (month plus one to get right month)
        calendarDay = dt.date(year, month+1, date)

        
        # add task to database
        newTask = TodoDay(title=task, author=user, calendarDay=calendarDay)
        newTask.save()

        # add todos to database (if any)
        if todos:
            for todo in todos:
                newTodo = Todos(todo=todo, day=newTask)
                newTodo.save()

        return Response({'message': 'task added'}, status=status.HTTP_200_OK)

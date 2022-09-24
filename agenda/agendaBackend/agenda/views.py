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
        tododay = TodoDay.objects.first()
        todos = tododay.todos.all()
        todoss = TodosSerializer(todos.first()).data
        print('**********')
        print(tododay)
        print('**********')
        print(tododay.todos.all())
        print('**********')
        print(todos)
        print('**********')
        print(todoss)
        print('**********')
        for todo in todos:
            print(TodosSerializer(todo).data)
            print('****')
        response = TodoDaySerializer(tododay).data
        # print(tododay.todos.all())
        
        return Response(response, status=status.HTTP_200_OK)


        
# class TestApi(APIView):

    

#     def post(self, request):
#         sertest = UserSerializer(User.objects.first())
#         print("******************")
#         print(User.objects.first().username)
#         print(sertest.data)

#         test = {
#             "test": "test"
#         }
        
#         return Response(sertest.data)

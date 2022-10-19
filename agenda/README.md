# Agenda Todo Calendar App

### Distinctiveness and Complexity

My goal with this project was really to test out and learn more about react. So I guess the complexity for me in this project lies more in learning react and connecting frontend to backend, rather then django models and relational database.

The project is a Calendar/Todo app  
A user logges on and sees his/her's calendar and can click on any day on the calendar then add task/todos to that day.  
At first I wanted to add some sort of friends list so you could add a friend/User to a Task/Event, in order to share the burdon so to speak, I decided against that because of time limitations. I also suspected that it would be close to count as a social network.   

I used the Create-React-App tool for the frontend and django for the backend, I also used Djangorestframework and django-cors-headers to help build and connect api to the frontend 

The database is simple with 3 models    
```
User
TodoDays
Todos
```
**User** is pretty self-explanatory  
**TodoDays** Is the Task/event.  foreing key:**User**  
**Todos** Is used if user adds more todos to **TodoDays**. foreign key: **TodoDays**  

The app is also mobile responsive.  
   
  ***

### Files

A semiquick walkthrough of the files in the project, Starting with backend  

#### **Backend**  
Backend project is called agendaBackend and the app in the project where most code is is called agenda.  

`settings.py`  
added 3 lines to installed apps  

```
    'corsheaders',
    'rest_framework',
    'agenda'
```

1 line to middleware  
```
    'corsheaders.middleware.CorsMiddleware'
```

DEFAULT_AUTO_FIELD - to create primary keys to models  
CORS_ORIGIN_WHITELIST - to allow connections, in this case to the React app (Frontend)  
AUTH_USER_MODEL - To be able to customiize user model  
```
    DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

    CORS_ORIGIN_WHITELIST = [
        'http://localhost:3000'
    ]

    AUTH_USER_MODEL = 'agenda.User'
```  
  
`urls.py (agendaBackend)`   
2 urlpatterns  
admin/ - admin site  
api/ - to where the rest of the backend sits (agenda.urls)
  
```
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('agenda.urls'))
    ]
```  
  
***`agenda`***    
moving on to the api - the agenda app

`models.py`    
I used 3 models as mentioned before.
```
User

TodoDay  
    title - name of task/event/todo
    calendarDay - date, needed to link to a day in calendar
    author - User foreign key
    completed - bool to determine if task/event is done

Todos
    todo - the users todo e.g. clean kitchen
    completed - bool to determine if todo is done
    day - TodoDay foreign key
```

`admin.py`  
Added my 3 models to admin.py to be able to edit them in admin site  
  
  
`serializers.py`  
added my 3 models to serializers to easier be able to convert the data to json data  

`urls.py`  
first I added 3 routes to /api or ''. 1 route for each model with serialized data.
so I can go to http://127.0.0.1:8000/api and see all models or go one step more e.g. '/api/users' to see all users.  
Then the rest of the views from views.py.  
  
  
`views.py`  
First I have the 3 views that serializes data for the /api  
Second there is another 3 views login,logout,register which handles login,logout,register of the User.  
  
Then there is 3 views that handles requests from the frontend.  

***LoadTasks***  

Handles 3 diffirent request depending on where the request comes from.  

*calendarDay* - returns non completed TodoDay and Todos for a specific user for a specific day.  
  
*calendarDays* - returns non completed TodoDay for a specific user for a specific month.  
  
*tasks* - returns all non completed TodoDays and Todos for a specific user.  
  
  

***ToggleCompletedTask***  
toggles bool of TodoDay and/or Todos
If TodoDay is toggled then all todos toggles too.  
Todos toggles individually  
  

***AddTask***  
Adds New TodoDay based on the data the user provided.  
If user also added Todos, they will be addes aswell and linked to the new TodoDay.  
  


#### **Frontend**  

`index.js`  
contains routes for each page of app. Index element is Login by default, changes to Home if user is logged on.  
Also create the root where the app in index.html.  

`csrftoken.js`  
Returns csrftoken via an input value. Input name = csrfmiddlewaretoken.  

#### **Styles folder**  
contains 5 css files with same names as the page or component it was created for.  
  
#### **Pages folder**  
*Some functions and variables are used almost the same way with same name in more than 1 file. I've only described them once here. I probably should have created some helper file but haven't..  
  

`Layout.jsx`  
Returns Navbar component and Outlet which is the selected route from index.js.  

`NoPage.jsx`  
Renders basic 404 page.  
Some other files has an if statement in the beginning which renders Nopage if the condition is not met.  
  
`Home.jsx`  
Returns Calendar component wrapped in a container.  

`Tasks.jsx`  
Returns a page which will show all of the users tasks that are not completed. Also has the ablility to toggle tasks/todos as completed.

This file contains 2 fetch requsts that I put in functions loadTasks()  and toggleCompleted().  

**loadTasks**  
loads the users tasks/todos and gets called after the page is rendered with the help of useEffect().  

**toggleCompleted**  
Is a put request that toggles the completed value of the clicked task/todo.
  
`CalendarDay.jsx`  
This page is rendered when the user has accessed a single day in the calendar e.g. 'October 3 2022'. The user can here toggle this days tasks as completed and also create new Tasks/Todods for this date.  
  
*Variables*:   
list *months* - used to determine name of month with the help of the getMonth method.  
useState object *inputs* - used to update and store value of the inputs in the form.  
useState object *showInput* - stores values of how many inputs is showing in the form.  

***Functions***:  
**handleChange**  
Updates inputs object when form inputs changes.  

**addInput**  
updates showInput object when "-" or "+" button is pressed.  

**addInputField**  
adds another input to form, increments the name of input which is used as the accessor in the inputs object.  

**handleAddTask**  
Adds all currently shown inputs to a list then sends all the data in form and date data via a Post request. Then reloads page.  
  
  
#### **Components folder**  
`Navbar.jsx`  
Returns the navbar which changes to dropdown if window gets to narrow. Login and Register if user **NOT** logged in. Changes when user is logged in.  

**useEffect**  
to run when page ha loaded.  
**isAuth**  - is set to true if user is logged on.  
A eventlistener(clickevent) is added to all links in navbar.  
  
**ToggleActiveLink**  
changes class on links when a link is clicked.  

**Logoutnav**  
renders Logout page with csrftoken prop when logout link is clicked.  

  
`Calendar.jsx`  
Returns the structure of the calendar that is shown. Displays Month and weekday, Also the abillity to change month back and forward. Calls CalendarDays to render all dates in calendar.  

*Variables*:
*months* and *daysInWeek* to determine month and weekday name.  
useState object *calendar* to keep track on date.

***Functions***:  
**nextMonth**  
Runs when user clicks on either arrow.  
Updates *calendar* to match new month and year.  
If year and month is current month and year the currentday is set.  
  
`CalendarDays.jsx`  
Returns all the days of the month, with a small notification in each day the user has a task in. If there is more tasks then 1, the notification shows a number of tasks instead of the title of the task.  

***Functions***:  

**loadTask**  
Is same as other files but runs each time props is updated. (When user changes month).  

**loadTaskToCalendar**  
Adds tasktitle to the tasks date. If there is more than one task on same day then the number of tasks is added instead. This information is added in a div to be shown inside the calendarday div.  

Then the first day of the month is determined so days that are added to the list *calendardays* starts with a monday even if the date is from previous month.

Then all the days in the month is added to *calendardays* and ends with a sunday.

Days that are in calendardays but from a different month gets another class to seperate the 2 from each other to the user.

#### **Auth folder**  
`Login.jsx`  
Contains a login form.  

*Variables*
useState:
*username* - stores username input  
*pwd* - stores password input
*errorMsg* - stores error message  

2 **useEffects** are run.  
1 after page render to check if user is logged in or not.  
2 to set error message to nothing when username or pwd gets changed.  

***Functions***
**handleSubmit**  
takes data from input and sends via Post request.
if it returns error the *errMsg* gets updated and shown to user.  
if succesful userId is set in localstorage and homepage gets rendered.  

  
`logout.jsx`  
Logs out User and clears Localstorage of userId.  
Redirects to homepage (login)  

  
`Register.jsx`  
Contains a form so the user can register.  

Pretty much identical to login page but with more inputs.
And infomration is sent to different api function to create a new user.  

### How to run application

open 2 terminal windows to run backend and frontend  

terminal window 1  
To run backend go to agenda/agendaBackend/  
run  
```
python3 manage.py runserver
```

terminal window 2  
To run frontend go to agenda/Frontend/  
run  
```
npm start
```

If browser not opens up automatically go to the adress shown in terminal window 2  
# Web Application Architecture for Task Manager

## 1. Web Application Overview:
This Task Manager website allows users to track, manage, and organize their tasks based on priorities, deadlines, and recurrence options. The website provides a user-friendly interface to add tasks, filter completed tasks, and view them on a calendar.

## 2. Back-End Architecture (Flask):
Flask will be used as the back-end framework.
The back-end will handle routes to serve the front-end HTML, handle task data submission, store data in a database, and manage user sessions.

## 3. Database Schema:
The web application will interact with a MySQL database that holds task data. The schema will include the following tables:

### Users Table:
- `user_id`: Primary key, integer
- `email`: User's email, string
- `password_hash`: Encrypted password, string

### Tasks Table:
- `task_id`: Primary key, integer
- `title`: Task title, string
- `description`: Task description, string
- `priority`: Task priority level (low, medium, high), string
- `recurrence`: Recurrence pattern (daily, weekly, etc.), string
- `due_date`: Task due date, date
- `completed`: Boolean indicating whether the task is completed
- `user_id`: Foreign key linking to the `Users` table

### Calendar Events Table:
- `event_id`: Primary key, integer
- `task_id`: Foreign key linking to the `Tasks` table
- `date`: Date of the event
- `completed`: Boolean indicating whether the event is completed

## 4. Routes and HTTP Methods:
### GET /:
- Displays the homepage with the task form and task list.

### POST /task:
- Submits a new task from the form and saves it to the database.

### GET /tasks:
- Fetches all tasks for a user and displays them.

### POST /filter-completed:
- Filters completed tasks and displays the filtered list.

### POST /task/update/:id:
- Marks a task as completed or updates task details.

## 5. Front-End and Back-End Interaction:
- The front-end sends data from the task form to the Flask back-end using POST requests.
- The back-end processes the data, stores it in the database, and returns updated task lists.
- Flask handles dynami

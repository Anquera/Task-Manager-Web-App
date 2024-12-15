// Select DOM elements
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskRecurrence = document.getElementById('task-recurrence');
const taskDueDate = document.getElementById('task-due-date');
const taskList = document.querySelector('#task-list .list-group');
const taskCounter = document.getElementById('task-counter');
const calendarDays = document.getElementById('calendar-days');
const monthYear = document.getElementById('month-year');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');
const filterCompletedButton = document.getElementById('filter-completed');

let tasks = [];
let editMode = false;
let editTaskId = null;
let selectedDate = new Date();
let currentMonth = selectedDate.getMonth();
let currentYear = selectedDate.getFullYear();
let filterCompleted = false; // New variable to track the filter state

// Function to update the task counter
function updateTaskCounter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    taskCounter.textContent = `${totalTasks} tasks total, ${completedTasks} completed`;
}

// Function to add or update a task
function saveTask(title, description, recurrence) {
    const dueDate = new Date(taskDueDate.value);
    if (editMode) {
        // Update existing task
        tasks = tasks.map(task => 
            task.id === editTaskId ? { ...task, title, description, recurrence, dueDate } : task
        );
        editMode = false;
        editTaskId = null;
    } else {
        // Add new tasks for each recurrence instance
        let taskDate = new Date(dueDate);
        const taskInstances = [];
        while (taskDate <= new Date(currentYear + 1, 11, 31)) { // Limit to one year for now
            taskInstances.push({
                id: Date.now() + taskInstances.length,
                title: title,
                description: description,
                recurrence: recurrence,
                dueDate: new Date(taskDate),
                completed: false
            });
            if (recurrence === 'daily') {
                taskDate.setDate(taskDate.getDate() + 1);
            } else if (recurrence === 'weekly') {
                taskDate.setDate(taskDate.getDate() + 7);
            } else if (recurrence === 'monthly') {
                taskDate.setMonth(taskDate.getMonth() + 1);
            } else {
                break;
            }
        }
        tasks = tasks.concat(taskInstances);
    }
    renderTasks();
    renderCalendar(); // Re-render the calendar to show updated tasks
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = '';
    
    // Filter tasks for the selected month and year
    const tasksForSelectedMonth = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
    });

    // Sort tasks by due date
    tasksForSelectedMonth.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    tasksForSelectedMonth.forEach(task => {
        if (filterCompleted && task.completed) {
            return; // Skip rendering completed tasks if the filter is active
        }
        const taskItem = document.createElement('li');
        taskItem.className = `list-group-item d-flex justify-content-between align-items-start ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <div>
                <h5>${task.title} - ${new Date(task.dueDate).toDateString()}</h5>
                <p>${task.description}</p>
            </div>
            <div>
                <button class="btn btn-sm btn-success me-2" onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="btn btn-sm btn-warning me-2" onclick="startEditTask(${task.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
    updateTaskCounter();
}

// Function to toggle task completion
function toggleTask(taskId) {
    tasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
    renderCalendar(); // Re-render the calendar to show updated tasks
}

// Function to delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
    renderCalendar(); // Re-render the calendar to show updated tasks
}

// Function to start editing a task
function startEditTask(taskId) {
    const taskToEdit = tasks.find(task => task.id === taskId);
    taskTitle.value = taskToEdit.title;
    taskDescription.value = taskToEdit.description;
    taskRecurrence.value = taskToEdit.recurrence;
    taskDueDate.value = taskToEdit.dueDate.toISOString().split('T')[0];
    editMode = true;
    editTaskId = taskId;
    renderCalendar(); // Highlight the selected date
}

// Form submission event listener
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (taskTitle.value.trim() && taskDescription.value.trim()) {
        saveTask(taskTitle.value, taskDescription.value, taskRecurrence.value);
        taskTitle.value = '';
        taskDescription.value = '';
        taskDueDate.value = '';
        taskRecurrence.value = 'none';
    }
});

// Function to render the calendar
function renderCalendar() {
    calendarDays.innerHTML = '';
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    monthYear.textContent = `${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`;

    // Add blank days to align the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isSameDay(date, selectedDate) ? 'selected' : ''}`;
        dayElement.textContent = day;

        // Display tasks for this date
        const tasksForDate = getTasksForDate(date);
        if (tasksForDate.length > 0) {
            const taskListElement = document.createElement('ul');
            tasksForDate.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = task.title;
                taskListElement.appendChild(taskItem);
            });
            dayElement.appendChild(taskListElement);
        }

        dayElement.addEventListener('click', () => selectDate(date));
        calendarDays.appendChild(dayElement);
    }
}

// Function to get tasks for a specific date, including recurring tasks
function getTasksForDate(date) {
    return tasks.filter(task => {
        if (filterCompleted && task.completed) {
            return false; // Exclude completed tasks if the filter is active
        }
        return isSameDay(new Date(task.dueDate), date);
    });
}

// Function to select a date
function selectDate(date) {
    selectedDate = date;
    renderCalendar();
}

// Function to check if two dates are the same day
function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

// Event listeners for changing month
prevMonth.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderTasks(); // Re-render tasks to filter by the current month
    renderCalendar();
});

nextMonth.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderTasks(); // Re-render tasks to filter by the current month
    renderCalendar();
});

// Event listener for filtering completed tasks
filterCompletedButton.addEventListener('click', () => {
    filterCompleted = !filterCompleted;
    filterCompletedButton.textContent = filterCompleted ? 'Show Completed' : 'Filter Completed';
    renderTasks();
    renderCalendar(); // Re-render the calendar to apply the filter
});

// Initial rendering of tasks and calendar
renderTasks();
renderCalendar();

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load tasks from localStorage
    loadTasks();
    
    // Add event listeners to existing delete and edit buttons
    initializeExistingTasks();
    
    // Add event listener for the add button
    document.getElementById("add-btn").addEventListener("click", addNewTask);
    
    // Add event listener for the Enter key in the input field
    document.getElementById("todo-input").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            addNewTask();
        }
    });
});

// Update the item numbers for all tasks
function updateItemNumbers() {
    const items = document.querySelectorAll('#todo-list li');
    items.forEach((item, index) => {
        item.setAttribute('data-index', index + 1);
    });
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
    const todoList = document.getElementById("todo-list");
    
    // Clear any existing tasks from the HTML
    todoList.innerHTML = '';
    
    // Add tasks from localStorage
    tasks.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = task.id;
        checkbox.checked = task.completed;

        const label = document.createElement("label");
        label.setAttribute("for", checkbox.id);
        label.textContent = task.text;
        
        // Apply completed styling if needed
        if (task.completed) {
            label.style.textDecoration = 'line-through';
            label.style.color = '#999';
        }

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "✏️";

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "🗑️";

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
    
    // Update item numbers
    updateItemNumbers();
}

// Save tasks to localStorage
function saveTasks() {
    const todoItems = document.querySelectorAll('#todo-list li');
    const tasks = [];
    
    todoItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');
        
        tasks.push({
            id: checkbox.id,
            text: label.textContent,
            completed: checkbox.checked
        });
    });
    
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    
    // Update item numbers
    updateItemNumbers();
}

// Initialize event listeners for existing tasks
function initializeExistingTasks() {
    // Add event listeners to all existing delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('li').remove();
            saveTasks();
        });
    });
    
    // Add event listeners to all existing edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            editTask(this.closest('li'));
        });
    });
    
    // Add event listeners to all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.color = '#999';
            } else {
                label.style.textDecoration = 'none';
                label.style.color = '';
            }
            saveTasks();
        });
    });
}

// Function to add a new task
function addNewTask() {
    const input = document.getElementById("todo-input");
    const taskText = input.value.trim();
    if (taskText) {
        const li = document.createElement("li");
        const taskId = `task-${Date.now()}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = taskId;
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.color = '#999';
            } else {
                label.style.textDecoration = 'none';
                label.style.color = '';
            }
            saveTasks();
        });

        const label = document.createElement("label");
        label.setAttribute("for", taskId);
        label.textContent = taskText;

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "✏️";
        editBtn.addEventListener("click", function() {
            editTask(li);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "🗑️";
        deleteBtn.addEventListener("click", function() {
            li.remove();
            saveTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        document.getElementById("todo-list").appendChild(li);
        
        // Save tasks after adding a new one
        saveTasks();

        input.value = ""; // Clear the input field after adding task
    }
}

// Function to edit a task
function editTask(li) {
    const label = li.querySelector('label');
    const currentText = label.textContent;
    
    // Create input for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    input.style.flex = '1';
    
    // Create save button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'save-btn';
    
    // Temporarily replace label and other buttons
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    
    // Hide existing buttons
    label.style.display = 'none';
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
    
    // Add new elements
    li.appendChild(input);
    li.appendChild(saveBtn);
    
    // Focus the input field
    input.focus();
    
    // Add event listener for save button
    saveBtn.addEventListener('click', function() {
        saveEdit(li, input);
    });
    
    // Add event listener for Enter key
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEdit(li, input);
        }
    });
}

// Function to save the edited task
function saveEdit(li, input) {
    const newText = input.value.trim();
    if (newText) {
        const label = li.querySelector('label');
        label.textContent = newText;
        
        // Show the original elements again
        label.style.display = '';
        li.querySelector('.edit-btn').style.display = '';
        li.querySelector('.delete-btn').style.display = '';
        
        // Remove the edit input and save button
        li.removeChild(input);
        li.removeChild(li.querySelector('.save-btn'));
        
        // Save tasks after editing
        saveTasks();
    }
}

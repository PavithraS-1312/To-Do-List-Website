//What do we need from HTML?
let currentTasks = "all";
let input = document.getElementById("task");
let button = document.getElementById("addTask");
let list = document.getElementById("taskList");
let dueDate = document.getElementById("dueDate");
let clearCompletedBtn = document.getElementById("clearCompleted");


let allBtn = document.getElementById("all");
let pendingBtn = document.getElementById("pending");
let completedBtn = document.getElementById("completed");

clearCompletedBtn.addEventListener("click", function () {
    if (tasks.filter(task => task.completed).length === 0) {
        alert("No tasks are completed!");
        return;
    }

    if (confirm("Are you sure you want to clear all completed tasks?")) {
        tasks = tasks.filter(task => task.completed === false);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }
});

//Where are tasks stored?
let tasks = [];
//Displaying the stored tasks
let storedTasks = localStorage.getItem("tasks");

if (storedTasks) {
    tasks = JSON.parse(storedTasks);
}

renderTasks();

function renderTasks() {
    //Clear the existing list 
    list.innerHTML = "";

    if (tasks.length == 0) {
        list.innerHTML = "<p>No tasks added yet!</p>";
        return;
    }

    let total = tasks.length;
    let completed = tasks.filter(task => task.completed).length;
    let pending = total - completed;

    allBtn.textContent = `All (${total})`;
    completedBtn.textContent = `Completed (${completed})`;
    pendingBtn.textContent = `Pending (${pending})`;

    let filteredTasks;
    if (currentTasks == "completed") {
        filteredTasks = tasks.filter(task => task.completed === true);
    }
    else if (currentTasks == "pending") {
        filteredTasks = tasks.filter(task => task.completed === false);
    }
    else {
        filteredTasks = tasks;
    }


    //Loop tasks
    filteredTasks.forEach(function (task) {

        //Create <li>
        let lt = document.createElement("li");

        let taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        let taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        let taskDate = document.createElement("small");
        taskDate.classList.add("task-date");
        

        if(task.due){
            let date=new Date(task.due);
            taskDate.textContent = "Due: " + date.toLocaleString();
        }
        else{
            taskDate.textContent = "No Due Date";
        }

        taskInfo.appendChild(taskText);
        taskInfo.appendChild(taskDate);


        if (task.completed) {
            lt.classList.add("completed");
        }

        //Completed Button
        let completedBtn = document.createElement("button");
        completedBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        completedBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            task.completed = !task.completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        });


        //Edit feature
        let editBtn = document.createElement("button");
        editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';

        editBtn.addEventListener("click", function (event) {
            event.stopPropagation();

            let editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = task.text;

            lt.innerHTML = "";
            lt.appendChild(editInput);
            editInput.focus();

            editInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    let newText = editInput.value.trim();
                    if (newText === "") {
                        alert("Task cannot be empty!");
                        return;
                    }
                    task.text = newText;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    renderTasks();
                }
            });
        });
        


        //Delete button
        let del = document.createElement("button");
        del.innerHTML = '<i class="fa-solid fa-trash"></i>';
        del.addEventListener("click", function (event) {
            event.stopPropagation();  //On cliking delete button, it will only perform delete. It will not toggle the task.
            if (confirm("Are you sure you want to delete this task?")) {
                tasks = tasks.filter(item => item.id !== task.id);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
            }
        });
        

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("task-buttons");

        buttonContainer.appendChild(completedBtn);
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(del);

        lt.appendChild(taskInfo);
        lt.appendChild(buttonContainer);
        list.appendChild(lt);
    })
}

//Adding a task
button.addEventListener("click", function () {
    console.log("Button clicked");
    let task = input.value;
    console.log(task);
    if (task.trim() == "") {
        alert("Please enter a task");
        return;
    }
    tasks.push({
        id: Date.now(),
        text: task,
        completed: false,
        due: dueDate.value
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(tasks);
    input.value = "";
    renderTasks();

})

allBtn.addEventListener("click", function () {
    currentTasks = "all";
    renderTasks();
});
completedBtn.addEventListener("click", function () {
    currentTasks = "completed";
    renderTasks();
});
pendingBtn.addEventListener("click", function () {
    currentTasks = "pending";
    renderTasks();
});

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        button.click();
    }
})


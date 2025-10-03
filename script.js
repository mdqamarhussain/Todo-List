const input = document.querySelector("#task-input");
const btn = document.querySelector("#add-btn");
const taskList = document.querySelector("#task-list");

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();
});

btn.addEventListener("click", () => {
    if (input.value.trim() !== "") {
        createTask({ text: input.value, completed: false });
        input.value = "";
        saveTasksToLocalStorage();
    }
});

function createTask(task) {
    let newTask = document.createElement("div");
    newTask.classList.add("task-item");
    if (task.completed) {
        newTask.classList.add('completed');
    }

    let iconSpan = document.createElement("span");
    iconSpan.className = "task-icon";
    iconSpan.textContent = task.completed ? "☑" : "☐";
    newTask.appendChild(iconSpan);

    let textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.innerText = task.text;
    newTask.appendChild(textSpan);

    newTask.addEventListener("click", (e) => {
        if (e.target.classList.contains('edit-btn') || e.target.classList.contains('delete-btn')) {
            return;
        }
        newTask.classList.toggle('completed');
        iconSpan.textContent = newTask.classList.contains('completed') ? "☑" : "☐";
        saveTasksToLocalStorage();
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        newTask.remove();
        saveTasksToLocalStorage();
    });

    let editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        let currentText = textSpan.innerText;

        let editInput = document.createElement("input");
        editInput.value = currentText;
        editInput.className = "edit-field";

        newTask.replaceChild(editInput, textSpan);
        editInput.focus();

        function finishEdit() {
            let newValue = editInput.value.trim();
            if (newValue !== "") {
                textSpan.innerText = newValue;
                newTask.replaceChild(textSpan, editInput);
                saveTasksToLocalStorage();
            } else {
                editInput.focus();
            }
        }

        editInput.addEventListener("blur", finishEdit);
        editInput.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") finishEdit();
        });
    });

    newTask.appendChild(editBtn);
    newTask.appendChild(deleteBtn);
    taskList.appendChild(newTask);
}

function saveTasksToLocalStorage() {
    let items = document.querySelectorAll("#task-list .task-item");
    let tasks = [];
    for (let item of items) {
        let text = item.querySelector(".task-text").innerText.trim();
        let isCompleted = item.classList.contains('completed');
        tasks.push({ text, completed: isCompleted });
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    for (let task of tasks) createTask(task);
}
loadTasksFromLocalStorage();

const greetingElement = document.getElementById("greeting");
const currentTime = document.getElementById("current-time");
const currentDate = document.getElementById("current-date");

let savedName = localStorage.getItem("customName") || "";

function updateClock() {
    const now = new Date();

    currentTime.textContent = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    currentDate.textContent = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const hour = now.getHours();
    let greeting;

    if (hour >= 5 && hour < 11) {
        greeting = "Good Morning";
    } else if (hour >= 11 && hour < 15) {
        greeting = "Good Afternoon";
    } else if (hour >= 15 && hour < 18) {
        greeting = "Good Evening";
    } else {
        greeting = "Good Night";
    }

    greetingElement.textContent = savedName
        ? `${greeting}, ${savedName}!`
        : `${greeting}!`;
}

updateClock();
setInterval(updateClock, 1000);

let timerDuration = 25 * 60;
let remainingTime = timerDuration;
let timerInterval = null;

const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start-timer");
const stopButton = document.getElementById("stop-timer");
const resetButton = document.getElementById("reset-timer");

function displayTimer() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

startButton.addEventListener("click", function () {
    if (timerInterval !== null || remainingTime <= 0) return;

    timerInterval = setInterval(function () {
        remainingTime--;
        displayTimer();

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Focus session completed! Great job!");
        }
    }, 1000);
});

stopButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;
});

resetButton.addEventListener("click", function () {
    clearInterval(timerInterval);
    timerInterval = null;

    remainingTime = timerDuration;
    displayTimer();
});

displayTimer();

const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const taskText = document.createElement("span");
        taskText.textContent = task.text;

        taskText.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            displayTasks();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function () {
            const newText = prompt("Edit tugas:", task.text);

            if (newText !== null && newText.trim() !== "") {
                tasks[index].text = newText.trim();
                saveTasks();
                displayTasks();
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}


function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Silakan masukkan tugas terlebih dahulu!");
        return;
    }

    const isDuplicate = tasks.some(task =>
        task.text.toLowerCase() === taskText.toLowerCase()
    );

    if (isDuplicate) {
        alert("Tugas tersebut sudah ada!");
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
}


addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

displayTasks();

const linkNameInput = document.getElementById("link-name");
const linkUrlInput = document.getElementById("link-url");
const addLinkButton = document.getElementById("add-link");
const quickLinksContainer = document.getElementById("quick-links");

let quickLinks = JSON.parse(localStorage.getItem("quickLinks")) || [];

function saveLinks() {
    localStorage.setItem("quickLinks", JSON.stringify(quickLinks));
}

function displayLinks() {
    quickLinksContainer.innerHTML = "";

    quickLinks.forEach((link, index) => {
        const linkCard = document.createElement("div");
        linkCard.className = "quick-link-item";

        const linkElement = document.createElement("a");
        linkElement.textContent = link.name;
        linkElement.href = link.url;
        linkElement.target = "_blank";
        linkElement.rel = "noopener noreferrer";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            quickLinks.splice(index, 1);
            saveLinks();
            displayLinks();
        });

        linkCard.appendChild(linkElement);
        linkCard.appendChild(deleteButton);

        quickLinksContainer.appendChild(linkCard);
    });
}

function addLink() {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();

    if (name === "" || url === "") {
        alert("Nama dan alamat website harus diisi!");
        return;
    }

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    try {
        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            alert("Alamat website tidak valid!");
            return;
        }
    } catch {
        alert("Alamat website tidak valid!");
        return;
    }

    quickLinks.push({
        name: name,
        url: url
    });

    saveLinks();
    displayLinks();

    linkNameInput.value = "";
    linkUrlInput.value = "";
}

addLinkButton.addEventListener("click", addLink);

displayLinks();

const customNameInput = document.getElementById("custom-name");
const saveNameButton = document.getElementById("save-name");

customNameInput.value = savedName;

saveNameButton.addEventListener("click", function () {
    const name = customNameInput.value.trim();

    if (name === "") {
        alert("Silakan masukkan nama terlebih dahulu!");
        return;
    }

    savedName = name;
    localStorage.setItem("customName", savedName);

    updateClock();

    alert("Nama berhasil disimpan!");
});

const toggleThemeButton = document.getElementById("toggle-theme");

let savedTheme = localStorage.getItem("theme") || "light";

function applyTheme() {
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        toggleThemeButton.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        toggleThemeButton.textContent = "🌙 Dark Mode";
    }
}

toggleThemeButton.addEventListener("click", function () {
    savedTheme = savedTheme === "light" ? "dark" : "light";

    localStorage.setItem("theme", savedTheme);
    applyTheme();
});

applyTheme();

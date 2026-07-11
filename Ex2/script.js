// ================= In-memory "database" (simulates backend) =================
// Pre-seeded demo user so evaluators can log in instantly: demo / demo123
let users = [
    { username: "demo", password: "demo123" }
  ];
  
  // Tasks stored per username: { username: [ {id, text, priority, completed} ] }
  let tasksByUser = {
    demo: [
      { id: 1, text: "Complete resume review", priority: "high", completed: false },
      { id: 2, text: "Apply to 5 job openings", priority: "high", completed: false },
      { id: 3, text: "Practice DSA problems", priority: "medium", completed: true }
    ]
  };
  
  let currentUser = null;
  let currentFilter = "all";
  
  // ================= DOM references =================
  const authScreen = document.getElementById("authScreen");
  const dashboard = document.getElementById("dashboard");
  
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");
  const loginError = document.getElementById("loginError");
  const signupError = document.getElementById("signupError");
  
  const welcomeText = document.getElementById("welcomeText");
  const logoutBtn = document.getElementById("logoutBtn");
  const addTaskForm = document.getElementById("addTaskForm");
  const taskInput = document.getElementById("taskInput");
  const priorityInput = document.getElementById("priorityInput");
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");
  const filterButtons = document.querySelectorAll(".filter-btn");
  
  // ================= Auth: switch between login/signup =================
  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  });
  
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });
  
  // ================= Signup =================
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
  
    if (users.find(u => u.username === username)) {
      signupError.textContent = "Username already exists.";
      return;
    }
  
    users.push({ username, password });
    tasksByUser[username] = [];
    signupError.textContent = "";
    signupForm.reset();
  
    loginSuccess(username);
  });
  
  // ================= Login =================
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
  
    const user = users.find(u => u.username === username && u.password === password);
  
    if (!user) {
      loginError.textContent = "Invalid username or password.";
      return;
    }
  
    loginError.textContent = "";
    loginForm.reset();
    loginSuccess(username);
  });
  
  function loginSuccess(username) {
    currentUser = username;
    welcomeText.textContent = `Welcome, ${username}!`;
    authScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");
    renderTasks();
  }
  
  // ================= Logout =================
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    dashboard.classList.add("hidden");
    authScreen.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });
  
  // ================= Add Task =================
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
  
    const newTask = {
      id: Date.now(),
      text,
      priority: priorityInput.value,
      completed: false
    };
  
    tasksByUser[currentUser].unshift(newTask);
    taskInput.value = "";
    renderTasks();
  });
  
  // ================= Filter =================
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });
  
  // ================= Render Tasks (scoped to logged-in user) =================
  function renderTasks() {
    const userTasks = tasksByUser[currentUser] || [];
  
    const filtered = userTasks.filter(t => {
      if (currentFilter === "active") return !t.completed;
      if (currentFilter === "completed") return t.completed;
      return true;
    });
  
    taskList.innerHTML = "";
  
    if (filtered.length === 0) {
      taskList.innerHTML = `<li class="empty-state">No tasks here. Add one above!</li>`;
    } else {
      filtered.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item priority-${task.priority}${task.completed ? " completed" : ""}`;
        li.innerHTML = `
          <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
          <span class="task-text">${task.text}</span>
          <span class="priority-tag">${task.priority}</span>
          <button class="delete-task-btn" data-id="${task.id}">✕</button>
        `;
        taskList.appendChild(li);
      });
    }
  
    // Update count
    const activeCount = userTasks.filter(t => !t.completed).length;
    taskCount.textContent = `${activeCount} task(s) remaining`;
  
    // Wire up checkbox + delete events
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(cb => {
      cb.addEventListener("change", () => toggleComplete(Number(cb.dataset.id)));
    });
    document.querySelectorAll(".delete-task-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteTask(Number(btn.dataset.id)));
    });
  }
  
  // ================= Toggle complete =================
  function toggleComplete(id) {
    const task = tasksByUser[currentUser].find(t => t.id === id);
    if (task) task.completed = !task.completed;
    renderTasks();
  }
  
  // ================= Delete task =================
  function deleteTask(id) {
    tasksByUser[currentUser] = tasksByUser[currentUser].filter(t => t.id !== id);
    renderTasks();
  }
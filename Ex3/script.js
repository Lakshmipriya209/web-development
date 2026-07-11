// ================= In-memory "database" =================
let users = [
    { username: "demo", password: "demo123" },
    { username: "arun", password: "pass123" },
    { username: "priya", password: "pass123" },
    { username: "kumar", password: "pass123" }
  ];
  
  let following = {
    demo: ["arun", "priya"]
  };
  
  // Posts now include an image (Instagram is image-first)
  let posts = [
    { id: 1, author: "arun", image: "https://picsum.photos/id/1015/500/500", caption: "Weekend trek vibes 🏞️", time: "2h ago", likes: [] },
    { id: 2, author: "priya", image: "https://picsum.photos/id/1025/500/500", caption: "New puppy alert 🐶", time: "5h ago", likes: ["arun"] },
    { id: 3, author: "kumar", image: "https://picsum.photos/id/1035/500/500", caption: "Coding session with coffee ☕", time: "1d ago", likes: [] },
    { id: 4, author: "arun", image: "https://picsum.photos/id/1041/500/500", caption: "Sunset from my terrace", time: "1d ago", likes: [] }
  ];
  
  let currentUser = null;
  let postIdCounter = 5;
  
  // ================= DOM references =================
  const authScreen = document.getElementById("authScreen");
  const app = document.getElementById("app");
  
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");
  const loginError = document.getElementById("loginError");
  const signupError = document.getElementById("signupError");
  
  const logoutBtn = document.getElementById("logoutBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const uploadOverlay = document.getElementById("uploadOverlay");
  const cancelUploadBtn = document.getElementById("cancelUploadBtn");
  const uploadForm = document.getElementById("uploadForm");
  
  const tabButtons = document.querySelectorAll(".tab-btn");
  const feedTab = document.getElementById("feedTab");
  const discoverTab = document.getElementById("discoverTab");
  const profileTab = document.getElementById("profileTab");
  
  const storiesBar = document.getElementById("storiesBar");
  const feedList = document.getElementById("feedList");
  const discoverList = document.getElementById("discoverList");
  
  const profileAvatar = document.getElementById("profileAvatar");
  const profileUsername = document.getElementById("profileUsername");
  const postCount = document.getElementById("postCount");
  const followingCount = document.getElementById("followingCount");
  const profileGrid = document.getElementById("profileGrid");
  
  // ================= Auth switch =================
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
      signupError.textContent = "Username already taken.";
      return;
    }
  
    users.push({ username, password });
    following[username] = [];
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
    authScreen.classList.add("hidden");
    app.classList.remove("hidden");
    renderAll();
  }
  
  logoutBtn.addEventListener("click", () => {
    currentUser = null;
    app.classList.add("hidden");
    authScreen.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });
  
  // ================= Tab switching =================
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
  
      feedTab.classList.add("hidden");
      discoverTab.classList.add("hidden");
      profileTab.classList.add("hidden");
  
      if (btn.dataset.tab === "feed") feedTab.classList.remove("hidden");
      if (btn.dataset.tab === "discover") discoverTab.classList.remove("hidden");
      if (btn.dataset.tab === "profile") profileTab.classList.remove("hidden");
  
      renderAll();
    });
  });
  
  // ================= Upload modal =================
  uploadBtn.addEventListener("click", () => uploadOverlay.classList.add("show"));
  cancelUploadBtn.addEventListener("click", () => uploadOverlay.classList.remove("show"));
  
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const image = document.getElementById("imageUrlInput").value.trim();
    const caption = document.getElementById("captionInput").value.trim();
    if (!image || !caption) return;
  
    posts.unshift({
      id: postIdCounter++,
      author: currentUser,
      image,
      caption,
      time: "just now",
      likes: []
    });
  
    uploadForm.reset();
    uploadOverlay.classList.remove("show");
    renderAll();
  });
  
  // ================= Render everything =================
  function renderAll() {
    renderStories();
    renderFeed();
    renderDiscover();
    renderProfile();
  }
  
  // ---- Stories bar: shows followed users (tap = just visual, no story content) ----
  function renderStories() {
    const followedUsers = following[currentUser] || [];
    storiesBar.innerHTML = "";
  
    followedUsers.forEach(username => {
      const item = document.createElement("div");
      item.className = "story-item";
      item.innerHTML = `
        <div class="story-ring"><div class="avatar-inner">${username[0].toUpperCase()}</div></div>
        <span>${username}</span>
      `;
      storiesBar.appendChild(item);
    });
  
    if (followedUsers.length === 0) {
      storiesBar.innerHTML = `<span style="font-size:12px;color:#999;padding:8px 0;">Follow people to see their stories here</span>`;
    }
  }
  
  // ---- Home Feed: only posts from people I follow + my own ----
  function renderFeed() {
    const followedUsers = following[currentUser] || [];
    const visiblePosts = posts.filter(p => p.author === currentUser || followedUsers.includes(p.author));
  
    feedList.innerHTML = "";
  
    if (visiblePosts.length === 0) {
      feedList.innerHTML = `<div class="empty-state">Your feed is empty. Follow people in "Discover" to see their posts!</div>`;
      return;
    }
  
    visiblePosts.forEach(p => feedList.appendChild(buildPostCard(p)));
  }
  
  // ---- Build a post card (Instagram-style: image, like, caption) ----
  function buildPostCard(p) {
    const card = document.createElement("div");
    card.className = "post-card";
    const liked = p.likes.includes(currentUser);
  
    card.innerHTML = `
      <div class="post-header">
        <div class="avatar">${p.author[0].toUpperCase()}</div>
        <div class="post-author">${p.author}</div>
      </div>
      <img class="post-image" src="${p.image}" alt="post">
      <div class="post-actions">
        <button class="action-btn like-btn ${liked ? "liked" : ""}" data-id="${p.id}">${liked ? "♥" : "♡"}</button>
      </div>
      <div class="like-count">${p.likes.length} likes</div>
      <div class="post-caption"><strong>${p.author}</strong>${p.caption}</div>
      <div class="post-time">${p.time}</div>
    `;
  
    card.querySelector(".like-btn").addEventListener("click", () => toggleLike(p.id));
    return card;
  }
  
  function toggleLike(id) {
    const post = posts.find(p => p.id === id);
    const idx = post.likes.indexOf(currentUser);
    if (idx === -1) post.likes.push(currentUser);
    else post.likes.splice(idx, 1);
    renderAll();
  }
  
  // ---- Discover: list all other users with follow/unfollow ----
  function renderDiscover() {
    discoverList.innerHTML = "";
    const others = users.filter(u => u.username !== currentUser);
  
    others.forEach(u => {
      const isFollowing = (following[currentUser] || []).includes(u.username);
      const card = document.createElement("div");
      card.className = "person-card";
      card.innerHTML = `
        <div class="avatar">${u.username[0].toUpperCase()}</div>
        <div class="person-name">${u.username}</div>
        <button class="follow-btn ${isFollowing ? "following" : ""}" data-username="${u.username}">
          ${isFollowing ? "Following" : "Follow"}
        </button>
      `;
      card.querySelector(".follow-btn").addEventListener("click", () => toggleFollow(u.username));
      discoverList.appendChild(card);
    });
  }
  
  function toggleFollow(username) {
    if (!following[currentUser]) following[currentUser] = [];
    const idx = following[currentUser].indexOf(username);
    if (idx === -1) following[currentUser].push(username);
    else following[currentUser].splice(idx, 1);
    renderAll();
  }
  
  // ---- Profile tab: grid of my own posts ----
  function renderProfile() {
    profileAvatar.textContent = currentUser ? currentUser[0].toUpperCase() : "";
    profileUsername.textContent = currentUser;
  
    const myPosts = posts.filter(p => p.author === currentUser);
    postCount.textContent = myPosts.length;
    followingCount.textContent = (following[currentUser] || []).length;
  
    profileGrid.innerHTML = "";
  
    if (myPosts.length === 0) {
      profileGrid.innerHTML = `<div class="empty-state">No posts yet. Tap ➕ to share your first photo!</div>`;
      return;
    }
  
    myPosts.forEach(p => {
      const item = document.createElement("div");
      item.className = "grid-item";
      item.innerHTML = `
        <img src="${p.image}" alt="post">
        <button class="delete-grid-btn" data-id="${p.id}">✕</button>
      `;
      item.querySelector(".delete-grid-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        posts = posts.filter(post => post.id !== p.id);
        renderAll();
      });
      profileGrid.appendChild(item);
    });
  }
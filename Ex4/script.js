// ================= Data (simulates backend) =================
const restaurants = [
    {
      id: 1,
      name: "Saravana Bhavan",
      cuisine: "South Indian",
      rating: 4.3,
      time: "30-35 min",
      image: "https://picsum.photos/id/292/300/160",
      menu: [
        { id: 101, name: "Masala Dosa", price: 90, veg: true, desc: "Crispy dosa with spiced potato filling" },
        { id: 102, name: "Idli Sambar (4 pcs)", price: 60, veg: true, desc: "Steamed rice cakes with sambar & chutney" },
        { id: 103, name: "Chicken Chettinad", price: 220, veg: false, desc: "Spicy Chettinad-style chicken curry" },
        { id: 104, name: "Filter Coffee", price: 30, veg: true, desc: "South Indian style filter coffee" }
      ]
    },
    {
      id: 2,
      name: "Punjabi Tadka",
      cuisine: "North Indian",
      rating: 4.1,
      time: "35-40 min",
      image: "https://picsum.photos/id/365/300/160",
      menu: [
        { id: 201, name: "Butter Chicken", price: 260, veg: false, desc: "Creamy tomato-based chicken curry" },
        { id: 202, name: "Paneer Tikka", price: 200, veg: true, desc: "Grilled cottage cheese with spices" },
        { id: 203, name: "Garlic Naan", price: 50, veg: true, desc: "Tandoor-baked garlic flatbread" },
        { id: 204, name: "Dal Makhani", price: 180, veg: true, desc: "Slow-cooked creamy black lentils" }
      ]
    },
    {
      id: 3,
      name: "Pizza Republic",
      cuisine: "Italian",
      rating: 4.5,
      time: "25-30 min",
      image: "https://picsum.photos/id/1080/300/160",
      menu: [
        { id: 301, name: "Margherita Pizza", price: 250, veg: true, desc: "Classic cheese and tomato pizza" },
        { id: 302, name: "Pepperoni Pizza", price: 320, veg: false, desc: "Loaded with pepperoni and cheese" },
        { id: 303, name: "Garlic Bread", price: 120, veg: true, desc: "Toasted bread with garlic butter" }
      ]
    },
    {
      id: 4,
      name: "Dragon Wok",
      cuisine: "Chinese",
      rating: 4.0,
      time: "30-35 min",
      image: "https://picsum.photos/id/292/300/161",
      menu: [
        { id: 401, name: "Veg Fried Rice", price: 150, veg: true, desc: "Stir-fried rice with mixed vegetables" },
        { id: 402, name: "Chilli Chicken", price: 220, veg: false, desc: "Indo-Chinese spicy chicken starter" },
        { id: 403, name: "Manchurian", price: 170, veg: true, desc: "Fried veg balls in tangy sauce" }
      ]
    }
  ];
  
  let cart = []; // { itemId, name, price, qty, restaurantId, restaurantName }
  let currentRestaurant = null;
  let currentCuisineFilter = "all";
  let currentSearch = "";
  let orderCounter = 1000;
  
  // ================= DOM references =================
  const logoHome = document.getElementById("logoHome");
  const searchInput = document.getElementById("searchInput");
  const cartBtn = document.getElementById("cartBtn");
  const cartBadge = document.getElementById("cartBadge");
  
  const restaurantListView = document.getElementById("restaurantListView");
  const menuView = document.getElementById("menuView");
  const cuisineBar = document.getElementById("cuisineBar");
  const restaurantGrid = document.getElementById("restaurantGrid");
  
  const backToListBtn = document.getElementById("backToListBtn");
  const restaurantBanner = document.getElementById("restaurantBanner");
  const menuList = document.getElementById("menuList");
  
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartItems = document.getElementById("cartItems");
  const cartSummary = document.getElementById("cartSummary");
  const checkoutBtn = document.getElementById("checkoutBtn");
  
  const checkoutOverlay = document.getElementById("checkoutOverlay");
  const checkoutForm = document.getElementById("checkoutForm");
  const cancelCheckoutBtn = document.getElementById("cancelCheckoutBtn");
  const checkoutTotal = document.getElementById("checkoutTotal");
  
  const trackingOverlay = document.getElementById("trackingOverlay");
  const orderIdText = document.getElementById("orderIdText");
  const closeTrackingBtn = document.getElementById("closeTrackingBtn");
  
  // ================= Init: cuisine filter bar =================
  const cuisines = ["all", ...new Set(restaurants.map(r => r.cuisine))];
  cuisines.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "cuisine-btn" + (c === "all" ? " active" : "");
    btn.textContent = c === "all" ? "All Cuisines" : c;
    btn.dataset.cuisine = c;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cuisine-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCuisineFilter = c;
      renderRestaurantGrid();
    });
    cuisineBar.appendChild(btn);
  });
  
  // ================= Search =================
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase();
    renderRestaurantGrid();
  });
  
  // ================= Render Restaurant Grid =================
  function renderRestaurantGrid() {
    restaurantGrid.innerHTML = "";
  
    const filtered = restaurants.filter(r => {
      const matchCuisine = currentCuisineFilter === "all" || r.cuisine === currentCuisineFilter;
      const matchSearch = r.name.toLowerCase().includes(currentSearch) || r.cuisine.toLowerCase().includes(currentSearch);
      return matchCuisine && matchSearch;
    });
  
    if (filtered.length === 0) {
      restaurantGrid.innerHTML = "<p>No restaurants found.</p>";
      return;
    }
  
    filtered.forEach(r => {
      const card = document.createElement("div");
      card.className = "restaurant-card";
      card.innerHTML = `
        <img src="${r.image}" alt="${r.name}">
        <div class="restaurant-info">
          <h3>${r.name}</h3>
          <p style="font-size:13px;color:#888;">${r.cuisine}</p>
          <div class="restaurant-meta">
            <span class="rating-badge">★ ${r.rating}</span>
            <span>${r.time}</span>
          </div>
        </div>
      `;
      card.addEventListener("click", () => openRestaurant(r.id));
      restaurantGrid.appendChild(card);
    });
  }
  
  // ================= Open a restaurant's menu =================
  function openRestaurant(id) {
    currentRestaurant = restaurants.find(r => r.id === id);
    restaurantListView.classList.add("hidden");
    menuView.classList.remove("hidden");
  
    restaurantBanner.innerHTML = `
      <h2>${currentRestaurant.name}</h2>
      <p>${currentRestaurant.cuisine} • ★ ${currentRestaurant.rating} • ${currentRestaurant.time}</p>
    `;
  
    renderMenu();
  }
  
  backToListBtn.addEventListener("click", () => {
    menuView.classList.add("hidden");
    restaurantListView.classList.remove("hidden");
    currentRestaurant = null;
  });
  
  logoHome.addEventListener("click", () => {
    menuView.classList.add("hidden");
    restaurantListView.classList.remove("hidden");
    currentRestaurant = null;
  });
  
  // ================= Render Menu with quantity controls =================
  function renderMenu() {
    menuList.innerHTML = "";
  
    currentRestaurant.menu.forEach(item => {
      const cartItem = cart.find(c => c.itemId === item.id);
      const qty = cartItem ? cartItem.qty : 0;
  
      const row = document.createElement("div");
      row.className = "menu-item";
      row.innerHTML = `
        <div class="menu-item-info">
          <h4><span class="veg-tag" style="border-color:${item.veg ? '#267e3e' : '#c0392b'}"></span>${item.name}</h4>
          <div class="price">₹${item.price}</div>
          <div class="desc">${item.desc}</div>
        </div>
        <div class="item-action" data-item-id="${item.id}">
          ${qty === 0
            ? `<button class="add-btn" data-id="${item.id}">ADD</button>`
            : `<div class="qty-control">
                 <button class="decrease-btn" data-id="${item.id}">−</button>
                 <span>${qty}</span>
                 <button class="increase-btn" data-id="${item.id}">+</button>
               </div>`
          }
        </div>
      `;
      menuList.appendChild(row);
    });
  
    // Wire up buttons
    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
    });
    document.querySelectorAll(".increase-btn").forEach(btn => {
      btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
    });
    document.querySelectorAll(".decrease-btn").forEach(btn => {
      btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
    });
  }
  
  // ================= Cart logic =================
  function addToCart(itemId) {
    const item = currentRestaurant.menu.find(i => i.id === itemId);
    const existing = cart.find(c => c.itemId === itemId);
  
    // If cart has items from a different restaurant, clear it first (realistic single-restaurant-per-order rule)
    if (cart.length > 0 && cart[0].restaurantId !== currentRestaurant.id) {
      const confirmSwitch = confirm(`Your cart has items from ${cart[0].restaurantName}. Start a new cart with ${currentRestaurant.name}?`);
      if (!confirmSwitch) return;
      cart = [];
    }
  
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        itemId: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
        restaurantId: currentRestaurant.id,
        restaurantName: currentRestaurant.name
      });
    }
  
    updateCartBadge();
    renderMenu();
  }
  
  function removeFromCart(itemId) {
    const existing = cart.find(c => c.itemId === itemId);
    if (!existing) return;
  
    existing.qty -= 1;
    if (existing.qty <= 0) {
      cart = cart.filter(c => c.itemId !== itemId);
    }
  
    updateCartBadge();
    renderMenu();
  }
  
  function updateCartBadge() {
    const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
    cartBadge.textContent = totalQty;
  }
  
  // ================= Cart Drawer =================
  cartBtn.addEventListener("click", () => {
    renderCartDrawer();
    cartOverlay.classList.add("show");
  });
  
  closeCartBtn.addEventListener("click", () => cartOverlay.classList.remove("show"));
  
  function renderCartDrawer() {
    cartItems.innerHTML = "";
  
    if (cart.length === 0) {
      cartItems.innerHTML = `<div class="empty-cart">Your cart is empty. Add items from a restaurant!</div>`;
      cartSummary.innerHTML = "";
      checkoutBtn.disabled = true;
      return;
    }
  
    checkoutBtn.disabled = false;
  
    cart.forEach(c => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <div class="cart-item-name">${c.name} × ${c.qty}</div>
          <div class="cart-item-restaurant">${c.restaurantName}</div>
        </div>
        <div>₹${c.price * c.qty}</div>
      `;
      cartItems.appendChild(row);
    });
  
    const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const deliveryFee = 30;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + taxes;
  
    cartSummary.innerHTML = `
      <div class="row"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="row"><span>Delivery Fee</span><span>₹${deliveryFee}</span></div>
      <div class="row"><span>Taxes (5%)</span><span>₹${taxes}</span></div>
      <div class="row total-row"><span>Total</span><span>₹${total}</span></div>
    `;
  }
  
  // ================= Checkout =================
  checkoutBtn.addEventListener("click", () => {
    cartOverlay.classList.remove("show");
    const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const total = subtotal + 30 + Math.round(subtotal * 0.05);
    checkoutTotal.textContent = `Total to pay: ₹${total}`;
    checkoutOverlay.classList.add("show");
  });
  
  cancelCheckoutBtn.addEventListener("click", () => checkoutOverlay.classList.remove("show"));
  
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    checkoutOverlay.classList.remove("show");
    checkoutForm.reset();
  
    const orderId = "FH" + orderCounter++;
    orderIdText.textContent = `Order #${orderId} • Estimated delivery: ${currentRestaurant ? currentRestaurant.time : "30-35 min"}`;
  
    cart = [];
    updateCartBadge();
    trackingOverlay.classList.add("show");
    simulateOrderProgress();
  });
  
  closeTrackingBtn.addEventListener("click", () => {
    trackingOverlay.classList.remove("show");
    if (currentRestaurant) renderMenu();
  });
  
  // ================= Simulate order tracking progress =================
  function simulateOrderProgress() {
    const steps = document.querySelectorAll(".step");
    steps.forEach(s => s.classList.remove("active"));
    steps[0].classList.add("active");
  
    let current = 1;
    const interval = setInterval(() => {
      if (current >= steps.length) {
        clearInterval(interval);
        return;
      }
      steps[current].classList.add("active");
      current++;
    }, 2000);
  }
  
  // ================= Initial render =================
  renderRestaurantGrid();
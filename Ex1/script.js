// ---- In-memory data store (no backend, no localStorage) ----
let products = [
    {
      id: 1,
      title: "iPhone 12 - 128GB",
      price: 28000,
      category: "electronics",
      desc: "Good condition, 2 years old, box included, minor scratches on back.",
      image: "https://via.placeholder.com/220x150?text=iPhone+12",
      sellerName: "Arun Kumar",
      sellerPhone: "9876543210",
      sold: false,
      ownedByMe: false
    },
    {
      id: 2,
      title: "Wooden Study Table",
      price: 3500,
      category: "furniture",
      desc: "Sturdy study table, teakwood finish, barely used.",
      image: "https://via.placeholder.com/220x150?text=Study+Table",
      sellerName: "Priya S",
      sellerPhone: "9123456780",
      sold: false,
      ownedByMe: false
    },
    {
      id: 3,
      title: "Royal Enfield Classic 350",
      price: 120000,
      category: "vehicles",
      desc: "2019 model, single owner, all papers clear, recently serviced.",
      image: "https://via.placeholder.com/220x150?text=RE+Classic",
      sellerName: "Manoj R",
      sellerPhone: "9988776655",
      sold: true,
      ownedByMe: false
    },
    {
      id: 4,
      title: "GATE CS Preparation Books Set",
      price: 800,
      category: "books",
      desc: "Complete set of 6 books, useful for competitive exam prep.",
      image: "https://via.placeholder.com/220x150?text=Books",
      sellerName: "Divya K",
      sellerPhone: "9012345678",
      sold: false,
      ownedByMe: false
    }
  ];
  
  let currentCategory = "all";
  let currentSearch = "";
  let viewMode = "browse"; // "browse" = all listings, "mine" = My Ads
  
  // ---- DOM references ----
  const listingsGrid = document.getElementById("listingsGrid");
  const searchInput = document.getElementById("searchInput");
  const catButtons = document.querySelectorAll(".cat-btn");
  const postAdBtn = document.getElementById("postAdBtn");
  const myAdsBtn = document.getElementById("myAdsBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const cancelBtn = document.getElementById("cancelBtn");
  const adForm = document.getElementById("adForm");
  const detailOverlay = document.getElementById("detailOverlay");
  const detailModal = document.getElementById("detailModal");
  
  // ---- Render listings based on filters + current view mode ----
  function renderListings() {
    listingsGrid.innerHTML = "";
  
    let base = viewMode === "mine" ? products.filter(p => p.ownedByMe) : products;
  
    const filtered = base.filter(p => {
      const matchesCategory = currentCategory === "all" || p.category === currentCategory;
      const matchesSearch = p.title.toLowerCase().includes(currentSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  
    if (filtered.length === 0) {
      listingsGrid.innerHTML = viewMode === "mine"
        ? "<p>You haven't posted any ads yet.</p>"
        : "<p>No products found.</p>";
      return;
    }
  
    filtered.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card" + (p.sold ? " sold" : "") + (viewMode === "mine" ? " my-ad-card" : "");
  
      card.innerHTML = `
        ${p.sold ? '<span class="sold-badge">SOLD</span>' : ""}
        <img src="${p.image}" alt="${p.title}">
        <div class="product-info">
          <h3>${p.title}</h3>
          <div class="price">₹${p.price.toLocaleString()}</div>
          <div class="desc">${p.desc}</div>
          <span class="tag">${p.category}</span>
        </div>
        ${viewMode === "mine" ? `
          <div class="card-actions">
            <button class="sold-toggle-btn" data-id="${p.id}">${p.sold ? "Mark Available" : "Mark Sold"}</button>
            <button class="delete-btn" data-id="${p.id}">Delete</button>
          </div>
        ` : ""}
      `;
  
      // Browse mode -> clicking card opens buy/detail view
      if (viewMode === "browse") {
        card.addEventListener("click", () => openDetail(p.id));
      }
  
      listingsGrid.appendChild(card);
    });
  
    // Wire up My Ads action buttons
    if (viewMode === "mine") {
      document.querySelectorAll(".sold-toggle-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleSold(Number(btn.dataset.id));
        });
      });
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteAd(Number(btn.dataset.id));
        });
      });
    }
  }
  
  // ---- Open product detail modal (Buy side) ----
  function openDetail(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
  
    detailModal.innerHTML = `
      <img class="detail-img" src="${p.image}" alt="${p.title}">
      <h2>${p.title}</h2>
      <div class="detail-price">₹${p.price.toLocaleString()}</div>
      <p>${p.desc}</p>
      <span class="tag">${p.category}</span>
      ${p.sold ? '<p style="color:#d9534f;font-weight:600;margin-top:10px;">This item is already sold.</p>' : ""}
      <div class="seller-box" id="sellerBox">
        Seller: <strong>${p.sellerName}</strong><br>
        Contact: <strong>${p.sellerPhone}</strong>
      </div>
      <div class="detail-actions">
        <button class="close-btn" id="closeDetailBtn">Close</button>
        ${!p.sold ? `<button class="buy-btn" id="contactSellerBtn">Contact Seller</button>` : ""}
      </div>
    `;
  
    detailOverlay.classList.add("show");
  
    document.getElementById("closeDetailBtn").addEventListener("click", () => {
      detailOverlay.classList.remove("show");
    });
  
    const contactBtn = document.getElementById("contactSellerBtn");
    if (contactBtn) {
      contactBtn.addEventListener("click", () => {
        document.getElementById("sellerBox").classList.add("show");
        contactBtn.textContent = "Contact Info Revealed";
        contactBtn.disabled = true;
      });
    }
  }
  
  // ---- Sell side: toggle sold status ----
  function toggleSold(id) {
    const p = products.find(x => x.id === id);
    if (p) p.sold = !p.sold;
    renderListings();
  }
  
  // ---- Sell side: delete an ad ----
  function deleteAd(id) {
    products = products.filter(x => x.id !== id);
    renderListings();
  }
  
  // ---- Category filter ----
  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      catButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.cat;
      renderListings();
    });
  });
  
  // ---- Search ----
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderListings();
  });
  
  // ---- Modal open/close ----
  postAdBtn.addEventListener("click", () => modalOverlay.classList.add("show"));
  cancelBtn.addEventListener("click", () => modalOverlay.classList.remove("show"));
  
  // ---- My Ads / Browse toggle ----
  myAdsBtn.addEventListener("click", () => {
    viewMode = viewMode === "mine" ? "browse" : "mine";
    myAdsBtn.textContent = viewMode === "mine" ? "Browse All" : "My Ads";
    renderListings();
  });
  
  // ---- Add new listing (Sell side) ----
  adForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const newProduct = {
      id: Date.now(),
      title: document.getElementById("titleInput").value,
      price: Number(document.getElementById("priceInput").value),
      category: document.getElementById("categoryInput").value,
      desc: document.getElementById("descInput").value,
      image: document.getElementById("imageInput").value || "https://via.placeholder.com/220x150?text=No+Image",
      sellerName: "You",
      sellerPhone: "9999900000",
      sold: false,
      ownedByMe: true
    };
  
    products.unshift(newProduct);
    adForm.reset();
    modalOverlay.classList.remove("show");
    renderListings();
  });
  
  // ---- Initial render ----
  renderListings();
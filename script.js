// ==========================================
// GLOBALS & AUTH
// ==========================================

const API_BASE = "http://localhost:5000/api";

window.logout = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
};

window.bookService = async function (productId, vendorId, name, price) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login to book a service!");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/order`, { // Using /api/order exactly as the backend expects
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                vendorId: vendorId,
                products: [{
                    productId: productId,
                    name: name,
                    quantity: 1,
                    price: price
                }]
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert(`🎉 Successfully booked ${name}!`);
        } else {
            alert(data.msg || "Failed to book service");
        }
    } catch (err) {
        console.error("Booking error:", err);
        alert("Network error. Make sure your backend is running!");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Handle Navigation Menu Toggle
    const menuToggle = document.getElementById("menuToggle");
    const navCenter = document.getElementById("navCenter");
    const navLinks = document.getElementById("navLinks");
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", !isExpanded);
            if (navCenter) navCenter.classList.toggle("active");
            if (navLinks && !navCenter) navLinks.classList.toggle("active");
        });
    }

    // 1b. Handle Dropdown Toggles for Mobile/Click
    document.querySelectorAll(".dropdown-toggle").forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            const parent = toggle.closest('.dropdown');
            document.querySelectorAll('.dropdown.open').forEach(drop => {
                if (drop !== parent) drop.classList.remove('open');
            });
            parent.classList.toggle("open");
        });
    });

    // 2. Auth State Check
    const token = localStorage.getItem("token");
    let userName = localStorage.getItem("userName");
    if (!userName || userName === "undefined" || userName === "null") {
        userName = "User";
    }
    const userInitial = userName.charAt(0).toUpperCase();

    const authButtons = document.getElementById("auth-buttons");
    const userMenu = document.getElementById("user-menu");
    const userTrigger = document.getElementById("user-trigger");

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (authButtons) authButtons.style.display = "none";
            if (userMenu) {
                userMenu.style.display = "block";

                // Update user trigger to show avatar
                if (userTrigger) {
                    userTrigger.innerHTML = `
                        <div class="user-avatar">${userInitial}</div>
                        <span id="user-name">${userName}</span>
                        <i class="fa-solid fa-chevron-down"></i>
                    `;
                }

                const userDropdown = document.getElementById("user-dropdown");
                if (payload.role === "vendor") {
                    if (userDropdown) {
                        userDropdown.innerHTML = `
                            <a href="vendor-dashboard.html"><i class="fa-solid fa-chart-line"></i> Dashboard</a>
                            <button class="logout-btn" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
                        `;
                    }
                } else {
                    if (userDropdown) {
                        userDropdown.innerHTML = `
                            <a href="profile.html"><i class="fa-solid fa-user"></i> Profile</a>
                            <a href="bookings.html"><i class="fa-solid fa-calendar-check"></i> Bookings</a>
                            <button class="logout-btn" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
                        `;
                    }
                }
            }
        } catch (e) {
            console.error("Invalid token");
            localStorage.removeItem("token");
        }
    } else {
        if (authButtons) authButtons.style.display = "block";
        if (userMenu) userMenu.style.display = "none";
    }

    // 3. User Dropdown Toggle
    const userDropdown = document.getElementById("user-dropdown");

    if (userTrigger && userDropdown && userMenu) {
        userTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            const expanded = userTrigger.getAttribute("aria-expanded") === "true" || false;
            userTrigger.setAttribute("aria-expanded", !expanded);
            userMenu.classList.toggle("open");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!userMenu.contains(e.target)) {
                if (userTrigger) userTrigger.setAttribute("aria-expanded", "false");
                userMenu.classList.remove("open");
            }
        });
    }

    // ==========================================
    // CAROUSEL LOGIC
    // ==========================================
    const slides = document.querySelectorAll(".slide");
    const indicators = document.querySelectorAll(".indicators span");
    const nextBtn = document.querySelector(".carousel-controls .next");
    const prevBtn = document.querySelector(".carousel-controls .prev");

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const updateCarousel = () => {
            slides.forEach((s, i) => {
                s.classList.toggle("active", i === currentSlide);
            });
            indicators.forEach((ind, i) => {
                ind.classList.toggle("active", i === currentSlide);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        };

        if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetInterval(); });
        if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetInterval(); });

        indicators.forEach((ind, i) => {
            ind.addEventListener("click", () => {
                currentSlide = i;
                updateCarousel();
                resetInterval();
            });
        });

        // Start Auto Slide
        slideInterval = setInterval(nextSlide, 5000);
    }

    // ==========================================
    // FETCH SERVICES LOGIC (index.html, vendors.html, serv.html)
    // ==========================================
    const servicesGrid = document.getElementById("services-grid");
    if (!servicesGrid) {
        const vg = document.getElementById("vendor-grid");
        if (vg) fetchServices(vg);
    } else {
        fetchServices(servicesGrid);
    }

    // ==========================================
    // GLOBAL BUTTON ROUTING (EXPLORE / VIEW ALL)
    // ==========================================
    document.querySelectorAll("button").forEach(btn => {
        const text = btn.innerText.toLowerCase();
        if (text.includes("explore") || text.includes("view all services")) {
            btn.addEventListener("click", () => {
                window.location.href = "vendors.html";
            });
        }
    });

});

let allServicesList = [];

async function fetchServices(gridElement) {
    try {
        const res = await fetch(`${API_BASE}/vendor/products`);
        if (!res.ok) throw new Error("Failed to fetch services");

        allServicesList = await res.json();
        renderServices(allServicesList, gridElement);

        // Attach listeners for dynamic Search & Category Filters
        const searchInput = document.getElementById("service-search");
        const categorySelect = document.getElementById("service-category");

        if (searchInput || categorySelect) {
            const filterData = () => {
                let filtered = allServicesList;

                if (searchInput && searchInput.value) {
                    const q = searchInput.value.toLowerCase();
                    filtered = filtered.filter(s =>
                        s.name.toLowerCase().includes(q) ||
                        s.description.toLowerCase().includes(q)
                    );
                }

                if (categorySelect && categorySelect.value && categorySelect.value !== "All Categories") {
                    const c = categorySelect.value.toLowerCase();
                    // Match structurally strictly against category, fallback to keywords if undefined
                    filtered = filtered.filter(s => {
                        if (s.category && s.category !== "Uncategorized") {
                            return s.category.toLowerCase() === c;
                        }
                        return s.name.toLowerCase().includes(c) || s.description.toLowerCase().includes(c);
                    });
                }

                renderServices(filtered, gridElement);
            };

            if (searchInput) searchInput.addEventListener("input", filterData);
            if (categorySelect) categorySelect.addEventListener("change", filterData);
        }

    } catch (err) {
        console.error(err);
        gridElement.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">Error loading services.</p>`;
    }
}

function renderServices(services, gridElement) {
    gridElement.innerHTML = "";

    if (services.length === 0) {
        gridElement.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No services match your criteria right now. Check back later!</p>`;
        return;
    }

    // Sanitize user inputs to prevent XSS
    const escapeHTML = (str) => {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    };

    services.forEach(service => {
        const card = document.createElement("div");
        card.className = "service-card card";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.height = "100%";

        const imgSrc = (service.images && service.images.length > 0) ? service.images[0] : "https://via.placeholder.com/300x200?text=No+Image";
        const vendorName = service.vendorId?.name || "Unknown Vendor";
        const categoryLabel = (service.category && service.category !== "Uncategorized") ? service.category.charAt(0).toUpperCase() + service.category.slice(1) : "";

        const safeName = escapeHTML(service.name);
        const safeVendor = escapeHTML(vendorName);
        const safeDesc = escapeHTML(service.description);

        card.innerHTML = `
            <div style="position:relative;">
                ${categoryLabel ? `<span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.75); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">${categoryLabel}</span>` : ""}
                <img src="${imgSrc}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Unavailable'" alt="${safeName}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;">
            </div>
            <div class="card-content" style="padding: 15px; display: flex; flex-direction: column; flex: 1;">
                <h3 style="margin: 0 0 5px 0;">${safeName}</h3>
                <p style="font-size: 0.85rem; color: #64748b; margin-top: 0;">By ${safeVendor}</p>
                <p style="margin: 10px 0; flex: 1;">${safeDesc}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="price" style="font-weight: 600; color: #059669;">₹${service.price}</span>
                    <button class="btn-primary" onclick="bookService('${service._id}', '${service.vendorId?._id}', '${service.name.replace(/'/g, "\\'")}', ${service.price})" style="padding: 8px 16px;">Book</button>
                </div>
            </div>
        `;
        gridElement.appendChild(card);
    });
}

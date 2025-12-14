document.addEventListener('DOMContentLoaded', () => {
    console.log("Website Loaded. Starting script...");

    // --- 1. DATA ---
    const products = [
        { id: 1, name: 'Noise Cancelling Pro', category: 'Electronics', price: 24999, image: 'assets/images/headphones.jpg', description: 'Industry-leading noise cancellation.', specs: { 'Battery': '30 Hours', 'Weight': '250g' } },
        { id: 2, name: 'Leather Bifold', category: 'Accessories', price: 4500, image: 'assets/images/wallet.jpg', description: 'Hand-stitched full-grain leather.', specs: { 'Material': 'Leather', 'Warranty': '5 Years' } },
        { id: 3, name: 'Silk Blend Tee', category: 'Apparel', price: 3200, image: 'assets/images/tshirt.jpg', description: 'Luxuriously soft silk-cotton blend.', specs: { 'Fabric': 'Cotton/Silk', 'Fit': 'Regular' } },
        { id: 4, name: 'UltraWide 4K Monitor', category: 'Electronics', price: 42000, image: 'assets/images/monitor.jpg', description: '34-inch curved display for creators.', specs: { 'Resolution': '3440 x 1440', 'Refresh': '144Hz' } },
        { id: 5, name: 'Artisan Ceramic Set', category: 'Home Goods', price: 1800, image: 'assets/images/mug.jpg', description: 'Hand-thrown ceramic mugs.', specs: { 'Count': 'Set of 4', 'Safe': 'Microwave' } },
        { id: 6, name: 'Smart Fitness Watch', category: 'Electronics', price: 8999, image: 'assets/images/watch.jpg', description: 'Track your health in style.', specs: { 'Battery': '7 Days', 'Waterproof': '5ATM' } },
        { id: 7, name: 'Stainless Water Bottle', category: 'Accessories', price: 1200, image: 'assets/images/bottle.jpg', description: 'Keeps drinks cold for 24 hours.', specs: { 'Capacity': '1L', 'Material': 'Steel' } },
        { id: 8, name: 'Winter Wool Scarf', category: 'Apparel', price: 2500, image: 'assets/images/scarf.jpg', description: 'Soft wool blend perfect for winter.', specs: { 'Material': 'Wool', 'Size': 'One Size' } }
    ];

    // --- 2. STATE ---
    let cart = [];
    let wishlists = { 'Default': [] };
    let orders = []; 
    let currentProductToWishlist = null;

    const productGrid = document.getElementById('product-grid');
    const cartCountSpan = document.getElementById('cart-count');
    const wishlistModal = document.getElementById('wishlist-modal');
    const formatPrice = (price) => '₹' + price.toLocaleString('en-IN');

    // --- 3. ICONS ---
    const MOON_ICON = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const SUN_ICON = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    // --- 4. STORAGE & THEME ---
    
    function saveData() {
        localStorage.setItem('luxeCart', JSON.stringify(cart));
        localStorage.setItem('luxeWishlists', JSON.stringify(wishlists));
        localStorage.setItem('luxeOrders', JSON.stringify(orders)); 
    }

    function loadData() {
        const storedCart = localStorage.getItem('luxeCart');
        const storedWishlists = localStorage.getItem('luxeWishlists');
        const storedOrders = localStorage.getItem('luxeOrders');
        const storedTheme = localStorage.getItem('luxeTheme');

        if (storedCart) cart = JSON.parse(storedCart);
        if (storedWishlists) wishlists = JSON.parse(storedWishlists);
        if (storedOrders) orders = JSON.parse(storedOrders);
        
        if (storedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('theme-icon').innerHTML = SUN_ICON;
        } else {
            document.getElementById('theme-icon').innerHTML = MOON_ICON;
        }

        updateCartUI();
    }

    window.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        document.getElementById('theme-icon').innerHTML = isDark ? SUN_ICON : MOON_ICON;
        localStorage.setItem('luxeTheme', isDark ? 'dark' : 'light');
    };

    // --- 5. HELPER FUNCTIONS ---

    function isInAnyWishlist(id) {
        return Object.values(wishlists).flat().some(item => item.id === id);
    }

    function syncCartButtons(id) {
        const isInCart = cart.some(item => item.id === id);
        const buttons = document.querySelectorAll(`button[data-id="${id}"]`);

        buttons.forEach(btn => {
            if (isInCart) {
                if (!btn.classList.contains('remove-btn') && !btn.classList.contains('added-success')) {
                     btn.textContent = "Remove from Cart";
                     btn.classList.add('remove-btn');
                     btn.classList.remove('add-btn'); 
                     btn.classList.add('add-btn'); 
                }
            } else {
                btn.textContent = "Add to Cart";
                btn.classList.remove('remove-btn', 'added-success');
                btn.classList.add('add-btn');
            }
        });
    }

    // --- 6. VIEW NAVIGATION ---

    window.switchView = function(viewId) {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        const target = document.getElementById(viewId);
        if(target) {
            target.classList.add('active');
            window.scrollTo(0, 0);
            if(viewId === 'wishlist-view') renderWishlistPage();
            if(viewId === 'orders-view') renderOrdersPage(); 
        }
    };

    // --- 7. CORE RENDER LOGIC ---

    window.renderProducts = function(productsToRender) {
        if (!productGrid) return;
        productGrid.innerHTML = ''; 
        if (!productsToRender || productsToRender.length === 0) {
            productGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No products found.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const isInCart = cart.some(item => item.id === product.id);
            const isWishlisted = isInAnyWishlist(product.id);
            
            const btnText = isInCart ? "Remove from Cart" : "Add to Cart";
            const btnClass = isInCart ? "add-btn remove-btn" : "add-btn";
            const heartClass = isWishlisted ? "wishlist-heart active" : "wishlist-heart";

            const html = `
                <div class="product-card" onclick="handleCardClick(event, ${product.id})">
                    <div class="card-image-wrapper">
                        <span class="${heartClass}" data-heart-id="${product.id}" onclick="toggleWishlist(event, ${product.id})">♥</span>
                        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
                        <div class="hover-details">
                            <p><strong>Specs:</strong></p>
                            ${Object.entries(product.specs).map(([k,v]) => `<p>${k}: ${v}</p>`).join('').slice(0, 150)}
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p style="color:#888; font-size:0.8rem">${product.category}</p>
                        <p class="product-price">${formatPrice(product.price)}</p>
                        <button class="${btnClass}" data-id="${product.id}" onclick="handleCartClick(event, ${product.id})">${btnText}</button>
                    </div>
                </div>
            `;
            productGrid.insertAdjacentHTML('beforeend', html);
        });
    };

    window.handleCardClick = function(e, id) {
        if (!e.target.closest('button') && !e.target.closest('.wishlist-heart')) {
            showProductDetail(id);
        }
    };

    // --- 8. CART LOGIC ---
    window.handleCartClick = function(event, id) {
        event.stopPropagation();
        const btn = event.target;
        
        if (btn.classList.contains('remove-btn')) {
            removeFromCart(id);
            return;
        }

        const product = products.find(p => p.id === id);
        if (!cart.some(p => p.id === id)) {
            cart.push(product);
            saveData(); updateCartUI();
            btn.textContent = "Added! ✔";
            btn.classList.add('added-success');
            setTimeout(() => {
                const buttons = document.querySelectorAll(`button[data-id="${id}"]`);
                buttons.forEach(b => {
                    b.classList.remove('added-success');
                    b.classList.add('remove-btn');
                    b.textContent = "Remove from Cart";
                });
            }, 1000);
        }
    };

    window.showCartView = function() {
        const list = document.getElementById('full-cart-list');
        const totalSpan = document.getElementById('cart-page-total');
        if(!list) return;

        list.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            list.innerHTML = '<p>Your cart is empty.</p>';
            totalSpan.textContent = '₹0.00';
        } else {
            cart.forEach(item => {
                total += item.price;
                list.insertAdjacentHTML('beforeend', `
                    <div class="cart-row">
                        <img src="${item.image}" onclick="showProductDetail(${item.id})">
                        <div onclick="showProductDetail(${item.id})" style="cursor:pointer; font-weight:bold;">${item.name}</div>
                        <div>${formatPrice(item.price)}</div>
                        <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; cursor:pointer;">Remove</button>
                    </div>
                `);
            });
            totalSpan.textContent = formatPrice(total);
        }
        window.switchView('cart-view');
    };

    window.removeFromCart = function(id) {
        cart = cart.filter(p => p.id !== id);
        saveData(); updateCartUI();
        if (document.getElementById('cart-view').classList.contains('active')) window.showCartView();
        const buttons = document.querySelectorAll(`button[data-id="${id}"]`);
        buttons.forEach(b => { b.classList.remove('remove-btn'); b.textContent = "Add to Cart"; });
    };

    function updateCartUI() {
        if(cartCountSpan) cartCountSpan.textContent = cart.length;
    }

    // --- 9. WISHLIST LOGIC ---
    window.toggleWishlist = function(e, id) {
        e.stopPropagation();
        if (isInAnyWishlist(id)) {
            Object.keys(wishlists).forEach(listName => {
                wishlists[listName] = wishlists[listName].filter(item => item.id !== id);
            });
            saveData();
            const heartIcons = document.querySelectorAll(`.wishlist-heart[data-heart-id="${id}"]`);
            heartIcons.forEach(icon => icon.classList.remove('active'));
            if(document.getElementById('wishlist-view').classList.contains('active')) renderWishlistPage();
        } else {
            openWishlistModal(id);
        }
    };

    function openWishlistModal(id) {
        currentProductToWishlist = id;
        const optionsDiv = document.getElementById('wishlist-options');
        optionsDiv.innerHTML = '';
        Object.keys(wishlists).forEach(listName => {
            const icon = listName === 'Default' ? '❤️' : '📂';
            optionsDiv.insertAdjacentHTML('beforeend', `
                <div class="wishlist-option" onclick="addToSpecificWishlist('${listName}')">
                    <span>${icon} ${listName}</span>
                    <span style="margin-left:auto; color:#888;">${wishlists[listName].length} items</span>
                </div>
            `);
        });
        wishlistModal.classList.add('active');
    };

    window.closeWishlistModal = function() { wishlistModal.classList.remove('active'); };
    
    window.createNewListAndAdd = function() {
        const nameInput = document.getElementById('new-list-name');
        const name = nameInput.value.trim();
        if (name) {
            if (!wishlists[name]) wishlists[name] = [];
            addToSpecificWishlist(name);
            nameInput.value = '';
        }
    };

    window.addToSpecificWishlist = function(listName) {
        const product = products.find(p => p.id === currentProductToWishlist);
        if (!wishlists[listName].some(p => p.id === product.id)) {
            wishlists[listName].push(product);
            saveData();
            const heartIcons = document.querySelectorAll(`.wishlist-heart[data-heart-id="${currentProductToWishlist}"]`);
            heartIcons.forEach(icon => icon.classList.add('active'));
        }
        closeWishlistModal();
    };

    window.renderWishlistPage = function() {
        const container = document.getElementById('wishlist-container');
        container.innerHTML = '';
        Object.keys(wishlists).forEach(listName => {
            if (wishlists[listName].length === 0 && listName === 'Default') {
                container.innerHTML = '<p>Your wishlists are empty.</p>'; return;
            }
            const itemsHTML = wishlists[listName].map(item => `
                <div style="border:1px solid var(--border); padding:10px; border-radius:5px; text-align:center;">
                    <img src="${item.image}" style="height:80px; object-fit:contain; cursor:pointer;" onclick="showProductDetail(${item.id})">
                    <p style="font-size:0.9rem; font-weight:bold; margin:5px 0; cursor:pointer;" onclick="showProductDetail(${item.id})">${item.name}</p>
                    <button onclick="handleCartClick(event, ${item.id})" class="add-btn" data-id="${item.id}" style="font-size:0.8rem; padding:5px;">Add to Cart</button>
                </div>
            `).join('');
            container.insertAdjacentHTML('beforeend', `<div class="wishlist-group"><h3>${listName} (${wishlists[listName].length})</h3><div class="wishlist-items">${itemsHTML}</div></div>`);
        });
        wishlists.Default.forEach(item => syncCartButtons(item.id));
    };

    // --- 10. CHECKOUT & ORDERS ---
    
    window.openCheckoutModal = function() {
        if (cart.length === 0) { alert("Your cart is empty!"); return; }
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('checkout-total').textContent = formatPrice(total);
        document.getElementById('checkout-modal').classList.add('active');
    };
    window.closeCheckoutModal = function() { document.getElementById('checkout-modal').classList.remove('active'); };

    window.handleCheckout = function(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = "Processing..."; btn.disabled = true;

        setTimeout(() => {
            document.getElementById('checkout-modal').classList.remove('active');
            
            // 1. Create Order
            const orderId = Math.floor(Math.random() * 1000000);
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            const newOrder = {
                id: orderId,
                date: new Date().toLocaleDateString(),
                total: total,
                items: [...cart]
            };
            orders.unshift(newOrder); 

            // 2. Remove purchased items from Wishlists
            cart.forEach(cartItem => {
                Object.keys(wishlists).forEach(listName => {
                    wishlists[listName] = wishlists[listName].filter(wItem => wItem.id !== cartItem.id);
                });
                // Remove visual heart
                const heartIcons = document.querySelectorAll(`.wishlist-heart[data-heart-id="${cartItem.id}"]`);
                heartIcons.forEach(icon => icon.classList.remove('active'));
            });

            // 3. Clear Cart & Save
            cart = [];
            saveData();
            updateCartUI();

            // 4. Show Success
            document.getElementById('order-id').textContent = orderId;
            document.getElementById('success-modal').classList.add('active');
            btn.textContent = originalText; btn.disabled = false;
        }, 1500);
    };

    window.finishOrder = function() {
        document.getElementById('success-modal').classList.remove('active');
        window.switchView('orders-view'); // Go to orders page
    };

    window.renderOrdersPage = function() {
        const container = document.getElementById('orders-container');
        container.innerHTML = '';
        if (orders.length === 0) {
            container.innerHTML = '<p>No past orders found.</p>'; return;
        }

        orders.forEach(order => {
            const itemsHTML = order.items.map(item => `
                <div class="order-item-thumb" title="${item.name}" onclick="showProductDetail(${item.id})">
                    <img src="${item.image}">
                    <p>${item.name}</p>
                </div>
            `).join('');

            container.insertAdjacentHTML('beforeend', `
                <div class="order-card">
                    <div class="order-header">
                        <span><strong>Order #${order.id}</strong></span>
                        <span>${order.date}</span>
                        <span style="color:var(--accent); font-weight:bold;">${formatPrice(order.total)}</span>
                    </div>
                    <div class="order-items">${itemsHTML}</div>
                </div>
            `);
        });
    };

    // --- 11. DETAIL PAGE ---
    window.showProductDetail = function(id) {
        const product = products.find(p => p.id === id);
        const container = document.getElementById('detail-content');
        if(!container) return;
        
        const isInCart = cart.some(item => item.id === product.id);
        const btnText = isInCart ? "Remove from Cart" : "Add to Cart";
        const btnClass = isInCart ? "add-btn remove-btn" : "add-btn";

        container.innerHTML = `
            <div class="detail-image"><img src="${product.image}"></div>
            <div class="detail-info">
                <h1>${product.name}</h1>
                <p class="detail-price">${formatPrice(product.price)}</p>
                <p>${product.description}</p>
                <h3>Specs</h3>
                <ul class="specs-list">${Object.entries(product.specs).map(([k,v])=>`<li><b>${k}</b><span>${v}</span></li>`).join('')}</ul>
                <button class="${btnClass}" data-id="${product.id}" onclick="handleCartClick(event, ${product.id})">${btnText}</button>
            </div>
        `;
        window.switchView('product-detail-view');
    };

    // --- 12. FILTERS & SEARCH ---
    function populateCategoryFilters() {
        const categories = [...new Set(products.map(p => p.category))];
        const container = document.getElementById('category-filters');
        container.innerHTML = ''; 
        categories.forEach(cat => {
            container.insertAdjacentHTML('beforeend', `<div><label style="font-weight:normal; text-transform:none;"><input type="checkbox" value="${cat}" class="category-filter"> ${cat}</label></div>`);
        });
    }

    const searchInput = document.getElementById('search-input');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.name.toLowerCase().includes(term));
            if(!document.getElementById('home-view').classList.contains('active')) window.switchView('home-view');
            window.renderProducts(filtered);
        });
    }

    const applyBtn = document.getElementById('apply-filters');
    if(applyBtn) {
        applyBtn.addEventListener('click', () => {
            const sortValue = document.getElementById('sort-select').value;
            const checkedCats = Array.from(document.querySelectorAll('.category-filter:checked')).map(i => i.value);
            let filtered = checkedCats.length ? products.filter(p => checkedCats.includes(p.category)) : products;
            
            if (sortValue === 'price-asc') filtered.sort((a, b) => a.price - b.price);
            if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price);
            window.renderProducts(filtered);
        });
    }

    // --- INIT ---
    try {
        console.log("Initializing...");
        loadData();
        populateCategoryFilters();
        window.renderProducts(products);
    } catch (error) { console.error("Init Error:", error); }
});
document.addEventListener('DOMContentLoaded', () => {
    console.log("Website Loaded. Starting script...");

    // --- 1. DATA ---
    const LOGO_LIGHT = 'assets/images/logo.webp';       
    const LOGO_DARK = 'assets/images/logo-dark.webp';
    const TEXT_LIGHT = 'assets/images/horqen.webp';

    // --- 2. STATE ---
    let cart = [];
    let wishlists = { 'Default': [] };
    let orders = []; 
    let currentDiscount = 0; 
    let currentProductToWishlist = null;
    let orderIdToCancel = null;

    const productGrid = document.getElementById('product-grid');
    const cartCountSpan = document.getElementById('cart-count');
    const wishlistModal = document.getElementById('wishlist-modal');
    const formatPrice = (price) => '₹' + price.toLocaleString('en-IN');

    // --- 3. ICONS ---
    const MOON_ICON = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const SUN_ICON = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    // --- 4. TOAST ---
    window.showToast = function(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? '✔' : '✖';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- 5. STORAGE & THEME ---
    function saveData() {
        localStorage.setItem('horqenCart', JSON.stringify(cart));
        localStorage.setItem('horqenWishlists', JSON.stringify(wishlists));
        localStorage.setItem('horqenOrders', JSON.stringify(orders)); 
    }
    
    function loadData() {
        const storedCart = localStorage.getItem('horqenCart');
        const storedWishlists = localStorage.getItem('horqenWishlists');
        const storedOrders = localStorage.getItem('horqenOrders');
        const storedTheme = localStorage.getItem('horqenTheme');

        if (storedCart) {
            try {
                cart = JSON.parse(storedCart);
                cart = cart.map(item => ({
                    ...item,
                    qty: item.qty ? parseInt(item.qty) : 1,
                    selected: item.selected !== undefined ? item.selected : true
                }));
            } catch (e) {
                cart = [];
            }
        }
        if (storedWishlists) wishlists = JSON.parse(storedWishlists);
        if (storedOrders) orders = JSON.parse(storedOrders);
        
        // --- THEME LOGIC (Fixed for Mobile) ---
        const logoImg = document.getElementById('main-logo');
        const textImg = document.getElementById('text-logo');
        
        // NEW: Mobile Elements
        const mobileLogoImg = document.getElementById('main-logo-mobile');
        const mobileTextImg = document.getElementById('text-logo-mobile');
        
        const footerTextImg = document.getElementById('footer-logo-text');
        const mobileIcon = document.getElementById('mobile-theme-icon');
        const desktopIcon = document.getElementById('theme-icon');

        if (storedTheme === 'dark' || !storedTheme) {
            document.body.classList.add('dark-mode');
            if(desktopIcon) desktopIcon.innerHTML = SUN_ICON;
            if(mobileIcon) mobileIcon.innerHTML = SUN_ICON;
            
            // Set All Dark Images
            if(logoImg) logoImg.src = LOGO_DARK;
            if(mobileLogoImg) mobileLogoImg.src = LOGO_DARK;

            if (!storedTheme) localStorage.setItem('horqenTheme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            if(desktopIcon) desktopIcon.innerHTML = MOON_ICON;
            if(mobileIcon) mobileIcon.innerHTML = MOON_ICON;
            
            // Set All Light Images
            if(logoImg) logoImg.src = LOGO_LIGHT;
            if(textImg) textImg.src = TEXT_LIGHT;
            if(mobileLogoImg) mobileLogoImg.src = LOGO_LIGHT;
            if(mobileTextImg) mobileTextImg.src = TEXT_LIGHT;
            if(footerTextImg) footerTextImg.src = TEXT_LIGHT;
        }
        updateCartUI();
    }

    window.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        const iconHTML = isDark ? SUN_ICON : MOON_ICON;
        if(document.getElementById('theme-icon')) document.getElementById('theme-icon').innerHTML = iconHTML;
        if(document.getElementById('mobile-theme-icon')) document.getElementById('mobile-theme-icon').innerHTML = iconHTML;
        
        // Elements
        const logoImg = document.getElementById('main-logo');
        const textImg = document.getElementById('text-logo');
        const mobileLogoImg = document.getElementById('main-logo-mobile');
        const mobileTextImg = document.getElementById('text-logo-mobile');
        const footerTextImg = document.getElementById('footer-logo-text');

        // Swap Logic for all
        if (logoImg) logoImg.src = isDark ? LOGO_DARK : LOGO_LIGHT;
        
        // Mobile Swaps
        if (mobileLogoImg) mobileLogoImg.src = isDark ? LOGO_DARK : LOGO_LIGHT;
        
        
        localStorage.setItem('horqenTheme', isDark ? 'dark' : 'light');
    };

    window.toggleMobileFilters = function() {
        document.getElementById('filter-sidebar').classList.toggle('active');
    };

    // --- NEW: Mobile Menu Toggle ---
    window.toggleMobileMenu = function() {
        document.getElementById('mobile-menu-overlay').classList.toggle('active');
    };

    // --- NEW: Nav Link Filtering ---
    window.filterByBrandLink = function(brandName) {
        window.switchView('home-view');
        window.scrollToGrid();
        
        // Uncheck all current filters
        document.querySelectorAll('.category-filter, .brand-filter').forEach(c => c.checked = false);
        
        // Check the brand if it exists in the filter list
        const brandCheckbox = Array.from(document.querySelectorAll('.brand-filter')).find(b => b.value === brandName);
        if (brandCheckbox) {
            brandCheckbox.checked = true;
            // Expand the Brand accordion if collapsed
            const brandContent = document.getElementById('brand-filters')?.parentElement.querySelector('.filter-content');
            if(brandContent) brandContent.classList.add('show');
        }

        // Trigger filter logic
        const applyBtn = document.getElementById('apply-filters');
        if(applyBtn) applyBtn.click();
    };

    // --- 6. HELPER FUNCTIONS ---
    function isInAnyWishlist(id) {
        return Object.values(wishlists).flat().some(item => item.id === id);
    }
    function getStarRating(rating) {
        const fullStar = `<svg class="star-icon" viewBox="0 0 24 24" fill="#f1c40f"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        const emptyStar = `<svg class="star-icon" viewBox="0 0 24 24" fill="#ccc"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        let stars = '';
        const fullCount = Math.floor(rating);
        for(let i=0; i<fullCount; i++) stars += fullStar;
        while(stars.split('<svg').length < 6) stars += emptyStar;
        return stars;
    }
    window.scrollToGrid = function() {
        document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth' });
    }

    // --- 7. VIEW NAVIGATION ---
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

    // --- 8. RENDER PRODUCTS ---
    window.renderProducts = function(productsToRender) {
        if (!productGrid) return;
        productGrid.innerHTML = ''; 
        if (!productsToRender || productsToRender.length === 0) {
            productGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No products found.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const cartItem = cart.find(item => item.id === product.id);
            const isInCart = !!cartItem;
            const isWishlisted = isInAnyWishlist(product.id);
            
            const btnText = isInCart ? `In Cart (${cartItem.qty})` : "Add to Cart";
            const heartClass = isWishlisted ? "wishlist-heart active" : "wishlist-heart";
            const fallbackImage = 'https://placehold.co/400x400?text=No+Image';

            const html = `
                <div class="product-card" onclick="handleCardClick(event, ${product.id})">
                    <div class="card-image-wrapper">
                        <span class="${heartClass}" data-heart-id="${product.id}" onclick="toggleWishlist(event, ${product.id})">♥</span>
                        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='${fallbackImage}'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="rating-stars">${getStarRating(product.rating)}</div>
                        <p style="color:#888; font-size:0.8rem">${product.brand}</p>
                        <p class="product-price">${formatPrice(product.price)}</p>
                        <button class="add-btn" data-id="${product.id}" onclick="handleCartClick(event, ${product.id})">${btnText}</button>
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

    // --- 9. CART LOGIC ---
    window.handleCartClick = function(event, id) {
        event.stopPropagation();
        const btn = event.target;
        const product = products.find(p => p.id === id);
        const cartItem = cart.find(p => p.id === id);

        if (cartItem) {
            cartItem.qty++;
            saveData(); updateCartUI();
            showToast(`Increased quantity: ${product.name}`);
            btn.textContent = `In Cart (${cartItem.qty})`;
        } else {
            cart.push({ ...product, qty: 1, selected: true });
            saveData(); updateCartUI();
            showToast(`${product.name} added to cart`);
            btn.textContent = "Added! ✔";
            btn.classList.add('added-success');
            setTimeout(() => {
                btn.classList.remove('added-success');
                btn.textContent = "In Cart (1)";
            }, 1000);
        }
    };

    window.moveToWishlist = function(id) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        if (!wishlists.Default.some(w => w.id === id)) {
            wishlists.Default.push(products.find(p => p.id === id));
            showToast("Moved to Wishlist");
        } else {
            showToast("Already in Wishlist");
        }
        removeFromCart(id);
        saveData();
        const heartIcons = document.querySelectorAll(`.wishlist-heart[data-heart-id="${id}"]`);
        heartIcons.forEach(icon => icon.classList.add('active'));
    };

    window.showCartView = function() {
        const list = document.getElementById('full-cart-list');
        const subtotalSpan = document.getElementById('cart-subtotal');
        const totalSpan = document.getElementById('cart-page-total');
        const discountRow = document.getElementById('discount-row');
        const discountSpan = document.getElementById('cart-discount');
        const selectAllBox = document.getElementById('select-all-cart');
        
        if(!list) return;
        list.innerHTML = '';
        let subtotal = 0;
        
        const allSelected = cart.length > 0 && cart.every(item => item.selected);
        if(selectAllBox) selectAllBox.checked = allSelected;

        if (cart.length === 0) {
            list.innerHTML = '<p style="text-align:center; padding:20px;">Your cart is empty.</p>';
            subtotalSpan.textContent = '₹0.00';
            totalSpan.textContent = '₹0.00';
            if(selectAllBox) selectAllBox.checked = false;
        } else {
            cart.forEach(item => {
                const quantity = parseInt(item.qty) || 1;
                const itemPrice = parseInt(item.price) || 0;
                
                if(item.selected) subtotal += (itemPrice * quantity);

                const imgSrc = item.image || 'https://placehold.co/400x400?text=No+Image';

                list.insertAdjacentHTML('beforeend', `
                    <div class="cart-row">
                        <label class="custom-checkbox-label">
                            <input type="checkbox" ${item.selected ? 'checked' : ''} onchange="toggleCartItemSelection(${item.id})">
                            <span class="checkmark"></span>
                        </label>
                        <img src="${imgSrc}" onclick="showProductDetail(${item.id})" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
                        <div onclick="showProductDetail(${item.id})" style="cursor:pointer; font-weight:bold;">
                            ${item.name}
                            <div style="font-weight:normal; font-size:0.85rem; color:#888;">${formatPrice(itemPrice)}</div>
                        </div>
                        <div class="cart-qty-controls">
                            <button class="cart-qty-btn" type="button" onclick="updateCartQty(${item.id}, -1)">-</button>
                            <span class="cart-qty-val">${quantity}</span>
                            <button class="cart-qty-btn" type="button" onclick="updateCartQty(${item.id}, 1)">+</button>
                        </div>
                        <div style="font-weight:bold;">${formatPrice(itemPrice * quantity)}</div>
                        <div class="cart-actions-col">
                            <button onclick="removeFromCart(${item.id})" style="color:red; background:none; border:none; cursor:pointer;">Remove</button>
                            <button class="move-wishlist-btn" onclick="moveToWishlist(${item.id})">Move to wishlist</button>
                        </div>
                    </div>
                `);
            });
            subtotalSpan.textContent = formatPrice(subtotal);
            const discountAmount = subtotal * currentDiscount;
            const finalTotal = subtotal - discountAmount;
            if (currentDiscount > 0) {
                discountRow.style.display = 'flex';
                discountSpan.textContent = `-${formatPrice(discountAmount)}`;
            } else {
                discountRow.style.display = 'none';
            }
            totalSpan.textContent = formatPrice(finalTotal);
        }
        window.switchView('cart-view');
    };

    window.toggleSelectAll = function(checkbox) {
        const isChecked = checkbox.checked;
        cart.forEach(item => item.selected = isChecked);
        saveData(); 
        setTimeout(showCartView, 0); 
    };
    window.toggleCartItemSelection = function(id) {
        const item = cart.find(i => i.id === id);
        if(item) {
            item.selected = !item.selected;
            saveData(); 
            setTimeout(showCartView, 0);
        }
    };
    window.updateCartQty = function(id, change) {
        const item = cart.find(i => i.id === id);
        if(item) {
            item.qty = (parseInt(item.qty) || 1) + change;
            if(item.qty <= 0) {
                removeFromCart(id); 
            } else {
                saveData(); 
                setTimeout(showCartView, 0); 
            }
        }
    };
    window.applyPromoCode = function() {
        const input = document.getElementById('promo-code-input');
        const code = input.value.trim().toUpperCase();
        if (code === 'HORQEN20') { currentDiscount = 0.20; showToast("20% Applied!"); } 
        else if (code === 'SAVE10') { currentDiscount = 0.10; showToast("10% Applied!"); } 
        else { currentDiscount = 0; showToast("Invalid Code", "error"); }
        setTimeout(showCartView, 0); 
    };
    
    window.removeFromCart = function(id) {
        cart = cart.filter(p => p.id !== id);
        saveData(); 
        updateCartUI();
        const cartView = document.getElementById('cart-view');
        if (cartView && cartView.classList.contains('active')) {
            setTimeout(showCartView, 0);
        }
        
        const btn = document.querySelector(`button[data-id="${id}"]`);
        if(btn) { btn.textContent = "Add to Cart"; btn.classList.remove('added-success'); }
    };
    
    function updateCartUI() {
        const totalCount = cart.reduce((sum, item) => sum + (parseInt(item.qty) || 1), 0);
        if(cartCountSpan) cartCountSpan.textContent = totalCount;
        const mobileBadge = document.getElementById('mobile-cart-badge');
        if(mobileBadge) mobileBadge.textContent = totalCount;
    }

    // --- 10. WISHLIST LOGIC ---
    window.toggleWishlist = function(e, id) {
        e.stopPropagation();
        if (isInAnyWishlist(id)) {
            Object.keys(wishlists).forEach(listName => {
                wishlists[listName] = wishlists[listName].filter(item => item.id !== id);
            });
            saveData();
            const heartIcons = document.querySelectorAll(`.wishlist-heart[data-heart-id="${id}"]`);
            heartIcons.forEach(icon => icon.classList.remove('active'));
            showToast("Removed from wishlist", "success");
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
            const icon = listName === 'Default' ? '❤️' : '✨';
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
            showToast(`Added to ${listName}`);
            const heartIcons = document.querySelectorAll(`.wishlist-heart[data-heart-id="${currentProductToWishlist}"]`);
            heartIcons.forEach(icon => icon.classList.add('active'));
        }
        closeWishlistModal();
    };
    window.removeFromWishlist = function(listName, productId) {
        wishlists[listName] = wishlists[listName].filter(item => item.id !== productId);
        saveData();
        renderWishlistPage(); 
        if (!isInAnyWishlist(productId)) {
            const heartIcons = document.querySelectorAll(`.wishlist-heart[data-heart-id="${productId}"]`);
            heartIcons.forEach(icon => icon.classList.remove('active'));
        }
        showToast("Removed from list");
    };
    window.renderWishlistPage = function() {
        const container = document.getElementById('wishlist-container');
        container.innerHTML = '';
        let hasItems = false;
        Object.keys(wishlists).forEach(listName => {
            if (wishlists[listName].length === 0 && listName === 'Default') return;
            hasItems = true;
            const itemsHTML = wishlists[listName].map(item => `
                <div class="wishlist-card">
                    <img src="${item.image}" onclick="showProductDetail(${item.id})" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
                    <h4 onclick="showProductDetail(${item.id})">${item.name}</h4>
                    <p style="font-weight:bold; color:var(--accent); font-size:0.9rem; margin-bottom:5px;">${formatPrice(item.price)}</p>
                    <div class="wishlist-btn-group">
                        <button class="btn-small-add" onclick="handleCartClick(event, ${item.id})">Add to Cart</button>
                        <button class="btn-small-remove" onclick="removeFromWishlist('${listName}', ${item.id})" title="Remove">✕</button>
                    </div>
                </div>
            `).join('');
            container.insertAdjacentHTML('beforeend', `<div class="wishlist-group"><h3>${listName} <span style="font-size:0.9rem; color:#888;">(${wishlists[listName].length})</span></h3><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">${itemsHTML}</div></div>`);
        });
        if (!hasItems) container.innerHTML = '<p style="text-align:center; padding:40px;">Your wishlists are empty.</p>';
    };

    // --- 11. CHECKOUT & ORDERS ---
    const cardInput = document.getElementById('card');
    if(cardInput) {
        cardInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9 ]/g, '');
        });
    }
    
    window.cancelOrder = function(orderId) {
        const order = orders.find(o => o.id === orderId);
        if(order && order.status === 'Processing') {
            orderIdToCancel = orderId; 
            document.getElementById('confirmation-modal').classList.add('active'); 
        }
    };

    window.confirmCancelOrder = function() {
        if (!orderIdToCancel) return;
        const order = orders.find(o => o.id === orderIdToCancel);
        if (order) {
            order.status = 'Cancelled';
            saveData();
            renderOrdersPage();
            showToast("Order Cancelled", "error");
        }
        closeConfirmationModal();
        orderIdToCancel = null;
    };

    window.closeConfirmationModal = function() {
        document.getElementById('confirmation-modal').classList.remove('active');
    };

    window.openCheckoutModal = function() {
        const selectedItems = cart.filter(i => i.selected);
        if (selectedItems.length === 0) { showToast("Select items to checkout!", "error"); return; }
        const subtotal = selectedItems.reduce((sum, item) => sum + ((parseInt(item.price)||0) * (parseInt(item.qty)||1)), 0);
        const discount = subtotal * currentDiscount;
        const total = subtotal - discount;
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
            const selectedItems = cart.filter(i => i.selected);
            
            // Calculate totals
            const subtotal = selectedItems.reduce((sum, item) => sum + ((parseInt(item.price)||0) * (parseInt(item.qty)||1)), 0);
            const total = subtotal - (subtotal * currentDiscount);
            
            const newOrder = {
                id: Math.floor(Math.random() * 1000000),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                status: 'Processing',
                total: total,
                items: [...selectedItems]
            };
            orders.unshift(newOrder); 
            const purchasedIds = selectedItems.map(i => i.id);
            cart = cart.filter(i => !i.selected);
            selectedItems.forEach(item => {
                Object.keys(wishlists).forEach(listName => {
                    wishlists[listName] = wishlists[listName].filter(wItem => wItem.id !== item.id);
                });
                const heartIcons = document.querySelectorAll(`.wishlist-heart[data-heart-id="${item.id}"]`);
                heartIcons.forEach(icon => icon.classList.remove('active'));
            });
            currentDiscount = 0; saveData(); updateCartUI();
            purchasedIds.forEach(id => {
                const btn = document.querySelector(`button[data-id="${id}"]`);
                if(btn) { btn.textContent = "Add to Cart"; btn.classList.remove('remove-btn', 'added-success'); btn.classList.add('add-btn'); }
            });
            document.getElementById('order-id').textContent = newOrder.id;
            document.getElementById('success-modal').classList.add('active');
            btn.textContent = originalText; btn.disabled = false;
        }, 1500);
    };
    window.finishOrder = function() {
        document.getElementById('success-modal').classList.remove('active');
        window.switchView('orders-view'); 
    };
    window.renderOrdersPage = function() {
        const container = document.getElementById('orders-container');
        container.innerHTML = '';
        if (orders.length === 0) { 
            container.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-muted);">No past orders found.</div>'; 
            return; 
        }
        
        orders.forEach(order => {
            // Generate list rows instead of grid thumbnails
            const itemsHTML = order.items.map(item => `
                <div class="order-item-row" onclick="showProductDetail(${item.id})">
                    <img src="${item.image}" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-meta">Qty: ${item.qty} &nbsp;|&nbsp; ${formatPrice(item.price)}</div>
                    </div>
                </div>
            `).join('');

            let cancelBtn = '';
            // Only show cancel button if status is Processing
            if(order.status === 'Processing') {
                cancelBtn = `<button class="cancel-order-btn" onclick="cancelOrder(${order.id})">Cancel Order</button>`;
            } else {
                cancelBtn = `<span style="font-size:0.85rem; color:var(--text-muted);">Order ${order.status}</span>`;
            }

            container.insertAdjacentHTML('beforeend', `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-header-left">
                            <strong>Order #${order.id}</strong>
                            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${order.date} • ${order.time}</div>
                        </div>
                        <div class="order-header-right">
                            <span class="status-badge status-${order.status}">${order.status}</span>
                            <div style="font-weight:bold; color:var(--accent); font-size:1rem; margin-top:2px;">${formatPrice(order.total)}</div>
                        </div>
                    </div>
                    <div class="order-items">
                        ${itemsHTML}
                    </div>
                    <div class="order-footer">
                        ${cancelBtn}
                    </div>
                </div>
            `);
        });
    };

    // --- 12. DETAIL PAGE ---
    window.showProductDetail = function(id) {
        const product = products.find(p => p.id === id);
        const container = document.getElementById('detail-content');
        if(!container) return;
        const cartItem = cart.find(item => item.id === product.id);
        const btnText = cartItem ? `In Cart (${cartItem.qty})` : "Add to Cart";
        
        container.innerHTML = `
            <div class="detail-image"><img src="${product.image}" onerror="this.src='https://placehold.co/400x400?text=No+Image'"></div>
            <div class="detail-info">
                <h1>${product.name}</h1>
                <div class="rating-stars" style="font-size:1.2rem; justify-content:flex-start;">${getStarRating(product.rating)}</div>
                <p class="detail-price">${formatPrice(product.price)}</p>
                <p>${product.description}</p>
                <h3>Specs</h3>
                <ul class="specs-list">${Object.entries(product.specs).map(([k,v])=>`<li><b>${k}</b><span>${v}</span></li>`).join('')}</ul>
                <button class="add-btn" data-id="${product.id}" onclick="handleCartClick(event, ${product.id})">${btnText}</button>
            </div>
            <div class="detail-reviews">
                <h3>Customer Reviews</h3>
                <div style="background:var(--bg-body); padding:20px; border-radius:8px; margin-bottom:15px;">
                    <div class="rating-stars" style="justify-content:flex-start;">★★★★★</div>
                    <p style="color:var(--text-main); margin-top:5px;"><i>"Absolutely love this product! The quality is unmatched."</i></p>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:5px;">— Jane D.</p>
                </div>
            </div>
        `;
        
        // Add Bubble Zoom Logic
        const imgContainer = container.querySelector('.detail-image');
        const img = imgContainer.querySelector('img');
        
        imgContainer.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            
            img.style.transformOrigin = `${x}% ${y}%`;
            img.style.transform = "scale(2)"; // Zoom scale factor
        });
        
        imgContainer.addEventListener('mouseleave', function() {
            img.style.transformOrigin = "center";
            img.style.transform = "scale(1)";
        });

        window.switchView('product-detail-view');
    };

    // --- 13. FILTERS (UPDATED WITH ACCORDION) ---
    function populateFilters() {
        
        // Helper to generate the accordion HTML structure
        const createAccordion = (title, id, items, typeClass) => {
            const htmlItems = items.map(item => `
                <div style="margin-bottom:8px;">
                    <label style="font-weight:normal; text-transform:none; display:flex; align-items:center; gap:8px; cursor:pointer;">
                        <input type="checkbox" value="${item}" class="${typeClass}"> ${item}
                    </label>
                </div>
            `).join('');

            return `
                <div class="filter-header" onclick="toggleFilterAccordion('${id}-content', this)">
                    ${title}
                </div>
                <div id="${id}-content" class="filter-content">
                    ${htmlItems}
                </div>
            `;
        };

        // 1. Categories
        const categories = [...new Set(products.map(p => p.category))];
        const catContainer = document.getElementById('category-filters');
        if(catContainer) {
            catContainer.parentElement.innerHTML = createAccordion('Categories', 'cat', categories, 'category-filter');
        }

        // 2. Brands
        const brands = [...new Set(products.map(p => p.brand))].sort();
        const brandContainer = document.getElementById('brand-filters');
        if(brandContainer) {
            brandContainer.parentElement.innerHTML = createAccordion('Brands', 'brand', brands, 'brand-filter');
        }
    }

    // New Helper to Toggle the Accordion
    window.toggleFilterAccordion = function(contentId, headerElement) {
        const content = document.getElementById(contentId);
        if(content) {
            content.classList.toggle('show');
            headerElement.classList.toggle('active');
        }
    };

    const applyBtn = document.getElementById('apply-filters');
    if(applyBtn) {
        applyBtn.addEventListener('click', () => {
            const sortValue = document.getElementById('sort-select').value;
            
            // Get selected categories
            const checkedCats = Array.from(document.querySelectorAll('.category-filter:checked')).map(i => i.value);
            
            // Get selected brands
            const checkedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(i => i.value);

            // Filter Logic
            let filtered = products.filter(p => {
                const matchesCat = checkedCats.length === 0 || checkedCats.includes(p.category);
                const matchesBrand = checkedBrands.length === 0 || checkedBrands.includes(p.brand);
                return matchesCat && matchesBrand;
            });

            // Sort Logic
            if (sortValue === 'price-asc') filtered.sort((a, b) => a.price - b.price);
            if (sortValue === 'price-desc') filtered.sort((a, b) => b.price - a.price);
            
            // Update View
            window.renderProducts(filtered);
            
            // On mobile, close sidebar after applying
            if(window.innerWidth <= 768) {
                toggleMobileFilters();
            }
        });
    }

    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        if(!document.getElementById('home-view').classList.contains('active')) window.switchView('home-view');
        window.renderProducts(filtered);
    });

    // --- INIT ---
    try {
        console.log("Initializing...");
        loadData();
        populateFilters(); 
        window.renderProducts(products);
    } catch (error) { console.error("Init Error:", error); }
});


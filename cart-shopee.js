// Shopee-style Cart Management System
class ShopeeCartManager {
    constructor() {
        this.cart = this.loadCart();
        this.selectedItems = new Set();
        this.init();
    }

    init() {
        this.renderCart();
        this.updateCartBadge();
        this.bindEvents();
    }

    loadCart() {
        const cart = localStorage.getItem('travelCart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('travelCart', JSON.stringify(this.cart));
        this.updateCartBadge();
    }

    addToCart(item) {
        const existingItem = this.cart.find(cartItem =>
            cartItem.id === item.id && cartItem.type === item.type
        );

        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.cart.push({
                id: item.id,
                type: item.type,
                name: item.title || item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity || 1,
                checkIn: item.checkIn || null,
                checkOut: item.checkOut || null,
                guests: item.guests || 1,
                selected: false
            });
        }

        this.saveCart();
        this.renderCart();
        return true;
    }

    removeFromCart(id, type) {
        this.cart = this.cart.filter(item =>
            !(item.id === id && item.type === type)
        );
        this.selectedItems.delete(`${id}-${type}`);
        this.saveCart();
        this.renderCart();
    }

    updateQuantity(id, type, quantity) {
        const item = this.cart.find(cartItem =>
            cartItem.id === id && cartItem.type === type
        );

        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(id, type);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    toggleItemSelection(id, type) {
        const itemKey = `${id}-${type}`;
        const item = this.cart.find(cartItem =>
            cartItem.id === id && cartItem.type === type
        );

        if (item) {
            if (this.selectedItems.has(itemKey)) {
                this.selectedItems.delete(itemKey);
                item.selected = false;
            } else {
                this.selectedItems.add(itemKey);
                item.selected = true;
            }
            this.updateSummary();
        }
    }

    selectAllItems(select = true) {
        this.selectedItems.clear();
        this.cart.forEach(item => {
            const itemKey = `${item.id}-${item.type}`;
            if (select) {
                this.selectedItems.add(itemKey);
                item.selected = true;
            } else {
                item.selected = false;
            }
        });
        this.renderCart();
        this.updateSummary();
    }

    deleteSelectedItems() {
        if (this.selectedItems.size === 0) {
            alert('Vui lòng chọn sản phẩm để xóa!');
            return;
        }

        if (confirm(`Bạn có muốn xóa ${this.selectedItems.size} sản phẩm đã chọn?`)) {
            this.cart = this.cart.filter(item => {
                const itemKey = `${item.id}-${item.type}`;
                return !this.selectedItems.has(itemKey);
            });
            this.selectedItems.clear();
            this.saveCart();
            this.renderCart();
        }
    }

    getSelectedTotal() {
        return this.cart
            .filter(item => item.selected)
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getSelectedCount() {
        return this.cart
            .filter(item => item.selected)
            .reduce((count, item) => count + item.quantity, 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price * 23000); // Convert USD to VND for display
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.getCartCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    renderCart() {
        const cartEmpty = document.getElementById('cart-empty');
        const cartTableContainer = document.getElementById('cart-table-container');
        const cartSummary = document.getElementById('cart-summary');
        const cartItemsBody = document.getElementById('cart-items-body');

        if (this.cart.length === 0) {
            cartEmpty.classList.remove('hidden');
            cartTableContainer.classList.add('hidden');
            cartSummary.classList.add('hidden');
            return;
        }

        cartEmpty.classList.add('hidden');
        cartTableContainer.classList.remove('hidden');
        cartSummary.classList.remove('hidden');

        // Render cart items
        cartItemsBody.innerHTML = this.cart.map(item => `
            <div class="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
                <div class="col-span-1">
                    <input type="checkbox" 
                           class="rounded item-checkbox" 
                           data-id="${item.id}" 
                           data-type="${item.type}"
                           ${item.selected ? 'checked' : ''}>
                </div>
                <div class="col-span-5">
                    <div class="flex items-center space-x-4">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                        <div class="flex-1">
                            <h3 class="font-medium text-gray-900 line-clamp-2">${item.name}</h3>
                            <p class="text-sm text-gray-500">${item.type === 'hotel' ? 'Khách sạn' : 'Tour du lịch'}</p>
                            ${item.checkIn ? `<p class="text-xs text-gray-400">Check-in: ${item.checkIn}</p>` : ''}
                            ${item.checkOut ? `<p class="text-xs text-gray-400">Check-out: ${item.checkOut}</p>` : ''}
                            ${item.guests > 1 ? `<p class="text-xs text-gray-400">Khách: ${item.guests}</p>` : ''}
                        </div>
                    </div>
                </div>
                <div class="col-span-2 text-center">
                    <span class="font-medium">${this.formatPrice(item.price)}</span>
                </div>
                <div class="col-span-2 text-center">
                    <div class="flex items-center justify-center space-x-2">
                        <button class="quantity-btn w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100" 
                                data-id="${item.id}" 
                                data-type="${item.type}" 
                                data-action="decrease">-</button>
                        <span class="w-12 text-center">${item.quantity}</span>
                        <button class="quantity-btn w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100" 
                                data-id="${item.id}" 
                                data-type="${item.type}" 
                                data-action="increase">+</button>
                    </div>
                </div>
                <div class="col-span-1 text-center">
                    <span class="font-medium text-orange-500">${this.formatPrice(item.price * item.quantity)}</span>
                </div>
                <div class="col-span-1 text-center">
                    <button class="remove-btn text-gray-400 hover:text-red-500" 
                            data-id="${item.id}" 
                            data-type="${item.type}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Update checkboxes
        this.updateCheckboxes();
        this.updateSummary();
    }

    updateCheckboxes() {
        const selectAllTop = document.getElementById('select-all');
        const selectAllBottom = document.getElementById('select-all-bottom');
        const allSelected = this.cart.length > 0 && this.cart.every(item => item.selected);

        if (selectAllTop) selectAllTop.checked = allSelected;
        if (selectAllBottom) selectAllBottom.checked = allSelected;
    }

    updateSummary() {
        const selectedCount = this.getSelectedCount();
        const totalAmount = this.getSelectedTotal();

        document.getElementById('selected-count').textContent = selectedCount;
        document.getElementById('total-amount').textContent = this.formatPrice(totalAmount);

        // Update modal summary
        const modalSubtotal = document.getElementById('modal-subtotal');
        const modalTax = document.getElementById('modal-tax');
        const modalTotal = document.getElementById('modal-total');

        const tax = totalAmount * 0.1;
        const total = totalAmount + tax;

        if (modalSubtotal) modalSubtotal.textContent = this.formatPrice(totalAmount);
        if (modalTax) modalTax.textContent = this.formatPrice(tax);
        if (modalTotal) modalTotal.textContent = this.formatPrice(total);
    }

    bindEvents() {
        // Select all checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.id === 'select-all' || e.target.id === 'select-all-bottom') {
                this.selectAllItems(e.target.checked);
            }
        });

        // Item checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('item-checkbox')) {
                const id = parseInt(e.target.dataset.id);
                const type = e.target.dataset.type;
                this.toggleItemSelection(id, type);
            }
        });

        // Quantity buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn') || e.target.parentElement.classList.contains('quantity-btn')) {
                const btn = e.target.classList.contains('quantity-btn') ? e.target : e.target.parentElement;
                const id = parseInt(btn.dataset.id);
                const type = btn.dataset.type;
                const action = btn.dataset.action;

                const item = this.cart.find(cartItem => cartItem.id === id && cartItem.type === type);
                if (item) {
                    const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    this.updateQuantity(id, type, newQuantity);
                }
            }
        });

        // Remove buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn') || e.target.parentElement.classList.contains('remove-btn')) {
                const btn = e.target.classList.contains('remove-btn') ? e.target : e.target.parentElement;
                const id = parseInt(btn.dataset.id);
                const type = btn.dataset.type;

                if (confirm('Bạn có muốn xóa sản phẩm này?')) {
                    this.removeFromCart(id, type);
                }
            }
        });

        // Delete selected button
        const deleteSelectedBtn = document.getElementById('delete-selected');
        if (deleteSelectedBtn) {
            deleteSelectedBtn.addEventListener('click', () => {
                this.deleteSelectedItems();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.selectedItems.size === 0) {
                    alert('Vui lòng chọn sản phẩm để thanh toán!');
                    return;
                }
                this.showCheckoutModal();
            });
        }

        // Modal events
        this.bindModalEvents();
    }

    showCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.updateSummary();
        }
    }

    hideCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    bindModalEvents() {
        const modal = document.getElementById('checkout-modal');
        const closeBtn = modal?.querySelector('.close-modal');
        const confirmBtn = document.getElementById('confirm-checkout');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideCheckoutModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideCheckoutModal();
                }
            });
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.processCheckout();
            });
        }
    }

    processCheckout() {
        const name = document.getElementById('checkout-name').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        const email = document.getElementById('checkout-email').value.trim();
        const paymentMethod = document.querySelector('input[name="modal-payment"]:checked')?.value;

        if (!name || !phone || !email) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (!this.validateEmail(email)) {
            alert('Email không hợp lệ!');
            return;
        }

        // Get selected items
        const selectedItems = this.cart.filter(item => item.selected);

        if (selectedItems.length === 0) {
            alert('Vui lòng chọn sản phẩm để thanh toán!');
            return;
        }

        // Create booking
        const bookingData = {
            id: 'BK' + Date.now(),
            customer: { name, phone, email },
            items: selectedItems,
            paymentMethod,
            total: this.getSelectedTotal() * 1.1,
            date: new Date().toISOString(),
            status: 'confirmed'
        };

        // Save booking
        const bookings = JSON.parse(localStorage.getItem('travelBookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('travelBookings', JSON.stringify(bookings));

        // Remove selected items from cart
        this.cart = this.cart.filter(item => !item.selected);
        this.selectedItems.clear();
        this.saveCart();
        this.renderCart();
        this.hideCheckoutModal();

        // Success message
        alert(`Đặt hàng thành công!\nMã đơn hàng: ${bookingData.id}\n\nEmail xác nhận sẽ được gửi đến ${email}`);

        // Clear form
        document.getElementById('checkout-name').value = '';
        document.getElementById('checkout-phone').value = '';
        document.getElementById('checkout-email').value = '';
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize cart manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new ShopeeCartManager();
});

// Global functions for other pages
window.addToCart = function (item) {
    if (!window.cartManager) {
        window.cartManager = new ShopeeCartManager();
    }
    return window.cartManager.addToCart(item);
};

window.getCartCount = function () {
    if (!window.cartManager) {
        const cart = JSON.parse(localStorage.getItem('travelCart') || '[]');
        return cart.reduce((count, item) => count + item.quantity, 0);
    }
    return window.cartManager.getCartCount();
};

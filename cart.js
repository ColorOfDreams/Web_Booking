// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
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
                type: item.type, // 'hotel' or 'tour'
                name: item.title || item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity || 1,
                checkIn: item.checkIn || null,
                checkOut: item.checkOut || null,
                guests: item.guests || 1
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

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
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
            cartEmpty.style.display = 'block';
            cartTableContainer.style.display = 'none';
            cartSummary.style.display = 'none';
            return;
        }

        cartEmpty.style.display = 'none';
        cartTableContainer.style.display = 'block';
        cartSummary.style.display = 'block';

        // Render cart items
        cartItemsBody.innerHTML = this.cart.map(item => `
            <tr class="border-b">
                <td class="p-4">
                    <div class="flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg mr-4">
                        <div>
                            <h3 class="font-semibold">${item.name}</h3>
                            <p class="text-sm text-gray-600">${item.type === 'hotel' ? 'Hotel' : 'Tour'}</p>
                            ${item.checkIn ? `<p class="text-xs text-gray-500">Check-in: ${item.checkIn}</p>` : ''}
                            ${item.checkOut ? `<p class="text-xs text-gray-500">Check-out: ${item.checkOut}</p>` : ''}
                            ${item.guests > 1 ? `<p class="text-xs text-gray-500">Guests: ${item.guests}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td class="p-4">$${item.price}</td>
                <td class="p-4">
                    <div class="flex items-center">
                        <button class="quantity-btn minus bg-gray-200 px-2 py-1 rounded" 
                                data-id="${item.id}" 
                                data-type="${item.type}" 
                                data-action="decrease">-</button>
                        <span class="mx-3">${item.quantity}</span>
                        <button class="quantity-btn plus bg-gray-200 px-2 py-1 rounded" 
                                data-id="${item.id}" 
                                data-type="${item.type}" 
                                data-action="increase">+</button>
                    </div>
                </td>
                <td class="p-4 font-semibold">$${(item.price * item.quantity).toFixed(2)}</td>
                <td class="p-4">
                    <button class="remove-btn text-red-600 hover:text-red-800" 
                            data-id="${item.id}" 
                            data-type="${item.type}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Update summary
        this.updateSummary();
    }

    updateSummary() {
        const subtotal = this.getCartTotal();
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;

        // Update modal summary too
        const modalSubtotal = document.getElementById('modal-subtotal');
        const modalTax = document.getElementById('modal-tax');
        const modalTotal = document.getElementById('modal-total');

        if (modalSubtotal) modalSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (modalTax) modalTax.textContent = `$${tax.toFixed(2)}`;
        if (modalTotal) modalTotal.textContent = `$${total.toFixed(2)}`;
    }

    bindEvents() {
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

                if (confirm('Are you sure you want to remove this item from your cart?')) {
                    this.removeFromCart(id, type);
                }
            }
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    alert('Your cart is empty!');
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
            this.updateSummary(); // Update modal summary
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
            alert('Please fill in all required fields!');
            return;
        }

        if (!this.validateEmail(email)) {
            alert('Please enter a valid email address!');
            return;
        }

        // Simulate booking process
        const bookingData = {
            id: 'BK' + Date.now(),
            customer: { name, phone, email },
            items: [...this.cart],
            paymentMethod,
            total: this.getCartTotal() * 1.1, // Including tax
            date: new Date().toISOString(),
            status: 'confirmed'
        };

        // Save booking to localStorage for demo
        const bookings = JSON.parse(localStorage.getItem('travelBookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('travelBookings', JSON.stringify(bookings));

        // Clear cart
        this.clearCart();
        this.hideCheckoutModal();

        // Show success message
        alert(`Booking confirmed! Your booking ID is: ${bookingData.id}\n\nA confirmation email will be sent to ${email}`);

        // Redirect to home page
        window.location.href = 'index.html';
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize cart manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Global function to add items to cart (called from other pages)
window.addToCart = function (item) {
    if (!window.cartManager) {
        // If cart manager doesn't exist, create it
        window.cartManager = new CartManager();
    }
    return window.cartManager.addToCart(item);
};

// Global function to get cart count (for badge updates)
window.getCartCount = function () {
    if (!window.cartManager) {
        const cart = JSON.parse(localStorage.getItem('travelCart') || '[]');
        return cart.reduce((count, item) => count + item.quantity, 0);
    }
    return window.cartManager.getCartCount();
};

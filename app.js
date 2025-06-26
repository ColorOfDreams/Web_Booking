// Slick slider will be initialized in render.js after hotels are rendered

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }
});

// FAQ Accordion Function
function toggleFaq(el) {
  const icon = el.querySelector('.toggle-icon');
  const content = el.nextElementSibling;
  const isOpen = icon.textContent === '−';

  // Close all other FAQs first
  document.querySelectorAll('.faq-content').forEach((item) => {
    if (item !== content) {
      item.style.maxHeight = '0px';
      item.previousElementSibling.querySelector('.toggle-icon').textContent = '+';
    }
  });

  // Toggle current FAQ
  icon.textContent = isOpen ? '+' : '−';
  content.style.maxHeight = isOpen ? '0px' : content.scrollHeight + 'px';
}

// Modal Functions
function openModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('hidden');
    // Add body scroll lock
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('hidden');
    // Remove body scroll lock
    document.body.style.overflow = 'auto';
  }
}

// Initialize Book Now Buttons
document.addEventListener('DOMContentLoaded', function () {
  // Use event delegation for dynamically created buttons
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-booknow')) {
      e.preventDefault();

      const hotelId = e.target.getAttribute('data-hotel-id');
      if (hotelId) {
        // For quick book, add to cart and show modal
        addToCartFromIndex(parseInt(hotelId));
        openModal();
      } else {
        // Regular book now (for tours etc.)
        openModal();
      }
    }
  });

  // Close modal when clicking outside
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});

// Form Submission Handler
document.addEventListener('DOMContentLoaded', function () {
  const bookingForm = document.querySelector('#bookingModal form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;

      // Basic validation
      if (!email || !phone) {
        alert('Please fill in all fields!');
        return;
      }

      // Simulate booking process
      alert(`Booking submitted successfully!\nEmail: ${email}\nPhone: ${phone}`);

      // Reset form and close modal
      bookingForm.reset();
      closeModal();
    });
  }

  // Update cart badge on page load
  updateCartBadge();
});

// Cart Functions
function addToCartFromIndex(hotelId) {
  const hotel = hotelsData.find(h => h.id === hotelId);
  if (hotel) {
    const cartItem = {
      id: hotel.id,
      type: 'hotel',
      title: hotel.name, // Sử dụng hotel.name thay vì hotel.title
      price: hotel.price,
      image: hotel.image,
      quantity: 1
    };

    // Add to cart using global function
    if (typeof addToCartGlobal === 'function') {
      addToCartGlobal(cartItem);
    } else {
      // Fallback - add to localStorage directly
      const cart = JSON.parse(localStorage.getItem('travelCart') || '[]');
      const existingItem = cart.find(item => item.id === cartItem.id && item.type === cartItem.type);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem('travelCart', JSON.stringify(cart));
      updateCartBadge();
    }

    // Show success message
    showToast(`${hotel.name} has been added to your cart!`, 'success');
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const cart = JSON.parse(localStorage.getItem('travelCart') || '[]');
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  }
}

// Global cart functions for other pages
window.addToCartGlobal = function (item) {
  const cart = JSON.parse(localStorage.getItem('travelCart') || '[]');
  const existingItem = cart.find(cartItem =>
    cartItem.id === item.id && cartItem.type === item.type
  );

  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
  } else {
    cart.push({
      id: item.id,
      type: item.type,
      name: item.title || item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity || 1,
      checkIn: item.checkIn || null,
      checkOut: item.checkOut || null,
      guests: item.guests || 1
    });
  }

  localStorage.setItem('travelCart', JSON.stringify(cart));
  updateCartBadge();
  return true;
}

// Toast notification function
function showToast(message, type = 'success') {
  // Remove existing toast if any
  const existingToast = document.querySelector('.success-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `success-toast ${type}`;
  toast.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-check-circle mr-2"></i>
      <span>${message}</span>
    </div>
  `;

  // Add to page
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
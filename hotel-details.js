// Hotel Details JavaScript
let currentHotel = null;

// Get hotel ID from URL parameters
function getHotelIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Find hotel by ID from data.js
function findHotelById(id) {
    return hotelsData.find(hotel => hotel.id == id);
}

// Generate additional images for gallery
function generateGalleryImages(baseImage) {
    const imageVariations = [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
    ];

    return [baseImage, ...imageVariations.slice(0, 4)];
}

// Render hotel details
function renderHotelDetails(hotel) {
    if (!hotel) {
        showHotelNotFound();
        return;
    }

    currentHotel = hotel;

    // Generate gallery images
    const galleryImages = generateGalleryImages(hotel.image);

    // Update page title
    document.title = `${hotel.name} - Hotel Details`;

    // Update main image and gallery
    document.getElementById('main-hotel-image').src = galleryImages[0];
    document.getElementById('main-hotel-image').alt = hotel.name;

    for (let i = 1; i <= 4; i++) {
        const img = document.getElementById(`gallery-image-${i}`);
        if (galleryImages[i]) {
            img.src = galleryImages[i];
            img.alt = `${hotel.name} - View ${i}`;
        }
    }

    // Update hotel information
    document.getElementById('hotel-name').textContent = hotel.name;
    document.getElementById('hotel-location').textContent = hotel.location;
    document.getElementById('hotel-rating').textContent = hotel.rating;
    document.getElementById('hotel-description').textContent = hotel.description;
    document.getElementById('hotel-price').textContent = hotel.price;

    // Show featured badge if applicable
    if (hotel.featured) {
        document.getElementById('hotel-featured').classList.remove('hidden');
    }

    // Show hotel content and hide loading
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('hotel-content').classList.remove('hidden');
}

// Show hotel not found message
function showHotelNotFound() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('hotel-not-found').classList.remove('hidden');
}

// Add to cart functionality
function addToCart(hotel) {
    const checkInDate = document.getElementById('checkin-date')?.value;
    const checkOutDate = document.getElementById('checkout-date')?.value;
    const guests = document.getElementById('guests')?.value || 1;

    const cartItem = {
        id: hotel.id,
        type: 'hotel',
        title: hotel.name,
        price: hotel.price,
        image: hotel.image,
        quantity: 1,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parseInt(guests)
    };

    // Use global cart function if available
    if (typeof addToCartGlobal === 'function') {
        addToCartGlobal(cartItem);
    } else {
        // Fallback to direct localStorage manipulation
        const cart = JSON.parse(localStorage.getItem('travelCart') || '[]');
        const existingItem = cart.find(item =>
            item.id === cartItem.id && item.type === cartItem.type
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('travelCart', JSON.stringify(cart));
        updateCartBadge();
    }

    // Show success message
    showSuccessMessage();
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('travelCart') || '[]');
        const count = cart.reduce((total, item) => total + item.quantity, 0);

        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.classList.remove('translate-x-full');

    setTimeout(() => {
        successMessage.classList.add('translate-x-full');
    }, 3000);
}

// Modal functions (reuse from app.js)
function openModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Gallery image click functionality
function setupGalleryEvents() {
    const mainImage = document.getElementById('main-hotel-image');
    const galleryImages = document.querySelectorAll('[id^="gallery-image-"]');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            const tempSrc = mainImage.src;
            mainImage.src = img.src;
            img.src = tempSrc;
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const hotelId = getHotelIdFromUrl();

    // Update cart badge on page load
    updateCartBadge();

    if (!hotelId) {
        showHotelNotFound();
        return;
    }

    // Wait for data.js to load
    if (typeof hotelsData === 'undefined') {
        setTimeout(() => {
            const hotel = findHotelById(hotelId);
            renderHotelDetails(hotel);
            setupGalleryEvents();
        }, 100);
    } else {
        const hotel = findHotelById(hotelId);
        renderHotelDetails(hotel);
        setupGalleryEvents();
    }

    // Update cart count on page load
    updateCartCount();

    // Event listeners
    document.getElementById('book-now-btn').addEventListener('click', () => {
        openModal();
    });

    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        if (currentHotel) {
            addToCart(currentHotel);
        }
    });

    document.getElementById('cart-btn').addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    // Form submission
    const bookingForm = document.querySelector('#bookingModal form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            if (!email || !phone) {
                alert('Please fill in all fields!');
                return;
            }

            // Add to cart when booking
            if (currentHotel) {
                addToCart(currentHotel);
            }

            alert(`Booking confirmed for ${currentHotel?.name}!\nEmail: ${email}\nPhone: ${phone}`);

            bookingForm.reset();
            closeModal();
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
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
});

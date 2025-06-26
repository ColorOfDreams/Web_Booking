// Function to render hotel cards
function renderHotelCard(hotel) {
    return `
    <div class="hotel-card w-full sm:w-[400px] bg-white overflow-hidden flex flex-col border cursor-pointer"
         style="border-top-left-radius: 2.5rem; border-bottom-right-radius: 2.5rem;"
         onclick="viewHotelDetails(${hotel.id})">
      <div>
        <img src="${hotel.image}" alt="${hotel.name}"
             class="w-full h-48 sm:h-60 object-cover rounded-t-lg" />
      </div>
      <div class="p-4 sm:p-6 flex flex-col flex-grow">
        <div class="flex justify-between items-center mb-4">
          <h5 class="text-xl sm:text-2xl font-bold text-blue-900">${hotel.name}</h5>
          <div class="flex items-center font-semibold">
            <img src="./sgv/start.svg" alt="Star" class="w-4 h-4" />
            <span class="text-gray-700 ml-1">${hotel.rating}</span>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-between text-sm sm:text-base text-gray-700 mt-4">
          <div class="flex items-center mb-2 sm:mb-0">
            <img src="./sgv/local.svg" alt="Location" class="w-4 h-4" />
            <span class="ml-2 font-medium">${hotel.location}</span>
          </div>
          <div class="flex items-center">
            <img src="./sgv/usd.svg" alt="USD" class="w-4 h-4" />
            <span class="ml-2 font-medium">USD ${hotel.price}/Day</span>
          </div>
        </div>
        <p class="text-sm sm:text-base text-gray-600 mt-4 font-normal">
          ${hotel.description}
        </p>
      </div>
      <button type="button" 
              class="btn-booknow w-full bg-blue-600 text-white text-lg sm:text-xl font-bold py-4 sm:py-6 px-6 sm:px-8 hover:bg-blue-700 transition-colors duration-300 mt-4"
              data-hotel-id="${hotel.id}"
              onclick="event.stopPropagation(); addToCartFromIndex(${hotel.id});">
        Book Now
      </button>
    </div>
  `;
}

// Function to render all hotels
function renderHotels() {
    const sliderContainer = document.querySelector('.slider');
    if (sliderContainer && hotelsData) {
        sliderContainer.innerHTML = hotelsData.map(hotel => renderHotelCard(hotel)).join('');
    }
}

// Function to render tour card
function renderTourCard(tour) {
    return `
    <div class="${tour.id === 1 ? 'mb-8 md:mb-0 md:mr-8' : ''}">
      <div class="w-full h-40 sm:h-48">
        <img src="${tour.image}" alt="${tour.name}"
             class="w-full h-full object-cover rounded-sm" />
      </div>
      <div class="mt-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg sm:text-xl font-bold text-blue-600 dark:text-sky-400">${tour.name}</h3>
          <span class="text-gray-900 font-medium text-sm sm:text-base">$${tour.price} per day</span>
        </div>
        <p class="text-gray-900 mt-4 text-base sm:text-lg font-semibold">${tour.title}</p>
        <div class="flex flex-wrap text-xs sm:text-base text-gray-500 mt-4 gap-2 sm:gap-4">
          <span class="text-gray-400">${tour.type}</span>
          <span class="text-gray-400">⏳ ${tour.duration}</span>
          <span class="text-gray-400">🌍 ${tour.location}</span>
        </div>
        <button class="btn-booknow mt-4 sm:mt-8 w-full bg-blue-600 text-white text-base sm:text-lg font-semibold py-3 px-6 sm:px-8 rounded-sm hover:bg-blue-700 transition-colors duration-300"
                data-tour-id="${tour.id}">
          Book Now
        </button>
      </div>
    </div>
  `;
}

// Function to render tours
function renderTours() {
    const toursContainer = document.querySelector('.tours-container');
    if (toursContainer && toursData) {
        toursContainer.innerHTML = toursData.map(tour => renderTourCard(tour)).join('');
    }
}

// Function to render service card
function renderServiceCard(service) {
    return `
    <div class="flex-1 transform transition-transform duration-300 hover:scale-105 px-2 sm:px-4">
      <div class="flex flex-col items-center pt-6 sm:pt-8 pb-6 sm:pb-8">
        <div class="bg-gray-100 p-4 rounded-full mb-6">
          <img src="${service.icon}" alt="${service.title}" class="w-8 h-8" />
        </div>
        <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-3">${service.title}</h3>
        <p class="text-gray-600 mb-6 text-sm sm:text-base">
          ${service.description}
        </p>
        <a href="${service.link}" class="text-blue-600 dark:text-sky-400 font-semibold inline-flex items-center">
          Learn More
          <img src="./sgv/arrow-right.svg" class="ml-2 w-4 h-4" alt="arrow" />
        </a>
      </div>
    </div>
  `;
}

// Function to render services
function renderServices() {
    const servicesContainer = document.querySelector('.services-container');
    if (servicesContainer && servicesData) {
        servicesContainer.innerHTML = servicesData.map(service => renderServiceCard(service)).join('');
    }
}

// Function to render stats
function renderStats() {
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer && statsData) {
        statsContainer.innerHTML = statsData.map(stat => `
      <div>
        <p class="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-sky-400">${stat.number}</p>
        <p class="text-gray-600 text-sm sm:text-base">${stat.label}</p>
      </div>
    `).join('');
    }
}

// Function to render FAQ item
function renderFaqItem(faq) {
    return `
    <li class="border-b pb-4">
      <div class="flex items-center justify-between cursor-pointer group transition-colors duration-200 hover:text-blue-700"
           onclick="toggleFaq(this)">
        <span class="text-gray-800 text-base sm:text-xl font-medium">${faq.question}</span>
        <span class="toggle-icon w-6 h-6 bg-blue-600 dark:bg-sky-400 rounded-full flex items-center justify-center text-white text-xl transition-all duration-300 group-hover:bg-blue-700 dark:group-hover:bg-sky-500">+</span>
      </div>
      <div class="faq-content overflow-hidden max-h-0 transition-all duration-500 ease-in-out text-gray-600 text-sm sm:text-base">
        <div class="mt-2">
          ${faq.answer}
        </div>
      </div>
    </li>
  `;
}

// Function to render FAQ
function renderFaq() {
    const faqContainer = document.querySelector('#faq-list');
    if (faqContainer && faqData) {
        faqContainer.innerHTML = faqData.map(faq => renderFaqItem(faq)).join('');
    }
}

// Function to navigate to hotel details page
function viewHotelDetails(hotelId) {
    window.location.href = `event-detail.html?id=${hotelId}`;
}

// Function to add hotel to cart (for quick book)
function addToCartFromIndex(hotelId) {
    const hotel = hotelsData.find(h => h.id === hotelId);
    if (!hotel) return;

    const cartItem = {
        id: hotel.id,
        type: 'hotel',
        name: hotel.name,
        price: hotel.price,
        image: hotel.image,
        location: hotel.location,
        quantity: 1
    };

    // Use global cart function if available
    if (typeof addToCartGlobal === 'function') {
        addToCartGlobal(cartItem);
    } else {
        // Fallback to direct localStorage manipulation
        let cart = JSON.parse(localStorage.getItem('travelCart')) || [];
        const existingItem = cart.find(item => item.id === hotel.id && item.type === 'hotel');

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('travelCart', JSON.stringify(cart));
    }

    // Show success message
    if (typeof showToast === 'function') {
        showToast(`${hotel.name} added to cart!`, 'success');
    } else {
        alert(`${hotel.name} added to cart!`);
    }

    // Update cart badge if function exists
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
}

// Initialize all renders when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    renderHotels();
    renderTours();
    renderServices();
    renderStats();
    renderFaq();

    // Re-initialize slick slider after rendering hotels
    setTimeout(() => {
        if ($('.slider').hasClass('slick-initialized')) {
            $('.slider').slick('unslick');
        }

        $('.slider').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            prevArrow: $('.custom-prev'),
            nextArrow: $('.custom-next'),
            speed: 600,
            cssEase: "ease-in-out",
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        });
    }, 100);
});

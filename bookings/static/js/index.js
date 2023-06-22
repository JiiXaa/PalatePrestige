const stripe = Stripe(
  'pk_test_51KG5PSCNxZRJUEeXP6dfetfctUGX4G24nKY2FruoTLNFCl57uHxL2pWPyOOcCdaWraBlUd4Jax59pouBetWCMwG000imChvkvo'
);
const elements = stripe.elements();

// Variable to hold the Stripe's payment modal
let paymentModal;

document.addEventListener('DOMContentLoaded', () => {
  console.log('booking/index.js loaded');

  // Initialize the payment modal
  const paymentModal = new bootstrap.Modal(
    document.getElementById('paymentModal'),
    {}
  );

  // Access the existing selectedBooking instance from the window object
  const selectedBooking = window.selectedBooking;

  // Get all the "Add menu to booking" buttons
  const addMenuToBookingBtns = document.querySelectorAll('.add-menu-js');

  // Add click event listener to each button
  addMenuToBookingBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Get the associated menu ID from the data attribute
      const menuId = this.closest('.menu-card').dataset.menuId;
      // Get the chef ID from the data attribute
      const chefId = this.closest('.menu-card').dataset.chefId;
      // Get the chef name from the data attributes
      const chefFirstName = this.closest('.menu-card').dataset.chefFirstName;
      const chefLastName = this.closest('.menu-card').dataset.chefLastName;
      const chefName = chefFirstName + ' ' + chefLastName;

      // Use the menu ID to set the selected menu in the selectedBooking instance and in local storage
      selectedBooking.setSelectedMenu(menuId);
      selectedBooking.addSelectedMenuLS(menuId);

      // Use the chef ID and name to set the selected chef in the selectedBooking instance and in local storage
      const chef = { id: chefId, name: chefName };
      selectedBooking.setSelectedChef(chef);
      selectedBooking.addSelectedChefLS(JSON.stringify(chef));

      // Update the selection display
      selectedBooking.updateSelectionDisplay();

      // Update the total price
      const numberOfGuestsInput = document.getElementById('numberOfGuests');
      const numberOfGuests = parseInt(numberOfGuestsInput.value);

      // Get all the menu cards
      const menuCards = document.querySelectorAll('.menu-card');

      // Find the selected menu card
      let selectedMenuCard = null;
      menuCards.forEach((menuCard) => {
        if (menuCard.dataset.menuId === menuId) {
          selectedMenuCard = menuCard;
          // Exit the loop once the selected menu card is found
          return;
        }
      });

      // Get the menu price from the selected menu card. If the selected menu card is not found, set the price to 0
      const menuPriceAttribute = selectedMenuCard
        ? selectedMenuCard.getAttribute('data-menu-price')
        : '0';
      const menuPrice = parseFloat(menuPriceAttribute);

      // Calculate the total price
      const totalPrice = numberOfGuests * menuPrice;

      // Display the total price
      const totalPriceElement = document.getElementById('totalPrice');
      totalPriceElement.textContent = `Total Price: £${totalPrice.toFixed(2)}`;

      // Hide the clicked button and show the rest
      addMenuToBookingBtns.forEach((button) => {
        if (button === this) {
          button.style.display = 'none';
        } else {
          button.style.display = 'block';
        }
      });
    });
  });

  // Clear Booking button
  const clearBookingBtn = document.getElementById('clearBookingBtn');

  clearBookingBtn.addEventListener('click', () => {
    selectedBooking.clearSelectedBookingLS();
    selectedBooking.clearSelectedBooking();
    selectedBooking.updateSelectionDisplay();
    console.log(
      'test',
      selectedBooking.date,
      selectedBooking.menu,
      selectedBooking.chef
    );
  });

  // Submit Booking button
  const submitBookingBtn = document.getElementById('submitBookingBtn');

  submitBookingBtn.addEventListener('click', () => {
    console.log('Submit Booking button clicked');

    // Open the card payment modal
    paymentModal.show();
  });

  // Create the card Element and mount it to the Element DOM element.
  const card = elements.create('card', {
    hidePostalCode: true,
  });
  card.mount('#card-element');

  // Handle real-time validation errors from the card Element.
  card.addEventListener('change', function (event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });

  document
    .getElementById('payment-form')
    .addEventListener('submit', function (e) {
      e.preventDefault();

      // Get the selectedBooking instance from the window object
      const selectedBooking = window.selectedBooking;
      // Get the selected date from the selectedBooking instance
      const selectedDate = selectedBooking.getSelectedDate();
      // Get the selected menu from the selectedBooking instance
      const selectedMenu = selectedBooking.getSelectedMenu();
      // Get the selected chef from the selectedBooking instance
      const selectedChef = selectedBooking.getSelectedChef();

      // Get the email from the payment form
      const email = document.getElementById('email').value;

      // Create a booking using the createBooking function after the payment method is created
      stripe
        .createPaymentMethod({
          type: 'card',
          card: card,
          billing_details: {
            email: email,
          },
        })
        .then((result) => {
          if (result.error) {
            alert(result.error.message);
          } else {
            const paymentMethodId = result.paymentMethod.id;
            // Call the createBooking function with the selected data and the payment method ID
            createBooking(
              selectedChef,
              selectedDate,
              selectedMenu,
              paymentMethodId,
              paymentModal
            );
          }
        });
    });
});

class Booking {
  constructor(id, chef, user, date, time, location, cuisine, status) {
    this.id = id;
    this.chef = chef;
    this.user = user;
    this.date = date;
    this.time = time;
    this.location = location;
    this.cuisine = cuisine;
    this.status = status;
  }

  // instance method to render a single booking to the DOM. This is an instance method because it is specific to a single booking instance.
  renderBooking() {
    let bookingDiv = document.createElement('div');
    bookingDiv.className = 'booking';
    bookingDiv.id = `booking-${this.id}`;
    bookingDiv.innerHTML = `
            <h3>${this.chef.name} - ${this.user.name}</h3>
            <p>Date: ${this.date}</p>
            <p>Time: ${this.time}</p>
            <p>Location: ${this.location}</p>
            <p>Cuisine: ${this.cuisine}</p>
            <p>Status: ${this.status}</p>
            <button class="delete-booking" data-id="${this.id}">Delete Booking</button>
        `;
    return bookingDiv;
  }

  // static method to render all bookings to the DOM from an array of bookings. This is a class method because it is not specific to a single booking instance.
  static renderAllBookings(bookings) {
    let bookingsDiv = document.getElementById('bookings');
    bookingsDiv.innerHTML = '';
    bookings.forEach((booking) => {
      let newBooking = new Booking(
        booking.id,
        booking.chef,
        booking.user,
        booking.date,
        booking.time,
        booking.location,
        booking.cuisine,
        booking.status
      );
      bookingsDiv.appendChild(newBooking.renderBooking());
    });
  }
}
class SelectedBooking {
  constructor() {
    this.date = null;
    this.menu = null;
    this.chef = null;
  }

  setSelectedDate(date) {
    this.date = date;
  }

  getSelectedDate() {
    return this.date;
  }

  clearSelectedDate() {
    this.date = null;
  }

  addSelectedDateLS(date) {
    localStorage.setItem('selectedDate', date);
  }

  removeSelectedDateLS() {
    localStorage.removeItem('selectedDate');
  }

  setSelectedMenu(menu) {
    this.menu = menu;
  }

  getSelectedMenu() {
    return this.menu;
  }

  clearSelectedMenu() {
    this.menu = null;
  }

  addSelectedMenuLS(menu) {
    localStorage.setItem('selectedMenu', menu);
  }

  removeSelectedMenuLS() {
    localStorage.removeItem('selectedMenu');
  }

  setSelectedChef(chef) {
    console.log('Setting chef:', chef);
    this.chef = chef;
  }

  getSelectedChef() {
    return this.chef;
  }

  clearSelectedChef() {
    this.chef = null;
  }

  addSelectedChefLS(chef) {
    console.log('Adding chef to local storage:', chef);
    localStorage.setItem('selectedChef', JSON.stringify(chef));
  }

  removeSelectedChefLS() {
    localStorage.removeItem('selectedChef');
  }

  clearSelectedBookingLS() {
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedMenu');
    localStorage.removeItem('selectedChef');
  }

  clearSelectedBooking() {
    this.date = null;
    this.menu = null;
    this.chef = null;
  }

  updateSelectionDisplay() {
    let selectedDate = document.getElementById('selectedDate');
    let selectedMenu = document.getElementById('selectedMenu');
    let selectedChef = document.getElementById('selectedChef');

    if (localStorage.getItem('selectedDate')) {
      this.date = localStorage.getItem('selectedDate');
    } else {
      this.date = null;
    }

    // Convert the date string to a date object
    const dateObj = new Date(this.date);

    if (localStorage.getItem('selectedMenu')) {
      this.menu = localStorage.getItem('selectedMenu');
    } else {
      this.menu = null;
    }

    if (this.menu) {
      selectedMenu.innerHTML = `
        <p>Menu: ${this.menu}</p>
        <span class="icon ml-2">
          <i class="fa-solid fa-xmark"></i>
        </span>
      `;

      // Get the icon element
      const icon = selectedMenu.querySelector('.icon');

      // Add an event listener to the icon to remove the selected menu
      icon.addEventListener('click', () => {
        this.removeSelectedMenuLS();
        this.clearSelectedMenu();
        this.clearSelectedChef();
        this.updateSelectionDisplay();
      });
    } else {
      selectedMenu.innerHTML = '';
    }

    // Check if both date and menu are selected. If so, get the chef data from the menu card and set the selected chef depending on the menu card selected and display the selected chef.
    if (this.date && this.menu) {
      // Find the correct parent element which contains the data attributes
      const menuCard = document.querySelector(
        `.menu-card[data-menu-id="${this.menu}"]`
      );

      // Get the chef data from the parent element
      const chefId = menuCard.dataset.chefId;
      const chefFirstName = menuCard.dataset.chefFirstName;
      const chefLastName = menuCard.dataset.chefLastName;
      const chefName = `${chefFirstName} ${chefLastName}`;

      this.chef = {
        id: chefId,
        name: chefName,
      };

      selectedChef.innerHTML = `<p>Chef: ${this.chef.name}</p>`;
    } else {
      // Either date or menu is not selected, clear chef and selectedChef display
      this.chef = null;
      selectedChef.innerHTML = '';
      this.removeSelectedChefLS();
    }

    if (this.date) {
      selectedDate.innerHTML = `
        <p class="date">${dateObj.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })} ${dateObj.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
      })}</p>
        <span class="icon ml-2">
          <i class="fa-solid fa-xmark"></i>
        </span>
      `;

      // Get the icon element
      const icon = selectedDate.querySelector('.icon');

      // Store a reference to the SelectedBooking instance
      const selectedBooking = this;

      // Add click event listener to the icon
      icon.addEventListener('click', function () {
        selectedBooking.clearSelectedDate();
        selectedBooking.removeSelectedDateLS();
        selectedBooking.removeSelectedChefLS();
        selectedBooking.updateSelectionDisplay();
      });
    } else {
      selectedDate.innerHTML = '';
    }

    // Clear Booking button
    const clearBooking = document.getElementById('clearBooking');

    console.log(
      'date from method',
      this.date,
      'menu',
      this.menu,
      'chef',
      this.chef
    );

    console.log('clearBooking', clearBooking);

    if (this.date || this.menu || this.chef) {
      clearBooking.classList.remove('hidden');
      // Add event listener to the Clear Booking button here
      const clearBookingBtn = document.getElementById('clearBookingBtn');
      clearBookingBtn.removeEventListener('click', clearBookingFunction);
      clearBookingBtn.addEventListener('click', clearBookingFunction);
    } else {
      clearBooking.classList.add('hidden');
    }

    // Get the number of guests from the input field
    const numberOfGuestsInput = document.getElementById('numberOfGuests');

    // Add an event listener to the number of guests input field
    numberOfGuestsInput.addEventListener('input', () => {
      // Get the current number of guests
      const numberOfGuests = parseInt(numberOfGuestsInput.value);

      // Get all the menu cards
      const menuCards = document.querySelectorAll('.menu-card');

      // Find the selected menu card
      let selectedMenuCard = null;
      menuCards.forEach((menuCard) => {
        if (menuCard.dataset.menuId === this.menu) {
          selectedMenuCard = menuCard;
          return; // Exit the loop once the selected menu card is found
        }
      });

      // Get the menu price from the selected menu card
      const menuPriceAttribute = selectedMenuCard
        ? selectedMenuCard.getAttribute('data-menu-price')
        : '0';
      const menuPrice = parseFloat(menuPriceAttribute);

      // Calculate the total price
      const totalPrice = numberOfGuests * menuPrice;

      // Display the total price
      const totalPriceElement = document.getElementById('totalPrice');
      totalPriceElement.textContent = `Total Price: £${totalPrice.toFixed(2)}`;
    });
  }
}

const clearBookingFunction = () => {
  selectedBooking.clearSelectedBookingLS();
  selectedBooking.clearSelectedBooking();
  selectedBooking.updateSelectionDisplay();
  console.log(
    'test',
    selectedBooking.date,
    selectedBooking.menu,
    selectedBooking.chef
  );
};

function createBooking(
  selectedChef,
  selectedDate,
  selectedMenu,
  paymentMethodId,
  paymentModal
) {
  // Check if selectedChef, selectedDate, and selectedMenu are not null
  if (!selectedDate || !selectedMenu) {
    let missingData = '';
    if (!selectedDate) missingData += 'Date ';
    if (!selectedMenu) missingData += 'Menu ';

    alert(
      `Please select the following data: ${missingData} to create a booking`
    );
    return;
  }

  // Get the number of guests
  const numberOfGuests = document.getElementById('numberOfGuests').value;

  // Get the menu price from the menu card
  const menuCard = document.querySelector('.menu-card');
  // Get the menu price from the menu card (price per person)
  const menuPriceAttribute = menuCard.getAttribute('data-menu-price');

  // Convert the price to a number
  const menuPrice = parseFloat(menuPriceAttribute);

  // Calculate the total price
  const totalPrice = numberOfGuests * menuPrice;

  // Get the email from the input field in the payment modal
  const email = document.getElementById('email').value;

  console.log('date before formatting', selectedDate);
  // Format date
  const formattedDate = formatDate(selectedDate);
  console.log('date after formatting', formattedDate);

  // Create the booking object
  const booking = {
    chef: selectedChef.id,
    date: formattedDate,
    menu: selectedMenu,
    numberOfGuests: numberOfGuests,
    totalPrice: totalPrice,
    paymentMethodId: paymentMethodId,
  };

  const csrfToken = getCookie('csrftoken');
  console.log('Before sending request to server');
  // Send the booking object to the server
  fetch('/bookings/create_booking/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(booking),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        console.log('Success:', data);

        // Clear the selected booking
        clearBookingFunction();

        // Handle payment
        stripe
          .confirmCardPayment(data.client_secret, {
            payment_method: paymentMethodId,
            receipt_email: email,
          })
          .then((result) => {
            if (result.error) {
              alert(result.error.message);
            } else {
              // Hide the payment form
              paymentModal.hide();

              // The payment has succeeded. Display a success message.
              alert('Payment succeeded!');

              // Clear the selected booking
              selectedBooking.clearSelectedBookingLS();
              selectedBooking.clearSelectedBooking();
              selectedBooking.updateSelectionDisplay();

              // Refresh the page
              location.reload();
            }
          });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  console.log('After sending request to server');
}

// Format the date to Django's required format
function formatDate(date) {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  const day = ('0' + dateObj.getDate()).slice(-2);
  const hours = ('0' + dateObj.getHours()).slice(-2);
  const minutes = ('0' + dateObj.getMinutes()).slice(-2);
  const seconds = ('0' + dateObj.getSeconds()).slice(-2);
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

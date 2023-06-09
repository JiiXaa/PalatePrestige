const stripe = Stripe(
  'pk_test_51KG5PSCNxZRJUEeXP6dfetfctUGX4G24nKY2FruoTLNFCl57uHxL2pWPyOOcCdaWraBlUd4Jax59pouBetWCMwG000imChvkvo'
);
const elements = stripe.elements();

// Variable to hold the Stripe's payment modal
let paymentModal;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the payment modal
  const paymentModal = new bootstrap.Modal(
    document.getElementById('paymentModal'),
    {}
  );

  // Access the existing selectedBooking instance from the window object
  const selectedBooking = window.selectedBooking;

  const visitedChefEl = document.getElementById('calendar');
  const visitedChefCheckId = parseInt(visitedChefEl.dataset.chefId);
  let menuIdToCheck = JSON.parse(localStorage.getItem('selectedMenu'));

  if (menuIdToCheck) {
    menuIdToCheck = parseInt(menuIdToCheck.chefId);
    if (menuIdToCheck != visitedChefCheckId) {
      clearBooking();
    }
  }

  // Event listener for the booking modal close button
  const bookingModalCloseBtn = document.querySelector(
    '#mobileBookingModal .close'
  );
  bookingModalCloseBtn.addEventListener('click', () => {
    // Remove the inline style from the body element to clear the padding-right
    document.body.style.paddingRight = '';
  });

  // Event listener for the payment modal hidden event
  paymentModal._element.addEventListener('hidden.bs.modal', () => {
    // Remove the inline style from the body element to clear the padding-right
    document.body.style.paddingRight = '';
  });

  // Get all the "Add menu to booking" buttons
  const addMenuToBookingBtns = document.querySelectorAll('.add-menu-js');

  // Variable to hold the selected menu card
  let selectedMenuCard = null;

  // Retrieve the total price in the booking modal and shopping bag from local storage
  const totalPriceLS = localStorage.getItem('totalPrice');
  const totalPriceIcon = document.getElementById('totalPriceIcon');

  const totalPriceElement =
    window.innerWidth < 768
      ? document.getElementById('totalPriceMobile')
      : document.getElementById('totalPrice');

  if (totalPriceLS) {
    totalPriceIcon.textContent = `£${parseFloat(totalPriceLS).toFixed(2)}`;
    totalPriceElement.textContent = `Total Price: £${parseFloat(
      totalPriceLS
    ).toFixed(2)}`;
  } else if (totalPriceIcon) {
    totalPriceIcon.textContent = '£0.00';
    totalPriceElement.textContent = '£0.00';
  }
  // Add click event listener to each button
  addMenuToBookingBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Get the associated menu ID from the data attribute
      const menuId = this.closest('.menu-card').dataset.menuId;
      // Get the menu title from the data attribute
      const menuTitle = this.closest('.menu-card').dataset.menuTitle;
      // Get the chef ID from the data attribute
      const chefId = this.closest('.menu-card').dataset.chefId;
      // Get the chef name from the data attributes
      const chefFirstName = this.closest('.menu-card').dataset.chefFirstName;
      const chefLastName = this.closest('.menu-card').dataset.chefLastName;
      const chefName = chefFirstName + ' ' + chefLastName;

      // Use the menu ID to set the selected menu in the selectedBooking instance and in local storage

      const menu = { id: menuId, chefId: chefId, title: menuTitle };
      selectedBooking.setSelectedMenu(menu);
      selectedBooking.addSelectedMenuLS(JSON.stringify(menu));
      selectedBooking.setSelectedMenuTitle(menuTitle);
      selectedBooking.addSelectedMenuTitleLS(menuTitle);

      // Use the chef ID and name to set the selected chef in the selectedBooking instance and in local storage
      const chef = { id: chefId, name: chefName };
      selectedBooking.setSelectedChef(chef);
      selectedBooking.addSelectedChefLS(JSON.stringify(chef));

      // Update the selection display
      selectedBooking.updateSelectionDisplay();

      // Update the total price
      const numberOfGuestsInput =
        window.innerWidth < 768
          ? document.getElementById('numberOfGuestsMobile')
          : document.getElementById('numberOfGuests');
      const numberOfGuests = parseInt(numberOfGuestsInput.value);

      // Get all the menu cards
      const menuCards = document.querySelectorAll('.menu-card');

      // Find the selected menu card
      menuCards.forEach((menuCard) => {
        if (menuCard.dataset.menuId === menu.id) {
          selectedMenuCard = menuCard;
          selectedMenuCard.classList.add('menu-selected');
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
      // Update total price on the booking modal
      const totalPriceElement =
        window.innerWidth < 768
          ? document.getElementById('totalPriceMobile')
          : document.getElementById('totalPrice');
      totalPriceElement.textContent = totalPrice
        ? `Total Price: £${totalPrice.toFixed(2)}`
        : '£0';

      // Update total price on the shopping bag icon
      const totalPriceIcon = document.getElementById('totalPriceIcon');
      totalPriceIcon.textContent = totalPrice
        ? `£${totalPrice.toFixed(2)}`
        : '£0';

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
    // Update total price on the booking modal
    const totalPriceElement =
      window.innerWidth < 768
        ? document.getElementById('totalPriceMobile')
        : document.getElementById('totalPrice');
    totalPriceElement.textContent = '£0';

    // Update total price on the shopping bag icon
    const totalPriceIcon = document.getElementById('totalPriceIcon');
    totalPriceIcon.textContent = '£0';

    // Show all addMenuToBookingBtns
    addMenuToBookingBtns.forEach((button) => {
      button.style.display = 'block';
    });

    // Update the total price
    const numberOfGuestsInput =
      window.innerWidth < 768
        ? document.getElementById('numberOfGuestsMobile')
        : document.getElementById('numberOfGuests');
    numberOfGuestsInput.value = 0;

    selectedBooking.clearSelectedBookingLS();
    selectedBooking.clearSelectedBooking();
    selectedBooking.updateSelectionDisplay();

    // Remove the 'menu-selected' class from the selected menu card
    if (selectedMenuCard) {
      selectedMenuCard.classList.remove('menu-selected');
    }
  });

  // Submit Booking button
  const submitBookingBtn =
    window.innerWidth < 768
      ? document.getElementById('submitBookingBtnMobile')
      : document.getElementById('submitBookingBtn');

  if (submitBookingBtn) {
    submitBookingBtn.addEventListener('click', () => {
      // Open the card payment modal
      paymentModal.show();
    });
  }

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
              selectedMenu.id,
              paymentMethodId,
              paymentModal
            );
          }
        });
    });
});

class SelectedBooking {
  constructor() {
    this.date = null;
    this.menu = null;
    this.menuTitle = null;
    this.chef = null;
    this.totalPrice = 0;
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

  setSelectedMenuTitle(menuTitle) {
    this.menuTitle = menuTitle;
  }

  getSelectedMenu() {
    return this.menu;
  }

  getSelectedMenuTitle() {
    return this.menuTitle;
  }

  clearSelectedMenu() {
    this.menu = null;
  }

  clearSelectedMenuTitle() {
    this.menuTitle = null;
  }

  addSelectedMenuLS(menu) {
    localStorage.setItem('selectedMenu', menu);
  }

  addSelectedMenuTitleLS(menuTitle) {
    localStorage.setItem('selectedMenuTitle', menuTitle);
  }

  removeSelectedMenuLS() {
    localStorage.removeItem('selectedMenu');
  }

  removeSelectedMenuTitleLS() {
    localStorage.removeItem('selectedMenuTitle');
  }

  setSelectedChef(chef) {
    this.chef = chef;
  }

  getSelectedChef() {
    return this.chef;
  }

  clearSelectedChef() {
    this.chef = null;
  }

  addSelectedChefLS(chef) {
    localStorage.setItem('selectedChef', JSON.stringify(chef));
  }

  removeSelectedChefLS() {
    localStorage.removeItem('selectedChef');
  }

  setTotalPrice(totalPrice) {
    this.totalPrice = totalPrice;
  }

  getTotalPrice() {
    return this.totalPrice;
  }

  clearTotalPrice() {
    this.totalPrice = 0;
  }

  addTotalPriceLS(totalPrice) {
    localStorage.setItem('totalPrice', totalPrice);
  }

  removeTotalPriceLS() {
    localStorage.removeItem('totalPrice');
  }

  clearSelectedBookingLS() {
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedMenu');
    localStorage.removeItem('selectedMenuTitle');
    localStorage.removeItem('selectedChef');
    localStorage.removeItem('totalPrice');
  }

  clearSelectedBooking() {
    this.date = null;
    this.menu = null;
    this.menuTitle = null;
    this.chef = null;
    this.totalPrice = 0;
  }

  updateSelectionDisplay() {
    let selectedDate =
      window.innerWidth < 768
        ? document.getElementById('selectedDateMobile')
        : document.getElementById('selectedDate');
    let selectedMenu =
      window.innerWidth < 768
        ? document.getElementById('selectedMenuMobile')
        : document.getElementById('selectedMenu');
    let selectedChef =
      window.innerWidth < 768
        ? document.getElementById('selectedChefMobile')
        : document.getElementById('selectedChef');

    if (localStorage.getItem('selectedDate')) {
      this.date = localStorage.getItem('selectedDate');
    } else {
      this.date = null;
    }

    // Convert the date string to a date object
    const dateObj = new Date(this.date);

    if (
      localStorage.getItem('selectedMenu') &&
      localStorage.getItem('selectedMenuTitle')
    ) {
      this.menu = JSON.parse(localStorage.getItem('selectedMenu'));
      this.menuTitle = localStorage.getItem('selectedMenuTitle');
    } else {
      this.menu = null;
    }

    if (this.menu) {
      selectedMenu.innerHTML = `
        <p class="badge-info badge p-2 d-flex justify-content-between align-items-center">
          <span style="font-size: 1.25rem">
            Menu: ${this.menuTitle}
          </span>
          <span class="icon ml-2 d-block d-lg-none" style="font-size: .8rem; background-color: white; border-radius: 50%; padding: 5px;">
            <i class="fa-solid fa-xmark"></i>
          </span>
        </p>
      `;

      // Get the icon element
      const icon = selectedMenu.querySelector('.icon');

      // Add an event listener to the icon to remove the selected menu
      icon.addEventListener('click', () => {
        selectedBooking.removeSelectedMenuLS();
        selectedBooking.removeTotalPriceLS();
        selectedBooking.clearTotalPrice();
        selectedBooking.clearSelectedMenu();
        selectedBooking.clearSelectedChef();
        selectedBooking.updateSelectionDisplay();

        // Retrieve the total price in the booking modal and shopping bag from local storage
        const totalPriceLS = localStorage.getItem('totalPrice');
        const totalPriceIcon = document.getElementById('totalPriceIcon');

        const totalPriceElement =
          window.innerWidth < 768
            ? document.getElementById('totalPriceMobile')
            : document.getElementById('totalPrice');

        if (totalPriceLS) {
          totalPriceIcon.textContent = `£${parseFloat(totalPriceLS).toFixed(
            2
          )}`;
          totalPriceElement.textContent = `Total Price: £${parseFloat(
            totalPriceLS
          ).toFixed(2)}`;
        } else {
          totalPriceIcon.textContent = '£0.00';
          totalPriceElement.textContent = '£0.00';
        }
      });
    } else {
      selectedMenu.innerHTML = `
        <p>Select a menu.</p>
      `;
    }

    // Check if both date and menu are selected. If so, get the chef data from the menu card and set the selected chef depending on the menu card selected and display the selected chef.
    if (this.date && this.menu) {
      // Find the correct parent element which contains the data attributes
      const menuCard = document.querySelector(
        `.menu-card[data-menu-id="${this.menu.id}"]`
      );

      if (menuCard) {
        // Get the chef data from the parent element
        const chefId = menuCard.dataset.chefId;
        const chefFirstName = menuCard.dataset.chefFirstName;
        const chefLastName = menuCard.dataset.chefLastName;
        const chefName = `${chefFirstName} ${chefLastName}`;

        this.chef = {
          id: chefId,
          name: chefName,
        };

        selectedChef.innerHTML = `<p class="badge-info badge p-2" style="font-size: 1.25rem">Chef: ${this.chef.name}</p>`;
        selectedChef.classList.add('d-flex');
        selectedChef.classList.add('justify-content-center');
      } else {
        selectedBooking.clearSelectedBooking();
        selectedBooking.clearSelectedBookingLS();
        this.updateSelectionDisplay();
      }
    } else {
      // Either date or menu is not selected, clear chef and selectedChef display
      this.chef = null;
      selectedChef.innerHTML = '';
      this.removeSelectedChefLS();
    }

    if (this.date) {
      selectedDate.innerHTML = `
        <p class="date badge-info badge p-2 d-flex justify-content-between align-items-center">
          <span style="font-size: 1.25rem">
          ${dateObj.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })} ${dateObj.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
      })}
          </span>
          <span class="icon ml-2 d-block d-lg-none" style="font-size: 0.8rem; background-color: white; border-radius: 50%; padding: 5px;">
            <i class="fa-solid fa-xmark"></i>
          </span>
        </p>
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
      selectedDate.innerHTML = `
        <p>Select a date</p>
      `;
    }

    // Clear Booking button
    const clearBooking = document.getElementById('clearBooking');

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
    const numberOfGuestsInput =
      window.innerWidth < 768
        ? document.getElementById('numberOfGuestsMobile')
        : document.getElementById('numberOfGuests');

    // Add an event listener to the number of guests input field
    numberOfGuestsInput.addEventListener('input', () => {
      // Get the current number of guests
      const numberOfGuests = parseInt(numberOfGuestsInput.value);

      // Get all the menu cards
      const menuCards = document.querySelectorAll('.menu-card');
      // Find the selected menu card
      let selectedMenuCard = null;
      menuCards.forEach((menuCard) => {
        if (menuCard.dataset.menuId === this.menu.id) {
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

      // Update the total price in the selectedBooking instance
      this.setTotalPrice(totalPrice);

      // Display the total price on the booking modal
      const totalPriceElement =
        window.innerWidth < 768
          ? document.getElementById('totalPriceMobile')
          : document.getElementById('totalPrice');
      totalPriceElement.textContent = `Total Price: £${selectedBooking.totalPrice.toFixed(
        2
      )}`;

      // Update the total price on the bag icon
      const totalPriceIcon = document.getElementById('totalPriceIcon');

      totalPriceIcon.textContent = totalPrice
        ? `£${selectedBooking.totalPrice.toFixed(2)}`
        : '£0';

      // Store the total price in the local storage
      this.addTotalPriceLS(totalPrice);
    });
  }
}

const clearBookingFunction = () => {
  selectedBooking.clearSelectedBookingLS();
  selectedBooking.clearSelectedBooking();
  selectedBooking.updateSelectionDisplay();
};

const clearBooking = () => {
  selectedBooking.clearSelectedBooking();
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
  const numberOfGuestsInput =
    window.innerWidth < 768
      ? document.getElementById('numberOfGuestsMobile')
      : document.getElementById('numberOfGuests');
  const numberOfGuests = numberOfGuestsInput.value;

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

  // Format date
  const formattedDate = formatDate(selectedDate);

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
      alert('Something went wrong. ${error}');
    });
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

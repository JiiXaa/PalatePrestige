document.addEventListener('DOMContentLoaded', () => {
  console.log('booking/index.js loaded');

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
      console.log('important!!!', this.closest('.menu-card').dataset);
      // Get the chef name from the data attributes
      const chefFirstName = this.closest('.menu-card').dataset.chefFirstName;
      const chefLastName = this.closest('.menu-card').dataset.chefLastName;

      console.log('Chef First Name: ', chefFirstName);
      console.log('Chef Last Name: ', chefLastName);
      const chefName = chefFirstName + ' ' + chefLastName;

      console.log('menuId', menuId);
      console.log('chefId', chefId);
      console.log('chefName', chefName);

      // Use the menu ID to set the selected menu in the selectedBooking instance and in local storage
      selectedBooking.setSelectedMenu(menuId);
      selectedBooking.addSelectedMenuLS(menuId);

      // Use the chef ID and name to set the selected chef in the selectedBooking instance and in local storage
      const chef = { id: chefId, name: chefName };
      console.log('Chef object before setting:', chef);
      selectedBooking.setSelectedChef(chef);
      selectedBooking.addSelectedChefLS(JSON.stringify(chef));

      // Update the selection display
      selectedBooking.updateSelectionDisplay();

      // Hide the button
      this.style.display = 'none'; // 'this' refers to the button that was clicked
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

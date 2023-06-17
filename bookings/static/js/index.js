document.addEventListener('DOMContentLoaded', () => {
  console.log('chefs bookings index.js');
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
    this.chef = chef;
  }

  getSelectedChef() {
    return this.chef;
  }

  clearSelectedChef() {
    this.chef = null;
  }

  addSelectedChefLS(chef) {
    localStorage.setItem('selectedChef', chef);
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

    if (this.date) {
      selectedDate.innerHTML = `Date: ${this.date}`;
    } else {
      selectedDate.innerHTML = '';
    }

    if (localStorage.getItem('selectedMenu')) {
      this.menu = localStorage.getItem('selectedMenu');
    } else {
      this.menu = null;
    }

    if (this.menu) {
      selectedMenu.innerHTML = `Menu: ${this.menu}`;
    } else {
      selectedMenu.innerHTML = '';
    }

    if (localStorage.getItem('selectedChef')) {
      this.chef = localStorage.getItem('selectedChef');
    } else {
      this.chef = null;
    }

    if (this.chef) {
      selectedChef.innerHTML = `Chef: ${this.chef}`;
    } else {
      selectedChef.innerHTML = '';
    }
  }
}

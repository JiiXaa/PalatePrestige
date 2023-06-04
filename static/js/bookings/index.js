console.log('chefs bookings index.js');

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

  setSelectedMenu(menu) {
    this.menu = menu;
  }

  setSelectedChef(chef) {
    this.chef = chef;
  }
}

const selectedBooking = new SelectedBooking();

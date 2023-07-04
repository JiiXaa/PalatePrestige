document.addEventListener('DOMContentLoaded', function () {
  console.log('chef_availability.js loaded');
  const calendarEl = document.getElementById('calendar');
  const chefId = calendarEl.getAttribute('data-chef-id');
  const userRole = calendarEl.getAttribute('data-user-role');

  // Check if the selectedBooking instance already exists in the window object
  const selectedBooking = window.selectedBooking || new SelectedBooking();

  // Assign the selectedBooking instance to the window object
  window.selectedBooking = selectedBooking;
  selectedBooking.updateSelectionDisplay();

  if (userRole === 'chef') {
    getChefAvailability(chefId);
  } else if (userRole === 'customer') {
    getChefAvailabilityForBooking(chefId);
  }

  let calendar;
  async function getChefAvailability(chefId) {
    try {
      // Remove past availabilities before retrieving current availability
      await removePastAvailabilities();

      // Fetch the chef's availability
      const response = await fetch(
        `/users/chefs/get_chef_availability/${chefId}/`
      );
      const availability = await response.json();

      const events = availability.map((slot) => {
        return {
          title: slot.title,
          start: slot.start,
          end: slot.end,
          extendedProps: {
            is_available: slot.title === 'Available',
            availability_id: slot.availability_id,
          },
          allDay: false,
        };
      });

      if (calendar) {
        // Update the calendar with the chef's availability
        calendar.removeAllEvents();
        calendar.addEventSource(events);
      } else {
        // Initialize the calendar with the chef's availability
        calendar = initCalendar(events, chefId, true);

        // Add event listener for when a user selects a time slot
        calendar.on('select', function (selectInfo) {
          handleChefSelect(selectInfo, chefId, calendar);
        });

        // Add event listener for when a user clicks on an event (when chef clicks on an availability)
        calendar.on('eventClick', function (info) {
          const e = info.event;
          const availabilityId = e.extendedProps.availability_id;

          // Retrieve the logged-in chef ID from the HTML attribute
          const logged_in_chef_id = calendarEl.getAttribute(
            'data-logged-in-user-id'
          );
          if (
            availabilityId &&
            e.extendedProps.is_available &&
            chefId === logged_in_chef_id && // Check if logged-in chef is the owner of the calendar
            confirm('Are you sure you want to delete this availability?')
          ) {
            deleteChefAvailability(availabilityId, chefId);
          }
        });

        // Event listener for eventDrop (when chef drags an availability to a new time slot)
        calendar.on('eventDrop', function (info) {
          const e = info.event;
          const availabilityId = e.extendedProps.availability_id;
          // Retrieve the logged-in chef ID from the HTML attribute
          const logged_in_chef_id = calendarEl.getAttribute(
            'data-logged-in-user-id'
          );

          if (
            availabilityId &&
            e.extendedProps.is_available &&
            chefId === logged_in_chef_id && // Check if logged-in chef is the owner of the calendar
            confirm('Are you sure you want to update this availability?')
          ) {
            // Update the availability
            updateChefAvailability(availabilityId, chefId, e.start, e.end);
          }
        });

        // Event listener for eventResize (when chef resizes an availability) (not currently used)
        calendar.on('eventResize', function (info) {
          const e = info.event;
          const availabilityId = e.extendedProps.availability_id;

          // Retrieve the logged-in chef ID from the HTML attribute
          const logged_in_chef_id = calendarEl.getAttribute(
            'data-logged-in-user-id'
          );
          if (
            availabilityId &&
            e.extendedProps.is_available &&
            chefId === logged_in_chef_id && // Check if logged-in chef is the owner of the calendar
            confirm('Are you sure you want to update this availability?')
          ) {
            // Update the availability
            updateChefAvailability(availabilityId, chefId, e.start, e.end);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching chef availability:', error);
    }
  }

  // Function to handle past availabilities
  async function removePastAvailabilities() {
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await fetch('/users/chefs/remove_past_availabilities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
    } catch (error) {
      console.error('Error removing past availabilities:', error);
    }
  }

  async function getChefAvailabilityForBooking(chefId) {
    try {
      // Remove past availabilities before retrieving current availability
      await removePastAvailabilities();

      // Fetch the chef's availability for booking
      const response = await fetch(
        `/users/chefs/get_chef_availability/${chefId}/`
      );
      const availability = await response.json();

      const events = availability.map((slot) => {
        return {
          title: slot.title,
          start: slot.start,
          end: slot.end,
          extendedProps: {
            is_available: slot.title === 'Available',
            availability_id: slot.availability_id,
          },
          allDay: false,
        };
      });

      calendar = initCalendar(events, chefId, false);

      // Customer's booking selection
      calendar.on('select', function (selectInfo) {
        handleCustomerSelect(selectInfo, calendar);
      });

      // Customer's booking selection
      calendar.on('eventClick', function (info) {
        const selectedDate = info.event.start;
        const isAvailable = info.event.extendedProps.is_available;

        // Check if the selected date is available
        if (isAvailable || isAvailable === undefined) {
          // selectedBooking is a variable in the booking/static/js/index.js file
          // It is used to store the selected date for the booking in the booking class instance.
          // This is done so that the selected date is stored in the booking class instance in the front end before the booking is created in the back end.
          selectedBooking.setSelectedDate(selectedDate);
          selectedBooking.addSelectedDateLS(selectedDate);
          selectedBooking.updateSelectionDisplay();
        } else {
          alert(
            'The selected date is not available. Please choose a different date..'
          );
        }
      });
    } catch (error) {
      console.error('Error fetching chef availability:', error);
    }
  }

  // Calendar initialization function - called after the chef's availability is retrieved from the server
  function initCalendar(events, chefId, editable) {
    const calendarEl = document.getElementById('calendar');
    const calendarInstance = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      allDaySlot: false,
      editable: editable,
      selectable: true,
      events: events,
      selectAllow: function (selectInfo) {
        // Only allow selecting dates that are equal to or later than today
        if (selectInfo.start < new Date()) {
          return false;
        }

        // Check if the selected slot is available
        const overlappingEvents = calendarInstance
          .getEvents()
          .filter((event) => {
            return selectInfo.start < event.end && selectInfo.end > event.start;
          });

        for (let event of overlappingEvents) {
          if (!event.extendedProps.is_available) {
            // Selected slot is not available
            alert('This slot is already booked.');
            return false;
          }
        }
        // Allow selection if the conditions are met
        return true;
      },
    });

    calendarInstance.render();

    return calendarInstance;
  }

  // Event handler for when a Customer selects a time slot
  function handleCustomerSelect(selectInfo, calendar) {
    const existingEvents = calendar.getEvents();

    if (existingEvents.length > 0) {
      alert('This chef is not available at this time');
      return;
    }
  }

  // Event handler for when a Chef selects a time slot
  function handleChefSelect(selectInfo, chefId, calendar) {
    const existingEvents = calendar.getEvents();

    for (let i = 0; i < existingEvents.length; i++) {
      if (
        selectInfo.start < existingEvents[i].end &&
        selectInfo.end > existingEvents[i].start
      ) {
        // The selected time slot overlaps with an existing event - do not allow the user to select it
        return;
      }
    }

    // Create a new Date object from the start date
    let endDate = new Date(selectInfo.start);
    // Add 4 hours to the start date to get the end date
    endDate.setHours(endDate.getHours() + 4);
    // If selected time slot is available, add it to the calendar
    addChefAvailability(chefId, selectInfo.start, endDate);
  }

  async function addChefAvailability(chefId, start, end) {
    try {
      const csrfToken = getCookie('csrftoken');

      const start_time = start.toISOString();
      const end_time = end.toISOString();

      // Retrieve the logged-in chef ID from the HTML attribute
      const logged_in_chef_id = calendarEl.getAttribute(
        'data-logged-in-user-id'
      );

      // Ensure only the logged-in chef can add availability for their own page
      if (chefId === logged_in_chef_id) {
        const response = await fetch(`/users/chefs/add_chef_availability/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify({
            chef_id: chefId,
            start_time: start_time,
            end_time: end_time,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        // Refresh the calendar to show the new availability
        getChefAvailability(chefId);
      } else {
        console.error('You do not have permission to add availability.');
      }
    } catch (error) {
      console.error('Error adding availability:', error);
    }
  }

  async function deleteChefAvailability(availabilityId, chefId) {
    try {
      const csrfToken = getCookie('csrftoken');

      // Retrieve the logged-in chef ID from the HTML attribute
      const logged_in_chef_id = calendarEl.getAttribute(
        'data-logged-in-user-id'
      );

      // Ensure only the logged-in chef can delete their own availability
      if (chefId === logged_in_chef_id) {
        const response = await fetch(
          `/users/chefs/delete_chef_availability/${availabilityId}/`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        // Refresh the calendar to show the new availability
        getChefAvailability(chefId);
      } else {
        console.error('You do not have permission to delete availability.');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  }

  async function updateChefAvailability(availabilityId, chefId, start, end) {
    try {
      const csrfToken = getCookie('csrftoken');

      const start_time = start.toISOString();
      const end_time = end.toISOString();

      const response = await fetch(
        `/users/chefs/update_chef_availability/${availabilityId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify({
            chef_id: chefId,
            availability_id: availabilityId,
            start_time: start_time,
            end_time: end_time,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Refresh the calendar to show the new availability
      getChefAvailability(chefId);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  }

  // Function to get the CSRF token from the cookie
  // Code snippet found: https://www.stackhawk.com/blog/django-csrf-protection-guide/
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});

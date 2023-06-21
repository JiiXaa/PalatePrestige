document.addEventListener('DOMContentLoaded', function () {
  console.log('chef_availability.js loaded');
  const calendarEl = document.getElementById('calendar');
  const chefId = calendarEl.getAttribute('data-chef-id');
  const userRole = calendarEl.getAttribute('data-user-role');

  console.log('User role:', userRole);
  console.log('Chef ID:', chefId);

  // Check if the selectedBooking instance already exists in the window object
  const selectedBooking = window.aselectedBooking || new SelectedBooking();

  // Assign the selectedBooking instance to the window object
  window.selectedBooking = selectedBooking;
  console.log('selectedBooking', selectedBooking);
  selectedBooking.updateSelectionDisplay();

  if (userRole === 'chef') {
    getChefAvailability(chefId);
  } else if (userRole === 'customer') {
    getChefAvailabilityForBooking(chefId);
  }

  let calendar;
  async function getChefAvailability(chefId) {
    console.log('Getting chef availability...');
    try {
      // Remove past availabilities before retrieving current availability
      await removePastAvailabilities();

      // Fetch the chef's availability
      const response = await fetch(
        `/users/chefs/get_chef_availability/${chefId}/`
      );
      const availability = await response.json();

      console.log('Chef availability:', availability);

      const events = availability.map((slot) => {
        console.log(slot);
        console.log('Availability ID:', slot.availability_id);
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

      console.log('Events:', events);

      if (calendar) {
        console.log('Updating events...');
        // TODO: update events when the chef's availability is updated
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
          console.log('Event click info:', info.event);

          const e = info.event;
          const availabilityId = e.extendedProps.availability_id;

          if (
            availabilityId &&
            e.extendedProps.is_available &&
            confirm('Are you sure you want to delete this availability?')
          ) {
            deleteChefAvailability(availabilityId, chefId);
          }
        });

        // Event listener for eventDrop (when chef drags an availability to a new time slot)
        calendar.on('eventDrop', function (info) {
          const e = info.event;
          const availabilityId = e.extendedProps.availability_id;
          console.log('Event drop info:', info.event);

          if (
            availabilityId &&
            e.extendedProps.is_available &&
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
          console.log('Event resize info:', info.event);

          if (
            availabilityId &&
            e.extendedProps.is_available &&
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
    console.log('Removing past availabilities...');
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

      console.log('Past availabilities removed successfully.');
    } catch (error) {
      console.error('Error removing past availabilities:', error);
    }
  }

  async function getChefAvailabilityForBooking(chefId) {
    console.log('Getting chef availability for booking...');
    try {
      // Remove past availabilities before retrieving current availability
      await removePastAvailabilities();

      // Fetch the chef's availability for booking
      const response = await fetch(
        `/users/chefs/get_chef_availability/${chefId}/`
      );
      const availability = await response.json();

      console.log('Chef availability:', availability);

      const events = availability.map((slot) => {
        console.log(slot);
        console.log('Availability ID:', slot.availability_id);
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
          console.log('Selected date:', selectedBooking);
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
    console.log('init Events:', events);

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
    console.log('Select info:', selectInfo);
    const existingEvents = calendar.getEvents();

    for (let i = 0; i < existingEvents.length; i++) {
      if (
        selectInfo.start < existingEvents[i].end &&
        selectInfo.end > existingEvents[i].start
      ) {
        // The selected time slot overlaps with an existing event - do not allow the user to select it
        console.log('Slot is not available');
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
      console.log('CSRF Token:', csrfToken);
      console.log('Chef ID:', typeof chefId, chefId);

      const start_time = start.toISOString();
      const end_time = end.toISOString();

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
    } catch (error) {
      console.error('Error adding availability:', error);
    }
  }

  async function deleteChefAvailability(availabilityId, chefId) {
    try {
      const csrfToken = getCookie('csrftoken');
      console.log('CSRF Token:', csrfToken);
      console.log('Chef ID:', typeof chefId, chefId);

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
    } catch (error) {
      console.error('Error deleting availability:', error);
    }
  }

  async function updateChefAvailability(availabilityId, chefId, start, end) {
    try {
      const csrfToken = getCookie('csrftoken');
      console.log('CSRF Token:', csrfToken);
      console.log('Chef ID:', typeof chefId, chefId);

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

      console.log('Availability updated');

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

  // Function to store the selected date in a variable
  function storeSelectedDate(selectedDate) {
    console.log('Storing selected date');
    console.log('Selected date:', selectedDate);
  }
});

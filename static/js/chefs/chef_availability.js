console.log('chef_availability.js loaded');

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const chefId = calendarEl.getAttribute('data-chef-id');

  console.log('Chef ID:', chefId);
  // chefId is passed to the Django's template as a data attribute on the calendar element
  getChefAvailability(chefId);
});

let calendar;
async function getChefAvailability(chefId) {
  console.log('Getting chef availability...');
  try {
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
      calendar = initCalendar(events, chefId);
    }
  } catch (error) {
    console.error('Error fetching chef availability:', error);
  }
}

// Calendar initialization function - called after the chef's availability is retrieved from the server
function initCalendar(events, chefId) {
  console.log('init Events:', events);

  const calendarEl = document.getElementById('calendar');
  const calendarInstance = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    allDaySlot: false,
    editable: true,
    selectable: true,
    selectAllow: function (selectInfo) {
      // Only allow selecting dates that are equal to or later than today
      return selectInfo.start >= new Date();
    },
    select: function (info) {
      const existingEvents = calendarInstance.getEvents();
      for (let i = 0; i < existingEvents.length; i++) {
        if (
          info.start < existingEvents[i].end &&
          info.end > existingEvents[i].start
        ) {
          // If selected slot overlaps with an existing event, don't add it
          return;
        }
      }

      // Create a new Date object from the start date
      let endDate = new Date(info.start);
      // Add 4 hours to the end date
      endDate.setHours(endDate.getHours() + 4);
      // The selected slot doesn't overlap with any existing events, so add it
      addChefAvailability(chefId, info.start, endDate);
    },
    events: events,
  });

  calendarInstance.render();

  calendarInstance.on('eventClick', function (info) {
    console.log('Event clicked:', info.event);
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

  return calendarInstance;
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

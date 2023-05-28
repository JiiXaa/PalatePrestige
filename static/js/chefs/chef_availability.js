console.log('chef_availability.js loaded');

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const chefId = calendarEl.getAttribute('data-chef-id');

  console.log('Chef ID:', chefId);
  // chefId is passed to the Django's template as a data attribute on the calendar element
  getChefAvailability(chefId);
});

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
      return {
        title: slot.title,
        start: slot.start,
        end: slot.end,
        extendedProps: {
          is_available: slot.title === 'Available',
        },
      };
    });

    console.log('Events:', events);

    // Initialize the calendar with the chef's availability
    initCalendar(events, chefId);
  } catch (error) {
    console.error('Error fetching chef availability:', error);
  }
}

// Calendar initialization function - called after the chef's availability is retrieved from the server
function initCalendar(events, chefId) {
  console.log('init Events:', events);

  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    select: function (info) {
      // Send the selected date range to the server
      addChefAvailability(chefId, info.start, info.end);
    },
    events: events,
  });

  calendar.render();
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

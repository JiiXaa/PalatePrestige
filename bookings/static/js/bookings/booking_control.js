console.log('booking_control loaded...');

document.addEventListener('DOMContentLoaded', function () {
  const collapseButton = document.querySelector('[data-bs-toggle="collapse"]');
  const collapseContent = document.getElementById('moreBookings');

  if (collapseButton && collapseContent) {
    collapseContent.addEventListener('shown.bs.collapse', function () {
      collapseButton.innerHTML = 'Show Less';
    });

    collapseContent.addEventListener('hidden.bs.collapse', function () {
      collapseButton.innerHTML = 'Show More';
    });
  }
});

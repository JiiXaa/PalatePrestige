console.log('booking_control loaded...');

document.addEventListener('DOMContentLoaded', function () {
  const collapseButton = document.querySelector('[data-bs-toggle="collapse"]');

  document
    .querySelector('[data-bs-toggle="collapse"]')
    .addEventListener('click', function () {
      if (this.getAttribute('aria-expanded') === 'false') {
        this.innerHTML = 'Show Less';
      } else {
        this.innerHTML = 'Show More';
      }
    });
});

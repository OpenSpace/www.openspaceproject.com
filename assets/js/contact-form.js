document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('contact-form');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let errorEl = document.getElementById('cf-error');

    let email = form.querySelector('#cf-email').value.trim();
    let message = form.querySelector('#cf-message').value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.hidden = false;
      return;
    }
    if (!message) {
      errorEl.textContent = 'Please enter a message.';
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    let name = form.querySelector('#cf-name').value.trim();
    let subject = form.querySelector('#cf-subject').value.trim() || 'OpenSpace inquiry';
    let body = (name ? 'From: ' + name + '\n' : '') + 'Email: ' + email + '\n\n' + message;

    window.location.href = 'mailto:support@openspaceproject.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
});

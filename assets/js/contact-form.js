document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('cf-error');

    const email = form.querySelector('#cf-email').value.trim();

    const message = form.querySelector('#cf-message').value.trim();
    if (!message) {
      errorEl.textContent = 'Please enter a message.';
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;

    const name = form.querySelector('#cf-name').value.trim();
    const subject = form.querySelector('#cf-subject').value.trim() ?? 'OpenSpace inquiry';
    const body = (name ? 'From: ' + name + '\n' : '') + 'Email: ' + email + '\n\n' + message;

    window.location.href = 'mailto:support@openspaceproject.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
});

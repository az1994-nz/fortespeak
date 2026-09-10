const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');
const button = form.querySelector('button[type="submit"]');
let sending = false;
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  const data = new FormData(form);
  if (data.get('_honey')) return;
  sending = true;
  button.disabled = true;
  button.textContent = 'Sending…';
  status.textContent = '';
  status.dataset.state = '';
  form.setAttribute('aria-busy', 'true');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(data)),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission failed');
    status.dataset.state = 'success';
    status.textContent = 'Thank you. Your message has been submitted.';
    form.reset();
  } catch (error) {
    status.dataset.state = 'error';
    status.textContent = 'We couldn’t confirm your submission. Your message is still here. Please try again, or email fathifazi96@gmail.com.';
  } finally {
    clearTimeout(timeout);
    sending = false;
    button.disabled = false;
    button.textContent = 'Send message →';
    form.removeAttribute('aria-busy');
  }
});

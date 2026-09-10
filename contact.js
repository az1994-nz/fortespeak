const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');
const button = form.querySelector('button[type="submit"]');
const fallback = document.getElementById('contact-fallback');
let sending = false;
form.addEventListener('submit', async (event) => {
  if (event.submitter === fallback) {
    if (sending || new FormData(form).get('_honey')) {
      event.preventDefault();
      return;
    }
    status.textContent = 'Complete the submission in the FormSubmit tab. Your message remains here until you have confirmed it was sent.';
    return;
  }
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  const data = new FormData(form);
  if (data.get('_honey')) return;
  data.set('_url', 'https://fortespeak.com/');
  sending = true;
  button.disabled = true;
  fallback.hidden = true;
  button.textContent = 'Sending…';
  status.textContent = '';
  status.dataset.state = '';
  form.setAttribute('aria-busy', 'true');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    // Standard form encoding avoids the JSON request's CORS preflight.
    const response = await fetch('https://formsubmit.co/ajax/fathifazi96@gmail.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new URLSearchParams(data),
      signal: controller.signal
    });
    let result;
    try { result = await response.json(); } catch { throw new Error('The message service returned an unexpected response (HTTP ' + response.status + ').'); }
    if (!response.ok || !(result.success === true || result.success === 'true')) {
      const detail = typeof result.message === 'string' ? result.message.slice(0, 300) : '';
      throw new Error(detail || 'The message service could not accept the enquiry (HTTP ' + response.status + ').');
    }
    // Activation responses must not be displayed as delivered enquiries.
    if (/activat|confirm.{0,25}email|verify.{0,25}email/i.test(result.message || '')) {
      throw new Error('This website’s form still needs email verification. Please use “Send through FormSubmit” below.');
    }
    status.dataset.state = 'success';
    status.textContent = 'Thank you. Your message has been submitted.';
    form.reset();
  } catch (error) {
    status.dataset.state = 'error';
    const detail = error.name === 'AbortError'
      ? 'The message service took too long to respond.'
      : error instanceof TypeError
        ? 'The background connection to the message service was blocked or unavailable.'
        : error.message;
    status.textContent = detail + ' Your message is still here. If you have not received confirmation, use “Send through FormSubmit” below to finish in a new tab, or email fathifazi96@gmail.com.';
    fallback.hidden = false;
  } finally {
    clearTimeout(timeout);
    sending = false;
    button.disabled = false;
    button.textContent = 'Send message →';
    form.removeAttribute('aria-busy');
  }
});

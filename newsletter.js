(() => {
  const dialog = document.getElementById('newsletter-dialog');
  const opener = document.getElementById('newsletter-open');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const close = document.getElementById('newsletter-close');
  const form = document.getElementById('newsletter-form');
  const key = 'fortespeak-newsletter-seen';
  let previousFocus;
  let timer;
  const remember = () => {
    try { sessionStorage.setItem(key, '1'); } catch { /* Works without storage. */ }
  };
  const open = () => {
    clearTimeout(timer);
    if (dialog.open) return;
    previousFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('newsletter-open');
    remember();
  };
  opener.hidden = false;
  opener.addEventListener('click', open);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('newsletter-open');
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  });
  form.addEventListener('submit', (event) => {
    if (new FormData(form).get('_honey')) event.preventDefault();
    // Native POST lets FormSubmit handle verification and confirmation.
    // Do not claim success before the service has accepted the signup.
  });
  let seen = false;
  try { seen = sessionStorage.getItem(key) === '1'; } catch { /* Show once per page without storage. */ }
  if (!seen) timer = setTimeout(() => {
    // Avoid interrupting a visitor who has already started an enquiry.
    if (!document.activeElement?.closest('form')) open();
  }, 1500);
})();

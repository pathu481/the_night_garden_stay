document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const OWNER_EMAIL = 'thenightgardenstay@gmail.com';
  const storedMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];

  // Optional: set these globally if you have EmailJS configured
  const EMAILJS_SERVICE = window.NIGHT_EMAILJS_SERVICE || 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE = window.NIGHT_EMAILJS_TEMPLATE || 'YOUR_TEMPLATE_ID';

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.querySelector("input[type='text']").value.trim();
    const email = contactForm.querySelector("input[type='email']").value.trim();
    const message = contactForm.querySelector("textarea").value.trim();

    if (!name || !email || !message) {
      alert('Please fill all fields before sending.');
      return;
    }

    const contactData = { name, email, message, date: new Date().toLocaleString() };
    storedMessages.push(contactData);
    localStorage.setItem('contactMessages', JSON.stringify(storedMessages));

    // Try EmailJS first if configured
    const emailjsAvailable = typeof emailjs !== 'undefined' && emailjs.send;
    let sent = false;
    if (emailjsAvailable && EMAILJS_SERVICE !== 'YOUR_SERVICE_ID' && EMAILJS_TEMPLATE !== 'YOUR_TEMPLATE_ID') {
      try {
        await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, { name, email, message });
        sent = true;
      } catch (err) {
        console.warn('EmailJS send failed', err);
      }
    }

    // If EmailJS not available or failed, fall back to opening mail client (mailto)
    if (!sent) {
      // build mailto link
      const subject = encodeURIComponent('Contact form message from ' + name);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailto = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
      // open mail client in new tab — user can then send the message
      window.open(mailto, '_blank');
    }

    contactForm.reset();
    showThankYou(sent);
  });

  function showThankYou(sent) {
    const msg = document.createElement('p');
    msg.textContent = sent ? 'Message sent — we’ll get back to you shortly 🌿' : 'A compose window opened — please click Send to notify the owner.';
    msg.style.color = 'var(--accent)';
    msg.style.marginTop = '1rem';
    contactForm.appendChild(msg);
    setTimeout(() => msg.remove(), 6000);
  }
});

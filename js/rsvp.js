// ==========================================
// RSVP Form Handler for Google Sheets
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpOk = document.getElementById('rsvp-ok');
  
  // Uses endpoint from config.js (window.WEDDING_CONFIG)
  const scriptUrl = (typeof window.WEDDING_CONFIG !== 'undefined' && window.WEDDING_CONFIG.rsvpEndpoint) 
    ? window.WEDDING_CONFIG.rsvpEndpoint 
    : (typeof CONFIG !== 'undefined' && CONFIG.SCRIPT_URL)
      ? CONFIG.SCRIPT_URL
      : "https://script.google.com/macros/s/AKfycbxx45hB_9DrDD7F_7Ilf4mEBpNK0vvudBS6307I1JRNjoGjLaWzf6a1NR99a71VEtBUQw/exec";

  if (!rsvpForm) return;

  // Remove any browser field restrictions so guests can submit partial responses freely
  rsvpForm.querySelectorAll('input, textarea, select').forEach(el => el.removeAttribute('required'));

  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot anti-spam check
    const hp = rsvpForm.querySelector('input[name="website"]');
    if (hp && hp.value) return;

    const submitBtn = document.getElementById('rsvp-send') || rsvpForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    const getRadioVal = (name) => {
      const checked = rsvpForm.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : '';
    };

    const formData = {
      name: rsvpForm.querySelector('input[name="name"]')?.value || '',
      phone: rsvpForm.querySelector('input[name="phone"]')?.value || '',
      guests: rsvpForm.querySelector('input[name="guests"]')?.value || '',
      hina: getRadioVal('hina') || getRadioVal('ev_hina') || getRadioVal('rasm-e-hina'),
      barat: getRadioVal('barat') || getRadioVal('ev_barat'),
      walima: getRadioVal('walima') || getRadioVal('ev_walima'),
      message: rsvpForm.querySelector('textarea[name="message"]')?.value || ''
    };

    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      rsvpForm.hidden = true;
      if (rsvpOk) rsvpOk.hidden = false;
    })
    .catch(error => {
      console.error('RSVP Submission Error:', error);
      alert('There was an error sending your RSVP. Please try again.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send RSVP";
      }
    });
  });
});

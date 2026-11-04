// ==========================================
// RSVP Form Handler for Google Sheets
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpOk = document.getElementById('rsvp-ok');
  
  // Use Web App URL from config.js or fallback to direct URL
  const scriptUrl = (typeof CONFIG !== 'undefined' && CONFIG.SCRIPT_URL) 
    ? CONFIG.SCRIPT_URL 
    : "https://script.google.com/macros/s/AKfycbyjcIH107Pc0ItAsL7O8Bor0N_36q5aFyzMTj9l5lB7DKkALWj-MJI-UEOCDYO5YFcwrw/exec";

  if (!rsvpForm) return;

  // Remove any browser field restrictions so guests can submit partial responses freely
  rsvpForm.querySelectorAll('input, textarea, select').forEach(el => el.removeAttribute('required'));

  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Honeypot anti-spam check (if hidden honeypot field is filled, abort submit)
    const hp = rsvpForm.querySelector('input[name="website"]');
    if (hp && hp.value) return;

    const submitBtn = document.getElementById('rsvp-send') || rsvpForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    // Safe helper function to get values of event radio buttons
    const getRadioVal = (name) => {
      const checked = rsvpForm.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : '';
    };

    // Gather form payload matching your exact HTML input name attributes
    const formData = {
      name: rsvpForm.querySelector('input[name="name"]')?.value || '',
      phone: rsvpForm.querySelector('input[name="phone"]')?.value || '',
      guests: rsvpForm.querySelector('input[name="guests"]')?.value || '',
      hina: getRadioVal('hina') || getRadioVal('ev_hina') || getRadioVal('rasm-e-hina'),
      barat: getRadioVal('barat') || getRadioVal('ev_barat'),
      walima: getRadioVal('walima') || getRadioVal('ev_walima'),
      message: rsvpForm.querySelector('textarea[name="message"]')?.value || ''
    };

    // Send payload to Google Apps Script Web App
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Prevents CORS errors on Google Apps Script Web Apps
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      // Hide form and display success panel
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

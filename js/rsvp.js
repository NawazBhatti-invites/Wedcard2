const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjcIH107Pc0ItAsL7O8Bor0N_36q5aFyzMTj9l5lB7DKkALWj-MJI-UEOCDYO5YFcwrw/exec";

const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
  // Remove any HTML5 'required' constraints dynamically just in case
  rsvpForm.querySelectorAll('input, textarea, select').forEach(el => {
    el.removeAttribute('required');
  });

  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('rsvp-send') || rsvpForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    // Safely collect whatever fields are filled out (leaves blank if skipped)
    const getVal = (selector) => rsvpForm.querySelector(selector)?.value || '';
    const getRadioVal = (name) => {
      const checked = rsvpForm.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : ''; // Left blank if nothing selected
    };

    const formData = {
      "Guest Name": getVal('[name="name"], [name="guest_name"], #guest-name'),
      "Contact Number": getVal('[name="phone"], [name="contact"], #contact-num'),
      "Total Guests": getVal('[name="guests"], [name="total_guests"], #total-guests'),
      "Rasm-e-Hina": getRadioVal('hina'),
      "Barat": getRadioVal('barat'),
      "Walima": getRadioVal('walima'),
      "Additional Message": getVal('[name="message"], [name="note"], #additional-msg')
    };

    // Send data to Google Sheet without any validation blocks
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(() => {
      const formElement = document.getElementById('rsvp-form');
      const successElement = document.getElementById('rsvp-ok');
      
      if (formElement) formElement.hidden = true;
      if (successElement) successElement.hidden = false;
    })
    .catch(error => {
      console.error('Submission Error:', error);
      alert('There was an error submitting your RSVP. Please try again.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send RSVP";
      }
    });
  });
}

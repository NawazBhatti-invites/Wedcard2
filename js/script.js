// js/script.js - Interactive UI, Animations & Dynamic Form Elements

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. RSVP Modal & Dynamic Event Buttons ---
  const rsvpDlg = document.getElementById('rsvp-dlg');
  const rsvpOpenBtn = document.getElementById('rsvp-open');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpOk = document.getElementById('rsvp-ok');
  const rsvpEventsContainer = document.getElementById('rsvp-events');
  const rsvpAllBtn = document.getElementById('rsvp-all');
  const closeBtns = document.querySelectorAll('[data-close]');

  // Open Dialog Trigger
  if (rsvpOpenBtn && rsvpDlg) {
    rsvpOpenBtn.addEventListener('click', () => {
      if (rsvpForm) rsvpForm.hidden = false;
      if (rsvpOk) rsvpOk.hidden = true;
      if (typeof rsvpDlg.showModal === 'function') {
        rsvpDlg.showModal();
      } else {
        rsvpDlg.setAttribute('open', '');
      }
    });
  }

  // Close Dialog Buttons
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof rsvpDlg.close === 'function') {
        rsvpDlg.close();
      } else {
        rsvpDlg.removeAttribute('open');
      }
    });
  });

  // Dynamically generate styled event selection options for Rasm-e-Hina, Barat, Walima in Poppins font
  const eventsData = [
    { id: 'hina', name: 'hina', label: 'Rasm-e-Hina', date: 'Fri, 20 Nov 2026' },
    { id: 'barat', name: 'barat', label: 'Barat', date: 'Sat, 21 Nov 2026' },
    { id: 'walima', name: 'walima', label: 'Walima', date: 'Sun, 22 Nov 2026' }
  ];

  if (rsvpEventsContainer && rsvpEventsContainer.children.length === 0) {
    eventsData.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'evr pp';
      card.innerHTML = `
        <b>${ev.label}</b>
        <small>${ev.date}</small>
        <div class="seg">
          <label>
            <input type="radio" name="${ev.name}" value="Attending">
            <span>Attending</span>
          </label>
          <label>
            <input type="radio" name="${ev.name}" value="Not Attending">
            <span>Not Attending</span>
          </label>
        </div>
      `;
      rsvpEventsContainer.appendChild(card);
    });
  }

  // "Select all occasions" button functionality
  if (rsvpAllBtn) {
    rsvpAllBtn.addEventListener('click', () => {
      eventsData.forEach(ev => {
        const attendingRadio = rsvpForm.querySelector(`input[name="${ev.name}"][value="Attending"]`);
        if (attendingRadio) attendingRadio.checked = true;
      });
    });
  }

  // --- 2. Cover / Door Unfolding Animation ---
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('open');
  const stage = document.getElementById('stage');
  const bgm = document.getElementById('bgm');

  if (cover && openBtn) {
    const handleOpen = () => {
      stage.classList.add('opening');
      setTimeout(() => stage.classList.add('swing'), 400);
      setTimeout(() => {
        cover.classList.add('fade');
        document.body.classList.add('open');
        if (bgm) bgm.play().catch(() => {});
      }, 1600);
    };

    openBtn.addEventListener('click', handleOpen);
    cover.addEventListener('click', (e) => {
      if (e.target === cover || e.target.closest('#open')) handleOpen();
    });
  }

  // --- 3. Locations Tab & Map Switcher ---
  const tabs = document.querySelectorAll('#tabs button');
  const mapIframe = document.getElementById('map');
  const venueName = document.getElementById('vn');
  const venueAddr = document.getElementById('va');
  const goLink = document.getElementById('go');

  const locations = [
    {
      name: "Al Fateh Marriage Hall",
      addr: ", Nankana Sahib",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.8!2d73.7!3d31.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDI0JzAwLjAiTiA3M8KwNDInMDAuMCJF!5e0!3m2!1sen!2spk!4v1",
      link: "https://maps.app.goo.gl/5ijWi6JC4totpVFn6"
    },
    {
      name: "Bhatti House (Ashfaq Bhatti)",
      addr: ", Nankana Sahib",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.8!2d73.7!3d31.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDI0JzAwLjAiTiA3M8KwNDInMDAuMCJF!5e0!3m2!1sen!2spk!4v1",
      link: "https://maps.app.goo.gl/Tcw7osaGgmZAr4Xz7"
    },
    {
      name: "Royal Marquee",
      addr: ", Mangtanwala Road, Nankana Sahib",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.8!2d73.7!3d31.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDI0JzAwLjAiTiA3M8KwNDInMDAuMCJF!5e0!3m2!1sen!2spk!4v1",
      link: "https://maps.app.goo.gl/woCR9DiXwZaR56259"
    }
  ];

  function setLocation(idx) {
    const loc = locations[idx];
    if (!loc) return;
    if (venueName) venueName.textContent = loc.name;
    if (venueAddr) venueAddr.textContent = loc.addr;
    if (mapIframe) mapIframe.src = loc.map;
    if (goLink) goLink.href = loc.link;
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      setLocation(idx);
    });
  });

  setLocation(0);

  const toTopBtn = document.getElementById('to-top');
  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      const invContainer = document.querySelector('.sc.on') || document.querySelector('#inv');
      if (invContainer) {
        invContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

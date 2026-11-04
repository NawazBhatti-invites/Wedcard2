// js/script.js - Interactive UI, Scroll Observer, Countdowns & RSVP Modal

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Cover / Door Unfolding Animation & Opening ---
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('open');
  const stage = document.getElementById('stage');
  const bgm = document.getElementById('bgm');
  const sections = document.querySelectorAll('.sc');
  const inv = document.getElementById('inv');
  const progress = document.getElementById('progress');

  const n = sections.length;
  if (inv) inv.style.setProperty('--n', n);

  if (cover && openBtn) {
    const handleOpen = () => {
      stage.classList.add('opening');
      setTimeout(() => stage.classList.add('swing'), 400);
      setTimeout(() => {
        cover.classList.add('fade');
        // Completely remove cover from layout so touch/scroll is 100% unblocked on mobile
        setTimeout(() => { cover.style.display = 'none'; }, 1000);

        document.body.classList.add('open');
        if (sections[0]) sections[0].classList.add('on'); // Activate first section
        
        if (bgm) {
          bgm.volume = (window.WEDDING_CONFIG?.music?.volume || 60) / 100;
          bgm.play().catch(() => {});
          const musicControl = document.getElementById('music');
          if (musicControl) musicControl.hidden = false;
        }
      }, 1600);
    };

    openBtn.addEventListener('click', handleOpen);
    cover.addEventListener('click', (e) => {
      if (e.target === cover || e.target.closest('#open')) handleOpen();
    });
  }

  // --- 2. Scroll Observer & Progress Bar ---
  window.addEventListener('scroll', () => {
    if (!document.body.classList.contains('open') || !inv) return;
    const rect = inv.getBoundingClientRect();
    const totalH = inv.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    let p = Math.max(0, Math.min(1, scrolled / totalH));
    
    if (progress) progress.style.transform = `scaleX(${p})`;

    const index = Math.min(n - 1, Math.max(0, Math.floor((p + 0.05) * n)));
    sections.forEach((sec, idx) => {
      if (idx === index) {
        sec.classList.add('on');
        const bgType = sec.getAttribute('data-bg');
        const pin = sec.closest('.pin');
        if (pin && bgType) pin.setAttribute('data-bg', bgType);
      } else {
        sec.classList.remove('on');
      }
    });
  });

  // --- 3. Countdown Timers ---
  const eventDates = {
    hina: new Date('2026-11-20T18:00:00').getTime(),
    barat: new Date('2026-11-21T08:00:00').getTime(),
    walima: new Date('2026-11-22T14:00:00').getTime()
  };

  function updateCountdowns() {
    const now = new Date().getTime();
    Object.keys(eventDates).forEach(key => {
      const target = eventDates[key];
      const diff = target - now;
      const cdEl = document.querySelector(`[data-cd="${key}"]`);
      if (!cdEl) return;

      if (diff <= 0) {
        cdEl.innerHTML = "<div><b>00</b><span>Event Started</span></div>";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      cdEl.innerHTML = `
        <div><b>${days}</b><span>Days</span></div>
        <div><b>${hours}</b><span>Hours</span></div>
        <div><b>${mins}</b><span>Mins</span></div>
        <div><b>${secs}</b><span>Secs</span></div>
      `;
    });
  }
  setInterval(updateCountdowns, 1000);
  updateCountdowns();

  // --- 4. RSVP Modal & Dynamic Event Buttons ---
  const rsvpDlg = document.getElementById('rsvp-dlg');
  const rsvpOpenBtn = document.getElementById('rsvp-open');
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpOk = document.getElementById('rsvp-ok');
  const rsvpEventsContainer = document.getElementById('rsvp-events');
  const rsvpAllBtn = document.getElementById('rsvp-all');
  const closeBtns = document.querySelectorAll('[data-close]');

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

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof rsvpDlg.close === 'function') {
        rsvpDlg.close();
      } else {
        rsvpDlg.removeAttribute('open');
      }
    });
  });

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

  if (rsvpAllBtn) {
    rsvpAllBtn.addEventListener('click', () => {
      eventsData.forEach(ev => {
        const attendingRadio = rsvpForm.querySelector(`input[name="${ev.name}"][value="Attending"]`);
        if (attendingRadio) attendingRadio.checked = true;
      });
    });
  }

  // --- 5. Locations Tab & Map Switcher ---
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

  // --- 6. Scroll to Top Button ---
  const toTopBtn = document.getElementById('to-top');
  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

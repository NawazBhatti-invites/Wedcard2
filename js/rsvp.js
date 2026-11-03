/* RSVP: three occasion buttons and one simple form. Anything the guest fills in is enough; it is sent to the Google Apps Script web app (backend/README.md). */
(function () {
  'use strict';
  var EV = [
    { k: 'hina', n: 'Rasm-e-Hina', b: 'Rasm-e-Hina', w: '20 November 2026, 6:00 PM' },
    { k: 'barat', n: 'Barat', b: 'Barat', w: '21 November 2026, 8:00 AM and 10:00 AM' },
    { k: 'walima', n: 'Walima', b: 'Walima', w: '22 November 2026, 2:00 PM' }
  ];
  var $ = function (s) { return document.querySelector(s); };
  var dlg = $('#rsvp-dlg'), form = $('#rsvp-form'), ok = $('#rsvp-ok'), err = $('#rsvp-err'), send = $('#rsvp-send'),
      box = $('#rsvp-events'), btns = $('#rsvp-buttons'), busy = false, requestId = '';

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
  function newId() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }

  EV.forEach(function (ev) {
    var b = el('button', 'btn'); b.type = 'button';
    b.appendChild(el('span', '', 'I’m Coming to ' + ev.b)); b.appendChild(el('small', '', ev.w));
    b.addEventListener('click', function () { openForm(ev.k); }); btns.appendChild(b);

    var row = el('div', 'evr'), seg = el('div', 'seg');
    row.appendChild(el('b', '', ev.n)); row.appendChild(el('small', '', ev.w));
    ['Attending', 'Not Attending'].forEach(function (v) {
      var l = el('label'), i = el('input'); i.type = 'radio'; i.name = 'ev_' + ev.k; i.value = v;     /* nothing is pre-selected */
      l.appendChild(i); l.appendChild(el('span', '', v)); seg.appendChild(l);
    });
    row.appendChild(seg); box.appendChild(row);
  });

  function setEv(k, v) { var i = form.querySelector('input[name="ev_' + k + '"][value="' + v + '"]'); if (i) i.checked = true; }
  function showErr(m) { err.textContent = m; err.hidden = false; err.scrollIntoView({ block: 'nearest' }); }

  function openForm(pre) {
    if (!busy) { form.reset(); err.hidden = true; ok.hidden = true; form.hidden = false; requestId = newId(); }
    if (pre) setEv(pre, 'Attending');
    if (dlg.showModal) { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
  }
  $('#rsvp-open').addEventListener('click', function () { openForm(); });
  $('#rsvp-all').addEventListener('click', function () { EV.forEach(function (e) { setEv(e.k, 'Attending'); }); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.hasAttribute('data-close')) { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); } });

  function collect() {
    var f = form.elements, ev = {};
    EV.forEach(function (e) { ev[e.k] = (form.querySelector('input[name="ev_' + e.k + '"]:checked') || {}).value || ''; });
    return { requestId: requestId, name: f.name.value.trim(), phone: f.phone.value.trim(), guests: f.guests.value.trim(),
             events: ev, message: f.message.value.trim(), website: f.website.value };
  }
  function empty(v) { return !(v.name || v.phone || v.guests || v.message || EV.some(function (e) { return v.events[e.k]; })); }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); if (busy) return;                       /* blocks repeated clicks */
    var v = collect(); if (empty(v)) { showErr('Please fill in at least one thing before sending.'); return; }
    var url = (window.WEDDING_CONFIG || {}).rsvpEndpoint;
    if (!url) { showErr('The RSVP service is not connected yet, so nothing was saved. Please call the family on the numbers shown on the invitation.'); return; }
    err.hidden = true; busy = true; send.disabled = true; send.textContent = 'Sending…';
    var ctrl = new AbortController(), to = setTimeout(function () { ctrl.abort(); }, 25000);
    /* text/plain keeps this a "simple" request, which Google Apps Script web apps accept from other websites */
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(v), signal: ctrl.signal })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || d.ok !== true) throw new Error('save failed');
        form.hidden = true; ok.hidden = false; requestId = newId();   /* success is shown only after the sheet confirms the row */
      })
      .catch(function () { showErr('We could not save your RSVP. Please check your connection and try again.'); })
      .then(function () { clearTimeout(to); busy = false; send.disabled = false; send.textContent = 'Send RSVP'; });
  });
})();

/* Wedding invitation: card opening, pinned fading scenes, countdowns, venue tabs and music. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CFG = window.WEDDING_CONFIG || {}, M = CFG.music || { source: 'file' };
  var body = document.body, cover = $('#cover'), cstage = $('#stage'), audio = $('#bgm'), music = $('#music'),
      progress = $('#progress'), inv = $('#inv'), stage = $('.pin', inv), scenes = $$('.sc'), N = scenes.length, opened = false, cur = -1, vh = innerHeight;

  /* Bismillah / In Shaa Allah pictures: keep the picture if present, otherwise show readable text */
  $$('img.ref').forEach(function (img) {
    function fallback() {
      var txt = img.getAttribute('data-fb') || '', ar = /[\u0600-\u06FF]/.test(txt), s = document.createElement('p');
      s.className = (ar ? 'fb' : 't gold') + (img.classList.contains('rv') ? ' rv' : '');
      if (ar) s.lang = 'ar'; else s.style.fontSize = '2em';
      s.textContent = txt; img.replaceWith(s);
    }
    if (img.complete && img.naturalWidth === 0) fallback(); else img.addEventListener('error', fallback);
  });

  /* ---------- Music: assets/audio/wedding-music.mp3 (starts only after the visitor taps Open) ---------- */
  var playBtn = $('#m-play'), muteBtn = $('#m-mute'), startAt = M.startSeconds || 0;
  audio.volume = (M.volume || 45) / 100;
  function ui() {
    var on = !audio.paused;
    music.classList.toggle('playing', on); music.classList.toggle('muted', audio.muted);
    playBtn.setAttribute('aria-pressed', on); playBtn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    muteBtn.setAttribute('aria-pressed', audio.muted); muteBtn.setAttribute('aria-label', audio.muted ? 'Unmute music' : 'Mute music');
  }
  ['play', 'pause', 'volumechange'].forEach(function (e) { audio.addEventListener(e, ui); });
  audio.addEventListener('error', function () { music.hidden = true; console.warn('assets/audio/wedding-music.mp3 is missing or unreadable.'); });
  function playAudio() { var p = audio.play(); if (p && p.catch) p.catch(ui); }     /* if blocked, the visitor can press play */
  function seekStart() {
    if (!(startAt > 0)) return;
    if (audio.readyState >= 1) audio.currentTime = startAt; else audio.addEventListener('loadedmetadata', function () { audio.currentTime = startAt; }, { once: true });
  }
  audio.addEventListener('ended', function () { audio.currentTime = startAt; playAudio(); });   /* loop */
  function startMusic() { music.hidden = false; seekStart(); playAudio(); ui(); }
  playBtn.addEventListener('click', function () { if (audio.paused) playAudio(); else audio.pause(); });
  muteBtn.addEventListener('click', function () { audio.muted = !audio.muted; ui(); });

  /* ---------- Card opening ---------- */
  function openInvite() {
    if (opened) return; opened = true; startMusic();
    function finish() {
      body.classList.add('open'); window.scrollTo(0, 0); initScenes();
      cover.classList.add('fade'); setTimeout(function () { cover.remove(); }, 1200);
    }
    if (reduce) { finish(); return; }
    var r = cstage.getBoundingClientRect();
    var z = Math.max(innerWidth / (r.width * 0.8842), innerHeight / (r.height * 0.8144));
    cstage.style.setProperty('--z', Math.max(1, z).toFixed(3));
    cover.classList.add('opening');
    setTimeout(function () { cover.classList.add('swing'); }, 450);   /* seal lifts, covers swing open */
    setTimeout(function () { cover.classList.add('zoom'); }, 1800);   /* camera moves into the card */
    setTimeout(finish, 3300);
  }
  cover.addEventListener('click', openInvite);
  cover.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvite(); } });

  /* ---------- Pinned scenes: scrolling changes the scene, never moves the picture ---------- */
  var mapLoaded = false;
  function size() { vh = innerHeight; document.documentElement.style.setProperty('--vh', vh + 'px'); }
  function show(i) {
    if (i === cur) return; cur = i;
    scenes.forEach(function (s, k) { s.classList.toggle('on', k === i); });
    stage.setAttribute('data-bg', scenes[i].getAttribute('data-bg'));        /* background cross-fades between pictures */
    if (scenes[i].id === 's-loc') { mapLoaded = true; venue(); }
  }
  function update() {
    var max = Math.max(1, document.documentElement.scrollHeight - vh);
    progress.style.transform = 'scaleX(' + Math.min(1, scrollY / max) + ')';
    show(Math.max(0, Math.min(N - 1, Math.floor((scrollY + vh * 0.5) / vh))));
  }
  var ticking = false;
  function initScenes() {
    scenes.forEach(function (s) { $$('.rv', s).forEach(function (el, i) { el.style.setProperty('--i', i); }); });
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); } }, { passive: true });
    window.addEventListener('resize', function () { size(); update(); }); size(); update();
  }
  size();
  $('#to-top').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* ---------- Venue tabs (Locations scene): Barat has two locations, departure then destination ---------- */
  var V = [
    { n: 'Al Fateh Marriage Hall', a: 'Rasm-e-Hina, Nankana Sahib', ll: '31.4431226,73.6923472', u: 'https://maps.app.goo.gl/5ijWi6JC4totpVFn6' },
    { n: 'Bhatti House (Ashfaq Bhatti)', a: 'Barat departure, Nankana Sahib', ll: '31.444889,73.694099', u: 'https://maps.app.goo.gl/Tcw7osaGgmZAr4Xz7' },
    { n: 'The Memories Event Complex', a: 'Barat destination', ll: '32.3432453,74.1387265', u: 'https://maps.app.goo.gl/rvsPbUDmELrQDdwb8' },
    { n: 'Royal Marquee', a: 'Walima, Mangtanwala Road, Nankana Sahib', ll: '31.4145685,73.7529125', u: 'https://maps.app.goo.gl/woCR9DiXwZaR56259' }
  ], GROUPS = [[0], [1, 2], [3]], tabs = $$('#tabs button'), subs = $$('#subtabs button'), subBox = $('#subtabs'), grp = 0, sub = 0;

  function venue() {
    var i = GROUPS[grp][sub] != null ? GROUPS[grp][sub] : GROUPS[grp][0];
    
    // Highlight active main tab
    tabs.forEach(function (t, k) { t.classList.toggle('on', k === grp); });
    
    // Show subtabs ONLY when Barat (grp === 1) is selected; hide for Rasm-e-Hina (0) and Walima (2)
    if (grp === 1) {
      subBox.removeAttribute('hidden');
      subBox.style.cssText = 'display: flex !important;';
    } else {
      subBox.setAttribute('hidden', 'true');
      subBox.style.cssText = 'display: none !important;';
    }

    // Highlight active subtab (Departure vs Destination)
    subs.forEach(function (t, k) { t.classList.toggle('on', k === sub); });
    
    // Update venue info text, directions link, and embedded map
    if ($('#vn')) $('#vn').textContent = V[i].n;
    if ($('#va')) $('#va').textContent = ' | ' + V[i].a;
    if ($('#go')) $('#go').href = V[i].u;
    if ($('#map')) $('#map').src = 'https://maps.google.com/maps?q=' + V[i].ll + '&z=16&output=embed';
  }

  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () {
      grp = k;
      sub = 0; // Default to Departure on main tab switch
      venue();
    });
  });

  subs.forEach(function (t, k) {
    t.addEventListener('click', function () {
      sub = k; // Switch between Departure and Destination
      venue();
    });
  });

  venue();

  /* ---------- Countdowns: each function counts down to its own start (Pakistan time, +05:00) ---------- */
  var T = {
    hina: Date.parse('2026-11-20T18:00:00+05:00'),
    barat: Date.parse('2026-11-21T08:00:00+05:00'),    /* Sehra Bandi */
    walima: Date.parse('2026-11-22T14:00:00+05:00')
  };
  function p2(x) { return String(x).padStart(2, '0'); }
  function tick() {
    var now = Date.now();
    $$('[data-cd]').forEach(function (el) {
      var ms = T[el.getAttribute('data-cd')] - now;
      if (ms <= 0) { el.textContent = 'It is time to celebrate!'; return; }
      var t = Math.floor(ms / 1000);
      el.innerHTML = '<div><b>' + Math.floor(t / 86400) + '</b><span>days</span></div><div><b>' + p2(Math.floor(t % 86400 / 3600)) +
        '</b><span>hours</span></div><div><b>' + p2(Math.floor(t % 3600 / 60)) + '</b><span>min</span></div><div><b>' + p2(t % 60) + '</b><span>sec</span></div>';
    });
  }
  tick(); setInterval(tick, 1000);
})();

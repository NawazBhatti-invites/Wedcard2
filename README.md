# Mohammad Nawaz Bhatti – Wedding Invitation

A mobile-first digital invitation: a closed ivory card with a wax seal that opens when tapped, then pages that fade in and out over fixed floral pictures (invitation, save the date, Rasm-e-Hina, Barat, Walima with a countdown on each, invitation wording, venue maps and contact numbers, RSVP). RSVPs are saved to a Google Sheet.

```
index.html
css/style.css            styles, engraved typography, card-opening animation
js/config.js             public settings: RSVP address and music volume
js/script.js             card opening, fading pages, countdowns, venue tabs, music
js/rsvp.js               RSVP buttons and form
assets/images/           card, doors, seal, floral pictures, In Shaa Allah
assets/fonts/            all fonts (see assets/fonts/README.md)
assets/audio/wedding-music.mp3
backend/                 Google Apps Script + setup steps (backend/README.md)
```

## Go live

1. Push this folder to a public GitHub repository (`main` branch).
2. **Settings → Pages → Deploy from a branch → `main` / root → Save.**
3. Your link: `https://<username>.github.io/<repository>/`.
4. Connect the RSVP sheet: follow `backend/README.md`, then paste the web app URL into `js/config.js`. Until then the form tells guests nothing was saved; it never pretends to succeed.

Test locally with `python3 -m http.server 8000` and open http://localhost:8000.

## How the pages behave

The floral pictures stay fixed. Scrolling only changes which page is showing: words and countdowns fade out and the next ones fade in on the same picture. The picture cross-fades to the couple for Walima, then back for the invitation wording, locations and RSVP pages. Nothing slides.

## Music

`assets/audio/wedding-music.mp3` is the song you supplied, trimmed to begin at the 17th second, with a short fade-in (128 kbps, about 5.6 MB). It starts only after a guest taps **Open Invitation**, loops, and can be paused or muted with the round buttons at the bottom right. It is a commercial recording, so make sure you are allowed to publish it. If you replace it with a full-length file, set `startSeconds: 17` in `js/config.js`.

## Edit the details

Names, dates, venues and phone numbers are in `index.html`. Countdown times are in `js/script.js` (object `T`, Pakistan time `+05:00`). Occasions for the RSVP are at the top of `js/rsvp.js`.

## What has and has not been tested

- The Apps Script logic passes an offline test (one field is enough, double sends are saved once, empty forms are refused).
- **Not yet tested:** the pages in real phone browsers, and the live link to your Google Sheet. Do the test in `backend/README.md` step 8 before sharing.

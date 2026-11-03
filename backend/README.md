# RSVP backend: website → Google Apps Script → your Google Sheet

```
Website form  →  Apps Script web app (backend/apps-script/Code.gs)  →  a new row in your Google Sheet
```

Your sheet already has these columns, and the script fills them in this order:
`A Submission ID | B Submission Date | C Guest Name | D Contact Number | E Total Guests | F Rasm-e-Hina | G Barat | H Walima | I Additional Message`

**Kept simple on purpose:** nothing is required. If a guest fills in just one thing (even only a name, a phone number or one occasion), the row is still saved and the other cells stay blank. Only a completely empty form is refused.

## Set it up (about 5 minutes)

1. Open the Google Sheet that has the nine headings in row 1.
2. Click **Extensions → Apps Script**. Delete the sample code, paste everything from `apps-script/Code.gs`, and click **Save**.
3. Click **Deploy → New deployment**. Click the gear icon and choose **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, then **Authorize access**. Pick your Google account. Because it is your own script, Google shows "Google hasn't verified this app": click **Advanced → Go to (project name) (unsafe) → Allow**.
5. Copy the **Web app URL** (it ends in `/exec`).
6. Check it: open that URL in your browser. You should see `{"ok":true,"status":"RSVP endpoint is running"}`.
7. In the website files, open `js/config.js` and paste the URL between the quotes after `rsvpEndpoint:`, then commit the change on GitHub.
8. Test on the live site: tap **Confirm Your Attendance**, type only a name, and send. A new row should appear in your sheet with the Pakistan time in column B. Delete your test rows afterwards.

If you edit `Code.gs` later: **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The URL stays the same.

## How guests' answers look in the sheet

- Column B is Pakistan time (`2026-11-20 18:30:00`).
- Columns F to H hold `Attending`, `Not Attending`, or stay blank if the guest did not answer.
- Phone numbers keep their leading 0.
- The same RSVP sent twice (for example a double tap) is saved once.

## Counting attendees

Put these in any empty cell:

- People who said they are coming to the Walima: `=COUNTIF(H:H,"Attending")`
- Total headcount for the Walima: `=SUMIF(H:H,"Attending",E:E)` (uses the Total Guests column; a guest who left it blank counts as 0)
- Use the filter icon on row 1 to show only one occasion.

## Things to know

- The web app link is not secret. Anyone who has it could send a row, which is acceptable for an invitation shared with known people. If you ever see junk rows, create a fresh deployment (new URL) and update `js/config.js`.
- A hidden field catches simple bots, and the script ignores anything beyond sensible lengths.
- If the guest sees "could not save" but rows appear, or never sees a thank-you, check step 3: **Who has access** must be **Anyone**.
- `apps-script/Code.test.js` checks the script's logic offline with a pretend Google environment (`node backend/apps-script/Code.test.js`). It has passed, but nothing has yet been tested against your real sheet, so do step 8 before you share the invitation.

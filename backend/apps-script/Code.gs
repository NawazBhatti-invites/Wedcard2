/**
 * Wedding RSVP -> Google Sheet.
 * Paste this into the spreadsheet's own script (Extensions > Apps Script), then Deploy > New deployment > Web app.
 * Columns A..I (row 1 already holds the headings):
 * Submission ID | Submission Date | Guest Name | Contact Number | Total Guests | Rasm-e-Hina | Barat | Walima | Additional Message
 */
var SHEET_NAME = 'RSVP';   // used if a sheet with this name exists, otherwise the first sheet is used

function doGet() { return json_({ ok: true, status: 'RSVP endpoint is running' }); }   // open the web app URL in a browser to check it

function doPost(e) {
  var lock = LockService.getScriptLock(), locked = false;
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (d.website) return json_({ ok: true });                       // hidden honeypot field: only bots fill it
    var row = buildRow_(d);
    if (!row) return json_({ ok: false, error: 'Nothing to save.' });
    lock.waitLock(15000); locked = true;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    if (sh.createTextFinder(row[0]).matchEntireCell(true).findNext()) return json_({ ok: true, duplicate: true });   // same RSVP sent twice
    var r = sh.getLastRow() + 1;
    sh.getRange(r, 1, 1, 2).setNumberFormat('@');                    // keep ID and date as text
    sh.getRange(r, 4).setNumberFormat('@');                          // keep the leading 0 of phone numbers
    sh.getRange(r, 1, 1, row.length).setValues([row]);
    SpreadsheetApp.flush();
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Could not save.' });
  } finally {
    if (locked) lock.releaseLock();
  }
}

// Anything at all is enough to be saved; blank answers stay blank.
function buildRow_(d) {
  var name = clean_(d.name, 80), phone = clean_(d.phone, 25), msg = clean_(d.message, 500);
  var g = parseInt(d.guests, 10); g = (g >= 1 && g <= 50) ? g : '';
  var ev = d.events || {}, hina = ans_(ev.hina), barat = ans_(ev.barat), walima = ans_(ev.walima);
  if (!(name || phone || msg || g !== '' || hina || barat || walima)) return null;
  var id = /^[A-Za-z0-9-]{8,64}$/.test(String(d.requestId || '')) ? String(d.requestId) : Utilities.getUuid();
  return [id, Utilities.formatDate(new Date(), 'Asia/Karachi', 'yyyy-MM-dd HH:mm:ss'), safe_(name), phone, g, hina, barat, walima, safe_(msg)];
}
function ans_(v) { return v === 'Attending' || v === 'Not Attending' ? v : ''; }
function clean_(v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
function safe_(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }   // stops text from being read as a spreadsheet formula
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

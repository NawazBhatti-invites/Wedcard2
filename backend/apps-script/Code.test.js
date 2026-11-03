// Offline check of Code.gs with a fake Google environment:  node backend/apps-script/Code.test.js
const vm = require('vm'), fs = require('fs'), assert = require('assert');
const rows = [];
const sheet = { getLastRow: () => rows.length + 1,
  createTextFinder: (t) => ({ matchEntireCell: () => ({ findNext: () => rows.some((r) => r[0] === t) }) }),
  getRange: () => ({ setNumberFormat() {}, setValues: (v) => rows.push(v[0]) }) };
const ctx = { console, JSON, Intl, Date, String, parseInt, RegExp,
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (s) => ({ s, setMimeType() { return this; } }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => null, getSheets: () => [sheet] }), flush() {} },
  Utilities: { getUuid: () => 'uuid-generated-1', formatDate: (d, tz) => new Intl.DateTimeFormat('sv-SE', { timeZone: tz, dateStyle: 'short', timeStyle: 'medium' }).format(d) } };
vm.createContext(ctx); vm.runInContext(fs.readFileSync(__dirname + '/Code.gs', 'utf8'), ctx);
const post = (o) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(o) } }).s);
assert.deepStrictEqual(post({ requestId: 'abc-12345678', name: 'Ali' }), { ok: true });            // one field is enough
assert.strictEqual(rows[0][2], 'Ali'); assert.strictEqual(rows[0][5], '');                             // unanswered occasions stay blank
assert.deepStrictEqual(post({ requestId: 'abc-12345678', name: 'Ali' }), { ok: true, duplicate: true }); assert.strictEqual(rows.length, 1);
assert.deepStrictEqual(post({ requestId: 'def-12345678', phone: '03001234567' }), { ok: true });        // phone only
assert.deepStrictEqual(post({ requestId: 'ghi-12345678', events: { walima: 'Attending' }, message: '=1+1' }), { ok: true });
assert.strictEqual(rows[2][7], 'Attending'); assert.strictEqual(rows[2][8], "'=1+1");
assert.strictEqual(post({ requestId: 'jkl-12345678' }).ok, false);                                      // completely empty
assert.deepStrictEqual(post({ website: 'spam', name: 'Bot' }), { ok: true }); assert.strictEqual(rows.length, 3);   // honeypot saves nothing
assert.match(rows[0][1], /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
console.log('Code.gs checks passed (' + rows.length + ' rows saved)');

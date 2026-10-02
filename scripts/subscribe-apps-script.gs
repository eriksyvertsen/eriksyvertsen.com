// Bound to the "eriksyvertsen.com subscribers" Google Sheet (Extensions > Apps Script).
// Deploy as Web app: Execute as Me, Access Anyone. Set SECRET to match SUBSCRIBE_WEBHOOK_SECRET in Vercel.
var SECRET = "REPLACE_ME";

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return out({ ok: false, error: "bad_json" });
  }
  if (data.secret !== SECRET) return out({ ok: false, error: "unauthorized" });

  var email = String(data.email || "").trim().toLowerCase();
  if (!email) return out({ ok: false, error: "no_email" });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var last = sheet.getLastRow();
    if (last > 1) {
      var emails = sheet.getRange(2, 1, last - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).toLowerCase() === email) return out({ ok: true, exists: true });
      }
    }
    sheet.appendRow([email, String(data.createdAt || new Date().toISOString()), String(data.source || "")]);
    return out({ ok: true, exists: false });
  } finally {
    lock.releaseLock();
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

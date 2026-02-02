// --- Google Apps Script (Backend) ---
// อัปเดต ID Sheet ใหม่เรียบร้อยครับ
const SHEET_ID = '1bW88Oj_ziPSwonRxtIvA8F2dq1aNwhu7sNK4DVJsLH8';

function doGet(e) {
  const op = e.parameter.op;
  // ฟังก์ชันดึงรายชื่อและข้อมูลใบหน้าส่งให้หน้าเว็บ
  if (op === 'getUsers') {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Users');
    // เช็คว่ามีข้อมูลหรือไม่
    if (sheet.getLastRow() <= 1) return responseJSON([]);
    
    const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
    const users = [];
    data.forEach(row => {
      // ตรวจสอบว่ามีชื่อและรหัสใบหน้าครบถ้วน
      if (row[1] && row[2]) {
        users.push({ label: row[1], descriptor: JSON.parse(row[2]) });
      }
    });
    return responseJSON(users);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // กรณี: ลงทะเบียนใบหน้าใหม่
    if (data.action === 'register') {
      const sheet = ss.getSheetByName('Users');
      sheet.appendRow([data.type, data.name, JSON.stringify(data.descriptor), new Date()]);
      return responseJSON({ success: true, msg: "ลงทะเบียนเรียบร้อย" });
    }
    
    // กรณี: บันทึกผลสอบวัดแววอาชีพ
    else if (data.action === 'save_career') {
      const sheet = ss.getSheetByName('CareerLog');
      sheet.appendRow([data.name, data.score, data.written, data.aiResult, new Date()]);
      return responseJSON({ success: true, msg: "บันทึกผลอาชีพเรียบร้อย" });
    }
    
    // กรณี: บันทึกผลสอบคอมพิวเตอร์
    else if (data.action === 'save_comp') {
      const sheet = ss.getSheetByName('ComLog');
      sheet.appendRow([data.name, data.score, data.aiResult, new Date()]);
      return responseJSON({ success: true, msg: "บันทึกผลคอมเรียบร้อย" });
    }
    
  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

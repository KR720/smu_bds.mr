// Google Apps Script (Code.gs) for Joo Seung-hwan Portfolio Guestbook
// Associated Spreadsheet ID: 1pdlP1EcYO7oM13rJncA3bKQ3O0W-xJyBW9QH6RXAU3g

const SPREADSHEET_ID = '1pdlP1EcYO7oM13rJncA3bKQ3O0W-xJyBW9QH6RXAU3g';
const OWNER_EMAIL = 'j27499643@gmail.com';

function doGet(e) {
  try {
    const sheet = getTargetSheet();
    const data = sheet.getDataRange().getValues();
    
    const guestbookEntries = [];
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1] || row[2] || row[5]) { // Check if valid row
        guestbookEntries.push({
          timestamp: row[0],
          association: row[1],
          name: row[2],
          phone: row[3],
          email: row[4],
          message: row[5]
        });
      }
    }
    
    // Return latest entries first (original spreadsheet has oldest first, so we reverse it for list)
    guestbookEntries.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: guestbookEntries
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    let payload;
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }
    
    const association = payload.association || '';
    const name = payload.name || '';
    const phone = payload.phone || '';
    const email = payload.email || '';
    const message = payload.message || '';
    
    if (!name || !email || !message) {
      throw new Error('필수 정보(이름, 이메일, 메시지)가 누락되었습니다.');
    }
    
    const sheet = getTargetSheet();
    const timestamp = new Date();
    
    // Append row
    sheet.appendRow([timestamp, association, name, phone, email, message]);
    
    // --- Send auto-reply to the visitor ---
    if (email) {
      try {
        MailApp.sendEmail({
          to: email,
          subject: '[주승환 포트폴리오] 방문해주셔서 감사합니다.',
          body: '방문해주셔서 감사합니다. 항상 배우고 성장하겠습니다.\n\n- 주승환 올림 -'
        });
      } catch (mailError) {
        Logger.log('Error sending reply mail: ' + mailError.toString());
      }
    }
    
    // --- Send notification to the portfolio owner ---
    try {
      const msgBody = 
        '안녕하세요, 주승환님.\n' +
        '포트폴리오에 새로운 방명록이 등록되었습니다.\n\n' +
        '■ 작성자 정보\n' +
        ' - 성함: ' + name + '\n' +
        ' - 소속: ' + association + '\n' +
        ' - 연락처: ' + phone + '\n' +
        ' - 이메일: ' + email + '\n\n' +
        '■ 방명록 메시지\n' +
        ' ' + message + '\n\n' +
        '등록 시간: ' + timestamp.toLocaleString('ko-KR');
        
      MailApp.sendEmail({
        to: OWNER_EMAIL,
        subject: '[방명록 알림] ' + name + '님이 포트폴리오에 발자취를 남기셨습니다.',
        body: msgBody
      });
    } catch (ownerMailError) {
      Logger.log('Error sending notification mail: ' + ownerMailError.toString());
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '방명록이 정상적으로 등록되었습니다.'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getTargetSheet() {
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  let sheet = ss.getSheetByName('방명록');
  if (!sheet) {
    sheet = ss.getSheets()[0];
    if (sheet) {
      sheet.setName('방명록');
    } else {
      sheet = ss.insertSheet('방명록');
    }
  }
  
  // Create headers if empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['등록시간', '소속', '이름', '연락처', '이메일', '메시지']);
    // Style headers
    sheet.getRange(1, 1, 1, 6)
         .setBackground('#3457E5')
         .setFontColor('#FFFFFF')
         .setFontWeight('bold');
  }
  
  return sheet;
}

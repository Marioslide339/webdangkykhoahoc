/**
 * ================================================
 * GOOGLE APPS SCRIPT - Nhận dữ liệu đăng ký khoá học
 * và lưu vào Google Sheet
 * ================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT:
 * 
 * 1. Mở Google Sheet mới (hoặc tạo mới tại sheets.google.com)
 * 2. Vào menu: Extensions > Apps Script
 * 3. Xóa code cũ, dán toàn bộ code này vào
 * 4. Bấm Save (Ctrl+S)
 * 5. Chạy hàm setup() một lần để tạo header
 * 6. Deploy > New deployment
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Bấm Deploy > Authorize > Allow
 * 8. Copy URL vừa tạo
 * 9. Dán URL vào file App.tsx, thay thế dòng:
 *    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';
 * ================================================
 */

// ID của Google Sheet - lấy từ URL của sheet
// Ví dụ: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
// Để trống để dùng Sheet hiện tại (sheet chứa script này)
const SPREADSHEET_ID = '';

function getSheet() {
  let ss;
  if (SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  
  let sheet = ss.getSheetByName('Đăng Ký Khoá Học');
  if (!sheet) {
    sheet = ss.insertSheet('Đăng Ký Khoá Học');
    setupHeaders(sheet);
  }
  return sheet;
}

function setupHeaders(sheet) {
  const headers = [
    'STT',
    'Thời Gian Đăng Ký',
    'Họ Và Tên',
    'Email',
    'Số Zalo',
    'Xã (Phường)',
    'Tỉnh (Thành Phố)',
    'Khoá Học Đăng Ký',
    'Trạng Thái',
    'Ghi Chú'
  ];
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Format header
  headerRange.setBackground('#1a3a6b');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 40);
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Set column widths
  sheet.setColumnWidth(1, 60);    // STT
  sheet.setColumnWidth(2, 160);   // Thời gian
  sheet.setColumnWidth(3, 200);   // Họ tên
  sheet.setColumnWidth(4, 200);   // Email
  sheet.setColumnWidth(5, 130);   // Zalo
  sheet.setColumnWidth(6, 180);   // Xã (Phường)
  sheet.setColumnWidth(7, 180);   // Tỉnh (Thành Phố)
  sheet.setColumnWidth(8, 300);   // Khoá học
  sheet.setColumnWidth(9, 120);   // Trạng thái
  sheet.setColumnWidth(10, 200);  // Ghi chú
}

// Chạy hàm này một lần để tạo header
function setup() {
  const sheet = getSheet();
  Logger.log('✅ Sheet đã được thiết lập thành công: ' + sheet.getName());
}

/**
 * Xử lý GET request từ website
 */
function doGet(e) {
  try {
    const params = e.parameter;
    
    // Validate dữ liệu
    if (!params.name || !params.email || !params.zalo || !params.course) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'error', 
          message: 'Thiếu thông tin bắt buộc' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;
    const stt = lastRow === 0 ? 1 : lastRow; // Trừ 1 vì có header
    
    // Thêm dữ liệu vào sheet
    const rowData = [
      stt,
      params.timestamp || new Date().toLocaleString('vi-VN'),
      params.name.trim(),
      params.email.trim().toLowerCase(),
      params.zalo.trim(),
      (params.ward || '').trim(),
      (params.province || '').trim(),
      params.course.trim(),
      'Chờ xác nhận',
      ''
    ];
    
    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Format row mới
    const newRow = sheet.getRange(nextRow, 1, 1, rowData.length);
    if (nextRow % 2 === 0) {
      newRow.setBackground('#f8f9ff');
    }
    newRow.setVerticalAlignment('middle');
    sheet.setRowHeight(nextRow, 35);
    
    // Format cột trạng thái
    const statusCell = sheet.getRange(nextRow, 9);
    statusCell.setBackground('#fff3cd');
    statusCell.setFontColor('#856404');
    statusCell.setHorizontalAlignment('center');
    statusCell.setFontWeight('bold');
    
    // Gửi email thông báo (tuỳ chọn - bỏ comment nếu muốn)
    // sendNotificationEmail(params);
    
    Logger.log(`✅ Đã lưu đăng ký: ${params.name} - ${params.course}`);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Đăng ký thành công!',
        row: nextRow
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('❌ Lỗi: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Xử lý POST request (phòng khi cần)
 */
function doPost(e) {
  return doGet(e);
}

/**
 * Gửi email thông báo khi có đăng ký mới (tuỳ chọn)
 */
function sendNotificationEmail(params) {
  const adminEmail = 'your-email@gmail.com'; // Thay bằng email của bạn
  const subject = `🎓 Đăng ký mới: ${params.name} - ${params.course}`;
  const body = `
Có đăng ký khoá học mới!

📋 Thông tin:
- Họ tên: ${params.name}
- Email: ${params.email}  
- Zalo: ${params.zalo}
- Xã/Phường: ${params.ward || 'Không có'}
- Tỉnh/TP: ${params.province || 'Không có'}
- Khoá học: ${params.course}
- Thời gian: ${params.timestamp}

Vui lòng liên hệ để xác nhận đăng ký.
  `;
  
  try {
    GmailApp.sendEmail(adminEmail, subject, body);
  } catch (e) {
    Logger.log('Không gửi được email: ' + e.toString());
  }
}

/**
 * Hàm test - chạy trong Apps Script editor để kiểm tra
 */
function testDoGet() {
  const mockEvent = {
    parameter: {
      name: 'Nguyễn Văn Test',
      email: 'test@gmail.com',
      zalo: '0123456789',
      ward: 'Phường Bến Nghé',
      province: 'TP. Hồ Chí Minh',
      course: 'Khoá Thiết Kế Bài Giảng E-Learning',
      timestamp: new Date().toLocaleString('vi-VN')
    }
  };
  
  const result = doGet(mockEvent);
  Logger.log('Kết quả test: ' + result.getContent());
}

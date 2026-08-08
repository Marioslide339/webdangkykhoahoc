import React, { useState, useEffect, useCallback } from 'react';

/* =============================================
   CONSTANTS & DATA
   ============================================= */
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxfCRCO8-lU8p-flBTPR8gXcKhGfD4XxvcX9daP6tB6kIzfAfE_uPGzMHCq0he2P-Ma/exec';

interface Course {
  id: number;
  icon: string;
  title: string;
  price: number;
  priceText: string;
  code: string;
}

const COURSES: Course[] = [
  { id: 1, icon: '🎓', title: 'Khoá Thiết Kế Bài Giảng E-Learning', price: 399000, priceText: '399K', code: 'ELEAR' },
  { id: 2, icon: '🤖', title: 'Khoá Ứng Dụng AI Vào Giảng Dạy', price: 399000, priceText: '399K', code: 'AIVGD' },
  { id: 3, icon: '📱', title: 'Khoá Tạo App Nâng Cao', price: 399000, priceText: '399K', code: 'APPNC' },
  { id: 4, icon: '🎨', title: 'Khoá Sử Dụng Canva', price: 299000, priceText: '299K', code: 'CANVA' },
  { id: 5, icon: '📊', title: 'Khoá Thiết Kế Bài Giảng PowerPoint', price: 299000, priceText: '299K', code: 'PPTBG' },
  { id: 6, icon: '🎬', title: 'Khoá Dựng Hoạt Hình 2D Bằng Animiz', price: 299000, priceText: '299K', code: 'ANIMZ' }
];

const COMBO = { name: 'Combo 6 Khoá Học - 999K', price: 999000, code: 'COMBO' };

export default function App() {
  /* =============================================
     STATE
     ============================================= */
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [zalo, setZalo] = useState('');
  const [ward, setWard] = useState('');
  const [province, setProvince] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set(COURSES.map(c => c.id)));
  const [isComboSelected, setIsComboSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeBank, setActiveBank] = useState<'mb' | 'tcb'>('mb');
  const [toastMessage, setToastMessage] = useState('');
  const [paymentData, setPaymentData] = useState({ courseName: '', price: 0, code: '' });

  /* =============================================
     PRICE CALCULATIONS
     ============================================= */
  const getCalculatedPrice = useCallback(() => {
    if (isComboSelected || selectedCourses.size === COURSES.length) {
      return { courseName: COMBO.name, price: COMBO.price, code: COMBO.code };
    }
    const selectedList = Array.from(selectedCourses);
    if (selectedList.length === 0) {
      return { courseName: '', price: 0, code: '' };
    }
    const rawSum = selectedList.reduce((sum, id) => {
      const c = COURSES.find(x => x.id === id);
      return sum + (c ? c.price : 0);
    }, 0);

    if (rawSum >= 999000) {
      return { courseName: COMBO.name, price: COMBO.price, code: COMBO.code };
    }

    const codes: string[] = [];
    const names: string[] = [];
    COURSES.forEach(c => {
      if (selectedCourses.has(c.id)) {
        codes.push(c.code);
        names.push(c.title);
      }
    });

    return {
      courseName: names.join(', '),
      price: rawSum,
      code: codes.join(' ')
    };
  }, [selectedCourses, isComboSelected]);

  const { price: currentPrice, code: currentCode } = getCalculatedPrice();
  const rawSum = Array.from(selectedCourses).reduce((sum, id) => {
    const c = COURSES.find(x => x.id === id);
    return sum + (c ? c.price : 0);
  }, 0);
  const isComboUpgrade = !isComboSelected && selectedCourses.size > 0 && rawSum >= 999000;

  /* =============================================
     SELECTION HANDLERS
     ============================================= */
  const toggleCombo = () => {
    setError('');
    const next = !isComboSelected;
    setIsComboSelected(next);
    if (next) {
      setSelectedCourses(new Set(COURSES.map(c => c.id)));
    } else {
      setSelectedCourses(new Set());
    }
  };

  const toggleCourse = (id: number) => {
    setError('');
    const nextSelected = new Set(selectedCourses);
    if (nextSelected.has(id)) {
      nextSelected.delete(id);
    } else {
      nextSelected.add(id);
    }
    setSelectedCourses(nextSelected);
    setIsComboSelected(nextSelected.size === COURSES.length);
  };

  /* =============================================
     TOAST MESSAGE
     ============================================= */
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    showToast(`📋 Đã sao chép ${label}: ${text}`);
  };

  /* =============================================
     FORM SUBMIT
     ============================================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('⚠️ Vui lòng nhập họ và tên');
    if (!email.trim() || !email.includes('@')) return setError('⚠️ Vui lòng nhập email hợp lệ');
    if (!zalo.trim()) return setError('⚠️ Vui lòng nhập số Zalo');
    if (!ward.trim()) return setError('⚠️ Vui lòng nhập xã / phường');
    if (!province.trim()) return setError('⚠️ Vui lòng nhập tỉnh / thành phố');
    if (selectedCourses.size === 0) return setError('⚠️ Vui lòng chọn ít nhất 1 khoá học');

    const details = getCalculatedPrice();
    setPaymentData(details);

    setLoading(true);
    try {
      const params = new URLSearchParams({
        name,
        email,
        zalo,
        ward,
        province,
        course: details.courseName,
        timestamp: new Date().toLocaleString('vi-VN')
      });
      await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: 'GET', mode: 'no-cors' });
    } catch (_) {
      // Ignored for no-cors fallback
    } finally {
      setLoading(false);
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* =============================================
     VIETQR GENERATOR
     ============================================= */
  const nameEnc = encodeURIComponent('CONG TY TNHH CONG NGHE GIAO DUC MRE');
  const infoEnc = encodeURIComponent(paymentData.code);
  const qrMb = `https://img.vietqr.io/image/MB-353536888-compact2.png?amount=${paymentData.price}&addInfo=${infoEnc}&accountName=${nameEnc}`;
  const qrTcb = `https://img.vietqr.io/image/TCB-836869999-compact2.png?amount=${paymentData.price}&addInfo=${infoEnc}&accountName=${nameEnc}`;

  /* =============================================
     INITIALIZE ON QUERY PARAMETERS
     ============================================= */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const preselect = urlParams.get('course');
    if (preselect) {
      if (preselect === 'combo') {
        setIsComboSelected(true);
        setSelectedCourses(new Set(COURSES.map(c => c.id)));
      } else {
        setIsComboSelected(false);
        const found = COURSES.find(c => c.code.toLowerCase() === preselect.toLowerCase());
        if (found) {
          setSelectedCourses(new Set([found.id]));
        }
      }
    }
  }, []);

  return (
    <>
      {/* ===================== INLINE CSS (BULLETPROOF CONFLICT-FREE) ===================== */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --red: #e8192c;
          --red-dark: #c01020;
          --orange: #f97316;
          --orange-light: #fdba74;
          --yellow: #fbbf24;
          --green: #10b981;
          --green-dark: #059669;
          --bg-page: #f8fafc;
          --bg-card: #ffffff;
          --text-dark: #1e293b;
          --text-body: #475569;
          --text-muted: #94a3b8;
          --border: #e2e8f0;
          --font: 'Be Vietnam Pro', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
          --radius: 16px;
          --radius-sm: 10px;
          --shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
          --shadow-lg: 0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05);
        }

        .m-wrap {
          position: relative; z-index: 1;
          max-width: 650px;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
          font-family: var(--font);
        }

        /* HEADER */
        header.top-nav {
          background: #ffffff;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          font-family: var(--font);
        }

        .top-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 650px; margin: 0 auto; padding: 12px 16px;
          box-sizing: border-box;
        }

        .brand-logo-area {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }

        .brand-logo-img {
          height: 38px; width: auto; object-fit: contain; border-radius: 6px;
        }

        .brand-title-area { display: flex; flex-direction: column; }
        .brand-main-title { font-size: 16px; font-weight: 900; color: var(--red); line-height: 1.1; }
        .brand-tagline { font-size: 8px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

        .phone-pill {
          display: flex; align-items: center; gap: 8px;
          font-size: 12.5px; font-weight: 700; color: var(--text-dark);
          background: #f1f5f9; border: 1.5px solid var(--border);
          padding: 6px 14px; border-radius: 50px; text-decoration: none;
          transition: all 0.25s;
        }

        .phone-pill::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: var(--red); animation: pulse-dot-app 1.5s ease-in-out infinite;
        }

        @keyframes pulse-dot-app {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,25,44,0.6); }
          50% { box-shadow: 0 0 0 5px rgba(232,25,44,0); }
        }

        .phone-pill:hover { border-color: var(--red); color: var(--red); background: #fff1f3; }

        .header-bar-accent {
          width: 32px; height: 4px; background: var(--orange);
          border-radius: 2px; margin: 16px auto 0;
        }

        /* BODY CONTAINER */
        .m-container-body {
          background: #ffffff;
          border: 2px solid var(--border);
          border-radius: var(--radius);
          padding: 24px;
          box-shadow: var(--shadow-lg);
          margin-top: 24px;
          margin-bottom: 32px;
          box-sizing: border-box;
        }

        .m-sec-title {
          font-size: 20px; font-weight: 900; color: var(--text-dark);
          text-align: center; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.5px;
        }

        .m-step-indicator {
          display: flex; justify-content: center; gap: 8px; margin-bottom: 24px;
        }
        .m-step-badge {
          font-size: 10.5px; font-weight: 800; text-transform: uppercase;
          padding: 4px 12px; border-radius: 20px; background: #e2e8f0; color: var(--text-muted);
        }
        .m-step-badge.active {
          background: var(--red); color: #ffffff;
          box-shadow: 0 2px 8px rgba(232,25,44,0.2);
        }

        /* FORM FIELD LAYOUT (PREVENTS OVERLAPPING) */
        .m-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 22px;
          position: relative;
          box-sizing: border-box;
          text-align: left;
        }
        .m-form-group:last-child { margin-bottom: 0; }

        .m-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          box-sizing: border-box;
        }

        .m-form-label {
          font-size: 13px;
          font-weight: 800;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 2px;
        }

        .m-form-input {
          width: 100%;
          padding: 13px 16px;
          background: #ffffff;
          border: 2px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-dark);
          font-size: 16px;
          font-family: var(--font);
          outline: none;
          transition: all 0.25s;
          box-sizing: border-box;
          height: auto;
          line-height: normal;
        }

        .m-form-input::placeholder { color: var(--text-muted); opacity: 0.7; }
        .m-form-input:focus {
          border-color: var(--red);
          box-shadow: 0 0 0 4px rgba(232,25,44,0.06);
          background: #ffffff;
        }

        .m-form-err {
          color: var(--red);
          font-size: 13px;
          font-weight: 700;
          margin-top: 8px;
          text-align: center;
        }

        /* CHECKLIST */
        .m-course-checklist {
          border: 2px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .m-course-check-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-bottom: 1.5px solid var(--border);
          cursor: pointer; transition: all 0.25s;
          box-sizing: border-box;
        }
        .m-course-check-item:last-child { border-bottom: none; }
        .m-course-check-item:hover { background: #f8fafc; }

        .m-course-check-item.combo-item {
          background: #fff8f8; border-bottom: 2px solid var(--border);
        }
        .m-course-check-item.combo-item:hover { background: #fff1f1; }
        .m-course-check-item.combo-item.checked { background: #fff1f2; }
        .m-course-check-item.checked { background: #f0fdf4; }

        .m-check-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; text-align: left; }
        
        .m-checkbox-icon {
          width: 22px; height: 22px; border-radius: 4px; border: 2px solid var(--border);
          background: #ffffff; display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 900; color: transparent; transition: all 0.2s;
          flex-shrink: 0;
        }
        .m-course-check-item.checked .m-checkbox-icon {
          background: var(--green); border-color: var(--green); color: #ffffff;
        }
        .m-course-check-item.combo-item.checked .m-checkbox-icon {
          background: var(--red); border-color: var(--red); color: #ffffff;
        }

        .m-check-icon-emoji { font-size: 20px; flex-shrink: 0; }
        .m-check-title-box { display: flex; flex-direction: column; min-width: 0; }
        .m-check-title { font-size: 14px; font-weight: 700; color: var(--text-dark); line-height: 1.35; }
        .m-check-badge {
          display: inline-block; font-size: 8px; font-weight: 900; color: #ffffff;
          background: linear-gradient(135deg, var(--red), var(--orange));
          padding: 2px 8px; border-radius: 10px; text-transform: uppercase;
          letter-spacing: 0.5px; margin-top: 3px; align-self: flex-start;
        }

        .m-check-price-box { text-align: right; flex-shrink: 0; }
        .m-price-old-strike { font-size: 11px; color: var(--text-muted); text-decoration: line-through; display: block; }
        .m-price-new-lbl { font-size: 14.5px; font-weight: 900; color: var(--red); }
        .combo-item .m-price-new-lbl {
          background: linear-gradient(135deg, var(--orange), var(--red));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          font-weight: 900;
        }

        .m-checklist-divider {
          background: #f1f5f9; padding: 8px 16px;
          font-size: 10.5px; font-weight: 800; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 1px; border-bottom: 1.5px solid var(--border);
          text-align: left;
        }

        /* Price Summary */
        .m-summary-box {
          background: #f8fafc; border: 2px solid var(--border); border-radius: var(--radius-sm);
          padding: 16px; margin-top: 14px;
        }
        .m-sum-row { display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; color: var(--text-body); margin-bottom: 8px; }
        .m-sum-row:last-child { margin-bottom: 0; }
        .m-sum-total { font-size: 19px; font-weight: 900; color: var(--red); }
        .m-combo-tip {
          background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
          padding: 10px 14px; font-size: 12px; color: var(--green-dark);
          font-weight: 700; margin-top: 10px; text-align: center;
          line-height: 1.4;
        }

        /* PAYMENT */
        .m-pay-card { border-radius: var(--radius); }

        .m-pay-header {
          padding: 14px 16px; background: #fff5f5; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          margin-bottom: 18px; text-align: left;
        }
        .m-pay-course-lbl {
          font-size: 13.5px; font-weight: 700; color: var(--red);
          background: #ffffff; border: 1.5px solid rgba(232,25,44,0.2);
          border-radius: 6px; padding: 6px 12px; display: inline-block; margin-top: 6px;
        }

        .m-pay-code-box {
          background: #fffbeb; border: 2px solid var(--orange-light); border-radius: var(--radius-sm);
          padding: 18px; text-align: center; margin-bottom: 18px;
        }
        .m-pay-code-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-body); margin-bottom: 6px; }
        .m-pay-code-value {
          font-size: 28px; font-weight: 900; letter-spacing: 4px; color: var(--orange);
          font-family: 'Courier New', monospace; margin-bottom: 6px; cursor: pointer;
        }
        .m-pay-code-hint { font-size: 11.5px; color: var(--text-muted); }

        /* Bank tabs */
        .m-bank-tabs { display: flex; gap: 8px; margin-bottom: 18px; }
        .m-bank-tab {
          flex: 1; padding: 12px 8px;
          border: 2px solid var(--border); border-radius: var(--radius-sm);
          background: #f8fafc; color: var(--text-body);
          font-size: 13.5px; font-weight: 700; cursor: pointer;
          transition: all 0.25s; font-family: var(--font);
        }
        .m-bank-tab.active {
          border-color: var(--red); background: #ffffff; color: var(--red);
          box-shadow: 0 2px 8px rgba(232,25,44,0.06);
        }

        .m-bank-info-panel { display: block; }

        .m-bi-row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #f8fafc; border: 1.5px solid var(--border); border-radius: 8px; margin-bottom: 8px; text-align: left; }
        .m-bi-label { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; min-width: 90px; flex-shrink: 0; }
        .m-bi-value { font-size: 14px; font-weight: 700; color: var(--text-dark); }
        .m-bi-stk { font-size: 19px; font-weight: 900; color: var(--red); cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .m-bi-stk:hover { color: var(--orange); }

        /* QR Code */
        .m-qr-wrap { text-align: center; padding: 16px 0 8px; }
        .m-qr-label { font-size: 11.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .m-qr-frame { background: #ffffff; border-radius: 12px; padding: 12px; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 2px solid var(--border); }
        .m-qr-img { width: 180px; height: 180px; display: block; border-radius: 6px; }
        .m-qr-brand { margin-top: 10px; font-size: 13.5px; font-weight: 800; }
        .mb-brand { color: #003893; }
        .tcb-brand { color: #ed1c24; }

        /* Pay note */
        .m-pay-note {
          display: flex; align-items: flex-start; gap: 12px;
          background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: var(--radius-sm);
          padding: 14px 16px; margin: 18px 0; text-align: left;
        }
        .m-pay-note-ico { font-size: 20px; flex-shrink: 0; }
        .m-pay-note-txt { font-size: 13.5px; color: var(--text-body); line-height: 1.6; }
        .m-pay-note-txt strong { color: var(--green-dark); }

        /* Zalo btn */
        .m-zalo-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px; background: #0068ff;
          color: #ffffff; font-size: 14.5px; font-weight: 800;
          border-radius: var(--radius-sm); text-decoration: none;
          text-transform: uppercase; letter-spacing: 1px;
          box-shadow: 0 4px 14px rgba(0,104,255,0.3);
          transition: all 0.28s;
        }
        .m-zalo-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,104,255,0.4); }

        /* BUTTONS */
        .m-btn-primary {
          width: 100%; padding: 15px; margin-top: 10px;
          background: linear-gradient(135deg, var(--orange), var(--red));
          color: #ffffff; font-size: 14.5px; font-weight: 800;
          border: none; border-radius: var(--radius-sm); cursor: pointer;
          text-transform: uppercase; letter-spacing: 1.5px;
          box-shadow: 0 4px 14px rgba(232,25,44,0.25);
          transition: all 0.28s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: var(--font);
        }
        .m-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,25,44,0.35); }
        .m-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .m-btn-back {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 12px;
          background: #f1f5f9; border: 2px solid var(--border);
          border-radius: var(--radius-sm); color: var(--text-body);
          font-size: 13.5px; font-weight: 700; cursor: pointer;
          transition: all 0.25s; margin-top: 12px;
          font-family: var(--font);
        }
        .m-btn-back:hover { background: #e2e8f0; }

        /* TOAST & FOOTER */
        .m-toast {
          position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
          background: rgba(16,185,129,0.95); color: #ffffff; padding: 10px 24px;
          border-radius: 50px; font-size: 13px; font-weight: 700;
          z-index: 9999; opacity: 0; transition: opacity 0.3s;
          pointer-events: none; white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .m-toast.show { opacity: 1; }

        footer {
          text-align: center; padding: 24px 16px;
          border-top: 1px solid var(--border);
          margin-top: 24px;
        }
        footer p { color: var(--text-muted); font-size: 11px; line-height: 1.8; }
        footer a { color: var(--red); text-decoration: none; font-weight: 600; }
        
        /* FADE IN ANIMATION */
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile vs Desktop Responsive Grid Layout */
        .m-desktop-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .m-pay-grid-desktop {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* DESKTOP STYLING (PC - AUTO MATCH SCREEN WITH MAX OPTIMIZED SIZES) */
        @media (min-width: 769px) {
          .m-wrap {
            max-width: 1400px;
            width: 95%;
            padding: 0 32px;
          }
          .top-nav-inner {
            max-width: 1400px;
            width: 95%;
            padding: 16px 32px;
          }
          .m-container-body {
            margin-top: 32px;
            margin-bottom: 32px;
            padding: 44px 48px;
            border-width: 2.5px;
          }
          .m-sec-title {
            font-size: 26px;
            margin-bottom: 32px;
            letter-spacing: 1px;
          }
          .m-step-badge {
            font-size: 12px;
            padding: 6px 16px;
          }
          .m-desktop-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 48px;
            align-items: start;
          }
          .m-pay-grid-desktop {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 48px;
            align-items: start;
          }
          
          /* Form Inputs PC sizing */
          .m-form-group {
            margin-bottom: 24px;
            gap: 10px;
          }
          .m-form-grid {
            gap: 24px;
          }
          .m-form-label {
            font-size: 14.5px;
          }
          .m-form-input {
            font-size: 17.5px;
            padding: 15px 18px;
            border-width: 2.5px;
          }
          .m-course-checklist {
            border-width: 2.5px;
            max-height: 380px;
            overflow-y: auto;
          }
          .m-course-check-item {
            padding: 14px 20px;
            border-bottom-width: 2px;
          }
          .m-check-title {
            font-size: 15.5px;
          }
          .m-price-new-lbl {
            font-size: 16.5px;
          }
          .m-summary-box {
            border-width: 2.5px;
            padding: 20px;
            margin-top: 18px;
          }
          .m-sum-row {
            font-size: 14.5px;
            margin-bottom: 10px;
          }
          .m-sum-total {
            font-size: 22px;
          }
          .m-combo-tip {
            font-size: 13.5px;
            padding: 12px 18px;
          }

          /* Step 2 PC Sizing */
          .m-pay-header {
            padding: 18px 20px;
            border-width: 2px;
          }
          .m-pay-course-lbl {
            font-size: 15px;
            padding: 8px 16px;
          }
          .m-pay-code-box {
            border-width: 2.5px;
            padding: 22px;
          }
          .m-pay-code-value {
            font-size: 34px;
          }
          .m-bank-tab {
            font-size: 15px;
            padding: 14px 10px;
            border-width: 2.5px;
          }
          .m-bi-row {
            padding: 14px 18px;
            border-width: 2px;
            margin-bottom: 10px;
          }
          .m-bi-value {
            font-size: 15px;
          }
          .m-bi-stk {
            font-size: 21px;
          }
          .m-qr-frame {
            border-width: 2.5px;
            padding: 16px;
          }
          .m-qr-img {
            width: 220px;
            height: 220px;
          }
          .m-qr-brand {
            font-size: 15px;
          }
          .m-pay-note {
            padding: 16px 20px;
            border-width: 2px;
          }
          .m-pay-note-txt {
            font-size: 14px;
          }
          .m-zalo-btn {
            padding: 16px;
            font-size: 16px;
          }
          .m-btn-primary {
            padding: 16px;
            font-size: 16px;
          }
          footer {
            margin-top: 32px;
            padding: 24px;
          }
        }
      `}} />

      <div className="min-h-screen bg-[#f8fafc] text-[#475569] pb-12" style={{ fontFamily: 'var(--font)' }}>
        {/* ===================== TOP NAV ===================== */}
        <header className="top-nav">
          <div className="top-nav-inner">
            <a href="/" className="brand-logo-area" onClick={e => e.preventDefault()}>
              <img src="/logo.png" alt="Maris Slide Logo" className="brand-logo-img" />
              <div className="brand-title-area">
                <span className="brand-main-title">Maris Slide</span>
                <span className="brand-tagline">Tiên phong công nghệ giáo dục</span>
              </div>
            </a>
            <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer" className="phone-pill">
              <span>0396.581.283</span>
            </a>
          </div>
        </header>

        <div className="m-wrap">
          <div className="header-bar-accent" />

          {/* ===================== MAIN CONTAINER ===================== */}
          <main className="m-container-body">
            
            {/* ===================== STEP 1: FORM ===================== */}
            {step === 1 && (
              <section className="animate-fadeIn">
                <div className="m-step-indicator">
                  <span className="m-step-badge active">Bước 1: Điền đăng ký</span>
                </div>
                <h2 className="m-sec-title">📝 ĐĂNG KÝ KHOÁ HỌC</h2>

                <form onSubmit={handleSubmit} noValidate className="m-desktop-grid">
                  <div className="m-form-fields-side">
                    <div className="m-form-group">
                      <label className="m-form-label" htmlFor="f-name">👤 Họ và Tên</label>
                      <input
                        id="f-name"
                        type="text"
                        placeholder="Nhập họ và tên đầy đủ..."
                        className="m-form-input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>

                    <div className="m-form-group">
                      <label className="m-form-label" htmlFor="f-email">📧 Email nhận bài giảng</label>
                      <input
                        id="f-email"
                        type="email"
                        placeholder="example@gmail.com"
                        className="m-form-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="m-form-group">
                      <label className="m-form-label" htmlFor="f-zalo">💬 Số điện thoại Zalo</label>
                      <input
                        id="f-zalo"
                        type="tel"
                        placeholder="0xxx.xxx.xxx"
                        className="m-form-input"
                        value={zalo}
                        onChange={e => setZalo(e.target.value)}
                      />
                    </div>

                    <div className="m-form-grid">
                      <div className="m-form-group">
                        <label className="m-form-label" htmlFor="f-ward">📍 Xã (Phường)</label>
                        <input
                          id="f-ward"
                          type="text"
                          placeholder="Xã / phường..."
                          className="m-form-input"
                          value={ward}
                          onChange={e => setWard(e.target.value)}
                        />
                      </div>
                      <div className="m-form-group">
                        <label className="m-form-label" htmlFor="f-province">🏙️ Tỉnh / Thành phố</label>
                        <input
                          id="f-province"
                          type="text"
                          placeholder="Tỉnh / thành phố..."
                          className="m-form-input"
                          value={province}
                          onChange={e => setProvince(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="m-checklist-side">
                    <div className="m-form-group" style={{ marginBottom: 0 }}>
                      <label className="m-form-label">📚 Chọn khoá học đăng ký</label>
                      
                      <div className="m-course-checklist">
                        {/* Combo Option */}
                        <div
                          className={`m-course-check-item combo-item ${isComboSelected ? 'checked' : ''}`}
                          onClick={toggleCombo}
                        >
                          <div className="m-check-left">
                            <div className="m-checkbox-icon" style={{ color: isComboSelected ? '#ffffff' : 'transparent' }}>✓</div>
                            <div className="m-check-title-box">
                              <span className="m-check-title">⭐ ĐĂNG KÝ COMBO 6 KHOÁ HỌC</span>
                              <span className="m-check-badge">🔥 Siêu Tiết Kiệm</span>
                            </div>
                          </div>
                          <div className="m-check-price-box">
                            <span className="m-price-old-strike">2.494K</span>
                            <span className="m-price-new-lbl">999.000đ</span>
                          </div>
                        </div>

                        <div className="m-checklist-divider">Hoặc chọn đăng ký lẻ từng khoá học</div>

                        {/* Individual list */}
                        {COURSES.map(c => {
                          const isChecked = selectedCourses.has(c.id);
                          return (
                            <div
                              key={c.id}
                              className={`m-course-check-item ${isChecked ? 'checked' : ''}`}
                              onClick={() => toggleCourse(c.id)}
                            >
                              <div className="m-check-left">
                                <div className="m-checkbox-icon" style={{ color: isChecked ? '#ffffff' : 'transparent' }}>✓</div>
                                <span className="m-check-icon-emoji">{c.icon}</span>
                                <div className="m-check-title-box">
                                  <span className="m-check-title">{c.title}</span>
                                </div>
                              </div>
                              <div className="m-check-price-box">
                                <span className="m-price-new-lbl">{c.priceText}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Price summary */}
                      {selectedCourses.size > 0 && (
                        <div className="m-summary-box">
                          <div className="m-sum-row">
                            <span>Số lượng đã chọn:</span>
                            <strong className="font-bold text-[#1e293b]">{isComboSelected ? '6 khoá học (Combo)' : `${selectedCourses.size} khoá học`}</strong>
                          </div>
                          <div className="m-sum-row">
                            <span>TỔNG TIỀN TẠM TÍNH:</span>
                            <span className="m-sum-total">
                              {isComboUpgrade || isComboSelected ? '999.000đ' : `${rawSum.toLocaleString('vi-VN')}đ`}
                            </span>
                          </div>
                          {isComboUpgrade && (
                            <div className="m-combo-tip">
                              🎉 Hệ thống tự áp dụng giá <strong>COMBO 999K</strong> tiết kiệm nhất cho thầy cô!
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {error && <div className="m-form-err" style={{ marginTop: '12px' }}>{error}</div>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="m-btn-primary"
                      style={{ marginTop: '12px' }}
                    >
                      {loading ? '⏳ Đang gửi đăng ký...' : '🚀 Gửi Đăng Ký & Tiếp Tục'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* ===================== STEP 2: PAYMENT ===================== */}
            {step === 2 && (
              <section className="animate-fadeIn">
                <div className="m-step-indicator">
                  <span className="m-step-badge active" style={{ background: 'var(--green)' }}>Bước 2: Thanh toán</span>
                </div>
                <h2 className="m-sec-title">💳 THÔNG TIN CHUYỂN KHOẢN</h2>

                <div className="m-pay-card">
                  <div className="m-pay-grid-desktop">
                    <div className="m-pay-details-side">
                      <div className="m-pay-header">
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Khoá học đăng ký</div>
                        <span className="m-pay-course-lbl">
                          {paymentData.courseName} – {paymentData.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>

                      {/* Transfer code */}
                      <div className="m-pay-code-box">
                        <div className="m-pay-code-label">Nội dung chuyển khoản bắt buộc</div>
                        <div
                          className="m-pay-code-value"
                          onClick={() => copyText(paymentData.code, 'mã nội dung')}
                          title="Click để sao chép"
                        >
                          {paymentData.code}
                        </div>
                        <div className="m-pay-code-hint">📋 Click lên đoạn mã để sao chép nhanh</div>
                      </div>

                      {/* Tabs */}
                      <div className="m-bank-tabs">
                        <button
                          className={`m-bank-tab ${activeBank === 'mb' ? 'active' : ''}`}
                          onClick={() => setActiveBank('mb')}
                        >
                          🏦 MB Bank
                        </button>
                        <button
                          className={`m-bank-tab ${activeBank === 'tcb' ? 'active' : ''}`}
                          onClick={() => setActiveBank('tcb')}
                        >
                          🏦 Techcombank
                        </button>
                      </div>

                      {/* Bank info details */}
                      <div className="m-bank-info-container">
                        <div className="m-bi-row">
                          <div className="m-bi-label">Chủ TK</div>
                          <div className="m-bi-value">CONG TY TNHH CONG NGHE GIAO DUC MRE</div>
                        </div>
                        <div className="m-bi-row">
                          <div className="m-bi-label">Số TK</div>
                          <div className="m-bi-stk" onClick={() => copyText(activeBank === 'mb' ? '353536888' : '836869999', 'số tài khoản')}>
                            {activeBank === 'mb' ? '353536888' : '836869999'} <span className="copy-ico">📋</span>
                          </div>
                        </div>
                        <div className="m-bi-row">
                          <div className="m-bi-label">Ngân hàng</div>
                          <div className="m-bi-value">{activeBank === 'mb' ? 'MB Bank (Ngân hàng Quân đội)' : 'Techcombank (TMCP Kỹ Thương)'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="m-pay-qr-side">
                      <div className="m-qr-wrap" style={{ padding: '0 0 8px' }}>
                        <div className="m-qr-label">Quét mã QR để chuyển khoản điền sẵn nội dung</div>
                        <div className="m-qr-frame">
                          <img src={activeBank === 'mb' ? qrMb : qrTcb} alt={`QR ${activeBank === 'mb' ? 'MB Bank' : 'Techcombank'}`} className="m-qr-img" />
                        </div>
                        <div className={`m-qr-brand ${activeBank === 'mb' ? 'mb-brand' : 'tcb-brand'}`}>{activeBank === 'mb' ? 'MB Bank' : 'Techcombank'}</div>
                      </div>

                      {/* Note */}
                      <div className="m-pay-note">
                        <span className="m-pay-note-ico">💬</span>
                        <div className="m-pay-note-txt">
                          Sau khi chuyển khoản xong, thầy cô hãy bấm <strong>"Báo Zalo Đã Thanh Toán"</strong> bên dưới để nhân viên kích hoạt tài khoản học ngay lập tức.
                        </div>
                      </div>

                      <a
                        href="https://zalo.me/0396581283"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="m-zalo-btn"
                      >
                        <span>💬</span> Báo Zalo Đã Thanh Toán
                      </a>

                      <button
                        onClick={handleBack}
                        className="m-btn-back"
                      >
                        ← Quay lại chỉnh sửa thông tin
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

          </main>

          {/* ===================== FOOTER ===================== */}
          <footer className="text-center p-6 border-t border-[#e2e8f0] mt-6">
            <p className="text-[11px] text-[#94a3b8] leading-relaxed">
              © 2024 <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer" className="text-[#e8192c] font-semibold hover:underline">MARIS SLIDE</a> · Công ty TNHH Công Nghệ Giáo Dục MRE<br />
              Zalo: <a href="https://zalo.me/0396581283" target="_blank" className="text-[#e8192c] font-semibold hover:underline">0396.581.283</a> · Học trọn đời · Hỗ trợ 1:1
            </p>
          </footer>
        </div>

        {/* ===================== TOAST ===================== */}
        <div className={`m-toast ${toastMessage ? 'show' : ''}`}>
          {toastMessage}
        </div>
      </div>
    </>
  );
}

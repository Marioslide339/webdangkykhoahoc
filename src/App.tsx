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
  { id: 1, icon: '🎓', title: 'Khoá Thiết Kế Bài Giảng E-Learning', price: 299000, priceText: '299K', code: 'ELEAR' },
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
      {/* ===================== INLINE CSS (BULLETPROOF) ===================== */}
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
          --font: 'Be Vietnam Pro', sans-serif;
          --radius: 16px;
          --radius-sm: 10px;
          --shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
          --shadow-lg: 0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05);
        }

        .wrap { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; padding: 0 16px; }

        /* HEADER */
        header.top-nav {
          background: #ffffff;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .top-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 600px; margin: 0 auto; padding: 12px 16px;
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
        .container-body {
          background: #ffffff; border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px;
          box-shadow: var(--shadow); margin-top: 24px; margin-bottom: 32px;
        }

        .sec-title {
          font-size: 18px; font-weight: 900; color: var(--text-dark);
          text-align: center; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px;
        }

        .step-indicator {
          display: flex; justify-content: center; gap: 8px; margin-bottom: 24px;
        }
        .step-badge {
          font-size: 10px; font-weight: 800; text-transform: uppercase;
          padding: 4px 12px; border-radius: 20px; background: #e2e8f0; color: var(--text-muted);
        }
        .step-badge.active {
          background: var(--red); color: #ffffff;
          box-shadow: 0 2px 8px rgba(232,25,44,0.2);
        }

        /* FORM */
        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; gap: 14px; } }

        .form-label {
          font-size: 11.5px; font-weight: 800; color: var(--text-dark);
          text-transform: uppercase; letter-spacing: 0.5px;
          text-align: left;
        }

        .form-input {
          width: 100%; padding: 12px 14px;
          background: #ffffff; border: 1.5px solid var(--border);
          border-radius: var(--radius-sm); color: var(--text-dark); font-size: 14px;
          outline: none; transition: all 0.25s;
        }

        .form-input::placeholder { color: var(--text-muted); }
        .form-input:focus {
          border-color: var(--red);
          box-shadow: 0 0 0 3px rgba(232,25,44,0.06);
        }

        .form-err { color: var(--red); font-size: 12px; font-weight: 700; margin-top: 4px; text-align: center; }

        /* CHECKLIST */
        .course-checklist {
          border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          overflow: hidden; background: #ffffff; display: flex; flex-direction: column;
        }

        .course-check-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-bottom: 1px solid var(--border);
          cursor: pointer; transition: all 0.25s;
        }
        .course-check-item:last-child { border-bottom: none; }
        .course-check-item:hover { background: #f8fafc; }

        .course-check-item.combo-item {
          background: #fff8f8; border-bottom: 2px solid var(--border);
        }
        .course-check-item.combo-item:hover { background: #fff1f1; }
        .course-check-item.combo-item.checked { background: #fff1f2; }

        .course-check-item.checked { background: #f0fdf4; }

        .check-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; text-align: left; }
        
        .checkbox-icon {
          width: 20px; height: 20px; border-radius: 4px; border: 2px solid var(--border);
          background: #ffffff; display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900; color: transparent; transition: all 0.2s;
          flex-shrink: 0;
        }
        .course-check-item.checked .checkbox-icon {
          background: var(--green); border-color: var(--green); color: #ffffff;
        }
        .course-check-item.combo-item.checked .checkbox-icon {
          background: var(--red); border-color: var(--red); color: #ffffff;
        }

        .check-icon-emoji { font-size: 20px; flex-shrink: 0; }
        .check-title-box { display: flex; flex-direction: column; min-width: 0; }
        .check-title { font-size: 13.5px; font-weight: 700; color: var(--text-dark); line-height: 1.3; }
        .check-badge {
          display: inline-block; font-size: 8px; font-weight: 900; color: #ffffff;
          background: linear-gradient(135deg, var(--red), var(--orange));
          padding: 2px 8px; border-radius: 10px; text-transform: uppercase;
          letter-spacing: 0.5px; margin-top: 3px; align-self: flex-start;
        }

        .check-price-box { text-align: right; flex-shrink: 0; }
        .price-old-strike { font-size: 11px; color: var(--text-muted); text-decoration: line-through; display: block; }
        .price-new-lbl { font-size: 14px; font-weight: 900; color: var(--red); }
        .combo-item .price-new-lbl {
          background: linear-gradient(135deg, var(--orange), var(--red));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          font-weight: 900;
        }

        .checklist-divider {
          background: #f1f5f9; padding: 6px 16px;
          font-size: 10px; font-weight: 800; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border);
          text-align: left;
        }

        /* Price Summary */
        .summary-box {
          background: #f8fafc; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          padding: 14px 16px; margin-top: 14px;
        }
        .sum-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-body); margin-bottom: 6px; }
        .sum-row:last-child { margin-bottom: 0; }
        .sum-total { font-size: 18px; font-weight: 900; color: var(--red); }
        .combo-tip {
          background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
          padding: 8px 12px; font-size: 11.5px; color: var(--green-dark);
          font-weight: 700; margin-top: 8px; text-align: center;
        }

        /* PAYMENT */
        .pay-card { border-radius: var(--radius); }

        .pay-header {
          padding: 12px 16px; background: #fff5f5; border: 1px solid var(--border); border-radius: var(--radius-sm);
          margin-bottom: 18px; text-align: left;
        }
        .pay-course-lbl {
          font-size: 13px; font-weight: 700; color: var(--red);
          background: #ffffff; border: 1px solid rgba(232,25,44,0.2);
          border-radius: 6px; padding: 6px 12px; display: inline-block; margin-top: 6px;
        }

        .pay-code-box {
          background: #fffbeb; border: 1.5px solid var(--orange-light); border-radius: var(--radius-sm);
          padding: 16px; text-align: center; margin-bottom: 18px;
        }
        .pay-code-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--text-body); margin-bottom: 6px; }
        .pay-code-value {
          font-size: 26px; font-weight: 900; letter-spacing: 4px; color: var(--orange);
          font-family: 'Courier New', monospace; margin-bottom: 4px; cursor: pointer;
        }
        .pay-code-hint { font-size: 11px; color: var(--text-muted); }

        /* Bank tabs */
        .bank-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
        .bank-tab {
          flex: 1; padding: 10px 8px;
          border: 1.5px solid var(--border); border-radius: var(--radius-sm);
          background: #f8fafc; color: var(--text-body);
          font-size: 13px; font-weight: 700; cursor: pointer;
          transition: all 0.25s;
        }
        .bank-tab.active {
          border-color: var(--red); background: #ffffff; color: var(--red);
          box-shadow: 0 2px 8px rgba(232,25,44,0.06);
        }

        .bank-panel { display: none; }
        .bank-panel.active { display: block; }

        .bi-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 6px; text-align: left; }
        .bi-label { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; min-width: 90px; flex-shrink: 0; }
        .bi-value { font-size: 13px; font-weight: 700; color: var(--text-dark); }
        .bi-stk { font-size: 18px; font-weight: 900; color: var(--red); cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .bi-stk:hover { color: var(--orange); }

        /* QR Code */
        .qr-wrap { text-align: center; padding: 16px 0 8px; }
        .qr-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
        .qr-frame { background: #ffffff; border-radius: 12px; padding: 10px; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1.5px solid var(--border); }
        .qr-img { width: 180px; height: 180px; display: block; border-radius: 6px; }
        .qr-brand { margin-top: 10px; font-size: 13px; font-weight: 800; }
        .mb-brand { color: #003893; }
        .tcb-brand { color: #ed1c24; }

        /* Pay note */
        .pay-note {
          display: flex; align-items: flex-start; gap: 12px;
          background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-sm);
          padding: 14px 16px; margin: 16px 0; text-align: left;
        }
        .pay-note-ico { font-size: 20px; flex-shrink: 0; }
        .pay-note-txt { font-size: 13px; color: var(--text-body); line-height: 1.6; }
        .pay-note-txt strong { color: var(--green-dark); }
        .pay-note-txt a { color: var(--red); text-decoration: none; font-weight: 700; }

        /* Zalo btn */
        .zalo-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px; background: #0068ff;
          color: #ffffff; font-size: 14px; font-weight: 800;
          border-radius: var(--radius-sm); text-decoration: none;
          text-transform: uppercase; letter-spacing: 1px;
          box-shadow: 0 4px 14px rgba(0,104,255,0.3);
          transition: all 0.28s;
        }
        .zalo-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,104,255,0.4); }

        /* BUTTONS */
        .btn-primary {
          width: 100%; padding: 14px; margin-top: 10px;
          background: linear-gradient(135deg, var(--orange), var(--red));
          color: #ffffff; font-size: 14px; font-weight: 800;
          border: none; border-radius: var(--radius-sm); cursor: pointer;
          text-transform: uppercase; letter-spacing: 1px;
          box-shadow: 0 4px 14px rgba(232,25,44,0.25);
          transition: all 0.28s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,25,44,0.35); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-back {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%; padding: 11px;
          background: #f1f5f9; border: 1.5px solid var(--border);
          border-radius: var(--radius-sm); color: var(--text-body);
          font-size: 13px; font-weight: 700; cursor: pointer;
          transition: all 0.25s; margin-top: 10px;
        }
        .btn-back:hover { background: #e2e8f0; }

        /* TOAST & FOOTER */
        .toast {
          position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
          background: rgba(16,185,129,0.95); color: #ffffff; padding: 10px 24px;
          border-radius: 50px; font-size: 13px; font-weight: 700;
          z-index: 9999; opacity: 0; transition: opacity 0.3s;
          pointer-events: none; white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .toast.show { opacity: 1; }

        footer {
          text-align: center; padding: 24px 16px;
          border-top: 1px solid var(--border);
          margin-top: 16px;
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
      `}} />

      <div className="min-h-screen bg-[#f8fafc] text-[#475569] pb-12">
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

        <div className="wrap">
          <div className="header-bar-accent" />

          {/* ===================== MAIN CONTAINER ===================== */}
          <main className="container-body">
            
            {/* ===================== STEP 1: FORM ===================== */}
            {step === 1 && (
              <section className="animate-fadeIn">
                <div className="step-indicator">
                  <span className="step-badge active">Bước 1: Điền đăng ký</span>
                </div>
                <h2 className="sec-title">📝 ĐĂNG KÝ KHOÁ HỌC</h2>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label className="form-label" htmlFor="f-name">👤 Họ và Tên</label>
                    <input
                      id="f-name"
                      type="text"
                      placeholder="Nhập họ và tên đầy đủ..."
                      className="form-input"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="f-email">📧 Email nhận bài giảng</label>
                    <input
                      id="f-email"
                      type="email"
                      placeholder="example@gmail.com"
                      className="form-input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="f-zalo">💬 Số điện thoại Zalo</label>
                    <input
                      id="f-zalo"
                      type="tel"
                      placeholder="0xxx.xxx.xxx"
                      className="form-input"
                      value={zalo}
                      onChange={e => setZalo(e.target.value)}
                    />
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="f-ward">📍 Xã (Phường)</label>
                      <input
                        id="f-ward"
                        type="text"
                        placeholder="Xã / phường..."
                        className="form-input"
                        value={ward}
                        onChange={e => setWard(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="f-province">🏙️ Tỉnh / Thành phố</label>
                      <input
                        id="f-province"
                        type="text"
                        placeholder="Tỉnh / thành phố..."
                        className="form-input"
                        value={province}
                        onChange={e => setProvince(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">📚 Chọn khoá học đăng ký</label>
                    
                    <div className="course-checklist">
                      {/* Combo Option */}
                      <div
                        className={`course-check-item combo-item ${isComboSelected ? 'checked' : ''}`}
                        onClick={toggleCombo}
                      >
                        <div className="check-left">
                          <div className="checkbox-icon" style={{ color: isComboSelected ? '#ffffff' : 'transparent' }}>✓</div>
                          <div className="check-title-box">
                            <span className="check-title">⭐ ĐĂNG KÝ COMBO 6 KHOÁ HỌC</span>
                            <span className="check-badge">🔥 Siêu Tiết Kiệm</span>
                          </div>
                        </div>
                        <div className="check-price-box">
                          <span className="price-old-strike">2.494K</span>
                          <span className="price-new-lbl">999.000đ</span>
                        </div>
                      </div>

                      <div className="checklist-divider">Hoặc chọn đăng ký lẻ từng khoá học</div>

                      {/* Individual list */}
                      {COURSES.map(c => {
                        const isChecked = selectedCourses.has(c.id);
                        return (
                          <div
                            key={c.id}
                            className={`course-check-item ${isChecked ? 'checked' : ''}`}
                            onClick={() => toggleCourse(c.id)}
                          >
                            <div className="check-left">
                              <div className="checkbox-icon" style={{ color: isChecked ? '#ffffff' : 'transparent' }}>✓</div>
                              <span className="check-icon-emoji">{c.icon}</span>
                              <div className="check-title-box">
                                <span className="check-title">{c.title}</span>
                              </div>
                            </div>
                            <div className="check-price-box">
                              <span className="price-new-lbl">{c.priceText}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price summary */}
                    {selectedCourses.size > 0 && (
                      <div className="summary-box">
                        <div className="sum-row">
                          <span>Số lượng đã chọn:</span>
                          <strong className="font-bold text-[#1e293b]">{isComboSelected ? '6 khoá học (Combo)' : `${selectedCourses.size} khoá học`}</strong>
                        </div>
                        <div className="sum-row">
                          <span>TỔNG TIỀN TẠM TÍNH:</span>
                          <span className="sum-total">
                            {isComboUpgrade || isComboSelected ? '999.000đ' : `${rawSum.toLocaleString('vi-VN')}đ`}
                          </span>
                        </div>
                        {isComboUpgrade && (
                          <div className="combo-tip">
                            🎉 Hệ thống tự áp dụng giá <strong>COMBO 999K</strong> tiết kiệm nhất cho thầy cô!
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {error && <div className="form-err">{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? '⏳ Đang gửi đăng ký...' : '🚀 Gửi Đăng Ký & Tiếp Tục'}
                  </button>
                </form>
              </section>
            )}

            {/* ===================== STEP 2: PAYMENT ===================== */}
            {step === 2 && (
              <section className="animate-fadeIn">
                <div className="step-indicator">
                  <span className="step-badge active" style={{ background: 'var(--green)' }}>Bước 2: Thanh toán</span>
                </div>
                <h2 className="sec-title">💳 THÔNG TIN CHUYỂN KHOẢN</h2>

                <div className="pay-card">
                  <div className="pay-header">
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Khoá học đăng ký</div>
                    <span className="pay-course-lbl">
                      {paymentData.courseName} – {paymentData.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  {/* Transfer code */}
                  <div className="pay-code-box">
                    <div className="pay-code-label">Nội dung chuyển khoản bắt buộc</div>
                    <div
                      className="pay-code-value"
                      onClick={() => copyText(paymentData.code, 'mã nội dung')}
                      title="Click để sao chép"
                    >
                      {paymentData.code}
                    </div>
                    <div className="pay-code-hint">📋 Click lên đoạn mã để sao chép nhanh</div>
                  </div>

                  {/* Tabs */}
                  <div className="bank-tabs">
                    <button
                      className={`bank-tab ${activeBank === 'mb' ? 'active' : ''}`}
                      onClick={() => setActiveBank('mb')}
                    >
                      🏦 MB Bank
                    </button>
                    <button
                      className={`bank-tab ${activeBank === 'tcb' ? 'active' : ''}`}
                      onClick={() => setActiveBank('tcb')}
                    >
                      🏦 Techcombank
                    </button>
                  </div>

                  {/* MB Bank Panel */}
                  <div className={`bank-panel ${activeBank === 'mb' ? 'active' : ''}`}>
                    <div className="bi-row">
                      <div className="bi-label">Chủ TK</div>
                      <div className="bi-value">CONG TY TNHH CONG NGHE GIAO DUC MRE</div>
                    </div>
                    <div className="bi-row">
                      <div className="bi-label">Số TK</div>
                      <div className="bi-stk" onClick={() => copyText('353536888', 'số tài khoản')}>
                        353536888 <span className="copy-ico">📋</span>
                      </div>
                    </div>
                    <div className="bi-row">
                      <div className="bi-label">Ngân hàng</div>
                      <div className="bi-value">MB Bank (Ngân hàng Quân đội)</div>
                    </div>
                    <div className="qr-wrap">
                      <div className="qr-label">Quét mã QR để chuyển khoản điền sẵn nội dung</div>
                      <div className="qr-frame">
                        <img src={qrMb} alt="QR MB Bank" className="qr-img" />
                      </div>
                      <div className="qr-brand mb-brand">MB Bank</div>
                    </div>
                  </div>

                  {/* Techcombank Panel */}
                  <div className={`bank-panel ${activeBank === 'tcb' ? 'active' : ''}`}>
                    <div className="bi-row">
                      <div className="bi-label">Chủ TK</div>
                      <div className="bi-value">CONG TY TNHH CONG NGHE GIAO DUC MRE</div>
                    </div>
                    <div className="bi-row">
                      <div className="bi-label">Số TK</div>
                      <div className="bi-stk" onClick={() => copyText('836869999', 'số tài khoản')}>
                        836869999 <span className="copy-ico">📋</span>
                      </div>
                    </div>
                    <div className="bi-row">
                      <div className="bi-label">Ngân hàng</div>
                      <div className="bi-value">Techcombank (TMCP Kỹ Thương)</div>
                    </div>
                    <div className="qr-wrap">
                      <div className="qr-label">Quét mã QR để chuyển khoản điền sẵn nội dung</div>
                      <div className="qr-frame">
                        <img src={qrTcb} alt="QR Techcombank" className="qr-img" />
                      </div>
                      <div className="qr-brand tcb-brand">Techcombank</div>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="pay-note">
                    <span className="pay-note-ico">💬</span>
                    <div className="pay-note-txt">
                      Sau khi chuyển khoản xong, thầy cô hãy bấm <strong>"Báo Zalo Đã Thanh Toán"</strong> bên dưới để nhân viên kích hoạt tài khoản học ngay lập tức.
                    </div>
                  </div>

                  <a
                    href="https://zalo.me/0396581283"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="zalo-btn"
                  >
                    <span>💬</span> Báo Zalo Đã Thanh Toán
                  </a>

                  <button
                    onClick={handleBack}
                    className="btn-back"
                  >
                    ← Quay lại chỉnh sửa thông tin
                  </button>
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
        <div className={`toast ${toastMessage ? 'show' : ''}`}>
          {toastMessage}
        </div>
      </div>
    </>
  );
}

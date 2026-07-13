import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#475569] font-sans pb-12">
      {/* ===================== TOP NAV ===================== */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="max-w-[600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#f97316] to-[#e8192c] rounded-lg flex items-center justify-center font-black text-white text-lg shadow-sm">M</div>
            <div className="flex flex-col">
              <span className="text-[16px] font-black text-[#e8192c] leading-tight">Maris Slide</span>
              <span className="text-[8px] font-bold text-[#94a3b8] uppercase tracking-wider">Tiên phong công nghệ giáo dục</span>
            </div>
          </div>
          <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12.5px] font-bold text-[#1e293b] bg-[#f1f5f9] border border-[#e2e8f0] px-3.5 py-1.5 rounded-full transition-colors hover:border-[#e8192c] hover:text-[#e8192c] hover:bg-[#fff1f3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8192c] animate-ping" />
            <span>0396.581.283</span>
          </a>
        </div>
      </header>

      <div className="max-w-[600px] mx-auto px-4">
        <div className="w-8 h-1 bg-[#f97316] rounded-full mx-auto mt-4" />

        {/* ===================== MAIN CONTAINER ===================== */}
        <main className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm mt-6">
          
          {/* ===================== STEP 1: FORM ===================== */}
          {step === 1 && (
            <section className="animate-fadeIn">
              <div className="flex justify-center mb-6">
                <span className="text-[10px] font-extrabold uppercase bg-[#e8192c] text-white px-3 py-1 rounded-full shadow-sm">
                  Bước 1: Điền đăng ký
                </span>
              </div>
              <h2 className="text-lg font-black text-[#1e293b] text-center mb-5 tracking-wide uppercase">
                📝 ĐĂNG KÝ KHOÁ HỌC
              </h2>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-extrabold text-[#1e293b] uppercase tracking-wide">👤 Họ và Tên</label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên đầy đủ..."
                    className="w-full p-3 bg-white border-1.5 border-[#e2e8f0] rounded-lg text-sm outline-none transition-all focus:border-[#e8192c] focus:ring-4 focus:ring-red-500/5"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-extrabold text-[#1e293b] uppercase tracking-wide">📧 Email nhận bài giảng</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full p-3 bg-white border-1.5 border-[#e2e8f0] rounded-lg text-sm outline-none transition-all focus:border-[#e8192c] focus:ring-4 focus:ring-red-500/5"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-extrabold text-[#1e293b] uppercase tracking-wide">💬 Số điện thoại Zalo</label>
                  <input
                    type="tel"
                    placeholder="0xxx.xxx.xxx"
                    className="w-full p-3 bg-white border-1.5 border-[#e2e8f0] rounded-lg text-sm outline-none transition-all focus:border-[#e8192c] focus:ring-4 focus:ring-red-500/5"
                    value={zalo}
                    onChange={e => setZalo(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-extrabold text-[#1e293b] uppercase tracking-wide">📍 Xã (Phường)</label>
                    <input
                      type="text"
                      placeholder="Xã / phường..."
                      className="w-full p-3 bg-white border-1.5 border-[#e2e8f0] rounded-lg text-sm outline-none transition-all focus:border-[#e8192c] focus:ring-4 focus:ring-red-500/5"
                      value={ward}
                      onChange={e => setWard(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-extrabold text-[#1e293b] uppercase tracking-wide">🏙️ Tỉnh / Thành phố</label>
                    <input
                      type="text"
                      placeholder="Tỉnh / thành phố..."
                      className="w-full p-3 bg-white border-1.5 border-[#e2e8f0] rounded-lg text-sm outline-none transition-all focus:border-[#e8192c] focus:ring-4 focus:ring-red-500/5"
                      value={province}
                      onChange={e => setProvince(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 mt-2">
                  <label className="text-[11.5px] font-extrabold text-[#1e293b] uppercase tracking-wide">📚 Chọn khoá học đăng ký</label>
                  
                  <div className="border-1.5 border-[#e2e8f0] rounded-lg overflow-hidden bg-white flex flex-col">
                    {/* Combo Option */}
                    <div
                      className={`flex items-center justify-between p-3.5 border-b-2 border-[#e2e8f0] cursor-pointer transition-colors ${isComboSelected ? 'bg-[#fff1f2]' : 'bg-[#fff8f8] hover:bg-[#fff1f1]'}`}
                      onClick={toggleCombo}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[10px] font-black transition-colors ${isComboSelected ? 'bg-[#e8192c] border-[#e8192c] text-white' : 'border-[#e2e8f0] text-transparent'}`}>✓</div>
                        <div className="flex flex-col">
                          <span className="text-[13.5px] font-black text-[#1e293b] leading-tight">⭐ ĐĂNG KÝ COMBO 6 KHOÁ HỌC</span>
                          <span className="inline-block text-[8px] font-black bg-gradient-to-r from-[#e8192c] to-[#f97316] text-white px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 self-start">🔥 Siêu Tiết Kiệm</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-[#94a3b8] line-through block leading-none mb-1">2.494K</span>
                        <span className="text-[14px] font-black bg-gradient-to-r from-[#f97316] to-[#e8192c] bg-clip-text text-transparent">999.000đ</span>
                      </div>
                    </div>

                    <div className="bg-[#f1f5f9] px-4 py-1.5 text-[9.5px] font-extrabold text-[#94a3b8] uppercase tracking-wider border-b border-[#e2e8f0]">
                      Hoặc chọn đăng ký lẻ từng khoá học
                    </div>

                    {/* Individual list */}
                    {COURSES.map(c => {
                      const isChecked = selectedCourses.has(c.id);
                      return (
                        <div
                          key={c.id}
                          className={`flex items-center justify-between p-3 border-b border-[#e2e8f0] last:border-b-0 cursor-pointer transition-colors ${isChecked ? 'bg-[#f0fdf4]' : 'hover:bg-[#f8fafc]'}`}
                          onClick={() => toggleCourse(c.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center text-[10px] font-black transition-colors ${isChecked ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-[#e2e8f0] text-transparent'}`}>✓</div>
                            <span className="text-xl flex-shrink-0">{c.icon}</span>
                            <span className="text-[13px] font-bold text-[#1e293b] leading-tight">{c.title}</span>
                          </div>
                          <span className="text-[13.5px] font-black text-[#e8192c]">{c.priceText}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price recap */}
                  {selectedCourses.size > 0 && (
                    <div className="bg-[#f8fafc] border-1.5 border-[#e2e8f0] rounded-lg p-3.5 mt-2 animate-fadeIn">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span>Số lượng đã chọn:</span>
                        <strong className="font-extrabold text-[#1e293b]">{isComboSelected ? '6 khoá học (Combo)' : `${selectedCourses.size} khoá học`}</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span>TỔNG TIỀN TẠM TÍNH:</span>
                        <span className="text-[17px] font-black text-[#e8192c]">
                          {isComboUpgrade || isComboSelected ? '999.000đ' : `${rawSum.toLocaleString('vi-VN')}đ`}
                        </span>
                      </div>
                      {isComboUpgrade && (
                        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-md p-2 text-[11px] text-[#059669] font-bold text-center mt-2.5">
                          🎉 Hệ thống tự áp dụng giá <strong>COMBO 999K</strong> tiết kiệm nhất cho thầy cô!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {error && <div className="text-red-600 text-xs font-bold mt-1 text-center">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-3.5 mt-3.5 bg-gradient-to-r from-[#f97316] to-[#e8192c] text-white text-sm font-black uppercase tracking-wider rounded-lg shadow-md transition-all hover:scale-[1.01] active:scale-100 disabled:opacity-50"
                >
                  {loading ? '⏳ Đang gửi đăng ký...' : '🚀 Gửi Đăng Ký & Tiếp Tục'}
                </button>
              </form>
            </section>
          )}

          {/* ===================== STEP 2: PAYMENT ===================== */}
          {step === 2 && (
            <section className="animate-fadeIn">
              <div className="flex justify-center mb-6">
                <span className="text-[10px] font-extrabold uppercase bg-[#10b981] text-white px-3 py-1 rounded-full shadow-sm">
                  Bước 2: Thanh toán
                </span>
              </div>
              <h2 className="text-lg font-black text-[#1e293b] text-center mb-5 tracking-wide uppercase">
                💳 THÔNG TIN CHUYỂN KHOẢN
              </h2>

              <div className="flex flex-col gap-4">
                <div className="p-3.5 bg-[#fff5f5] border border-[#e2e8f0] rounded-lg">
                  <div className="text-[10px] font-bold uppercase text-[#94a3b8] mb-1">Khoá học đăng ký</div>
                  <span className="inline-block text-xs font-bold text-[#e8192c] bg-white border border-red-200 px-3 py-1.5 rounded-md">
                    {paymentData.courseName} – {paymentData.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {/* Transfer code */}
                <div className="bg-[#fffbeb] border-1.5 border-[#fdba74] rounded-lg p-4 text-center">
                  <div className="text-[10px] font-bold uppercase text-[#475569] mb-1">Nội dung chuyển khoản bắt buộc</div>
                  <div
                    className="text-2xl font-black tracking-widest text-[#f97316] font-mono cursor-pointer hover:opacity-85 active:scale-95 transition-all my-1.5"
                    onClick={() => copyText(paymentData.code, 'mã nội dung')}
                    title="Click để sao chép"
                  >
                    {paymentData.code}
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">📋 Click lên đoạn mã để sao chép nhanh</div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold border-1.5 transition-all ${activeBank === 'mb' ? 'border-[#e8192c] bg-white text-[#e8192c] shadow-sm' : 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569]'}`}
                    onClick={() => setActiveBank('mb')}
                  >
                    🏦 MB Bank
                  </button>
                  <button
                    className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold border-1.5 transition-all ${activeBank === 'tcb' ? 'border-[#e8192c] bg-white text-[#e8192c] shadow-sm' : 'border-[#e2e8f0] bg-[#f8fafc] text-[#475569]'}`}
                    onClick={() => setActiveBank('tcb')}
                  >
                    🏦 Techcombank
                  </button>
                </div>

                {/* MB Bank Panel */}
                {activeBank === 'mb' && (
                  <div className="animate-fadeIn">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3 p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
                        <span className="w-18 font-extrabold text-[#94a3b8] uppercase">Chủ TK</span>
                        <span className="font-bold text-[#1e293b]">CONG TY TNHH CONG NGHE GIAO DUC MRE</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-18 font-extrabold text-[#94a3b8] uppercase">Số TK</span>
                          <span className="text-base font-black text-[#e8192c] tracking-wider">353536888</span>
                        </div>
                        <button
                          className="bg-white border border-[#e2e8f0] text-[10px] font-extrabold px-2.5 py-1 rounded transition-colors hover:border-[#e8192c] hover:text-[#e8192c]"
                          onClick={() => copyText('353536888', 'số tài khoản')}
                        >
                          📋 Sao chép
                        </button>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
                        <span className="w-18 font-extrabold text-[#94a3b8] uppercase">Ngân hàng</span>
                        <span className="font-bold text-[#1e293b]">MB Bank (Ngân hàng Quân đội)</span>
                      </div>
                    </div>
                    <div className="text-center mt-5">
                      <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider mb-2">Quét mã QR để chuyển khoản điền sẵn nội dung</div>
                      <div className="bg-white p-2.5 border border-[#e2e8f0] rounded-lg inline-block shadow-sm">
                        <img src={qrMb} alt="QR MB Bank" className="w-[180px] h-[180px] rounded" />
                      </div>
                      <div className="text-xs font-black text-[#003893] mt-2">MB Bank</div>
                    </div>
                  </div>
                )}

                {/* Techcombank Panel */}
                {activeBank === 'tcb' && (
                  <div className="animate-fadeIn">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3 p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
                        <span className="w-18 font-extrabold text-[#94a3b8] uppercase">Chủ TK</span>
                        <span className="font-bold text-[#1e293b]">CONG TY TNHH CONG NGHE GIAO DUC MRE</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-18 font-extrabold text-[#94a3b8] uppercase">Số TK</span>
                          <span className="text-base font-black text-[#e8192c] tracking-wider">836869999</span>
                        </div>
                        <button
                          className="bg-white border border-[#e2e8f0] text-[10px] font-extrabold px-2.5 py-1 rounded transition-colors hover:border-[#e8192c] hover:text-[#e8192c]"
                          onClick={() => copyText('836869999', 'số tài khoản')}
                        >
                          📋 Sao chép
                        </button>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
                        <span className="w-18 font-extrabold text-[#94a3b8] uppercase">Ngân hàng</span>
                        <span className="font-bold text-[#1e293b]">Techcombank (TMCP Kỹ Thương)</span>
                      </div>
                    </div>
                    <div className="text-center mt-5">
                      <div className="text-[10px] text-[#94a3b8] uppercase tracking-wider mb-2">Quét mã QR để chuyển khoản điền sẵn nội dung</div>
                      <div className="bg-white p-2.5 border border-[#e2e8f0] rounded-lg inline-block shadow-sm">
                        <img src={qrTcb} alt="QR Techcombank" className="w-[180px] h-[180px] rounded" />
                      </div>
                      <div className="text-xs font-black text-[#ed1c24] mt-2">Techcombank</div>
                    </div>
                  </div>
                )}

                {/* Note */}
                <div className="flex gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-3.5 mt-2">
                  <span className="text-xl">💬</span>
                  <div className="text-xs leading-relaxed">
                    Sau khi chuyển khoản xong, thầy cô hãy bấm <strong>"Báo Zalo Đã Thanh Toán"</strong> bên dưới để nhân viên kích hoạt tài khoản học ngay lập tức.
                  </div>
                </div>

                <a
                  href="https://zalo.me/0396581283"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full p-3.5 bg-[#0068ff] text-white text-xs font-extrabold uppercase tracking-wide rounded-lg shadow-md transition-all hover:scale-[1.01] active:scale-100"
                >
                  <span>💬</span> Báo Zalo Đã Thanh Toán
                </a>

                <button
                  onClick={handleBack}
                  className="w-full py-2.5 bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg text-xs font-bold text-[#475569] transition-all hover:bg-[#e2e8f0]"
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
      {toastMessage && (
        <div className="fixed bottom-[30px] left-1/2 transform -translate-x-1/2 bg-[#10b981] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md z-50 animate-fadeIn">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

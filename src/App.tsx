import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import logoImg from './logo.png';

/* =============================================
   CONSTANTS
   ============================================= */
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxfCRCO8-lU8p-flBTPR8gXcKhGfD4XxvcX9daP6tB6kIzfAfE_uPGzMHCq0he2P-Ma/exec';

const LESSON_COLORS = [
  '#7b2ff7','#4a9fff','#ff6b00','#00c851',
  '#ff2d55','#00a8ff','#ff9500','#7b2ff7','#4a9fff','#00e5a8',
];

/* =============================================
   DATA – COURSES
   ============================================= */
interface CourseData {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  oldPrice: string;
  salePrice: string;
  discount: string;
  trialText: string;
  trialUrl: string;
  features: string[];
  lessons: string[];
}

const COURSES: CourseData[] = [
  {
    id: 1, icon: '🎓',
    title: 'Khoá Thiết Kế Bài Giảng E-Learning',
    subtitle: 'iSpring Suite 11',
    oldPrice: '499K', salePrice: '299K', discount: 'Ưu đãi -40%',
    trialText: 'Bài 4: Tạo sẵn mẫu câu hỏi.',
    trialUrl: 'https://youtu.be/4yi01CWL9Y4',
    features: [
      'Thiết kế bài giảng chuyên nghiệp',
      'Tạo Quiz tương tác hấp dẫn',
      'Đồng bộ âm thanh, video dễ dàng',
      'Xuất bản SCORM, HTML5, Video',
    ],
    lessons: [
      '📌 Phần 1: Giới thiệu tổng quan về bài giảng E-learning',
      'Bài 1: E-Learning là gì? Các phần mềm tham khảo để làm E-Learning.',
      'Bài 2: Các bước thiết kế và bố cục của bài giảng E-Learning.',
      'Bài 3: Bài giảng Powerpoint đạt yêu cầu.',
      '📌 Phần 2: Thiết kế câu hỏi trong Quizmaker',
      'Bài 4: Tạo sẵn mẫu câu hỏi.',
      'Bài 5: Cài đặt giao diện và các dạng câu hỏi trong Quiz Maker.',
      'Bài 5.1: Dạng bài tập chọn 1 đáp án đúng.',
      'Bài 5.2: Dạng bài tập chọn nhiều đáp án đúng.',
      'Bài 5.3: Dạng bài tập ĐÚNG - SAI và câu trả lời ngắn.',
      'Bài 5.4: Dạng bài tập GHÉP CỘT và ĐIỀN TỪ vào ô trống.',
      'Bài 5.5: Dạng bài tập CHỌN VÙNG TRONG ẢNH và KÉO THẢ.',
      'Bài 5.6: Dạng bài tập KHOẢNG GIÁ TRỊ và SẮP XẾP.',
      'Bài 5.7: Dạng bài tập TỰ LUẬN và khảo sát.',
      'Bài 6: Chèn hình ảnh, video, âm thanh và cài đặt hiệu ứng trong Quiz Maker.',
      'Bài 7: Tạo thông tin người dùng và cài đặt gửi kết quả bài Quiz về Email.',
      '📌 Phần 3: Tạo thiết bị dạy học số trên Interaction',
      'Bài 8: Thiết bị dạy học số là gì?',
      'Bài 9: Các bước thiết kế thiết bị dạy học số.',
      'Bài 10: Thực hành thiết kế thiết bị dạy học số đơn giản.',
      '📌 Phần 4: Kết hợp các phần để hoàn thiện nội dung E-Learning',
      'Bài 11: Chèn bộ câu hỏi Quiz vào Powerpoint.',
      'Bài 12: Chèn Thiết bị dạy học số vào Powerpoint.',
      'Bài 13: Chèn các trò chơi và web bên ngoài vào bài E-Learning.',
      '📌 Phần 5: Đồng bộ âm thanh và video',
      'Bài 14: Thu âm và đồng bộ âm thanh cùng lúc.',
      'Bài 15: Đồng bộ âm thanh, video bằng Manage Narration.',
      'Bài 16: Chỉnh sửa thời gian trong Slide Properties.',
      '📌 Phần 6: Thiết lập hoàn thiện bài giảng E-Learning',
      'Bài 17: Cài đặt thông tin GV và đính kèm tệp thuyết trình.',
      'Bài 18: Phân chia mục nội dung và chuyển tiếp Slide nâng cao.',
      'Bài 19: Thiết lập giao diện bài giảng E-learning.',
      '📌 Phần 7: Xuất bản bài giảng',
      'Bài 20: Xuất bản bài giảng E-Learning.',
      'Bài 21: Chụp ảnh màn hình chèn vào bài thuyết trình.',
    ],
  },
  {
    id: 2, icon: '🤖',
    title: 'Khoá Ứng Dụng AI Vào Giảng Dạy',
    subtitle: 'ChatGPT · Gemini · Canva AI · Leonardo AI · Veo 3',
    oldPrice: '999K', salePrice: '399K', discount: 'Ưu đãi -60%',
    trialText: 'Bài 4: Tạo giọng nói trẻ con bằng AI.',
    trialUrl: 'https://youtu.be/z9givVLPiOQ',
    features: [
      'Soạn giáo án bằng AI nhanh chóng',
      'Tạo video và hình ảnh AI đẹp mắt',
      'Tạo học liệu số thông minh',
      'Viết SKKN và nghiên cứu nhanh',
    ],
    lessons: [
      'Mở đầu: Giới thiệu khoá học và lưu ý.',
      'Bài 1: AI siêu trí tuệ Chat GPT.',
      'Bài 2: Soạn giáo án siêu tốc với trợ lý AI.',
      'Bài 3: Các AI chuyển đổi văn bản thành giọng nói.',
      'Bài 4: Tạo giọng nói trẻ con bằng AI.',
      'Bài 5: Tạo hình ảnh bằng Leonardo AI.',
      'Bài 6: AI tạo video nhép miệng cho người thật.',
      'Bài 7: AI tạo bài giảng Powerpoint tự động.',
      'Bài 8: Chuyển đổi hình ảnh SGK thành video bằng Runway AI.',
      'Bài 9: Tạo hình ảnh đồng nhất nhân vật bằng Nano Banana.',
      'Bài 10: Tạo video hoạt hình đồng nhất nhân vật bằng Veo 3 AI.',
      'Bài 11: Thực hành tạo video: Chiếc mũ ảo thuật.',
      'Bài 12: Thực hành tạo tranh cát có cử động tay vẽ.',
      'Bài 13: Thực hành làm video theo phong cách ghép lá.',
      'Bài 14: Thực hành làm video theo phong cách lịch sử cổ xưa.',
      'Bài 15: Tạo video minh hoạ truyện, thơ.',
      'Bài 16: Tạo MV ca nhạc sôi động bằng AI (Minh hoạ ATGT).',
      'Bài 17: Sử dụng các công cụ AI trên Canva PRO.',
      'Bài 18: Thiết kế truyện tranh sinh động bằng Canva AI Magic.',
      'Bài 19: Ứng dụng công nghệ 3D vào dạy học.',
      'Bài 20: Xây dựng ứng dụng tạo ảnh đồng nhất bằng AI.',
      'Bài 21: Sử dụng AI làm SKKN, Biện pháp - Nâng cao.',
      'Bài 22: Tạo nhân vật đồng hành bằng AI.',
      'Bài 23: Tạo sơ đồ tư duy, tóm tắt nội dung bằng AI Gemini.',
      'Bài 24: Sử dụng full tính năng trên Notebook LM.',
      'Bài 25: Tạo APP mô phỏng bằng AI.',
    ],
  },
  {
    id: 3, icon: '📱',
    title: 'Khoá Tạo App Nâng Cao',
    subtitle: 'Sử dụng AI tạo APP – Không cần lập trình',
    oldPrice: '999K', salePrice: '399K', discount: 'Ưu đãi -60%',
    trialText: 'Bài 2: Sử dụng phần mềm viết câu lệnh PRO + cài API.',
    trialUrl: 'https://youtu.be/5faCaVPbx7k',
    features: [
      'Tạo App không cần lập trình',
      'Quản lý học sinh thông minh',
      'Tạo trò chơi giáo dục',
      'Tiết kiệm thời gian quản lý',
    ],
    lessons: [
      'Bài 1: Cài đặt các phần mềm để tạo APP bằng AI.',
      'Bài 2: Sử dụng phần mềm viết câu lệnh PRO + cài API.',
      'Bài 3: Thực hành tạo APP quản lý, đánh giá học sinh.',
      'Bài 4: Thực hành tạo APP viết Sáng kiến kinh nghiệm tự động.',
      'Bài 5: Thực hành tạo APP soạn giáo án chuẩn khung NLS.',
      'Bài 6: Thực hành tạo APP GAME lật mảnh ghép.',
      'Bài 7: Thực hành tạo APP GAME Đấu trường trí tuệ.',
      'Bài 8: Tạo APP quét độ trùng lặp sáng kiến.',
      'Bài 9: Tạo APP gọi tên học sinh theo danh sách.',
    ],
  },
  {
    id: 4, icon: '🎨',
    title: 'Khoá Sử Dụng Canva',
    subtitle: 'Thiết kế từ cơ bản đến nâng cao',
    oldPrice: '499K', salePrice: '299K', discount: 'Ưu đãi -40%',
    trialText: 'Bài 2: Cách chuyển sang tài khoản Canva Edu Pro đội nhóm.',
    trialUrl: 'https://youtu.be/lM20ZQ47y7w',
    features: [
      'Thiết kế slide bài giảng chuyên nghiệp',
      'Tạo infographic đẹp mắt',
      'Tạo học liệu số sáng tạo',
      'Ứng dụng AI Canva hiệu quả',
    ],
    lessons: [
      'Bài 1: Hướng dẫn đăng nhập vào Canva.',
      'Bài 2: Cách chuyển sang tài khoản Canva Edu Pro đội nhóm.',
      'Bài 3: Mẹo chuyển bài làm từ TK cá nhân sang TK đội nhóm.',
      'Bài 4: Cách sử dụng các công cụ AI chỉnh ảnh trên Canva.',
      'Bài 5: Tìm hiểu thanh công cụ ngang phía trên.',
      'Bài 6: Cách lấy mẫu Slide có sẵn theo chủ đề.',
      'Bài 7: Khám phá mục thành phần trong Canva.',
      'Bài 8: Tạo hiệu ứng cho toàn bộ bài giảng chỉ bằng 1 click.',
      'Bài 9: Bí kíp tạo chữ đồ hoạ siêu đẹp bằng AI Canva.',
      'Bài 10: Các ứng dụng và AI tích hợp trên Canva.',
      'Bài 11: Làm quen giao diện tạo ảnh trên Canva.',
      'Bài 12: Biên tập video trên Canva.',
      'Bài 13: Tạo bối cảnh theo ý tưởng trên Canva.',
      'Bài 14: Tạo câu hỏi tương tác trên Canva.',
      'Bài 15: Dễ dàng tạo bài giảng với Canva.',
      'Bài 16: Cách tạo sách lật trên Canva.',
      'Bài 17: Cách tạo nhân vật cử động và hoạt hình trên Canva - P1.',
      'Bài 18: Cách tạo nhân vật cử động và hoạt hình trên Canva - P2.',
      'Bài 19: Tạo thiết bị dạy học số bằng 1 câu lệnh trên Canva.',
    ],
  },
  {
    id: 5, icon: '📊',
    title: 'Khoá Thiết Kế Bài Giảng PowerPoint',
    subtitle: 'Animation · Trigger · Transition',
    oldPrice: '499K', salePrice: '299K', discount: 'Ưu đãi -40%',
    trialText: 'Bài 23: Các bước để thiết kế bài giảng điện tử.',
    trialUrl: 'https://youtu.be/YHsfEFImUmg',
    features: [
      'Thiết kế bài giảng sinh động',
      'Hiệu ứng chuyên nghiệp',
      'Trò chơi tương tác Trigger',
      'Nâng cao kỹ năng trình chiếu',
    ],
    lessons: [
      'Mở đầu: Giới thiệu nội dung và lưu ý.',
      '📌 Phần 1: Thành thạo nhóm lệnh TỆP (FILE)',
      'Bài 1: Những thao tác quen thuộc.',
      'Bài 2: Các tính năng đặc biệt.',
      '📌 Phần 2: Thành thạo nhóm lệnh BAN ĐẦU (HOME)',
      'Bài 3: Làm quen các công cụ "Bảng tạm".',
      'Bài 4: Tham khảo các bố cục có sẵn trên "Trang chiếu".',
      'Bài 5: Font chữ và màu sắc.',
      'Bài 6: Căn chỉnh và giãn cách dòng trong đoạn văn.',
      'Bài 7: Vẽ các hình học và sắp xếp lớp.',
      'Bài 8: Bộ công cụ chỉnh sửa và phần mềm bổ trợ.',
      '📌 Phần 3: Thành thạo nhóm lệnh CHÈN (INSERT)',
      'Bài 9: Thêm trang chiếu và tạo bảng trên Powerpoint.',
      'Bài 10: Chèn các hình học, biểu tượng, biểu đồ.',
      'Bài 11: Tạo liên kết để có được bài trình chiếu chuyên nghiệp.',
      'Bài 12: Thêm chú thích và các dạng văn bản vào trang chiếu.',
      'Bài 13: Cách chèn các ký hiệu toán học, phương trình.',
      'Bài 14: Đưa âm thanh và video vào bài giảng.',
      '📌 Phần 4: Thành thạo nhóm lệnh Thiết kế (DESIGN)',
      'Bài 15: Thiết kế với nhóm lệnh Design - mẫu nền.',
      'Bài 16: Thiết kế bài giảng sinh động với công cụ chủ đề.',
      '📌 Phần 5: Thành thạo CHUYỂN TIẾP & HOẠT HÌNH',
      'Bài 17: Transition - Hiệu ứng chuyển cảnh biến đổi ma thuật.',
      'Bài 18: Animation - Làm quen các dạng hiệu ứng hoạt hình.',
      'Bài 19: Animation - Tùy chỉnh cho hiệu ứng nâng cao.',
      '📌 Phần 6: Trình chiếu, ghi màn hình, ghi âm',
      'Bài 20: Kỹ thuật cài đặt trình chiếu trên Powerpoint.',
      'Bài 21: Nhóm công cụ ghi màn hình và ghi âm.',
      'Bài 22: Công cụ kiểm tra lỗi cho bài thuyết trình.',
      '📌 Phần 7: Thực hành thiết kế bài giảng Powerpoint',
      'Bài 23: Các bước để thiết kế bài giảng điện tử.',
      'Bài 24: Bí quyết thiết kế 1 bài giảng sinh động, màu sắc.',
      'Bài 25: Thực hành thiết kế bài giảng Powerpoint.',
      'Bài 26: Chèn sơ đồ tư duy siêu đẹp vào bài giảng Powerpoint.',
      '📌 Phần 8: Thực hành thiết kế trò chơi Powerpoint',
      'Bài 27: Các bước để thiết kế trò chơi trên Powerpoint.',
      'Bài 28: Hiệu ứng Trigger (thủ tục lẫy) - công cụ quan trọng trong thiết kế trò chơi.',
      'Bài 29: Thiết kế trò chơi: Giải cứu muông thú.',
    ],
  },
  {
    id: 6, icon: '🎬',
    title: 'Khoá Dựng Hoạt Hình 2D Bằng Animiz',
    subtitle: 'Animiz + AI Giọng Nói',
    oldPrice: '499K', salePrice: '299K', discount: 'Ưu đãi -40%',
    trialText: 'Bài 4: Các thao tác cơ bản đối với lớp thành phần của video.',
    trialUrl: 'https://youtu.be/P9kuLNIXAjw',
    features: [
      'Tạo phim hoạt hình giáo dục',
      'Kết hợp AI giọng nói tự nhiên',
      'Xây dựng tình huống học tập',
      'Dùng video sinh động cho bài giảng',
    ],
    lessons: [
      '📌 Chương I: Làm quen giao diện Animiz Animation Maker',
      'Bài 1: Giới thiệu phần mềm Animiz Animation Maker.',
      'Bài 2: Chức năng từng khu vực - Tìm hiểu khu vực Timeline.',
      'Bài 3: Tìm hiểu các công cụ trong phần SideBar.',
      'Bài 4: Các thao tác cơ bản đối với lớp thành phần của video.',
      'Bài 5: Chèn phụ đề và âm thanh cho video hoạt hình.',
      '📌 Chương II: Thực hành kết hợp AI thiết kế phim tình huống',
      'Bài 1: Hướng dẫn làm kịch bản video bằng AI Chat GPT.',
      'Bài 2: Thêm phông nền và chèn nhân vật theo kịch bản.',
      'Bài 3: Giải thích chi tiết một số hành động của nhân vật.',
      'Bài 4: Thiết lập hành động cho nhân vật 1.',
      'Bài 5: Thiết lập hành động cho nhân vật 2.',
      'Bài 6: Chèn đoạn hội thoại và AI chuyển văn bản thành âm thanh.',
      'Bài 7: Hoàn thiện đoạn phim hoạt hình tình huống.',
      'Bài 8: Kết thúc bài học.',
      '📌 Chương III: Bổ sung kiến thức',
      'Bài 1: Thêm nhân vật mới vào phần mềm Animiz Animation Maker.',
      'Bài 2: Dựng phim hoạt hình 2D trên Powerpoint - Phần 1.',
      'Bài 3: Dựng phim hoạt hình 2D trên Powerpoint - Phần 2.',
    ],
  },
];

/* =============================================
   DATA – GIFTS
   ============================================= */
const GIFTS = [
  { emoji: '🎮', name: '300 Game PowerPoint' },
  { emoji: '🎨', name: 'Tài Khoản Canva Edu Pro 12 Tháng' },
  { emoji: '📋', name: 'App Quản Lý Học Sinh' },
  { emoji: '🏆', name: 'App Game Đấu Trường Trí Tuệ' },
  { emoji: '✍️', name: 'App Viết Sáng Kiến Kinh Nghiệm' },
  { emoji: '⚡', name: 'App Viết Câu Lệnh AI Nâng Cao' },
  { emoji: '📝', name: 'App Soạn Giáo Án Chuẩn Khung NLS' },
  { emoji: '🎯', name: 'App Game Kéo Co Kỹ Thuật Số' },
  { emoji: '💬', name: 'Hỗ Trợ Trọn Đời 1:1 Qua Zalo' },
  { emoji: '♾️', name: 'Được Học Không Giới Hạn' },
];

/* =============================================
   DATA – PAYMENT
   ============================================= */
const COURSE_PAY: Record<string, { code: string; price: number }> = {
  'Combo 6 Khoá Học - 999K':              { code: 'COMBO', price: 999000 },
  'Khoá Thiết Kế Bài Giảng E-Learning':   { code: 'ELEAR', price: 299000 },
  'Khoá Ứng Dụng AI Vào Giảng Dạy':       { code: 'AIVGD', price: 399000 },
  'Khoá Tạo App Nâng Cao':                 { code: 'APPNC', price: 399000 },
  'Khoá Sử Dụng Canva':                    { code: 'CANVA', price: 299000 },
  'Khoá Thiết Kế Bài Giảng PowerPoint':    { code: 'PPTBG', price: 299000 },
  'Khoá Dựng Hoạt Hình 2D Bằng Animiz':   { code: 'ANIMZ', price: 299000 },
};

/* =============================================
   STARS CANVAS
   ============================================= */
function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let stars: { x: number; y: number; r: number; a: number; da: number }[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStars() {
      if (!canvas) return;
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        r: Math.random() > 0.85 ? 1.8 : 1,
        a: Math.random(),
        da: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      }));
    }

    function drawStars() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.da;
        if (s.a <= 0 || s.a >= 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(drawStars);
    }

    const onResize = () => { resize(); createStars(); };
    window.addEventListener('resize', onResize);
    resize();
    createStars();
    drawStars();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return null; // Hidden in light theme via CSS
}

/* =============================================
   COPY TOAST
   ============================================= */
function showToast(msg: string) {
  let t = document.getElementById('copy-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'copy-toast';
    t.className = 'copy-toast';
    document.body.appendChild(t);
  }
  t.textContent = '✅ ' + msg;
  t.classList.add('show');
  setTimeout(() => t!.classList.remove('show'), 2500);
}

/* =============================================
   PRODUCTS MODAL
   ============================================= */
interface ProductsModalProps { onClose: () => void; }
function ProductsModal({ onClose }: ProductsModalProps) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label="Sản phẩm học viên">
      <div className="products-modal" onClick={e => e.stopPropagation()}>
        <div className="products-head">
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
          <span className="products-head-icon">💡</span>
          <div className="products-head-title">Sản Phẩm Của Học Viên</div>
          <div className="products-head-desc">Khám phá những sản phẩm thực tế học viên đã tạo ra sau khoá học</div>
        </div>
        <div className="products-body">
          {[
            { emoji: '🎓', label: 'Khoá E-Learning', url: 'https://khoahoc4-sudadangcuanam.netlify.app/' },
            { emoji: '💻', label: 'Thiết bị dạy học số', url: 'https://vongtuanhoancuanuoc-lebichngoc.netlify.app/' },
            { emoji: '🎬', label: 'Video hoạt hình 3D', url: 'https://youtu.be/9gr-_l5S8ys' },
            { emoji: '📱', label: 'Xây dựng APP', url: 'https://dautruongtritue-beta.vercel.app/' },
            { emoji: '📊', label: 'Bài giảng Powerpoint', url: 'https://youtu.be/8waAhW77MKo' },
            { emoji: '🎨', label: 'Video hoạt hình 2D', url: 'https://youtu.be/IvCGHT8UjDg' },
          ].map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="prod-item">
              <span className="prod-emoji">{p.emoji}</span>
              <span className="prod-label">{p.label}</span>
              <span className="prod-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============================================
   LESSON MODAL
   ============================================= */
interface LessonModalProps {
  course: CourseData;
  onClose: () => void;
  onRegister: (courseName: string) => void;
}
function LessonModal({ course, onClose, onRegister }: LessonModalProps) {
  const lessonCount = course.lessons.filter(l => !l.startsWith('📌')).length;
  let lessonNum = 0;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label="Danh sách bài giảng">
      <div className="lesson-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
          <div className="modal-course-no">Khoá học #{course.id}</div>
          <h2 className="modal-course-title">{course.title}</h2>
          <div className="modal-price-row">
            <span className="modal-old-price">{course.oldPrice}</span>
            <span className="modal-sale-price">{course.salePrice}</span>
            <span className="modal-discount-badge">{course.discount}</span>
            {course.trialUrl && (
              <a href={course.trialUrl} target="_blank" rel="noopener noreferrer" className="modal-trial-badge">
                <span>▶</span> Học thử
              </a>
            )}
          </div>
        </div>
        <div className="modal-body">
          <div className="lessons-head">📚 Danh sách bài giảng ({lessonCount} bài)</div>
          <ul className="lessons-ul">
            {course.lessons.map((l, i) => {
              const isHeader = l.startsWith('📌');
              if (isHeader) {
                return (
                  <li key={i} style={{ listStyle: 'none', padding: 0 }}>
                    <div className="lesson-section-header">
                      {l.replace('📌 ', '')}
                    </div>
                  </li>
                );
              }
              lessonNum++;
              const num = lessonNum;
              const isTrial = l.trim() === course.trialText;
              return (
                <li key={i} className="lesson-li" style={{ animation: `lesson-slide ${0.2 + i * 0.03}s ease backwards` }}>
                  <span className="lesson-no" style={{ background: LESSON_COLORS[(num - 1) % LESSON_COLORS.length] }}>{num}</span>
                  <span className="lesson-text">
                    {l}
                    {isTrial && (
                      <a href={course.trialUrl} target="_blank" rel="noopener noreferrer" className="inline-trial-badge">▶ Học thử</a>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <button className="modal-reg-btn" onClick={() => { onClose(); onRegister(course.title); }}>
            🚀 Đăng Ký Khoá Học Này Ngay
          </button>
        </div>
      </div>
    </div>
  );
}

/* =============================================
   PAYMENT MODAL
   ============================================= */
interface PaymentModalProps {
  courseName: string;
  price: number;
  code: string;
  onClose: () => void;
}
function PaymentModal({ courseName, price, code, onClose }: PaymentModalProps) {
  const [activeBank, setActiveBank] = useState<'mb' | 'tcb'>('mb');
  const name = encodeURIComponent('CONG TY TNHH CONG NGHE GIAO DUC MRE');
  const info = encodeURIComponent(code);
  const amt = price;

  const qrMb = `https://img.vietqr.io/image/MB-353536888-compact2.png?amount=${amt}&addInfo=${info}&accountName=${name}`;
  const qrTcb = `https://img.vietqr.io/image/TCB-836869999-compact2.png?amount=${amt}&addInfo=${info}&accountName=${name}`;

  function copySTK(stk: string) {
    navigator.clipboard.writeText(stk).catch(() => {});
    showToast('Đã sao chép: ' + stk);
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true">
      <div className="pay-modal" onClick={e => e.stopPropagation()}>
        <div className="pay-head">
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
          <div className="pay-step">Bước 2 / 2 – Thanh Toán</div>
          <h2 className="pay-title">💳 Thông Tin Chuyển Khoản</h2>
          <div className="pay-course-info">{(courseName || 'Khoá học') + ' – ' + price.toLocaleString('vi-VN') + 'đ'}</div>
        </div>
        <div className="pay-body">
          <div className="pay-code-box">
            <div className="pay-code-label">Nội dung chuyển khoản</div>
            <div className="pay-code-value">{code}</div>
            <div className="pay-code-hint">📋 Sao chép nội dung này khi chuyển khoản</div>
          </div>

          <div className="bank-tabs">
            <button className={`bank-tab${activeBank === 'mb' ? ' active' : ''}`} onClick={() => setActiveBank('mb')}>🏦 MB Bank</button>
            <button className={`bank-tab${activeBank === 'tcb' ? ' active' : ''}`} onClick={() => setActiveBank('tcb')}>🏦 Techcombank</button>
          </div>

          {activeBank === 'mb' && (
            <div>
              <div className="bank-info-row">
                <div className="bank-info-item"><div className="bi-label">Chủ tài khoản</div><div className="bi-value">CONG TY TNHH CONG NGHE GIAO DUC MRE</div></div>
                <div className="bank-info-item"><div className="bi-label">Số tài khoản</div><div className="bi-value stk" onClick={() => copySTK('353536888')}>353536888 <span className="copy-icon">📋</span></div></div>
                <div className="bank-info-item"><div className="bi-label">Ngân hàng</div><div className="bi-value">Ngân hàng Quân đội – MB Bank</div></div>
              </div>
              <div className="qr-wrapper">
                <div className="qr-scan-label">Quét để thanh toán</div>
                <div className="qr-frame"><img src={qrMb} alt="QR MB Bank" className="qr-img" /></div>
                <div className="qr-brand mb-brand"><strong>MB</strong> Bank</div>
              </div>
            </div>
          )}

          {activeBank === 'tcb' && (
            <div>
              <div className="bank-info-row">
                <div className="bank-info-item"><div className="bi-label">Chủ tài khoản</div><div className="bi-value">CONG TY TNHH CONG NGHE GIAO DUC MRE</div></div>
                <div className="bank-info-item"><div className="bi-label">Số tài khoản</div><div className="bi-value stk" onClick={() => copySTK('836869999')}>836869999 <span className="copy-icon">📋</span></div></div>
                <div className="bank-info-item"><div className="bi-label">Ngân hàng</div><div className="bi-value">Techcombank – TMCP Kỹ Thương Việt Nam</div></div>
              </div>
              <div className="qr-wrapper">
                <div className="qr-scan-label">Quét để thanh toán</div>
                <div className="qr-frame"><img src={qrTcb} alt="QR Techcombank" className="qr-img" /></div>
                <div className="qr-brand tcb-brand"><strong>TECHCOM</strong>BANK</div>
              </div>
            </div>
          )}

          <div className="pay-note">
            <div className="pay-note-icon">💬</div>
            <div className="pay-note-text">
              Sau khi chuyển khoản thành công, vui lòng{' '}
              <strong>liên hệ Zalo <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer">0396.581.283</a></strong>{' '}
              để được kích hoạt và nhận khoá học ngay!
            </div>
          </div>

          <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer" className="zalo-confirm-btn">
            <span>💬</span> Báo Zalo Đã Thanh Toán
          </a>
        </div>
      </div>
    </div>
  );
}

/* =============================================
   REGISTER MODAL
   ============================================= */
interface RegisterModalProps {
  defaultCourse?: string;
  onClose: () => void;
  onPayment: (courseName: string, price: number, code: string) => void;
}
function RegisterModal({ defaultCourse = '', onClose, onPayment }: RegisterModalProps) {
  const [form, setForm] = useState({
    name: '', email: '', zalo: '', ward: '', province: '',
  });
  const [selectedCourses, setSelectedCourses] = useState<string[]>(() => {
    if (defaultCourse === 'Combo 6 Khoá Học - 999K') {
      return COURSES.map(c => c.title);
    } else if (defaultCourse) {
      return [defaultCourse];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isComboSelected = selectedCourses.length === COURSES.length;

  const handleToggleCombo = () => {
    setError('');
    if (isComboSelected) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(COURSES.map(c => c.title));
    }
  };

  const handleToggleCourse = (title: string) => {
    setError('');
    setSelectedCourses(prev => {
      if (prev.includes(title)) {
        return prev.filter(t => t !== title);
      } else {
        return [...prev, title];
      }
    });
  };

  const getPaymentDetails = (selected: string[]) => {
    const isAll = selected.length === COURSES.length;
    if (isAll) {
      return {
        courseName: 'Combo 6 Khoá Học - 999K',
        price: 999000,
        code: 'COMBO',
      };
    }

    if (selected.length === 0) {
      return {
        courseName: '',
        price: 0,
        code: '',
      };
    }

    let totalPrice = 0;
    const codes: string[] = [];
    const names: string[] = [];

    COURSES.forEach(c => {
      if (selected.includes(c.title)) {
        const payInfo = COURSE_PAY[c.title];
        if (payInfo) {
          totalPrice += payInfo.price;
          codes.push(payInfo.code);
          names.push(c.title);
        }
      }
    });

    if (totalPrice >= 999000) {
      return {
        courseName: 'Combo 6 Khoá Học - 999K',
        price: 999000,
        code: 'COMBO',
      };
    }

    return {
      courseName: names.join(', '),
      price: totalPrice,
      code: codes.join(' '),
    };
  };

  const { price: currentPrice, code: currentCode, courseName: currentCourseName } = getPaymentDetails(selectedCourses);
  const rawSum = selectedCourses.reduce((sum, title) => {
    const payInfo = COURSE_PAY[title];
    return sum + (payInfo ? payInfo.price : 0);
  }, 0);
  const isComboUpgrade = !isComboSelected && selectedCourses.length > 0 && rawSum >= 999000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('⚠️ Vui lòng nhập họ và tên');
    if (!form.email.trim() || !form.email.includes('@')) return setError('⚠️ Vui lòng nhập email hợp lệ');
    if (!form.zalo.trim()) return setError('⚠️ Vui lòng nhập số Zalo');
    if (!form.ward.trim()) return setError('⚠️ Vui lòng nhập xã / phường');
    if (!form.province.trim()) return setError('⚠️ Vui lòng nhập tỉnh / thành phố');
    if (selectedCourses.length === 0) return setError('⚠️ Vui lòng chọn ít nhất một khoá học');

    setLoading(true);
    try {
      const params = new URLSearchParams({
        name: form.name, email: form.email, zalo: form.zalo,
        ward: form.ward, province: form.province, course: currentCourseName,
        timestamp: new Date().toLocaleString('vi-VN'),
      });
      await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: 'GET', mode: 'no-cors' });
    } catch (_) {
      // no-cors: ignore errors
    } finally {
      setLoading(false);
    }
    setSuccess(true);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label="Form đăng ký">
      <div className="reg-modal" onClick={e => e.stopPropagation()}>
        <div className="reg-head">
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
          <div className="reg-title">🚀 Đăng Ký Ngay</div>
          <div className="reg-subtitle">Điền thông tin để đăng ký khoá học</div>
        </div>
        <div className="reg-body">
          {success ? (
            <div className="success-box">
              <span className="big-check">✅</span>
              <h3>Đăng ký thành công!</h3>
              <p>Cảm ơn <strong id="success-name">{form.name}</strong>!<br />Vui lòng <strong>chuyển khoản</strong> để hoàn tất đăng ký.</p>
              <button className="form-submit-btn" style={{ marginTop: 16 }} onClick={() => { onClose(); onPayment(currentCourseName, currentPrice, currentCode); }}>
                <span>💳</span> Đến Trang Thanh Toán
              </button>
              <button className="close-success-btn" style={{ marginTop: 10 }} onClick={onClose}>Đóng</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-lbl" htmlFor="f-name">👤 Họ và Tên</label>
                <input id="f-name" name="name" className="form-ctrl" type="text" placeholder="Nhập họ và tên đầy đủ..." value={form.name} onChange={handleChange} autoComplete="name" />
              </div>
              <div className="form-group">
                <label className="form-lbl" htmlFor="f-email">📧 Email</label>
                <input id="f-email" name="email" className="form-ctrl" type="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-lbl" htmlFor="f-zalo">💬 Số Zalo</label>
                <input id="f-zalo" name="zalo" className="form-ctrl" type="tel" placeholder="0xxx.xxx.xxx" value={form.zalo} onChange={handleChange} autoComplete="tel" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-lbl" htmlFor="f-ward">📍 Xã (Phường)</label>
                  <input id="f-ward" name="ward" className="form-ctrl" type="text" placeholder="Xã / phường..." value={form.ward} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-lbl" htmlFor="f-province">🏙️ Tỉnh (TP)</label>
                  <input id="f-province" name="province" className="form-ctrl" type="text" placeholder="Tỉnh / thành phố..." value={form.province} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-lbl">📚 Chọn khoá học (Tích chọn 1 hoặc nhiều)</label>
                <div className="course-checklist">
                  {/* Combo Option Card */}
                  <div 
                    className={`course-check-item combo-item ${isComboSelected ? 'checked' : ''}`}
                    onClick={handleToggleCombo}
                  >
                    <div className="course-check-left">
                      <input 
                        type="checkbox"
                        checked={isComboSelected}
                        onChange={() => {}}
                        className="custom-checkbox"
                      />
                      <div className="course-check-info">
                        <span className="course-check-badge">🔥 Siêu tiết kiệm</span>
                        <span className="course-check-title">⭐ COMBO 6 KHOÁ HỌC</span>
                      </div>
                    </div>
                    <div className="course-check-price">
                      <span className="course-price-old">2.494K</span>
                      <span className="course-price-new">999K</span>
                    </div>
                  </div>

                  <div className="course-checklist-divider">Hoặc đăng ký từng khoá học lẻ</div>

                  {/* Individual Course Cards */}
                  {COURSES.map(c => {
                    const isChecked = selectedCourses.includes(c.title);
                    return (
                      <div 
                        key={c.id}
                        className={`course-check-item ${isChecked ? 'checked' : ''}`}
                        onClick={() => handleToggleCourse(c.title)}
                      >
                        <div className="course-check-left">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="custom-checkbox"
                          />
                          <span className="course-check-icon">{c.icon}</span>
                          <span className="course-check-title">#{c.id} – {c.title}</span>
                        </div>
                        <div className="course-check-price">
                          <span className="course-price-new">{c.salePrice}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Summary Box */}
                {selectedCourses.length > 0 && (
                  <div className="price-summary-box">
                    <div className="price-summary-row">
                      <span>Số lượng đã chọn:</span>
                      <strong>{isComboSelected ? 6 : selectedCourses.length} khoá học</strong>
                    </div>
                    <div className="price-summary-row highlight">
                      <span>TỔNG TIỀN TẠM TÍNH:</span>
                      <span className="summary-price">{currentPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    {isComboUpgrade && (
                      <div className="combo-upgrade-tip">
                        🎉 Đã tự động kích hoạt giá **COMBO 999K** tối ưu nhất cho bạn!
                      </div>
                    )}
                  </div>
                )}
              </div>
              {error && <div className="err-msg">{error}</div>}
              <button type="submit" id="form-submit-btn" className="form-submit-btn" disabled={loading}>
                {loading ? <><span>⏳</span> Đang gửi...</> : <><span>🚀</span> Gửi Thông Tin Đăng Ký</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* =============================================
   DATA – TESTIMONIALS
   ============================================= */
interface Testimonial {
  id: number;
  name: string;
  school: string;
  date: string;
  rating: number;
  content: string;
  avatarColor: string;
  avatarLetter: string;
}

const TESTIMONIALS: Testimonial[] = [
  // === Khoá học (10 phản hồi) ===
  { id: 1, name: 'Cô Trúc Quỳnh', school: 'Trường TH Trần Quốc Toản, Quảng Ninh', date: '12/06/2026', rating: 5, content: 'Sau 5 buổi khoá học AI giáo dục tại Maris, giảng viên chỉ bảo tận tình từ viết prompt đến tích hợp slide. Từ lạ lẫm công nghệ, giờ mình đã tự tin ứng dụng số chuẩn quốc tế.', avatarColor: '#e8192c', avatarLetter: 'Q' },
  { id: 2, name: 'Thầy Nguyễn Đức Nam', school: 'Trường THPT Chuyên Quốc Học Huế', date: '18/06/2026', rating: 5, content: 'Cực kỳ ấn tượng với dịch vụ thiết kế Sáng kiến kinh nghiệm và báo cáo chuyên đề của Maris. Slide trực quan, chuyên nghiệp, giúp tôi bảo vệ thành công đề tài nghiên cứu cấp Tỉnh đạt loại Xuất sắc!', avatarColor: '#f97316', avatarLetter: 'N' },
  { id: 3, name: 'Cô Nguyễn Thị Hồng Hà', school: 'Trường Tiểu Học Kim Đồng, TP.HCM', date: '14/06/2026', rating: 5, content: 'Nhờ kho 300 game Powerpoint và app AI viết SKKN của Maris Slide mà năm nay mình hoàn thành báo cáo chuyên đề xuất sắc, học sinh trong lớp thi hào hứng tham gia hoạt động hơn hẳn!', avatarColor: '#8b5cf6', avatarLetter: 'H' },
  { id: 4, name: 'Thầy Lê Văn Tùng', school: 'Trường THPT Chuyên Lê Quý Đôn, Đà Nẵng', date: '10/06/2026', rating: 5, content: 'Phần mềm iSpring Suite qua khoá học của Maris giúp tôi tạo bài giảng E-Learning dùng cực mượt. Đặc biệt app bảng AI giúp tôi soạn bài chỉ vật lý cực kỳ đẳng cấp.', avatarColor: '#10b981', avatarLetter: 'T' },
  { id: 5, name: 'Cô Phạm Thanh Lan', school: 'Trường THCS Nguyễn Trãi, Hà Nội', date: '08/06/2026', rating: 5, content: 'Khoá học Canva và PowerPoint nâng cao thay đổi hoàn toàn cách mình soạn giáo án. Slide đẹp, chuyên nghiệp, học sinh ai cũng thích thú. Cảm ơn Maris Slide rất nhiều!', avatarColor: '#e8192c', avatarLetter: 'L' },
  { id: 6, name: 'Thầy Trần Minh Hoàng', school: 'Trường TH Lê Lợi, Nghệ An', date: '05/06/2026', rating: 5, content: 'Mình đăng ký Combo 6 khoá rất hời! Từ AI, PowerPoint, Canva, iSpring đến video editing đều có. Giảng viên nhiệt tình, hỗ trợ qua Zalo cực nhanh.', avatarColor: '#6366f1', avatarLetter: 'H' },
  { id: 7, name: 'Cô Đỗ Thị Minh Châu', school: 'Trường MN Hoa Sen, Bình Dương', date: '02/06/2026', rating: 5, content: 'Khoá CapCut chỉnh sửa video dạy học quá tuyệt! Giờ mình tự quay và biên tập video bài giảng cho các bé mầm non, phụ huynh khen không ngớt.', avatarColor: '#f97316', avatarLetter: 'C' },
  { id: 8, name: 'Thầy Võ Văn Đạt', school: 'Trường THPT Nguyễn Du, Bình Định', date: '28/05/2026', rating: 5, content: 'Sau khoá học PowerPoint chuẩn quốc tế, mình đã tự tạo được hệ thống 50 slide bài giảng tương tác cho cả học kỳ. Học sinh không còn ngủ gật nữa!', avatarColor: '#10b981', avatarLetter: 'Đ' },
  { id: 9, name: 'Cô Lý Thị Hương', school: 'Trường TH Nguyễn Bỉnh Khiêm, Cần Thơ', date: '25/05/2026', rating: 5, content: 'Khoá AI ứng dụng cho giáo viên giúp mình tiết kiệm 70% thời gian soạn bài. Prompt AI viết SKKN chạy chuẩn luôn, chỉ cần chỉnh sửa nhẹ là xong.', avatarColor: '#8b5cf6', avatarLetter: 'H' },
  { id: 10, name: 'Thầy Bùi Quốc Anh', school: 'Trường THCS Lương Thế Vinh, Hải Phòng', date: '20/05/2026', rating: 5, content: 'Combo khoá học Maris Slide chất lượng vượt mong đợi. Video bài giảng rõ ràng, đi từ cơ bản đến nâng cao. Đã giới thiệu cho cả tổ bộ môn đăng ký.', avatarColor: '#e8192c', avatarLetter: 'A' },
  // === Dịch vụ thiết kế đạt giải (5 phản hồi) ===
  { id: 11, name: 'Cô Phan Thị Thu', school: 'Trường TH Trưng Vương, Đắk Lắk', date: '15/06/2026', rating: 5, content: 'Maris thiết kế slide SKKN cho mình đạt giải Nhất cấp Huyện và giải Nhì cấp Tỉnh năm 2026! Trình bày khoa học, hình ảnh minh họa cực đẹp và chuyên nghiệp.', avatarColor: '#6366f1', avatarLetter: 'T' },
  { id: 12, name: 'Thầy Đặng Hữu Phước', school: 'Trường THCS Nguyễn Huệ, Khánh Hoà', date: '13/06/2026', rating: 5, content: 'Đề tài SKKN về ứng dụng AI trong dạy Toán được Maris thiết kế slide bảo vệ xuất sắc. Hội đồng giám khảo cấp Tỉnh đánh giá rất cao phần trình bày, đạt giải Nhất!', avatarColor: '#f97316', avatarLetter: 'P' },
  { id: 13, name: 'Cô Nguyễn Ánh Tuyết', school: 'Trường MN Sơn Ca, Lâm Đồng', date: '09/06/2026', rating: 5, content: 'Nhờ đội ngũ Maris thiết kế, bộ slide chuyên đề của mình đạt giải Ba cấp Quốc gia! Từ bố cục, màu sắc đến animation đều hoàn hảo, vượt xa kỳ vọng.', avatarColor: '#10b981', avatarLetter: 'T' },
  { id: 14, name: 'Thầy Lê Thanh Sơn', school: 'Trường THPT Lê Hồng Phong, Nam Định', date: '06/06/2026', rating: 5, content: 'Slide báo cáo chuyên đề do Maris thiết kế giúp mình đạt giải cấp Xã và được chọn đi thi cấp Huyện. Trình bày logic, dễ theo dõi, ban giám khảo rất ấn tượng.', avatarColor: '#8b5cf6', avatarLetter: 'S' },
  { id: 15, name: 'Cô Hoàng Minh Thư', school: 'Trường TH Đoàn Thị Điểm, Hà Nội', date: '01/06/2026', rating: 5, content: 'Dịch vụ thiết kế SKKN của Maris quá chuyên nghiệp. Bài thuyết trình đạt giải Nhất cấp Quận, đang chuẩn bị thi cấp Thành phố. Chắc chắn sẽ quay lại!', avatarColor: '#e8192c', avatarLetter: 'T' },
  // === Quà tặng hấp dẫn (5 phản hồi) ===
  { id: 16, name: 'Cô Trương Thị Mai', school: 'Trường TH Lê Văn Tám, Bà Rịa - Vũng Tàu', date: '17/06/2026', rating: 5, content: 'Đăng ký khoá học được tặng kèm 300 game PowerPoint tương tác và bộ 1000 icon giáo dục siêu đẹp. Quà tặng giá trị hơn cả khoá học, không thể tin được!', avatarColor: '#6366f1', avatarLetter: 'M' },
  { id: 17, name: 'Thầy Ngô Đức Thắng', school: 'Trường THCS Chu Văn An, Thái Nguyên', date: '11/06/2026', rating: 5, content: 'Quà tặng app AI viết SKKN trọn đời và kho template Canva Premium cực khủng. Mình dùng cả năm không hết! Maris cho đi nhiều hơn những gì mình trả.', avatarColor: '#f97316', avatarLetter: 'T' },
  { id: 18, name: 'Cô Vũ Thị Ngọc Ánh', school: 'Trường MN Tuổi Thơ, Quảng Nam', date: '07/06/2026', rating: 5, content: 'Ngoài khoá học chất lượng, còn được tặng bộ slide mẫu thiết kế sẵn theo từng môn và kho nhạc không bản quyền cho video. Quà tặng thiệt sự rất hấp dẫn!', avatarColor: '#10b981', avatarLetter: 'A' },
  { id: 19, name: 'Thầy Huỳnh Tấn Phát', school: 'Trường TH Hoàng Văn Thụ, Long An', date: '03/06/2026', rating: 5, content: 'Kho 300 game Powerpoint tương tác được tặng kèm quá xịn! Đủ thể loại từ đuổi hình bắt chữ, lật thẻ, quiz... Học sinh tranh nhau được chơi game mỗi tiết.', avatarColor: '#8b5cf6', avatarLetter: 'P' },
  { id: 20, name: 'Cô Đinh Hồng Nhung', school: 'Trường THCS Quang Trung, Thanh Hoá', date: '30/05/2026', rating: 5, content: 'Mua combo 6 khoá được tặng thêm tài khoản Canva Pro 1 năm và bộ font chữ Việt hoá cao cấp. Quà tặng quá hời, đồng nghiệp ai cũng muốn đăng ký theo!', avatarColor: '#e8192c', avatarLetter: 'N' },
];

/* =============================================
   REVIEW MODAL
   ============================================= */
function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [form, setForm] = useState({ name: '', school: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        <div className="review-modal-accent" />
        <button className="review-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
        {submitted ? (
          <div style={{ padding: '60px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-dark)', marginBottom: 8 }}>Cảm ơn bạn!</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Đánh giá của bạn đã được ghi nhận.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="review-head">
              <h3 className="review-head-title">Gửi Đánh Giá Học Viên</h3>
              <p className="review-head-desc">Đóng góp của thầy cô giúp cộng đồng giáo dục phát triển hơn</p>
              <div className="review-stars-select">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`review-star-btn ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    aria-label={`${star} sao`}
                  >★</button>
                ))}
              </div>
            </div>
            <div className="review-body">
              <div className="review-field">
                <label>Họ tên Thầy/Cô *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cô Trần Thị Thảo"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="review-field">
                <label>Đơn vị công tác (Trường / Tỉnh)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Trường Tiểu Học Lê Lợi, Nghệ An"
                  value={form.school}
                  onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
                />
              </div>
              <div className="review-field">
                <label>Nhận xét của thầy cô *</label>
                <textarea
                  placeholder="Hãy chia sẻ trải nghiệm về kho quà tặng PowerPoint, ứng dụng AI hay các khoá học của Maris Slide..."
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  required
                />
              </div>
              <div className="review-actions">
                <button type="button" className="review-cancel-btn" onClick={onClose}>Huỷ Bỏ</button>
                <button type="submit" className="review-submit-btn" disabled={!form.name.trim() || !form.comment.trim()}>✨ Gửi Phản Hồi Ngay</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* =============================================
   MAIN APP
   ============================================= */
export default function App() {
  const [activeCourse, setActiveCourse] = useState<CourseData | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [defaultRegCourse, setDefaultRegCourse] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({ courseName: '', price: 0, code: '' });
  const [showProducts, setShowProducts] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const openRegister = useCallback((courseName = '') => {
    let url = '/dangky.html';
    if (courseName) {
      if (courseName.includes('Combo')) {
        url += '?course=combo';
      } else {
        const found = COURSES.find(c => c.title === courseName);
        if (found) {
          const codes: Record<string, string> = {
            'Khoá Thiết Kế Bài Giảng E-Learning': 'elear',
            'Khoá Ứng Dụng AI Vào Giảng Dạy': 'aivgd',
            'Khoá Tạo App Nâng Cao': 'appnc',
            'Khoá Sử Dụng Canva': 'canva',
            'Khoá Thiết Kế Bài Giảng PowerPoint': 'pptbg',
            'Khoá Dựng Hoạt Hình 2D Bằng Animiz': 'animz'
          };
          const code = codes[found.title];
          if (code) {
            url += `?course=${code}`;
          }
        }
      }
    }
    window.location.href = url;
  }, []);

  const openPayment = useCallback((courseName: string, price: number, code: string) => {
    setPaymentInfo({ courseName, price, code });
    setShowPayment(true);
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const anyModalOpen = !!(activeCourse || showRegister || showPayment || showProducts || showReview);
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeCourse, showRegister, showPayment, showProducts, showReview]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCourse(null);
        setShowRegister(false);
        setShowPayment(false);
        setShowProducts(false);
        setShowReview(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <div className="page-bg" />
      <StarsCanvas />

      <div className="site-wrap">

        {/* ===================== TOP NAV ===================== */}
        <nav className="top-bar" role="navigation" aria-label="Điều hướng chính">
          <div className="top-bar-inner">
            <a href="#" className="brand">
              <img src={logoImg} alt="Maris Slide Logo" className="brand-logo-img" />
              <div className="brand-text">
                <span className="name">Maris Slide</span>
                <span className="tagline">Tiên phong công nghệ giáo dục</span>
              </div>
            </a>
            <div className="nav-bar-contact">
              <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer" className="contact-chip">
                <span className="dot" />
                <span>0396.581.283</span>
              </a>
              <button className="nav-register-btn" onClick={() => openRegister()} id="nav-register-btn">
                🚀 Đăng Ký Ngay
              </button>
            </div>
          </div>
        </nav>

        {/* ===================== HERO ===================== */}
        <header className="hero">
          <div className="hero-brand-bar" aria-label="ZALO HỖ TRỢ - 0396581283">
            <div className="brand-dot" />
            <span className="brand-name">ZALO HỖ TRỢ</span>
            <div className="brand-divider" />
            <span className="brand-phone">0396.581.283</span>
            <div className="brand-dot" />
          </div>

          <h1 className="hero-main-title">KHOÁ HỌC <span className="red">CÔNG NGHỆ</span></h1>
          <div className="hero-sub-title">Chuẩn Khung Năng Lực Số</div>
          <div className="hero-underline" aria-hidden="true" />
          <div className="hero-tagline">
            <span className="star" aria-hidden="true">✦</span>
            <span className="red-text">Dành Cho Giáo Viên</span>
            <span className="star" aria-hidden="true">✦</span>
          </div>
        </header>

        {/* ===================== COURSES ===================== */}
        <section className="courses-section" id="courses">
          <div className="container">
            <h2 className="section-heading">6 Khoá Học Chuyên Sâu Qua Video Bài Giảng Trực Tuyến</h2>
            <div className="courses-grid">
              {COURSES.map((c, idx) => (
                <article
                  key={c.id}
                  className="course-card"
                  id={`course-card-${c.id}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Xem chi tiết: ${c.title}`}
                  onClick={() => setActiveCourse(c)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActiveCourse(c); }}
                >
                  <div className="card-num">{c.id}</div>
                  <div className="card-icon" aria-hidden="true">{c.icon}</div>
                  <h3 className="card-title">{c.title}</h3>
                  <div className="card-sub">{c.subtitle}</div>
                  <ul className="card-features">
                    {c.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                  <div className="card-pricing">
                    <div>
                      <div className="price-old">{c.oldPrice}</div>
                      <div className="price-label">Ưu đãi còn</div>
                    </div>
                    <div className="price-new">{c.salePrice}</div>
                  </div>
                  <button
                    className="card-btn"
                    id={`view-course-${c.id}`}
                    onClick={e => { e.stopPropagation(); setActiveCourse(c); }}
                  >
                    📚 Xem Bài Giảng
                  </button>
                  <div className="card-hint">👆 Nhấn để xem danh sách bài học</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== COMBO BANNER ===================== */}
        <section className="combo-section" id="combo">
          <div className="combo-banner">
            <div className="combo-badge">⭐ Ưu đãi đặc biệt</div>
            <div className="combo-left">
              <div className="combo-icon">📦</div>
              <div>
                <div className="combo-title">Đăng Ký Combo 6 Khoá Học</div>
                <div className="combo-desc">
                  E-Learning · AI &amp; Hoạt Hình 3D · Tạo App · Canva · PowerPoint · Hoạt Hình 2D<br />
                  <strong>✓ Học không giới hạn · ✓ Cập nhật kiến thức mới miễn phí mãi mãi</strong>
                </div>
              </div>
            </div>
            <div className="combo-right">
              <div className="combo-price-label">Ưu đãi còn</div>
              <div className="combo-price-old">2.494.000đ</div>
              <span className="combo-price-new">999.000đ</span>
              <br />
              <button className="combo-cta-btn" onClick={() => openRegister('Combo 6 Khoá Học - 999K')}>
                🚀 Đăng Ký Combo Ngay
              </button>
            </div>
          </div>
        </section>

        {/* ===================== GIFTS ===================== */}
        <section className="gifts-section" id="gifts">
          <div className="container">
            <div className="gifts-header">
              <div className="gift-big-icon" aria-hidden="true">🎁</div>
              <h2 className="gifts-headline">
                <span className="t1">Quà Tặng</span>
                <span className="t2">Đặc Biệt</span>
              </h2>
            </div>
            <div className="gifts-grid">
              {GIFTS.map((g, i) => (
                <div className="gift-card" key={i} id={`gift-item-${i + 1}`}>
                  <span className="gift-emoji" aria-hidden="true">{g.emoji}</span>
                  <div className="gift-name">{g.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CONTACT ===================== */}
        <section className="contact-section" id="contact">
          <div className="contact-inner">
            <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer" className="zalo-block" id="zalo-contact-link">
              <div className="zalo-icon-box">Z</div>
              <div className="zalo-info">
                <div className="lbl">Liên hệ tư vấn qua</div>
                <div className="num">0396.581.283</div>
                <div className="name-tag">MARIS SLIDE</div>
              </div>
            </a>
            <div className="contact-motto">
              <div className="m1">Học dễ hiểu – Ứng dụng ngay</div>
              <div className="m2">Tiết kiệm thời gian – Nâng cao hiệu quả</div>
            </div>
          </div>
        </section>

        {/* ===================== LEARNING FORMAT ===================== */}
        <section className="learn-section" id="learn-format">
          <div className="container">
            <h2 className="section-heading">Hình Thức Học Tập: Qua Video Bài Giảng</h2>
            <div className="learn-grid">
              <div className="learn-card">
                <span className="learn-icon">⏰</span>
                <div className="learn-title">Chủ động<br />thời gian</div>
                <div className="learn-desc">Học mọi lúc mọi nơi, tự điều chỉnh tốc độ video. Tạm dừng, tua lại hoặc tăng tốc tuỳ ý.</div>
              </div>
              <div className="learn-card">
                <span className="learn-icon">💰</span>
                <div className="learn-title">Tiết kiệm<br />chi phí</div>
                <div className="learn-desc">Không tốn chi phí đi lại, tài liệu. Xem lại bài giảng không giới hạn, không phát sinh thêm.</div>
              </div>
              <div className="learn-card">
                <span className="learn-icon">🌟</span>
                <div className="learn-title">Kiến thức<br />chất lượng</div>
                <div className="learn-desc">Học từ chuyên gia hàng đầu, nội dung tinh lọc đi thẳng vào trọng tâm, không thừa thãi.</div>
              </div>
              <div className="learn-card">
                <span className="learn-icon">🎯</span>
                <div className="learn-title">Cá nhân hóa<br />lộ trình</div>
                <div className="learn-desc">Tự xây dựng lộ trình riêng, phù hợp nhịp độ và khả năng tiếp thu của bản thân.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== TESTIMONIALS ===================== */}
        <section className="testimonials-section" id="testimonials">
          <div className="container">
            <div className="testimonials-header">
              <div className="testimonials-header-text">
                <h2 className="testimonials-title">Chia Sẻ Từ Quý Thầy Cô Học Viên</h2>
                <p className="testimonials-subtitle">Phản hồi thực tế từ các nhà giáo trên toàn quốc đã ứng dụng hiệu quả tài nguyên Maris Slide.</p>
              </div>
              <button className="testimonials-send-btn" onClick={() => setShowReview(true)} id="send-review-btn">
                Gửi Đánh Giá Của Bạn
              </button>
            </div>
            <div className="testimonials-track-wrapper">
              <div className="testimonials-track">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                  <div className="testimonial-card" key={`${t.id}-${i}`}>
                    <div className="testimonial-card-top">
                      <span className="testimonial-date">{t.date}</span>
                      <div className="testimonial-stars">
                        {Array.from({ length: t.rating }, (_, j) => <span key={j}>★</span>)}
                      </div>
                    </div>
                    <div className="testimonial-content">{t.content}</div>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar" style={{ background: t.avatarColor }}>{t.avatarLetter}</div>
                      <div className="testimonial-author-info">
                        <span className="testimonial-author-name">{t.name}</span>
                        <span className="testimonial-author-school">{t.school}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== STATS & SHOWCASE ===================== */}
        <section className="stats-section" id="stats">
          <div className="container">
            <h2 className="section-heading">Thành Tích &amp; Minh Chứng</h2>

            <div className="stats-grid">
              {[
                { icon: '🌟', number: '10+', label: 'Năm hoạt động trong\nlĩnh vực Edu Tech' },
                { icon: '🎓', number: '10.000+', label: 'Học viên\ntrên toàn quốc' },
                { icon: '🏆', number: '3.000+', label: 'Học viên đạt giải\ncác cấp' },
                { icon: '👥', number: '50.000+', label: 'Giáo viên tham gia\ncộng đồng' },
                { icon: '🏢', number: '50+', label: 'Trường học mời\nđào tạo nội bộ' },
                { icon: '❤️', number: '99%', label: 'Học viên hài lòng\nvới khoá học' },
              ].map((s, i) => (
                <div className="stat-card" key={i}>
                  <span className="stat-icon">{s.icon}</span>
                  <div className="stat-number">{s.number}</div>
                  <div className="stat-label" style={{ whiteSpace: 'pre-line' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="showcase-grid">
              <a
                href="https://drive.google.com/drive/folders/1NjH4-jpddEqyjQM10IvAZoDsDjMNAdwS?usp=drive_link"
                target="_blank" rel="noopener noreferrer"
                className="showcase-card"
                id="showcase-feedback"
              >
                <span className="showcase-icon">💬</span>
                <div className="showcase-title">Phản Hồi Của Học Viên</div>
                <div className="showcase-desc">Xem những phản hồi tích cực từ học viên đã tham gia khoá học</div>
                <div className="showcase-arrow">→</div>
              </a>

              <div className="showcase-card" id="showcase-products" onClick={() => setShowProducts(true)} style={{ cursor: 'pointer' }}>
                <span className="showcase-icon">💡</span>
                <div className="showcase-title">Sản Phẩm Của Học Viên</div>
                <div className="showcase-desc">Khám phá những sản phẩm thực tế học viên đã tạo ra</div>
                <div className="showcase-arrow">→</div>
              </div>

              <a
                href="https://drive.google.com/drive/folders/1IbHbOPFaT6TUW-_dzmcM3YD2t5bvJhMp?usp=drive_link"
                target="_blank" rel="noopener noreferrer"
                className="showcase-card"
                id="showcase-cert"
              >
                <span className="showcase-icon">🏅</span>
                <div className="showcase-title">Giấy Chứng Nhận</div>
                <div className="showcase-desc">Xem giấy chứng nhận hoàn thành khoá học được cấp cho học viên</div>
                <div className="showcase-arrow">→</div>
              </a>
            </div>
          </div>
        </section>

        {/* ===================== CTA ===================== */}
        <section className="cta-section" id="register">
          <div className="container">
            <div className="cta-box">
              <div className="cta-tag">⭐ Cơ hội có hạn – Đừng bỏ lỡ ⭐</div>
              <h2 className="cta-main-title">
                Đăng Ký <span className="golden">Ngay</span>
                <br /><span className="white-line">Hôm Nay</span>
              </h2>
              <p className="cta-desc">Nhận ưu đãi đặc biệt + toàn bộ quà tặng giá trị khi đăng ký</p>
              <button className="cta-btn" id="open-register-btn" onClick={() => openRegister()}>
                <span className="rocket" aria-hidden="true">🚀</span>
                Đăng Ký Ngay
              </button>
              <div className="cta-note">
                <span className="shield" aria-hidden="true">🛡️</span>
                Hỗ trợ trọn đời 1:1 qua Zalo · Học không giới hạn
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FOOTER ===================== */}
        <footer>
          <p>
            © 2024 <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer">MARIS SLIDE</a>
            {' '}— Khoá Học Công Nghệ Chuẩn Khung Năng Lực Số<br />
            Zalo tư vấn: <a href="https://zalo.me/0396581283" target="_blank" rel="noopener noreferrer">0396.581.283</a>
          </p>
        </footer>

      </div>{/* /.site-wrap */}

      {/* ===================== MODALS ===================== */}
      {showProducts && <ProductsModal onClose={() => setShowProducts(false)} />}

      {activeCourse && (
        <LessonModal
          course={activeCourse}
          onClose={() => setActiveCourse(null)}
          onRegister={(name) => openRegister(name)}
        />
      )}

      {showRegister && (
        <RegisterModal
          defaultCourse={defaultRegCourse}
          onClose={() => setShowRegister(false)}
          onPayment={(courseName, price, code) => { 
            setShowRegister(false); 
            openPayment(courseName, price, code); 
          }}
        />
      )}

      {showPayment && (
        <PaymentModal
          courseName={paymentInfo.courseName}
          price={paymentInfo.price}
          code={paymentInfo.code}
          onClose={() => setShowPayment(false)}
        />
      )}

      {showReview && <ReviewModal onClose={() => setShowReview(false)} />}
    </>
  );
}

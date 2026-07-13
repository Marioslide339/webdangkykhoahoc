import React, { useState } from "react";
import { FileText, Sparkles, BookOpen, Clock, RefreshCw, AlertCircle, FileSpreadsheet } from "lucide-react";
import { Module } from "../types";

interface RawInputPanelProps {
  onDecomposeComplete: (courseTitle: string, modules: Module[]) => void;
}

export default function RawInputPanel({ onDecomposeComplete }: RawInputPanelProps) {
  const [courseTitle, setCourseTitle] = useState("Kiến Trúc EdTech Tinh Gọn");
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const samples = [
    {
      title: "An Toàn Thông Tin & Mật Mã Học Công Cộng",
      text: `Syllabus đề cương khóa học Mật mã học và An toàn thông tin:
      Thiết lập kiến thức mật mã học, mã hóa bất đối xứng khóa công khai RSA, chữ ký số.
      Chương 1: Các thuật toán mã hóa cổ điển và cơ sở toán học
        - Bài 1.1: Mã đối xứng cổ điển: Caesar, Vigenère, phân tích tần suất ký tự. Thời lượng 10 phút. Đọc hiểu bài viết và làm quiz.
        - Bài 1.2: Lý thuyết đại số cơ bản: Phép chia Euclid, modulo, số nguyên tố. Thời lượng 15 phút. Video hướng dẫn giải bài toán modulo.
      Chương 2: Hệ mã hóa khóa công khai & Tính toàn vẹn dữ liệu
        - Bài 2.1: Thuật toán mã hóa RSA và Diffie-Hellman đối thoại trao đổi khóa bí mật. Thời lượng 20 phút. Đọc tài liệu thuật toán RSA.
        - Bài 2.2: Chữ ký số và Hàm băm mật mã SHA-256. Kiểm tra tính toàn vẹn gói tin. Thời lượng 15 phút. Thực hành cấu hình chữ ký số.
      Lượng giá bằng bộ câu hỏi trắc nghiệm và một câu đố nối từ ghép nghĩa hàm băm.`
    },
    {
      title: "Nhập Môn Thiết Kế Trải Nghiệm EdTech",
      text: `Chào mừng đến với lớp Nhập môn Thiết kế giải pháp Giáo dục số EdTech LMS.
      Thời đại số yêu cầu bài giảng tối giản tuyệt đối, nâng đỡ học sinh từng chặng rèn luyện.
      Chương 1: Phân mảnh thông tin (Cognitive Load & Microlearning)
        - Bài 1: Sự sụt giảm khả năng chú ý trong học tập trực tuyến. Thời lượng 8 phút. Thống kê biểu đồ tập trung.
        - Bài 2: Thiết kế thẻ Microlearning 3-5 phút tối ưu. Thời lượng 10 phút. Thực hành chia nhỏ học trình.
      Chương 2: Đánh giá quá trình và Gamification thiết lập thói quen
        - Bài 1: Quá trình phản hồi liên tục - Feedback Loops. Thời lượng 12 phút. Video phỏng vấn học viên về việc nhận điểm số hằng ngày.
        - Bài 2: Phần thưởng thành tích và Bảng vàng thi đua. Thời lượng 15 phút. Thiết lập bộ 5 quả huy hiệu danh dự.`
    }
  ];

  const handleLoadSample = (sample: typeof samples[0]) => {
    setCourseTitle(sample.title);
    setRawText(sample.text);
    setErrorMsg("");
  };

  const handleDecompose = async () => {
    if (!rawText.trim()) {
      setErrorMsg("Vui lòng nhập nội dung giáo án hoặc học liệu thô.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/analyze-curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, courseTitle })
      });

      if (!response.ok) {
        throw new Error("Không thể phân rã giáo án bằng AI. Đang kích hoạt chế độ hỗ trợ khẩn cấp...");
      }

      const data = await response.json();
      if (data.curriculum) {
        onDecomposeComplete(courseTitle, data.curriculum);
      } else {
        throw new Error("Dữ liệu nhận về không đúng cấu trúc phân cấp.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("⚠️ " + err.message + " Hãy dán giáo án đơn giản hơn hoặc kiểm tra API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30">
            <FileText className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Bảng Nhập Liệu Thô</h3>
            <p className="text-[11px] text-slate-400">Raw Syllabus / Outline Input</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] font-mono font-medium text-slate-300">CURRICULUM DECOMPOSER</span>
        </div>
      </div>

      {/* Input Course Title */}
      <div className="mb-4">
        <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
          Tên Khóa Học Mục Tiêu:
        </label>
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Ví dụ: Thiết kế UX Tối Giản cho LMS"
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg text-xs text-white placeholder-slate-500 outline-none transition-all font-sans font-medium"
        />
      </div>

      {/* Load Sample Buttons */}
      <div className="mb-4">
        <p className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
          Dán nhanh mẫu giáo án thô:
        </p>
        <div className="flex flex-wrap gap-2">
          {samples.map((sample, index) => (
            <button
              key={index}
              onClick={() => handleLoadSample(sample)}
              className="px-2.5 py-1.5 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium text-left truncate transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3 h-3 text-slate-400" />
              <span>{sample.title.split("&")[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Raw Text input Area */}
      <div className="flex-1 flex flex-col min-h-[160px]">
        <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
          Nội dung Đề cương / Tài liệu thô chuyên ngành:
        </label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Ví dụ dán: 
Chương 1: Các Thuật Toán Cổ Điển
- Bài 1: Caesar and Vigenère (15 phút). Video và đọc tài liệu.
- Bài 2: Lý thuyết modulo sơ cấp (20 phút). Làm quiz.

Chương 2: Hệ mã hóa hiện đại RSA..."
          className="flex-1 w-full p-3.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs text-slate-200 placeholder-slate-600 outline-none resize-none font-mono leading-relaxed"
        />
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mt-3 p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Big Action Button */}
      <button
        onClick={handleDecompose}
        disabled={isLoading || !rawText.trim()}
        className="mt-4 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 text-white border border-indigo-500/20 transition-all cursor-pointer shadow-lg shadow-indigo-600/15"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Đang Phân Rã Bằng AI (EdTech Strategy)...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse-glow" />
            <span>Phân Cấp Giáo Án Thông Minh ➔</span>
          </>
        )}
      </button>

      {/* Informational Guidelines for users */}
      <div className="mt-4 p-3 bg-slate-950/40 rounded-lg border border-slate-800/60">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 text-indigo-400" /> Triết lý kiến tạo EdTech:
        </h4>
        <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
          Mô hình tự động bóc tách từ tài liệu thô thành <strong className="text-slate-300">Modules ➔ Lessons ➔ Interactive Quizzes</strong> theo phương án sư phạm hiện đại, sẵn sàng bàn giao cho coder hoặc xuất bản ngay lập tức.
        </p>
      </div>
    </div>
  );
}

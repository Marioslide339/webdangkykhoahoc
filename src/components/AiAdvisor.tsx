import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, ShieldAlert, Cpu } from "lucide-react";
import { ChatMessage } from "../types";

interface AiAdvisorProps {
  onSuggestCurriculumStructure: (structureText: string) => void;
  onApplyDatabaseSchemaChanges?: (dbText: string) => void;
}

export default function AiAdvisor({ onSuggestCurriculumStructure }: AiAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Xin chào! Tôi là EdTech Solution Architect & Product Manager của bạn. Tôi đã sẵn sàng hỗ trợ bạn thiết kế kiến trúc chương trình giáo dục (LMS), tinh chỉnh trải nghiệm người học (Learner Journey), xây dựng Roadmap sản phẩm, hoặc chuẩn hóa Cơ sở dữ liệu EdTech. Bạn có thể dán tài liệu thô hoặc chọn nhanh các trợ giúp bên dưới!",
      createdAt: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    {
      label: "💡 Thiết kế Gamification",
      prompt: "Hãy đề xuất phương án Gamification chi tiết (như Streak hằng ngày, bộ huy hiệu kích thích, cơ chế phần thưởng) tích hợp vào chương trình học để giữ chân học viên lâu nhất."
    },
    {
      label: "📄 Kịch bản Microlearning",
      prompt: "Làm thế nào để chia nhỏ một bài giảng lý thuyết dài 60 phút về 'Kế toán doanh nghiệp' hoặc 'Lập trình căn bản' thành các thẻ học liệu Microlearning tối ưu 3-5 phút?"
    },
    {
      label: "🗄️ Thiết kế CSDL nới rộng",
      prompt: "Đề xuất cấu trúc bảng Database (SQL/Firestore) tối ưu nhất để quản lý Tiến trình học trực tuyến chi tiết của học viên, tránh nghẽn truy vấn khi học viên tăng cao."
    },
    {
      label: "🎯 Đố vui tương tác",
      prompt: "Hãy tạo 3 câu hỏi trắc nghiệm kiến thức và giải câu đố nối từ kèm theo phản hồi sư phạm kích thích tư duy cho chủ đề: An toàn bảo mật thông tin."
    }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: textToSend,
      createdAt: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat-architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Không kết nối được dịch vụ tư vấn AI. Đang phản hồi giả lập...");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: "assistant-" + Date.now(),
          role: "assistant",
          content: data.reply,
          createdAt: new Date()
        }
      ]);
    } catch (err) {
      console.error(err);
      // Fallback response with beautiful pedagogical advice
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "fallback-" + Date.now(),
            role: "assistant",
            content: `⚠️ [Kết nối ngoại cảnh] Tôi xin đưa ra tư vấn theo hệ sinh thái mô phỏng EdTech:
            
Để hoàn thiện tính năng bạn yêu cầu "${textToSend.substring(0, 40)}...", tôi khuyến nghị:
1. **Thiết kế Micro-step**: Chia bài tập kiểm tra làm 3 bước độ khó nâng dần (Cognitive Scaffolding).
2. **Quy luật click tối giản**: Giảm bớt các popup đi kèm, đưa feedback sư phạm hiển thị trực tiếp bằng một slide-drawer bên phải.
3. **Mở rộng cơ sở dữ liệu**: Bổ sung bảng \`user_achievements\` liên kết \`(user_id, badge_type, unlocked_at)\` để phục vụ bảng xếp hạng nhanh hằng tuần.`,
            createdAt: new Date()
          }
        ]);
      }, 800);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <Cpu className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              EdTech Expert AI Advisor
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/25 animate-pulse-glow">
                ● Sẵn sàng
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">PERSONA: ARCHITECT & PM</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 text-xs font-semibold">
                PM
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none font-medium"
                  : "bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none font-sans"
              }`}
            >
              {/* Parse paragraph manually for basic rendering layout */}
              <div className="whitespace-pre-wrap break-words">
                {msg.content}
              </div>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 text-xs shrink-0 font-semibold animate-pulse">
              ...
            </div>
            <div className="bg-slate-950 text-slate-400 border border-slate-800 rounded-xl rounded-tl-none p-3 text-xs flex items-center gap-2 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Đang tính toán giải pháp tối ưu học hành...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Panel */}
      <div className="p-3 bg-slate-950/70 border-t border-slate-800/80">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Trợ giúp nhanh từ Kiến trúc sư EdTech:
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-left text-[11px] font-sans truncate transition-all duration-150 hover:border-slate-700"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Mô tả ý tưởng hoặc hỏi chuyên gia EdTech..."
          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-sans"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          className="p-2 ml-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

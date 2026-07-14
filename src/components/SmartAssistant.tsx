import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, AlertCircle, RefreshCw, FileText, User, Building, Trash2 } from "lucide-react";
import { ChatMessage, UserPath } from "../types";
import { wajeehFaqs } from "../data/wajeehFaqs";

interface SmartAssistantProps {
  pathType: UserPath;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, category?: string) => Promise<void>;
  onClearChat: () => void;
  isSending: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  uploadedFiles: { id: string; name: string }[];
  theme?: "light" | "dark";
  isFullScreen?: boolean;
}

export default function SmartAssistant({
  pathType,
  chatHistory,
  onSendMessage,
  onClearChat,
  isSending,
  selectedCategory,
  setSelectedCategory,
  uploadedFiles,
  theme = "dark",
  isFullScreen = false
}: SmartAssistantProps) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input, selectedCategory);
    setInput("");
  };

  const handleQuickQuestion = (text: string, category: string) => {
    if (isSending) return;
    setSelectedCategory(category);
    onSendMessage(text, category);
  };

  const getQuickPrompts = () => {
    return wajeehFaqs.map(faq => ({
      text: faq.question,
      cat: "all",
      label: faq.question
    }));
  };

  const isLight = theme === "light";

  return (
    <div className={`flex flex-col ${isFullScreen ? "h-full flex-1 min-h-0" : "h-[calc(100vh-12rem)]"} rounded-3xl border shadow-xl overflow-hidden font-sans transition-colors duration-300 ${
      isLight ? "bg-white border-slate-200" : "bg-[#062D24] border-[#103B30]/50"
    }`}>
      
      {/* Assistant Header */}
      <div className={`border-b px-6 py-4 flex items-center justify-between transition-colors duration-300 ${
        isLight ? "bg-slate-50 border-slate-150" : "bg-[#041C16] border-b border-[#103B30]/40"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/10">
            و
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold text-base ${isLight ? "text-slate-900" : "text-white"}`}>وجيه AI - المساعد الذكي</h3>
              <span className={`border text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isLight ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-[#103B30] border-[#103B30]/30 text-emerald-300"
              }`}>
                متصل
              </span>
            </div>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-450"}`}>
              {pathType === "individual" 
                ? "مستشارك الشخصي للحلول والشكاوى المالية والادخار" 
                : "مستشار الالتزام المالي، التراخيص ولوائح مكافحة غسيل الأموال"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {chatHistory.length > 0 && (
            <button 
              onClick={onClearChat}
              className={`p-2 rounded-lg transition cursor-pointer ${
                isLight ? "text-slate-450 hover:text-red-500 hover:bg-slate-105" : "text-slate-400 hover:text-red-400 hover:bg-[#020907]"
              }`}
              title="مسح المحادثة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <span className={`text-xs font-semibold border rounded-md px-2.5 py-1 ${
            isLight ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-[#020907] border-[#103B30]/40 text-slate-300"
          }`}>
            {pathType === "individual" ? "بوابة الأفراد" : "بوابة الأعمال"}
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-colors duration-300 ${
        isLight ? "bg-slate-50/50" : "bg-[#020907]"
      }`}>
        {chatHistory.length === 0 ? (
          <div className="py-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <div className={`w-14 h-14 border rounded-2xl flex items-center justify-center animate-bounce ${
              isLight ? "bg-white border-slate-200 text-emerald-600 shadow-sm" : "bg-[#041C16] border-[#103B30]/30 text-emerald-400"
            }`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className={`font-black text-base ${isLight ? "text-slate-900" : "text-white"}`}>مرحباً بك، أنا وجيه AI</h4>
              <p className={`text-xs leading-relaxed max-w-md mx-auto ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {pathType === "individual"
                  ? "أنا هنا لمساعدتك في صياغة الشكاوى، مراجعة كشوفات الحساب، وتقديم استشارات الصيانة المالية الشخصية المتوافقة مع الأنظمة السعودية."
                  : "مهمتي مساعدة شركتك في فهم اللوائح، وصياغة سياسات اعرف عميلك (KYC) للامتثال، واختصار الإجراءات التنظيمية لساما وهيئة السوق المالية."}
              </p>
            </div>

            {/* Quick Suggestions */}
            <div className="w-full space-y-2 pt-2">
              <p className={`text-[10px] font-bold uppercase tracking-wider text-right ${isLight ? "text-[#004B3E]" : "text-emerald-400"}`}>أسئلة شائعة لبدء المحادثة:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {getQuickPrompts().map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(prompt.text, prompt.cat)}
                    className={`border text-[11px] font-bold py-2.5 px-3.5 rounded-xl text-right transition cursor-pointer hover:border-emerald-500 shadow-xs hover:shadow-sm ${
                      isLight 
                        ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900" 
                        : "bg-[#041C16] hover:bg-[#103B30] text-slate-200 border-[#103B30]/50 hover:border-emerald-500"
                    }`}
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0 ${
                  message.sender === "user" 
                    ? "bg-emerald-600 text-white" 
                    : isLight
                    ? "bg-white border border-slate-200 text-emerald-600"
                    : "bg-[#041C16] text-emerald-400 border border-[#103B30]/30"
                }`}>
                  {message.sender === "user" ? <User className="w-4 h-4" /> : "و"}
                </div>

                {/* Message Body */}
                <div className="space-y-1 max-w-[80%]">
                  <div className={`rounded-2xl p-4.5 text-sm leading-relaxed shadow-xs ${
                    message.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-xs font-semibold"
                      : isLight
                      ? "bg-white text-slate-800 border border-slate-150 rounded-tl-xs"
                      : "bg-[#062D24] text-slate-100 border border-[#103B30]/50 rounded-tl-xs"
                  }`}>
                    <div className="whitespace-pre-wrap markdown-body prose prose-invert max-w-none text-right">
                      {/* Simple custom markdown renderer to render bold, headers, and code snippets */}
                      {message.text.split('\n').map((line, lIdx) => {
                        let content: React.ReactNode = line;

                        // Header 3
                        if (line.startsWith('### ')) {
                          return <h4 key={lIdx} className={`font-bold text-base mt-4 mb-2 first:mt-0 ${isLight ? "text-slate-900" : "text-white"}`}>{line.replace('### ', '')}</h4>;
                        }
                        // Header 4
                        if (line.startsWith('#### ')) {
                          return <h5 key={lIdx} className={`font-bold text-sm mt-3 mb-1 ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>{line.replace('#### ', '')}</h5>;
                        }
                        // Divider
                        if (line === '---') {
                          return <hr key={lIdx} className={`my-4 ${isLight ? "border-slate-150" : "border-[#103B30]/30"}`} />;
                        }
                        // Bullet point
                        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                          const cleanLine = line.trim().substring(2);
                          content = <span className="inline-block">{cleanLine}</span>;
                          return (
                            <div key={lIdx} className="flex items-start gap-2.5 my-1.5 font-medium">
                              <span className="w-1.5 h-1.5 bg-emerald-550 rounded-full mt-2 flex-shrink-0"></span>
                              <span className={isLight ? "text-slate-750" : "text-slate-350"}>{content}</span>
                            </div>
                          );
                        }
                        // Number list
                        if (/^\d+\.\s/.test(line.trim())) {
                          return <div key={lIdx} className={`mr-4 my-1.5 font-medium list-decimal ${isLight ? "text-slate-750" : "text-slate-350"}`}>{line}</div>;
                        }

                        // Bold formatting
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        if (boldRegex.test(line)) {
                          const parts = line.split(boldRegex);
                          content = parts.map((part, pIdx) => pIdx % 2 === 1 ? (
                            <strong key={pIdx} className={`px-1 py-0.5 rounded font-extrabold ${
                              isLight ? "text-emerald-800 bg-emerald-50" : "text-emerald-300 bg-[#041C16]"
                            }`}>{part}</strong>
                          ) : part);
                        }

                        // Code block detection
                        if (line.startsWith('```')) {
                          return null; // Skip code formatting tags to render content cleanly
                        }

                        return <p key={lIdx} className="min-h-[1rem] my-1 font-medium">{content}</p>;
                      })}
                    </div>
                  </div>

                  {/* Message timestamp & status */}
                  <div className={`flex items-center gap-1.5 text-[10px] text-slate-550 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}>
                    <span>{new Date(message.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.isSimulated && (
                      <span className={`border px-1.5 py-0.2 rounded-md font-semibold ${
                        isLight ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-[#041C16] border border-[#103B30]/20 text-emerald-400"
                      }`}>محاكاة ذكية</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-4 flex-row">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-sm animate-pulse flex-shrink-0 ${
                  isLight ? "bg-white border-slate-200 text-emerald-650" : "bg-[#041C16] text-emerald-400 border border-[#103B30]/30"
                }`}>
                  و
                </div>
                <div className={`border rounded-2xl rounded-tl-xs p-4 text-xs flex items-center gap-2.5 shadow-xs ${
                  isLight ? "bg-white border-slate-150 text-slate-500" : "bg-[#062D24] border border-[#103B30]/50 text-slate-400"
                }`}>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>يقوم وجيه AI بتحليل تفاصيل حالتك وصياغة الحل القانوني الآن...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className={`border-t p-4 transition-colors duration-300 ${
        isLight ? "bg-white border-slate-200" : "bg-[#062D24] border-[#103B30]/40"
      }`}>
        {/* Suggested FAQ Chips */}
        <div className="mb-3.5 space-y-1.5">
          <p className={`text-[10px] font-black px-1 text-right ${isLight ? "text-[#004B3E]" : "text-emerald-400"}`}>أسئلة شائعة مقترحة:</p>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-transparent snap-x" dir="rtl">
            {wajeehFaqs.map((faq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage(faq.question, "all")}
                disabled={isSending}
                className={`snap-center flex-shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full border transition cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  isLight
                    ? "bg-emerald-50/40 hover:bg-emerald-100/40 text-slate-700 border-emerald-100/60 hover:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    : "bg-[#041C16] hover:bg-[#103B30] text-emerald-100 border-[#103B30]/50 hover:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                }`}
              >
                {faq.question}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اشرح مشكلتك لـ وجيه AI هنا... (مثال: خصم خاطئ من البنك، أو ترخيص فنتك)"
              disabled={isSending}
              className={`w-full border rounded-xl pr-4 pl-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition font-medium ${
                isLight 
                  ? "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-550" 
                  : "bg-[#020907] border-[#103B30]/50 focus:border-emerald-550 focus:bg-[#020907] text-white placeholder-slate-500"
              }`}
            />
            
            {/* Category Indicator Tag */}
            <div className="absolute left-3.5 top-3 flex items-center gap-1.5">
              <span className={`text-[10px] border px-2 py-0.5 rounded-md font-bold uppercase ${
                isLight ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-[#041C16] text-emerald-400 border border-[#103B30]/30"
              }`}>
                {selectedCategory === "all" ? "عام" : selectedCategory}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="bg-emerald-600 hover:bg-emerald-550 disabled:bg-emerald-100 disabled:text-slate-400 text-white font-bold w-11 h-11 rounded-xl flex items-center justify-center transition shadow-md cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </form>

        <div className={`flex justify-between items-center text-[10px] mt-2.5 px-1 font-semibold ${
          isLight ? "text-slate-500" : "text-slate-500"
        }`}>
          <span>يمكنك كتابة استفسارك أو إرفاق ملف للبدء في تحليل المستندات تلقائياً.</span>
          <span>منصة وجيه الذكية للالتزام 2026</span>
        </div>
      </div>

    </div>
  );
}

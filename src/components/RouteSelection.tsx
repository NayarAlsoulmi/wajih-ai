import React from "react";
import { User, Building2, Check, ArrowLeft, Sun, Moon, Sparkles } from "lucide-react";
import { UserPath } from "../types";
import SamaHeader from "./SamaHeader";
import WajihLogo from "./WajihLogo";

interface RouteSelectionProps {
  onSelectPath: (path: UserPath) => void;
  onBackToPortal: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function RouteSelection({ onSelectPath, onBackToPortal, theme, onToggleTheme }: RouteSelectionProps) {
  const isLight = theme === "light";

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans transition-colors duration-300 ${
      isLight ? "bg-slate-50 text-slate-800" : "bg-[#020907] text-slate-200"
    }`} dir="rtl">
      
      {/* Official SAMA Persistent Header */}
      <SamaHeader 
        currentView="route_selection"
        onNavigate={(view) => {
          if (view === 'portal') {
            onBackToPortal();
          }
        }}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onStartWajih={() => {}} // Already on selection screen
      />

      {/* Main Selection Body */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col justify-center items-center gap-10 w-full animate-fade-in">
        
        {/* Wajih Adopted Emblem Showcase */}
        <div className="text-center space-y-4">
          <WajihLogo theme={isLight ? "light" : "dark"} size={80} showText={false} className="mx-auto" />
          
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight" style={{ color: isLight ? "#0f172a" : "#ffffff" }}>
            اختر مسارك في وجيه AI
          </h2>
          <p className="text-xs md:text-sm max-w-xl mx-auto font-extrabold text-slate-500 leading-relaxed">
            البوابة تنقسم إلى مسارين مخصصين: مسار الأفراد لشكاوى البنوك والتحليل المالي الشخصي، ومسار الأعمال للشركات وحاضنات التقنية المالية للالتزام واللوائح.
          </p>
        </div>

        {/* Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          
          {/* Path 1: Individuals */}
          <div className={`rounded-3xl border shadow-xl hover:shadow-2xl transition duration-300 flex flex-col justify-between overflow-hidden ${
            isLight 
              ? "bg-white border-slate-200 hover:border-[#004B3E]" 
              : "bg-[#062D24] border-[#103B30]/60 hover:border-emerald-500/50"
          }`}>
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-start justify-between">
                <span className={`border px-3.5 py-1 rounded-full text-[10px] font-black ${
                  isLight 
                    ? "bg-emerald-50 text-emerald-850 border-emerald-200" 
                    : "bg-[#103B30] text-emerald-300 border-emerald-550"
                }`}>
                  مواطن / مقيم (أفراد)
                </span>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  isLight ? "bg-slate-100 text-[#004B3E]" : "bg-[#041C16] text-[#C4A15A]"
                }`}>
                  <User className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className={`text-xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>بوابة الأفراد</h3>
                <p className="text-xs leading-relaxed font-extrabold text-slate-500">
                  فحص وتحليل الديون والتمويل الشخصي، رصد الحركات المالية المشبوهة، تجهيز ملفات التظلم الشاملة وصياغتها تلقائياً لتقديمها للبنك المركزي.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-bold text-slate-500">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>مساعد ذكي للشكاوى والاستفسارات</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>رفع وتحليل كشوف الحسابات وتدقيقها</span>
                </li>
              </ul>
            </div>

            <div className={`p-6 border-t ${isLight ? "bg-slate-50 border-slate-100" : "bg-[#041C16] border-t border-[#103B30]/40"}`}>
              <button 
                onClick={() => onSelectPath('individual')}
                className="w-full bg-[#004B3E] hover:bg-[#003B31] text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-emerald-950/10 cursor-pointer"
              >
                <span>دخول كفرد</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </button>
            </div>
          </div>

          {/* Path 2: Business */}
          <div className={`rounded-3xl border shadow-xl hover:shadow-2xl transition duration-300 flex flex-col justify-between overflow-hidden ${
            isLight 
              ? "bg-white border-slate-200 hover:border-[#004B3E]" 
              : "bg-[#062D24] border-[#103B30]/60 hover:border-emerald-500/50"
          }`}>
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-start justify-between">
                <span className={`border px-3.5 py-1 rounded-full text-[10px] font-black ${
                  isLight 
                    ? "bg-amber-50 text-amber-800 border-amber-200" 
                    : "bg-[#103B30] text-emerald-300 border-[#103B30]"
                }`}>
                  منشآت / فنتك (شركات)
                </span>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  isLight ? "bg-slate-100 text-[#004B3E]" : "bg-[#041C16] text-[#C4A15A]"
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className={`text-xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>بوابة المنشآت والأعمال</h3>
                <p className="text-xs leading-relaxed font-extrabold text-slate-500">
                  إعداد ومطابقة ملفات التراخيص للتقنية المالية (FinTech)، فحص وثائق الامتثال والحوكمة وسياسات مكافحة غسيل الأموال وتفادي المخالفات.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-bold text-slate-500">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>تجهيز رخص وسيط المدفوعات والفنتك</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>تدقيق سياسات AML/CFT والحوكمة</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>لوحة مؤشرات الالتزام وإدارة الحالات</span>
                </li>
              </ul>
            </div>

            <div className={`p-6 border-t ${isLight ? "bg-slate-50 border-slate-100" : "bg-[#041C16] border-t border-[#103B30]/40"}`}>
              <button 
                onClick={() => onSelectPath('business')}
                className="w-full bg-[#C4A15A] hover:bg-[#B08F50] text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-amber-600/10 cursor-pointer"
              >
                <span>دخول كأعمال</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Mini Footer */}
      <footer className={`text-center py-5 text-[11px] font-black border-t ${
        isLight ? "bg-slate-100 border-slate-200 text-slate-500" : "bg-[#020907] border-[#103B30]/30 text-slate-400"
      }`}>
        بوابة وجيه AI الذكية • جميع حقوق السياسات والأنظمة واللوائح محفوظة لمصادرها الرسمية بالمملكة العربية السعودية
      </footer>
    </div>
  );
}

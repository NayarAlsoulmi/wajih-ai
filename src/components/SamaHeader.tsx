import React from "react";
import { Search, Sun, Moon, Sparkles, LogOut, ShieldCheck, Home } from "lucide-react";

interface SamaHeaderProps {
  currentView: 'portal' | 'route_selection' | 'individual_dashboard' | 'business_dashboard';
  onNavigate: (view: 'portal' | 'route_selection' | 'individual_dashboard' | 'business_dashboard') => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onStartWajih: () => void;
}

export default function SamaHeader({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  onStartWajih
}: SamaHeaderProps) {
  const isLight = theme === "light";

  // Official SAMA Colors
  const greenPrimary = "#004B3E"; // SAMA Deep Emerald
  const goldPrimary = "#C4A15A";  // Wajih Golden/Bronze
  const goldHover = "#B08F50";

  return (
    <div className="w-full flex flex-col z-50 shadow-md font-sans" dir="rtl">
      
      {/* 1. White Top Bar */}
      <div className={`w-full h-16 border-b px-4 sm:px-6 lg:px-12 flex items-center justify-between transition-colors duration-300 ${
        isLight ? "bg-white border-slate-100" : "bg-[#041611] border-slate-900"
      }`}>
        
        {/* Right side: SAMA Logo & Text */}
        <button 
          onClick={() => onNavigate('portal')}
          className="flex items-center gap-3 text-right hover:opacity-90 transition cursor-pointer"
        >
          {/* SAMA Crest circular badge (Historic emblem custom designed) */}
          <svg className="w-10 h-10 flex-shrink-0 bg-white rounded-full shadow-sm" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Circle */}
            <circle cx="60" cy="60" r="56" stroke="#004B3E" strokeWidth="3" />
            
            {/* Inner Circle */}
            <circle cx="60" cy="60" r="35" stroke="#004B3E" strokeWidth="2" />
            
            {/* Top Hanging Ring/Beads */}
            <line x1="60" y1="4" x2="60" y2="35" stroke="#004B3E" strokeWidth="2" />
            <circle cx="60" cy="11" r="3.5" fill="white" stroke="#004B3E" strokeWidth="2" />
            <circle cx="60" cy="19" r="3.5" fill="white" stroke="#004B3E" strokeWidth="2" />
            <circle cx="60" cy="27" r="3.5" fill="white" stroke="#004B3E" strokeWidth="2" />
            
            {/* Inner Text (Shahada) */}
            <text x="60" y="52" textAnchor="middle" fill="#004B3E" fontSize="14" fontWeight="900" fontFamily="'Cairo', 'Amiri', 'Traditional Arabic', system-ui, sans-serif">لا اله</text>
            <text x="60" y="67" textAnchor="middle" fill="#004B3E" fontSize="14" fontWeight="900" fontFamily="'Cairo', 'Amiri', 'Traditional Arabic', system-ui, sans-serif">الا الله</text>
            <text x="60" y="82" textAnchor="middle" fill="#004B3E" fontSize="14" fontWeight="900" fontFamily="'Cairo', 'Amiri', 'Traditional Arabic', system-ui, sans-serif">وحده</text>
            
            {/* Circular Arabic Text: البنك المركزي السعودي */}
            <g fill="#004B3E" fontWeight="900" fontSize="12" fontFamily="'Cairo', 'Amiri', 'Traditional Arabic', system-ui, sans-serif">
              {/* Word "البنك" */}
              <text transform="translate(86, 36) rotate(42)" textAnchor="middle">البنك</text>
              
              {/* Word "المركزي" */}
              <text transform="translate(68, 104) rotate(-5)" textAnchor="middle">المركزي</text>
              
              {/* Word "السعودي" */}
              <text transform="translate(25, 52) rotate(-85)" textAnchor="middle">السعودي</text>
            </g>
          </svg>
          <div className="select-none flex flex-col">
            <span className={`text-[13px] font-extrabold leading-tight ${isLight ? "text-[#004B3E]" : "text-emerald-450"}`}>البنك المركزي السعودي</span>
            <span className="text-[9px] font-bold tracking-widest text-slate-450 leading-none">Saudi Central Bank</span>
          </div>
        </button>

        {/* Left side: Utilities (Careers, Contact, Theme Toggle, Search) */}
        <div className="flex items-center gap-5 sm:gap-6 text-[12px] font-extrabold text-slate-500">
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className={`hover:text-[#004B3E] transition ${isLight ? "text-slate-650" : "text-slate-350"}`}>التوظيف</a>
            <a href="#" className={`hover:text-[#004B3E] transition ${isLight ? "text-slate-650" : "text-slate-350"}`}>تواصل معنا</a>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button className={`p-2 rounded-lg hover:bg-slate-100/10 transition cursor-pointer ${isLight ? "text-slate-600 hover:bg-slate-100" : "text-slate-300 hover:bg-slate-800"}`}>
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition border flex items-center justify-center cursor-pointer ${
                isLight 
                  ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200" 
                  : "bg-[#062620] hover:bg-[#0c3c33] text-amber-400 border-[#103B30]/50"
              }`}
              title={isLight ? "التحويل للوضع الداكن" : "التحويل للوضع المضيء"}
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Back to Portal (Only visible if not in portal already) */}
            {currentView !== 'portal' && (
              <button
                onClick={() => onNavigate('portal')}
                className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50/50 transition cursor-pointer"
                title="الرجوع للبوابة الرئيسية"
              >
                <LogOut className="w-3.5 h-3.5 transform rotate-180" />
                <span className="hidden sm:inline">البوابة</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Deep Green Navbar */}
      <div className="w-full bg-[#004B3E] px-4 sm:px-6 lg:px-12 flex items-center justify-between h-14 overflow-x-auto overflow-y-hidden border-b border-[#053b31] select-none scrollbar-none">
        
        {/* Menu links (Right) */}
        <div className="flex items-center gap-5 sm:gap-7 h-full text-[13px] font-bold text-white flex-nowrap whitespace-nowrap">
          <button 
            onClick={() => onNavigate('portal')}
            className={`h-full flex items-center relative transition px-1 hover:text-emerald-250 cursor-pointer ${
              currentView === 'portal' ? "text-white font-extrabold" : "text-emerald-100"
            }`}
          >
            <span>الرئيسية</span>
            {currentView === 'portal' && (
              <span className="absolute bottom-0 right-0 left-0 h-[3.5px] bg-white rounded-t-lg"></span>
            )}
          </button>

          {[
            { label: "من نحن", view: "about" },
            { label: "الرقابة", view: "supervision" },
            { label: "الإحصاءات", view: "statistics" },
            { label: "المنشورات", view: "publications" },
            { label: "السياسة النقدية", view: "policy" },
            { label: "أنظمة المدفوعات", view: "payments" },
            { label: "الخدمات الإلكترونية", view: "services" }
          ].map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (link.view === "services") {
                  onStartWajih();
                } else {
                  alert(`قسم "${link.label}" يحاكي بوابة البنك المركزي السعودي. يرجى تصفح "وجيه AI" بالنقر على الزر الذهبي لبدء تجربة المساعد الذكي.`);
                }
              }}
              className="h-full flex items-center relative text-emerald-100 hover:text-white transition px-1 cursor-pointer"
            >
              <span>{link.label}</span>
            </button>
          ))}
        </div>

        {/* Golden "وجيه AI ✨" Pill Button (Left) */}
        <div className="flex-shrink-0 py-2 mr-4">
          <button
            onClick={onStartWajih}
            className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-black text-[12px] tracking-wide transition shadow-lg border cursor-pointer hover:scale-105 active:scale-95 duration-300 ${
              currentView !== 'portal'
                ? "bg-white text-[#004B3E] border-white shadow-white/10"
                : "bg-[#C4A15A] hover:bg-[#B08F50] text-white border-[#D6B875] shadow-amber-600/20"
            }`}
            style={{ fontFamily: "Cairo, sans-serif" }}
            id="btn-nav-wajih-pill"
          >
            {currentView !== 'portal' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>وجيه نشط حالياً</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                <span>وجيه AI</span>
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

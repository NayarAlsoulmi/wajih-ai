import React from "react";
import { Sparkles, ShieldCheck, FileText, Award, Layers, HelpCircle, ArrowLeft, Sun, Moon, ArrowRight, TrendingUp, CheckCircle, Bell, Clock } from "lucide-react";
import SamaHeader from "./SamaHeader";
import WajihLogo from "./WajihLogo";

interface PortalProps {
  onStartWajih: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Portal({ onStartWajih, theme, onToggleTheme }: PortalProps) {
  const isLight = theme === "light";

  // Official colors
  const greenPrimary = "#004B3E"; // SAMA Deep Emerald Green
  const goldPrimary = "#C4A15A";  // Wajih Accent Gold

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? "bg-slate-50 text-slate-800" : "bg-[#020907] text-slate-200"
    }`} dir="rtl">
      
      {/* SAMA Persistent Top Header & Navbar */}
      <SamaHeader 
        currentView="portal"
        onNavigate={() => {}}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onStartWajih={onStartWajih}
      />

      {/* SAMA Main Gateway Hero Banner (Recreating the second image) */}
      <div className="w-full bg-[#004B3E] text-white overflow-hidden border-b border-[#053b31] relative">
        {/* Subtle background overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-emerald-950/40 via-transparent to-transparent opacity-60"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 md:py-20 relative z-10">
          
          {/* SAMA Website Launch Announcement text */}
          <div className="space-y-6 text-right animate-fade-in max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#053c31] border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-[11px] font-black text-emerald-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              إستراتيجية التحول الرقمي المصرفي
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-snug tracking-tight font-sans text-white">
              البنك المركزي السعودي يطلق موقعه الإلكتروني الجديد
            </h2>

            <p className="text-sm md:text-base leading-relaxed text-emerald-100 font-medium max-w-3xl">
              أطلق البنك المركزي السعودي "ساما" موقعه الإلكتروني الجديد ضمن إستراتيجيته للتحول الرقمي، مجهزاً بأحدث التقنيات لخدمة قطاع الأفراد والأعمال بكفاءة عالية، وتسهيل الوصول الفوري للأنظمة واللوائح والخدمات التنظيمية الذكية.
            </p>
          </div>

        </div>

        {/* 3. The Interactive Guidance Bar at the bottom of the hero banner (EXACTLY from the second image) */}
        <div 
          onClick={onStartWajih}
          className="w-full bg-white border-y border-slate-100 hover:bg-slate-50 transition duration-300 cursor-pointer text-center py-4 flex items-center justify-center gap-2 text-[#004B3E] font-black text-sm select-none"
        >
          <span className="animate-pulse">اضغط تبويب "وجيه AI" أعلاه للمتابعة</span>
          <span className="text-amber-500 font-black animate-bounce mr-1">➔</span>
        </div>
      </div>

      {/* Main Content Area: Wajih AI Dedicated Intro section and Central Banking details */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* High-Fidelity Introduction to Wajih AI (Now Adopted with the user's Logo!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right: Text and action details */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[10px] font-black uppercase tracking-wider">
                مستشار مالي وتنظيمي متكامل
              </span>
              <span className="px-3 py-1 bg-[#004B3E]/5 text-[#004B3E] border border-[#004B3E]/10 rounded-md text-[10px] font-black">
                بإشراف البنك المركزي السعودي
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              تعرّف على <span className="text-[#004B3E]">وجيه AI</span>: المساعد المالي والتنظيمي الذكي
            </h3>

            <p className="text-sm md:text-base leading-relaxed text-slate-600 font-medium">
              مرحباً بك في البوابة الذكية المعززة بالذكاء الاصطناعي لرفع الثقافة المالية ومطابقة الالتزام والأنظمة. صُمم وجيه AI لتسريع وتبسيط الخدمات القانونية والمالية الصادرة عن البنك المركزي السعودي وهيئة السوق المالية للأفراد والشركات.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-150 flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-[#004B3E] rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">مراجعة الالتزام الفوري</h5>
                  <p className="text-[11px] text-slate-500 font-bold mt-1">حلل ملفاتك التنظيمية واعرف مدى تماشيها مع أنظمة مكافحة غسيل الأموال AML ومعايير اعرف عميلك KYC.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-150 flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">إعداد شكاوى البنوك والتمويل</h5>
                  <p className="text-[11px] text-slate-500 font-bold mt-1">توليد وصياغة لوائح الاعتراض والشكاوى المصرفية تلقائياً تمهيداً لتقديمها للجهات المعنية.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={onStartWajih}
                className="bg-[#004B3E] hover:bg-[#003c31] text-white px-8 py-3.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-950/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ابدأ تجربة وجيه AI الآن</span>
                <ArrowLeft className="w-4 h-4 mr-1" />
              </button>
            </div>
          </div>

          {/* Left: Beautiful Logo Showcase with exact uploaded design */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 relative overflow-hidden">
              <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full bg-emerald-50/40 blur-xl"></div>
              
              {/* Adopted Wajih Logo Component */}
              <div id="wajih-logo-portal" className="inline-block">
                <WajihLogo theme="light" size={90} />
              </div>

              {/* Status Badge */}
              <div className="mt-4 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs font-bold text-[#004B3E]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>المستشار الذكي جاهز لمساعدتك</span>
                </div>
                <span className="text-[10px] bg-[#004B3E] text-white px-2 py-0.5 rounded-md">آمن ومتوافق</span>
              </div>
            </div>
          </div>

        </div>

        {/* Central Banking Indicators Grid (Traditional SAMA Data) */}
        <div className="space-y-6 border-t border-slate-150 pt-12">
          <div className="text-right">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-450">المؤشرات النقدية والمصرفية لساما</h4>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">مؤشرات القطاع المالي المحدثة (يوليو 2026)</h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "معدل اتفاقيات إعادة الشراء (الريبو)", val: "6.00%", sub: "مستقر - قرار السياسة النقدية" },
              { label: "معدل الريبو العكسي (الريبو العكسي)", val: "5.50%", sub: "مستقر - البنك المركزي" },
              { label: "معدل التضخم السنوي (المملكة)", val: "1.6%", sub: "ضمن الحدود الآمنة للرؤية" },
              { label: "حجم الأصول الاحتياطية بالخارج", val: "1,675 مليار ر.س", sub: "نمو مستقر ومتين" }
            ].map((ind, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-slate-150 text-right space-y-1">
                <span className="text-[10px] font-bold text-slate-450 block">{ind.label}</span>
                <div className="text-xl font-black text-[#004B3E]">{ind.val}</div>
                <span className="text-[10px] font-semibold text-slate-400 block">{ind.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SAMA Service Category Cards (From image layout but updated) */}
        <div className="space-y-6 border-t border-slate-150 pt-12">
          <div className="text-right">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-450">تصنيفات الالتزام والدعم</h4>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">أقسام ومسارات الخدمة الإلكترونية والذكية</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Box 1: AI Assistant */}
            <div 
              onClick={onStartWajih}
              className="bg-[#004B3E] text-white rounded-2xl p-6 flex flex-col justify-between h-48 shadow-lg cursor-pointer transition transform hover:-translate-y-1 border border-[#053c31] hover:bg-[#003c31]"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 text-white">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] bg-amber-500/25 text-amber-200 border border-amber-500/20 px-2 py-0.5 rounded font-black">تبويب وجيه الذكي</span>
                <h4 className="font-extrabold text-base mt-2">وجيه AI للأفراد والأعمال</h4>
                <p className="text-[11px] text-emerald-100 mt-1 line-clamp-2">البوابة الذكية الموحدة للمساعدة في الشكاوى، تراخيص التقنية المالية، والتحقق من سياسات الالتزام.</p>
              </div>
            </div>

            {/* Box 2: FinTech */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between h-48 border border-slate-200 hover:border-[#004B3E]/40 hover:bg-slate-50/50 transition cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#004B3E]/5 text-[#004B3E]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">تراخيص شركات التقنية المالية</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-bold">نموذج الترخيص والتشغيل الموحد لشركات الفنتك Fintech ومزودي حلول الدفع بالسعودية.</p>
              </div>
            </div>

            {/* Box 3: Complaints */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between h-48 border border-slate-200 hover:border-[#004B3E]/40 hover:bg-slate-50/50 transition cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#004B3E]/5 text-[#004B3E]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">تقديم الشكاوى والبلاغات</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-bold">رفع ومتابعة الشكاوى المصرفية الرسمية الموجهة لإدارات حماية العملاء بالبنوك وشركات التمويل.</p>
              </div>
            </div>

            {/* Box 4: Compliance Audits */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between h-48 border border-slate-200 hover:border-[#004B3E]/40 hover:bg-slate-50/50 transition cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#004B3E]/5 text-[#004B3E]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">مراجعة الالتزام والمخاطر</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-bold">فحص الوثائق والتأكد من مطابقتها للقواعد العامة لمكافحة غسيل الأموال ومرئيات البنك المركزي.</p>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#003B31] border-t border-[#002f27] py-8 text-center text-xs font-bold text-emerald-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 البنك المركزي السعودي "ساما" - بوابة وجيه AI للمساعدة الذكية لخدمات الأفراد والأعمال.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">سياسة الخصوصية</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition">شروط الاستخدام والامتثال</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

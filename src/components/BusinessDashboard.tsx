import React, { useState } from "react";
import { 
  Sparkles, ShieldCheck, FileText, Award, Layers, HelpCircle, 
  TrendingUp, Activity, Bell, LogOut, User, Building2, UploadCloud, 
  CheckCircle2, Compass, PieChart, Users, Settings, AlertTriangle, Shield,
  Sun, Moon, Menu, X, ChevronLeft, ChevronRight, Calculator, Eye, EyeOff, Home, ArrowRight
} from "lucide-react";
import { ChatMessage, WajihCase, UploadedFile, AlertItem } from "../types";
import SmartAssistant from "./SmartAssistant";
import CaseManagement from "./CaseManagement";
import FilesManager from "./FilesManager";
import SamaHeader from "./SamaHeader";
import WajihLogo from "./WajihLogo";
import OnboardingSpotlight from "./OnboardingSpotlight";
import SidebarOnboarding from "./SidebarOnboarding";

export const BUSINESS_ENTITIES_DATA: Record<string, {
  name: string;
  crNumber: string;
  monthlyIncome: number;
  monthlySpending: number;
  activeLoans: number;
  dscr: number;
  profitMargin: number;
  score: number;
  status: string;
  statusColor: string;
  advice: string[];
}> = {
  innovativeFintech: {
    name: "شركة التقنيات المالية المبتكرة",
    crNumber: "1010482093",
    monthlyIncome: 185000,
    monthlySpending: 124000,
    activeLoans: 42000,
    dscr: 1.45,
    profitMargin: 33,
    score: 88,
    status: "ممتاز (ملتزم تنظيمياً)",
    statusColor: "text-emerald-500",
    advice: [
      "تتمتع المنشأة بنسبة سيولة نقدية عالية تمكنها من تغطية التزاماتها قصيرة الأجل بسهولة وبشكل متوافق.",
      "نسبة تغطية خدمة الدين (DSCR) تبلغ 1.45 وهي أعلى بكثير من الحد الاحترازي الأدنى لساما (1.20).",
      "ننصح باستثمار الفائض النقدي لتوسيع عمليات التطوير والابتكار في البيئة التجريبية (Sandbox)."
    ]
  },
  digitalGateway: {
    name: "مؤسسة بوابة الدفع الرقمية",
    crNumber: "1010910321",
    monthlyIncome: 92000,
    monthlySpending: 78000,
    activeLoans: 25000,
    dscr: 1.15,
    profitMargin: 15,
    score: 68,
    status: "مقبول (مخاطر منخفضة)",
    statusColor: "text-amber-500",
    advice: [
      "مؤشر الالتزام المالي يقترب من السقف الاحترازي لنسبة الدين إلى التدفقات النقدية والربحية.",
      "تغطية خدمة الدين تبلغ 1.15 وهي أقل من التوصيات المثالية لساما (1.20). يرجى الحذر من زيادة الاقتراض المالي.",
      "نوصي بمراجعة وتخفيض المصاريف التشغيلية بنسبة 10% لتحسين التدفق النقدي المتاح."
    ]
  },
  supplyChain: {
    name: "شركة سلاسل الإمداد للخدمات اللوجستية",
    crNumber: "1010374492",
    monthlyIncome: 350000,
    monthlySpending: 310000,
    activeLoans: 140000,
    dscr: 0.95,
    profitMargin: 11,
    score: 45,
    status: "حرج (مخاطر عالية في الملاءة)",
    statusColor: "text-red-500",
    advice: [
      "المنشأة تعاني من عجز نسبي في تغطية خدمة الدين الحالي (DSCR = 0.95)، مما يستدعي إعادة جدولة فورية مع المقرضين.",
      "الالتزام الشهري مرتفع للغاية مما يؤثر على كفاية رأس المال وملاءة المنشأة وفق المعايير الإشرافية والرقابية لساما.",
      "التقدم لطلب تمويل إضافي مرفوض تنظيمياً حالياً حتى تحسين نسب السيولة والتدفق النقدي العام."
    ]
  }
};

interface BusinessDashboardProps {
  cases: WajihCase[];
  files: UploadedFile[];
  alerts: AlertItem[];
  chatHistory: ChatMessage[];
  isSendingChat: boolean;
  onSendMessage: (text: string, category?: string) => Promise<void>;
  onClearChat: () => void;
  onUploadFile: (name: string, size: string, type: string) => void;
  onDeleteFile: (fileId: string) => void;
  onToggleDoc: (caseId: string, docName: string) => void;
  onAddCase: (title: string, category: string, desc: string, requiredDocs: string[]) => void;
  onDeleteCase: (caseId: string) => void;
  onExit: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function BusinessDashboard({
  cases,
  files,
  alerts,
  chatHistory,
  isSendingChat,
  onSendMessage,
  onClearChat,
  onUploadFile,
  onDeleteFile,
  onToggleDoc,
  onAddCase,
  onDeleteCase,
  onExit,
  theme,
  onToggleTheme
}: BusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [paidAlerts, setPaidAlerts] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);
  const [selectedEntity, setSelectedEntity] = useState<string>("innovativeFintech");

  // Business Financial Analysis parameters
  const [bizRevenue, setBizRevenue] = useState<number>(120000);
  const [bizOpEx, setBizOpEx] = useState<number>(78000);
  const [bizDebtService, setBizDebtService] = useState<number>(15000);
  const [bizInventory, setBizInventory] = useState<number>(35000);
  const [isAnalyzingBiz, setIsAnalyzingBiz] = useState<boolean>(false);
  const [analysisStepBiz, setAnalysisStepBiz] = useState<number>(0);
  const [analysisResultBiz, setAnalysisResultBiz] = useState<any>(null);

  const handleAnalyzeBiz = () => {
    setIsAnalyzingBiz(true);
    setAnalysisStepBiz(1);
    setAnalysisResultBiz(null);

    setTimeout(() => {
      setAnalysisStepBiz(2);
    }, 1000);

    setTimeout(() => {
      setAnalysisStepBiz(3);
    }, 2000);

    setTimeout(() => {
      const netProfit = bizRevenue - bizOpEx - bizDebtService;
      const profitMargin = parseFloat(((netProfit / bizRevenue) * 100).toFixed(1));
      const ds_ratio = parseFloat(((bizRevenue - bizOpEx) / (bizDebtService || 1)).toFixed(2)); // Debt Service Coverage Ratio
      
      let bizScore = 100;
      if (profitMargin < 10) bizScore -= 30;
      else if (profitMargin < 20) bizScore -= 15;

      if (ds_ratio < 1.25) bizScore -= 35;
      else if (ds_ratio < 2.0) bizScore -= 15;

      if (bizScore < 30) bizScore = 30;

      const results = {
        score: bizScore,
        profitMargin,
        dscr: ds_ratio,
        netProfit,
        status: bizScore >= 80 ? "ممتازة جداً" : bizScore >= 60 ? "مستقرة ومقبولة" : "حرجة وتحتاج تصويب",
        statusColor: bizScore >= 80 ? "text-emerald-500" : bizScore >= 60 ? "text-amber-500" : "text-red-500",
        advice: bizScore >= 80
          ? [
              "ملاءتك الائتمانية والمالية قوية جداً ونسبة تغطية خدمة الدين (DSCR) تزيد عن الحد الآمن لساما (1.25).",
              "لديك فائض نقدي ممتاز يتيح لك التوسع الرأسمالي أو طلب تمويل تسهيلات تجارية بأفضل نسب مرابحة منافسة.",
              "ننصحك بتحويل جزء من الأرباح المبقاة لصندوق احتياطي نظامي وتوزيع أرباح مرحلية للشركاء لرفع القيمة السوقية للمنشأة."
            ]
          : bizScore >= 60
          ? [
              "المنشأة تحقق أرباحاً ولكن نسبة الهامش الربحي ضيقة، مما يعرض المنشأة لمخاطر في حال تذبذب التدفقات النقدية السنوية.",
              "ننصح بمراجعة العقود مع الموردين وتحسين إدارة رأس المال العامل لتقليل النفقات التشغيلية بنسبة 10%.",
              "تغطية خدمة الدين ضمن النطاق المقبول حالياً ولكن يفضل عدم الدخول في قروض إضافية قصيرة الأجل."
            ]
          : [
              "تنبيه عالي الخطورة: نسبة تغطية خدمة الدين (DSCR) حرجة جداً وأقل من المعيار الاحترازي (1.25).",
              "يجب هيكلة الديون الحالية فوراً والاتصال بالمؤسسات التمويلية لطلب تمديد فترة السداد أو خفض نسبة الفائدة.",
              "نوصي بوضع خطة لترشيد المصاريف التشغيلية بنسبة 25% والتوقف فوراً عن الشراء الآجل والعمل على تسريع وتيرة تحصيل الذمم المدينة."
            ]
      };
      setAnalysisResultBiz(results);
      setIsAnalyzingBiz(false);
    }, 3000);
  };

  // Corporate tasks checklist state
  const [tasks, setTasks] = useState([
    { id: 1, title: "رفع التقرير الإشرافي ربع السنوي لساما", completed: false, due: "خلال 8 أيام" },
    { id: 2, title: "تعديل بنود سياسة المستفيد الحقيقي لـ KYC", completed: true, due: "مكتمل" },
    { id: 3, title: "تحديث شهادة ترخيص الأمن السيبراني (NCA)", completed: false, due: "خلال 14 يوم" },
    { id: 4, title: "تسجيل مسؤول الالتزام الجديد للامتثال المالي", completed: false, due: "عاجل" }
  ]);

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveTab("assistant");
    onSendMessage(searchQuery, "all");
    setSearchQuery("");
  };

  const triggerQuickService = (text: string, category: string) => {
    setActiveTab("assistant");
    setSelectedCategory(category);
    onSendMessage(text, category);
  };

  const isLight = theme === "light";

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${
      isLight ? "bg-slate-50 text-slate-800" : "bg-[#020907] text-slate-100"
    }`} dir="rtl">
      
      {/* Mobile sidebar overlay backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* 1. Right Sidebar */}
      <aside className={`transition-all duration-300 ease-in-out flex flex-col fixed lg:sticky top-0 right-0 h-screen justify-between p-6 z-50 lg:z-40 shadow-xl border-l lg:translate-x-0 lg:w-72 lg:opacity-100 ${
        isSidebarOpen 
          ? "w-72 opacity-100 translate-x-0" 
          : "w-72 opacity-0 translate-x-full"
      } ${
        isLight ? "bg-white border-slate-200" : "bg-[#062D24] border-l border-[#103B30]/40"
      }`}>
        
        <div className="space-y-8">
          
          {/* Brand Logo with Hide Sidebar trigger */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <WajihLogo showText={false} size={42} theme={isLight ? "light" : "dark"} />
              <div className="text-right">
                <h1 className={`text-xs font-black ${isLight ? "text-slate-900" : "text-white"}`}>وجيه AI للأعمال</h1>
              </div>
            </div>

            {/* Collapse button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className={`lg:hidden p-1 rounded-md border transition cursor-pointer ${
                isLight 
                  ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800" 
                  : "bg-[#041C16] hover:bg-[#103B30] border-[#103B30]/40 text-emerald-400"
              }`}
              title="إخفاء القائمة الجانبية"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav id="sidebar-navigation" className="space-y-1.5">
            {([
              { id: "overview", label: "الرئيسية", icon: Home },
              { id: "analytics", label: "تحليل مالي", icon: TrendingUp },
              { id: "alerts", label: "تنبيهات ذكية", icon: Bell, count: alerts.length },
              { id: "cases", label: "شكاوى والتزامات", icon: FileText, count: cases.filter(c => c.pathType === "business").length }
            ] as { id: string; label: string; icon: any; count?: number; badge?: string }[]).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive 
                      ? "bg-emerald-600 text-white shadow-md" 
                      : isLight
                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      : "text-slate-300 hover:bg-[#041C16] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-emerald-555"}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && item.count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] ${isActive ? "bg-emerald-700 text-white" : isLight ? "bg-slate-100 text-slate-700 border border-slate-200" : "bg-[#041C16] text-emerald-300 border border-[#103B30]/30"}`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom widgets and exit */}
        <div className="space-y-4">

          <div className={`border-t pt-4 flex items-center justify-between gap-3 ${isLight ? "border-slate-100" : "border-[#103B30]/30"}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 border rounded-full flex items-center justify-center font-bold text-sm ${isLight ? "bg-slate-100 text-emerald-700 border-slate-200" : "bg-[#041C16] border border-[#103B30]/35 text-emerald-450"}`}>
                ش
              </div>
              <div className="text-right">
                <h6 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>شركة التقنيات المالية</h6>
                <span className={`text-[9px] block font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>مالك السجل</span>
              </div>
            </div>

            {/* Sidebar Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition border flex items-center justify-center cursor-pointer ${
                isLight 
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200" 
                  : "bg-[#041C16] hover:bg-[#103B30] text-emerald-400 border-[#103B30]/50"
              }`}
              title={isLight ? "التحويل للوضع الداكن" : "التحويل للوضع المضيء"}
            >
              {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button 
              onClick={onExit}
              className={`p-2 rounded-lg transition cursor-pointer ${isLight ? "text-slate-400 hover:text-red-500 hover:bg-slate-100" : "text-slate-400 hover:text-red-400 hover:bg-[#041C16]"}`}
              title="خروج للبوابة"
            >
              <LogOut className="w-4 h-4 transform rotate-180" />
            </button>
          </div>

        </div>

      </aside>

      {/* 2. Main Dashboard Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 h-screen ${activeTab === 'assistant' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        
        {/* Dashboard Top Header */}
        <header className={`border-b py-4 px-6 md:px-8 relative z-30 flex items-center justify-between transition-colors duration-300 ${
          isLight ? "bg-white border-slate-150" : "bg-[#041611]/90 border-[#103B30]/30"
        }`}>
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl transition border flex items-center justify-center cursor-pointer shadow-sm ${
                isSidebarOpen ? "hidden" : "flex"
              } ${
                isLight 
                  ? "bg-white hover:bg-slate-100 text-slate-800 border-slate-200" 
                  : "bg-[#062D24] hover:bg-[#103B30] text-emerald-400 border-[#103B30]/50"
              }`}
              title="عرض القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
          </div>
        </header>

        {/* Dashboard Body container */}
        <div className={activeTab === "assistant" ? "p-4 sm:p-6 lg:p-6 flex-1 flex flex-col min-h-0 overflow-hidden" : "p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full"}>
          
          {activeTab === "overview" && (
            /* BUSINESS MAIN DASHBOARD OVERVIEW (Mockup 1) */
            <div className="space-y-8 animate-fade-in text-right">
              <OnboardingSpotlight 
                targetSelector="#wajih-welcome-banner"
                onboardingKey="wajih-business-onboarding-banner"
                title="مستشارك المالي والتنظيمي: وجيه AI"
                description="مرحباً بك في منصتك المالية والامتثالية الموحدة! هذا هو الجزء المخصص لـ (وجيه AI)، مستشارك الذكي المعتمد والمرتبط بأنظمة البنك المركزي (ساما). يمكنك الضغط هنا لبدء استشارة فورية مع وجيه AI، أو فهم الضوابط والقوانين وصياغة خطط غسيل الأموال وطلبات التراخيص والامتثال التنظيمي للشركات بسهولة ودون تعقيد."
                buttonText="حسنًا، فهمت"
                padding={4}
                borderRadius={24}
              />

              <SidebarOnboarding
                onboardingKey="wajih-business-sidebar-onboarding"
                triggerKey="wajih-business-onboarding-banner"
                title="قائمة الخيارات والتنقل الذكي للمنشآت"
                description="تتيح لك القائمة الجانبية التنقل المباشر والسهل بين لوحة التحكم، التحليل المالي والامتثال، مراجعة التنبيهات الذكية، ومتابعة القضايا والشكاوى القانونية لـ وجيه AI."
                buttonText="فهمت"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
              
              {/* Wajih AI & Quick Actions Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Large Wajih AI Welcome Banner (12 cols) */}
                <div id="wajih-welcome-banner" className={`lg:col-span-12 rounded-3xl p-6 md:p-8 border flex flex-col justify-between space-y-6 transition-all duration-300 shadow-md relative overflow-hidden ${
                  isLight 
                    ? "bg-gradient-to-br from-emerald-50 to-white border-emerald-100" 
                    : "bg-gradient-to-br from-[#041C16] to-[#062D24] border-[#103B30]/50"
                }`}>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <WajihLogo showText={false} size={48} theme={isLight ? "light" : "dark"} />
                      <div>
                        <h4 className={`text-lg font-black ${isLight ? "text-slate-900" : "text-white"}`}>مستشارك الذكي: وجيه AI</h4>
                        <span className={`text-xs font-bold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>بإشراف البنك المركزي السعودي (ساما)</span>
                      </div>
                    </div>
                    <p className={`text-xs md:text-sm leading-relaxed font-bold ${isLight ? "text-slate-600" : "text-slate-350"}`}>
                      مرحباً بك! وجيه هو مساعدك الذكي المتكامل للرد على استفسارات الأنظمة واللوائح، مراجعة سياسات غسيل الأموال، صياغة لوائح الشكاوى والمظالم للبنوك والمؤسسات المالية، وتسهيل إجراءات تراخيص التقنية المالية.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                      onClick={() => setActiveTab("assistant")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>استشارة وجيه AI</span>
                    </button>
                  </div>
                </div>
              </div>


              {/* Two Column Layout: Charts (Mockup 1) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. Revenue distribution (Pie chart model 12 cols) */}
                <div className={`lg:col-span-12 border rounded-3xl p-6 flex flex-col justify-between shadow-xs transition-colors duration-300 ${
                  isLight ? "bg-white border-slate-200 text-slate-800" : "bg-[#062D24] border border-[#103B30]/50"
                }`}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`font-extrabold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>توزيع الإيرادات والأنشطة</h4>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                        ( البيانات لشركة التقنيات المالية المبتكرة )
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>حسب تصنيف نشاط التقنيات في السجل التجاري.</p>
                  </div>

                  {/* Simulated Pie chart - Custom styled CSS rings */}
                  <div className="relative flex justify-center py-6">
                    <div className={`w-32 h-32 rounded-full border-12 flex items-center justify-center relative ${
                      isLight ? "border-emerald-600/80" : "border-emerald-600"
                    }`}>
                      {/* Inner overlay circle and texts */}
                      <div className="text-center">
                        <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-455"}`}>إجمالي الإيرادات</span>
                        <span className={`text-xs font-black ${isLight ? "text-slate-900" : "text-white"}`}>12.8M ر.س</span>
                      </div>
                    </div>
                  </div>

                  {/* Indicators */}
                  <div className="space-y-2 text-xs font-bold">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
                        <span className={isLight ? "text-slate-700" : "text-slate-300"}>خدمات مالية مرخصة (40%)</span>
                      </div>
                      <span className={`font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>5.1M ر.س</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                        <span className={isLight ? "text-slate-700" : "text-slate-300"}>مدفوعات رقمية (25%)</span>
                      </div>
                      <span className={`font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>3.2M ر.س</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                        <span className={isLight ? "text-slate-700" : "text-slate-300"}>إقراض وتمويل (20%)</span>
                      </div>
                      <span className={`font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>2.5M ر.س</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Row: Active Cases and Alerts for Business */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                
                {/* Active Case Summary Card */}
                <div className={`border rounded-3xl p-6 text-right space-y-4 flex flex-col justify-between shadow-xs transition-colors duration-300 ${
                  isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? "border-slate-100" : "border-[#103B30]/30"}`}>
                    <h4 className={`font-extrabold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>أحدث الشكاوى النشطة</h4>
                    <button 
                      onClick={() => setActiveTab("cases")} 
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>عرض الكل</span>
                      <ArrowRight className="w-3.5 h-3.5 transform rotate-180" />
                    </button>
                  </div>

                  {cases.filter(c => c.pathType === "business").length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 font-bold">
                      لا توجد شكاوى نشطة للمنشأة حالياً.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cases.filter(c => c.pathType === "business").slice(0, 2).map((c) => (
                        <div 
                          key={c.id} 
                          onClick={() => setActiveTab("cases")}
                          className={`p-3 border rounded-xl cursor-pointer transition text-right space-y-2 ${
                            isLight 
                              ? "bg-slate-50 border-slate-150 hover:border-emerald-500 hover:bg-slate-100/50" 
                              : "bg-[#041C16] border border-[#103B30]/55 hover:border-emerald-500/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-xs ${isLight ? "text-slate-900" : "text-white"}`}>{c.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isLight ? "bg-blue-50 border-blue-200 text-blue-800" : "bg-blue-950/40 text-blue-300 border-blue-900/30"
                            }`}>
                              {c.status === "under_review" ? "قيد المراجعة" : c.status === "pending_docs" ? "بانتظار مستندات" : c.status}
                            </span>
                          </div>
                          <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-[#020907]"}`}>
                            <div className="bg-emerald-600 h-1" style={{ width: `${c.progress}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Smart Alerts & Actions list */}
                <div className={`border rounded-3xl p-6 text-right space-y-4 shadow-xs transition-colors duration-300 ${
                  isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                }`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${isLight ? "border-slate-100" : "border-[#103B30]/30"}`}>
                    <h4 className={`font-extrabold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>التنبيهات الذكية والإجراءات</h4>
                    <button 
                      onClick={() => setActiveTab("alerts")} 
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>عرض الكل</span>
                      <ArrowRight className="w-3.5 h-3.5 transform rotate-180" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {alerts.slice(0, 2).map((alert) => (
                      <div 
                        key={alert.id}
                        className={`p-3 border rounded-xl flex items-start gap-3 transition-colors duration-300 ${
                          alert.type === "danger" 
                            ? "bg-red-50 border-red-200 text-red-800" 
                            : alert.type === "warning" 
                            ? "bg-amber-50 border-amber-200 text-amber-800" 
                            : isLight
                            ? "bg-emerald-50 border-emerald-150 text-emerald-900"
                            : "bg-[#041C16] border-[#103B30]/50 text-emerald-200"
                        }`}
                      >
                        <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          alert.type === "danger" ? "text-red-700" : alert.type === "warning" ? "text-amber-700" : "text-emerald-700"
                        }`} />
                        <div className="space-y-1">
                          <div className={`font-bold text-xs ${isLight ? "text-slate-900" : "text-slate-100"}`}>{alert.title}</div>
                          <p className={`text-[10px] leading-relaxed line-clamp-1 opacity-90 font-semibold ${isLight ? "text-slate-600" : "text-slate-300"}`}>{alert.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === "assistant" && (
            /* CHAT ASSISTANT TAB */
            <div className="animate-fade-in flex-1 flex flex-col h-full text-right">
              <SmartAssistant 
                pathType="business"
                chatHistory={chatHistory}
                onSendMessage={onSendMessage}
                onClearChat={onClearChat}
                isSending={isSendingChat}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                uploadedFiles={files.map(f => ({ id: f.id, name: f.name }))}
                theme={theme}
                isFullScreen={true}
              />
            </div>
          )}

          {activeTab === "cases" && (
            /* CASES TAB */
            <div className="animate-fade-in">
              <CaseManagement 
                pathType="business"
                cases={cases}
                onToggleDoc={onToggleDoc}
                onAddCase={onAddCase}
                onDeleteCase={onDeleteCase}
                theme={theme}
              />
            </div>
          )}

          {activeTab === "files" && (
            /* FILES TAB */
            <div className="animate-fade-in">
              <FilesManager 
                files={files}
                onUploadFile={onUploadFile}
                onDeleteFile={onDeleteFile}
                theme={theme}
              />
            </div>
          )}

          {activeTab === "alerts" && (
            /* ALERTS TAB */
            <div className="space-y-6 animate-fade-in text-right">
              <div>
                <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>صندوق تنبيهات الالتزام والأنظمة</h3>
                <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-350"}`}>إشعارات تنظيمية من البنك المركزي وهيئة السوق المالية.</p>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-300 ${
                      alert.type === "danger" 
                        ? (isLight ? "bg-red-50/80 border-red-200/60 text-red-900" : "bg-red-950/20 border-red-900/30 text-red-200") 
                        : alert.type === "warning" 
                        ? (isLight ? "bg-amber-50/80 border-amber-200/60 text-amber-900" : "bg-amber-950/20 border-amber-900/35 text-amber-200") 
                        : (isLight ? "bg-emerald-50/80 border-emerald-150 text-emerald-900" : "bg-[#041C16] border-[#103B30]/50 text-emerald-200")
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl ${
                        alert.type === "danger" 
                          ? (isLight ? "bg-red-100 text-red-700" : "bg-red-950/60 text-red-400") 
                          : alert.type === "warning" 
                          ? (isLight ? "bg-amber-100 text-amber-700" : "bg-amber-950/60 text-amber-400") 
                          : (isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-950/60 text-emerald-400")
                      }`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-extrabold text-sm ${
                            isLight ? "text-slate-900" : "text-white"
                          }`}>{alert.title}</h4>
                          <span className={`text-[10px] border px-2 py-0.5 rounded-md font-bold ${
                            completedTasks.includes(alert.id) || paidAlerts.includes(alert.id)
                              ? "bg-emerald-600 border-emerald-500 text-white"
                              : alert.type === "danger"
                              ? (isLight ? "bg-red-100 text-red-800 border-red-200" : "bg-red-950/40 text-red-400 border-red-900/40")
                              : alert.type === "warning"
                              ? (isLight ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-amber-950/40 text-amber-400 border-amber-900/40")
                              : (isLight ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-[#020907] border border-[#103B30]/30 text-emerald-400")
                          }`}>{completedTasks.includes(alert.id) ? (alert.badge === "تحديث الترخيص" ? "تم الإطلاع" : "تم إكمال المهمة") : paidAlerts.includes(alert.id) ? "تم السداد بنجاح" : alert.badge}</span>

                          {(alert.badge === "تذكير بالسداد" || alert.badge === "مستحق السداد") && !paidAlerts.includes(alert.id) && (
                            <button
                              onClick={() => setPaidAlerts([...paidAlerts, alert.id])}
                              className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-black px-2.5 py-0.5 rounded-md transition duration-150 cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                            >
                              انقر للدفع
                            </button>
                          )}

                          {(alert.badge === "إجراء مطلوب فوراً" || alert.badge === "تاريخ استحقاق هام" || alert.badge === "تحديث الترخيص") && !completedTasks.includes(alert.id) && (
                            <button
                              onClick={() => setCompletedTasks([...completedTasks, alert.id])}
                              className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-black px-2.5 py-0.5 rounded-md transition duration-150 cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                            >
                              {alert.badge === "تحديث الترخيص" ? "انقر للإطلاع" : "انقر لإكمال المهمة"}
                            </button>
                          )}
                        </div>
                        <p className={`text-xs leading-relaxed opacity-90 font-medium ${
                          isLight ? "text-slate-600" : "text-slate-300"
                        }`}>{alert.desc}</p>
                      </div>
                    </div>

                    <div className={`text-xs font-semibold flex-shrink-0 self-end sm:self-center ${isLight ? "text-slate-400" : "text-slate-500"}`}>
                      {alert.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            /* CORPORATE DETAILED FINANCIAL ANALYTICS */
            <div className="space-y-5 animate-fade-in text-right">
              <div>
                <h3 className={`text-base font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>التحليل المالي والالتزام للمنشآت</h3>
                <p className={`text-[11px] mt-0.5 font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  مؤشرات الملاءة المالية، الموازنات التشغيلية، ومطابقتها للمعايير والأنظمة الإشرافية والاحترازية لـ SAMA.
                </p>
              </div>

              {/* Entity Selection cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. Left selection area */}
                <div className={`lg:col-span-4 border rounded-3xl p-5 space-y-5 transition-colors duration-300 ${
                  isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-dashed border-slate-200/50">
                      <Building2 className="w-4 h-4 text-emerald-555" />
                      <h4 className={`text-xs font-black ${isLight ? "text-slate-900" : "text-white"}`}>اختيار المنشأة النشطة</h4>
                    </div>

                    <div className="space-y-2.5">
                      {Object.entries(BUSINESS_ENTITIES_DATA).map(([key, entity]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedEntity(key)}
                          className={`w-full p-3.5 rounded-2xl border text-right transition flex flex-col gap-1 cursor-pointer ${
                            selectedEntity === key
                              ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                              : isLight
                              ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                              : "bg-[#041C16] border-[#103B30]/40 text-slate-300 hover:bg-[#103B30]/60"
                          }`}
                        >
                          <span className="text-[11px] font-black">{entity.name}</span>
                          <span className={`text-[9px] font-mono font-bold ${selectedEntity === key ? "text-emerald-100" : "text-slate-400"}`}>
                            سجل تجاري: {entity.crNumber}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Reg note */}
                    <div className={`p-3.5 rounded-xl border flex items-start gap-2 transition-colors ${
                      isLight ? "bg-emerald-50/50 border-emerald-150 text-emerald-950" : "bg-[#041C16]/60 border border-[#103B30]/30 text-emerald-400"
                    }`}>
                      <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-[10px] leading-relaxed font-bold">
                        ملاحظة إشرافية: يتم فحص السيولة والامتثال فورياً وفق لائحة التحوط والملاءة للشركات المالية المرخصة تحت رقابة البنك المركزي السعودي.
                      </p>
                    </div>

                  </div>
                </div>

                {/* 2. Right Stats area */}
                <div className="lg:col-span-8 space-y-5">
                  
                  {/* Entity Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Income */}
                    <div className={`border p-3.5 rounded-2xl space-y-1 text-right shadow-xs transition-colors duration-300 ${
                      isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                    }`}>
                      <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-400"}`}>إجمالي الإيرادات شهرياً</span>
                      <div className="text-lg font-black text-emerald-600">
                        {BUSINESS_ENTITIES_DATA[selectedEntity].monthlyIncome.toLocaleString()} ر.س
                      </div>
                      <span className="text-[8px] text-emerald-800 font-bold bg-emerald-50 px-1 py-0.5 rounded-md inline-block">نشط ومتحقق</span>
                    </div>

                    {/* Spending */}
                    <div className={`border p-3.5 rounded-2xl space-y-1 text-right shadow-xs transition-colors duration-300 ${
                      isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                    }`}>
                      <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-400"}`}>إجمالي المصروفات شهرياً</span>
                      <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                        <span dir="ltr">-{BUSINESS_ENTITIES_DATA[selectedEntity].monthlySpending.toLocaleString()}</span> ر.س
                      </div>
                      <span className="text-[8px] text-blue-800 font-bold bg-blue-50 border border-blue-100 px-1 py-0.5 rounded-md inline-block">تشغيل ومصروفات</span>
                    </div>

                    {/* Active Loans */}
                    <div className={`border p-3.5 rounded-2xl space-y-1 text-right shadow-xs transition-colors duration-300 ${
                      isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                    }`}>
                      <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-400"}`}>التمويلات النشطة القائمة</span>
                      <div className="text-lg font-black text-blue-600">
                        {BUSINESS_ENTITIES_DATA[selectedEntity].activeLoans.toLocaleString()} ر.س
                      </div>
                      <span className="text-[8px] text-blue-800 font-bold bg-blue-50 px-1 py-0.5 rounded-md inline-block">تسهيلات قائمة</span>
                    </div>
                  </div>

                  {/* Visual gauge and Advisory board */}
                  <div className={`border rounded-3xl p-5 space-y-5 transition-colors duration-300 ${
                    isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                  }`}>
                    
                    {/* Header score */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3.5 border-b border-dashed border-slate-200/50">
                      <div>
                        <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-455"}`}>مؤشر الملاءة المالية والتوافق</span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-2xl font-black text-emerald-555">{BUSINESS_ENTITIES_DATA[selectedEntity].score}</span>
                          <span className="text-[10px] text-slate-400">/ 100</span>
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full mr-2 ${BUSINESS_ENTITIES_DATA[selectedEntity].statusColor} bg-emerald-500/10`}>
                            {BUSINESS_ENTITIES_DATA[selectedEntity].status}
                          </span>
                        </div>
                      </div>

                      <div className="w-full sm:w-40 space-y-1">
                        <div className="flex justify-between text-[8px] font-bold text-slate-400">
                          <span>حرج</span>
                          <span>متوسط</span>
                          <span>ممتاز</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-150 dark:bg-[#020907] rounded-full overflow-hidden flex">
                          <div className="h-full bg-red-500" style={{ width: "33%" }}></div>
                          <div className="h-full bg-amber-500" style={{ width: "37%" }}></div>
                          <div className="h-full bg-emerald-500" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Metrics info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className={`p-3.5 rounded-xl border text-right ${isLight ? "bg-slate-50 border-slate-150" : "bg-[#041C16] border-[#103B30]/40"}`}>
                        <span className="text-[9px] font-bold text-slate-400 block">هامش الأرباح التشغيلية</span>
                        <div className={`text-sm font-black mt-0.5 ${isLight ? "text-slate-800" : "text-white"}`}>{BUSINESS_ENTITIES_DATA[selectedEntity].profitMargin}%</div>
                      </div>
                      <div className={`p-3.5 rounded-xl border text-right ${isLight ? "bg-slate-50 border-slate-150" : "bg-[#041C16] border-[#103B30]/40"}`}>
                        <span className="text-[9px] font-bold text-slate-400 block">تغطية خدمة الدين (DSCR)</span>
                        <div className={`text-sm font-black mt-0.5 ${BUSINESS_ENTITIES_DATA[selectedEntity].dscr >= 1.20 ? "text-emerald-555" : "text-red-500"}`}>
                          {BUSINESS_ENTITIES_DATA[selectedEntity].dscr}
                        </div>
                      </div>
                    </div>

                    {/* Advisory recommendations list */}
                    <div className="space-y-2.5">
                      <h5 className={`text-[11px] font-black flex items-center gap-1.5 ${isLight ? "text-slate-800" : "text-white"}`}>
                        <Sparkles className="w-4 h-4 text-emerald-555" />
                        <span>تحليل التوصيات الاستباقية لـ وجيه AI:</span>
                      </h5>
                      <div className="space-y-1.5">
                        {BUSINESS_ENTITIES_DATA[selectedEntity].advice.map((item, idx) => (
                          <div key={idx} className={`p-2.5 rounded-xl border text-[10px] leading-relaxed font-bold transition-all ${
                            idx === 0
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : isLight
                              ? "bg-slate-50 border-slate-150 text-slate-700"
                              : "bg-[#041C16] border-[#103B30]/30 text-slate-300"
                          }`}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>


            </div>
          )}

          {activeTab === "users" && (
            /* USER MANAGEMENT SIMULATION */
            <div className="space-y-6 animate-fade-in text-right">
              <div>
                <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>إدارة صلاحيات المستخدمين والمسؤولين</h3>
                <p className={`text-xs mt-1 ${isLight ? "text-slate-550" : "text-slate-350"}`}>تحديد الموظفين المسموح لهم برفع التقارير الإشرافية والاطلاع على الملفات القانونية.</p>
              </div>

              <div className={`border rounded-3xl overflow-hidden shadow-xs transition-colors duration-300 ${
                isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
              }`}>
                <div className={`px-6 py-4 border-b ${isLight ? "bg-slate-50/55 border-slate-150" : "bg-[#041C16] border-b border-[#103B30]/40"}`}>
                  <h4 className={`font-extrabold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>المستخدمين المسجلين</h4>
                </div>
                <div className={`divide-y ${isLight ? "divide-slate-100" : "divide-[#103B30]/25"}`}>
                  {[
                    { name: "عبدالرحمن الشمري", role: "مالك المنشأة", email: "a.shammari@fintech.sa", status: "نشط" },
                    { name: "سارة العتيبي", role: "مسؤول الالتزام (قيد التعيين المعتمد)", email: "s.otaibi@fintech.sa", status: "بانتظار موافقة ساما" },
                    { name: "خالد الحربي", role: "مدير فني (صلاحية محدودة)", email: "k.harbi@fintech.sa", status: "نشط" }
                  ].map((usr, uIdx) => (
                    <div key={uIdx} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <h5 className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>{usr.name}</h5>
                        <p className={`text-xs font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>{usr.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-bold border px-2.5 py-1 rounded-lg ${
                          isLight ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-[#041C16] border border-[#103B30]/40 text-slate-200"
                        }`}>{usr.role}</span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          usr.status === "نشط" ? "bg-emerald-550/15 text-emerald-600" : "bg-amber-100 text-amber-800"
                        }`}>{usr.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            /* CONFIGURATION SETTINGS */
            <div className="space-y-6 animate-fade-in text-right">
              <div>
                <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>إعدادات المنصة والامتثال</h3>
                <p className={`text-xs mt-1 ${isLight ? "text-slate-550" : "text-slate-350"}`}>تعديل معلومات السجل التجاري والربط الآلي للمراسلات السيادية.</p>
              </div>

              <div className={`border rounded-3xl p-6 space-y-4 max-w-xl shadow-xs transition-colors duration-300 ${
                isLight ? "bg-white border-slate-200 text-slate-800" : "bg-[#062D24] border border-[#103B30]/50"
              }`}>
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>الاسم التجاري للمنشأة:</label>
                  <input type="text" value="شركة الحلول الرقمية للتقنية المالية" className={`w-full border rounded-xl px-4 py-2 text-xs font-bold ${
                    isLight ? "bg-slate-50 border-slate-200 text-slate-800" : "bg-[#020907] border border-[#103B30]/40 text-white"
                  }`} disabled />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>رقم السجل التجاري الموحد:</label>
                  <input type="text" value="10107294819" className={`w-full border rounded-xl px-4 py-2 text-xs font-bold ${
                    isLight ? "bg-slate-50 border-slate-200 text-slate-800" : "bg-[#020907] border border-[#103B30]/40 text-white"
                  }`} disabled />
                </div>
                <div className={`text-xs font-semibold leading-relaxed ${isLight ? "text-slate-550" : "text-slate-400"}`}>
                  يتم مزامنة هذه البيانات تلقائياً مع السجل الوطني الموحد وتعديلها عبر وزارة التجارة فقط.
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Floating Wajih Assistant button when not in Assistant view */}
      {activeTab !== "assistant" && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setActiveTab("assistant")}
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-3.5 rounded-full shadow-2xl border border-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            id="floating-wajih-trigger-biz"
            title="اسأل وجيه AI"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>اسأل وجيه AI</span>
          </button>
        </div>
      )}

    </div>
  );
}

import React, { useState } from "react";
import { 
  Sparkles, ShieldCheck, HelpCircle, Bell, ArrowRight, LogOut, 
  User, PiggyBank, CreditCard, ShieldAlert, FileText, Compass, 
  Activity, Settings, PieChart, TrendingUp, AlertTriangle, CheckCircle,
  Sun, Moon, Menu, X, ChevronLeft, ChevronRight, Calculator, Eye, EyeOff, LayoutGrid, Home
} from "lucide-react";
import { ChatMessage, WajihCase, UploadedFile, AlertItem } from "../types";
import SmartAssistant from "./SmartAssistant";
import CaseManagement from "./CaseManagement";
import FilesManager from "./FilesManager";
import SamaHeader from "./SamaHeader";
import WajihLogo from "./WajihLogo";
import OnboardingSpotlight from "./OnboardingSpotlight";
import SidebarOnboarding from "./SidebarOnboarding";

export const BANKS_DATA: Record<string, {
  name: string;
  accounts: Record<string, {
    name: string;
    lastDigits: string;
    iban: string;
    balance: number;
    income: number;
    spending: number;
    spendingCategories: { label: string; amount: number; percent: number; color: string }[];
  }>;
}> = {
  rajhi: {
    name: "مصرف الراجحي",
    accounts: {
      checking: {
        name: "حساب جاري (الرواتب)",
        lastDigits: "4820",
        iban: "SA8080000000123456784820",
        balance: 24500,
        income: 18000,
        spending: 12850,
        spendingCategories: [
          { label: "السكن والإيجار", amount: 4500, percent: 35, color: "bg-emerald-600" },
          { label: "أقساط القروض والديون", amount: 3800, percent: 29, color: "bg-amber-600" },
          { label: "المطاعم والكماليات", amount: 2500, percent: 20, color: "bg-blue-600" },
          { label: "فواتير وخدمات عامة", amount: 1200, percent: 9, color: "bg-red-600" },
          { label: "مدخرات شخصية طارئة", amount: 850, percent: 7, color: "bg-teal-600" }
        ]
      },
      savings: {
        name: "حساب ادخار المستقبل",
        lastDigits: "9103",
        iban: "SA8080000000123456789103",
        balance: 62000,
        income: 3000,
        spending: 500,
        spendingCategories: [
          { label: "استثمارات متنوعة", amount: 400, percent: 80, color: "bg-emerald-600" },
          { label: "خدمات بنكية ورسوم", amount: 100, percent: 20, color: "bg-blue-600" }
        ]
      }
    }
  },
  ahli: {
    name: "البنك الأهلي السعودي",
    accounts: {
      checking: {
        name: "حساب المشتريات والبطاقة",
        lastDigits: "1102",
        iban: "SA3030000000987654321102",
        balance: 8400,
        income: 5000,
        spending: 4200,
        spendingCategories: [
          { label: "تسوق إلكتروني", amount: 2200, percent: 52, color: "bg-indigo-600" },
          { label: "سوبرماركت ومقاضي", amount: 1500, percent: 36, color: "bg-emerald-600" },
          { label: "ترفيه وألعاب", amount: 500, percent: 12, color: "bg-pink-600" }
        ]
      },
      investment: {
        name: "الحساب الاستثماري والمحفظة",
        lastDigits: "7744",
        iban: "SA3030000000987654327744",
        balance: 150000,
        income: 12000,
        spending: 1000,
        spendingCategories: [
          { label: "رسوم تداول واكتتابات", amount: 1000, percent: 100, color: "bg-violet-600" }
        ]
      }
    }
  },
  inma: {
    name: "مصرف الإنماء",
    accounts: {
      checking: {
        name: "حساب جاري فرعي",
        lastDigits: "5511",
        iban: "SA5050000000445566775511",
        balance: 14200,
        income: 15000,
        spending: 11500,
        spendingCategories: [
          { label: "فواتير وإيجار سكني", amount: 5000, percent: 43, color: "bg-amber-600" },
          { label: "مصاريف سيارة وصيانة", amount: 3500, percent: 30, color: "bg-blue-600" },
          { label: "أغذية وتموين أسري", amount: 3000, percent: 27, color: "bg-emerald-600" }
        ]
      }
    }
  }
};

interface IndividualDashboardProps {
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

export default function IndividualDashboard({
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
}: IndividualDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [paidAlerts, setPaidAlerts] = useState<string[]>([]);
  const [simahViewed, setSimahViewed] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);
  const [selectedBank, setSelectedBank] = useState<string>("rajhi");
  const [selectedAccount, setSelectedAccount] = useState<string>("checking");

  // Financial Analysis inputs
  const [indIncome, setIndIncome] = useState<number>(18000);
  const [indSpending, setIndSpending] = useState<number>(12850);
  const [indLoans, setIndLoans] = useState<number>(5200);
  const [indSavingsGoal, setIndSavingsGoal] = useState<number>(3000);
  const [isAnalyzingInd, setIsAnalyzingInd] = useState<boolean>(false);
  const [analysisStepInd, setAnalysisStepInd] = useState<number>(0);
  const [analysisResultInd, setAnalysisResultInd] = useState<any>(null);

  const handleAnalyzeInd = () => {
    setIsAnalyzingInd(true);
    setAnalysisStepInd(1);
    setAnalysisResultInd(null);
    
    setTimeout(() => {
      setAnalysisStepInd(2);
    }, 1000);

    setTimeout(() => {
      setAnalysisStepInd(3);
    }, 2000);

    setTimeout(() => {
      const totalObligations = indSpending + indLoans;
      const surplus = indIncome - totalObligations;
      const debtRatio = parseFloat(((indLoans / indIncome) * 100).toFixed(1));
      const savingsRatio = parseFloat(((surplus > 0 ? (surplus / indIncome) * 100 : 0)).toFixed(1));
      
      let score = 100;
      // Deduct score based on metrics
      if (debtRatio > 45) score -= 30;
      else if (debtRatio > 33) score -= 15;
      else if (debtRatio > 15) score -= 5;

      if (surplus < 0) score -= 40;
      else if (surplus < 1500) score -= 15;

      if (savingsRatio < 5) score -= 15;
      else if (savingsRatio < 15) score -= 5;

      if (score < 30) score = 30; // Min score

      const results = {
        score,
        debtRatio,
        savingsRatio,
        surplus,
        status: score >= 85 ? "ممتاز" : score >= 70 ? "جيد جداً" : score >= 50 ? "مقبول" : "خطر مالي",
        statusColor: score >= 85 ? "text-emerald-500" : score >= 70 ? "text-blue-500" : score >= 50 ? "text-amber-500" : "text-red-500",
        advice: score >= 85 
          ? [
              "وضعك المالي مستقر وقوي جداً. ننصحك بالبدء في استثمار الفائض في قنوات استثمارية منخفضة المخاطر والمطابقة لأحكام الشريعة الإسلامية.",
              "نسبة التزامات الديون لديك ممتازة ومطابقة تماماً لتعليمات البنك المركزي السعودي (SAMA) التي تضع السقوف الاحترازية للتمويل الاستهلاكي.",
              "يمكنك البدء بجدولة استقطاع شهري آلي لحساب ادخاري إضافي لتدعيم أهدافك المالية البعيدة."
            ]
          : score >= 70
          ? [
              "لديك وعي واستقرار مالي جيد، ولكن هناك فرصة واضحة لتقنين وترشيد الإنفاق الاستهلاكي اليومي لزيادة الفائض الشهري.",
              "ننصح بمراجعة الاشتراكات الدورية والنفقات الترفيهية لرفع نسبة الادخار المحققة شهرياً.",
              "استهدف بناء صندوق طوارئ نقدي سائل يغطي مصاريفك الأساسية لمدة 3 إلى 6 أشهر كدرع واقٍ."
            ]
          : [
              "تنبيه: التزامات الديون والقروض تستهلك أكثر من 33% من دخلك وهو مؤشر خطر مالي يحتاج لتدخل فوري.",
              "نوصيك بالتقدم لطلب دمج المديونيات أو طلب إعادة جدولة القروض مع المصرف لتقليل القسط والعبء المالي الشهري.",
              "يجب تطبيق ميزانية طوارئ صارمة على الفور وإيقاف كافة أوجه الإنفاق غير الضرورية وسداد البطاقات الائتمانية أولاً بأول لتفادي تراكم العمولات."
            ]
      };
      setAnalysisResultInd(results);
      setIsAnalyzingInd(false);
    }, 3000);
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

  // Metrics for individuals
  const income = 18000;
  const spending = 12850;
  const loans = 5200;
  const remaining = income - spending - loans; 
  const savingsRate = 15;

  // Simple SVG circular gauge for Financial Health (78/100)
  const renderGauge = (score: number) => {
    const radius = 50;
    const strokeWidth = 6;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative flex flex-col items-center justify-center py-4">
        <svg className="w-36 h-36 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className={`fill-none ${isLight ? "stroke-slate-100" : "stroke-[#041C16]"}`}
            strokeWidth={strokeWidth}
          />
          {/* Active colored path */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <span className={`text-3xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>{score}</span>
          <span className="text-xs text-slate-400 font-bold block">من 100</span>
        </div>
      </div>
    );
  };

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

      {/* 1. Right Sidebar Navigation */}
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
                <h1 className={`text-xs font-black ${isLight ? "text-slate-900" : "text-white"}`}>وجيه AI للأفراد</h1>
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
              { id: "cases", label: "شكاوى والتزامات", icon: FileText, count: cases.filter(c => c.pathType === "individual").length }
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
                      <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[8px] uppercase font-bold">
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

        {/* Bottom profile and support */}
        <div className="space-y-5">

          <div className={`border-t pt-4 flex items-center justify-between gap-3 ${isLight ? "border-slate-100" : "border-[#103B30]/30"}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 border rounded-full flex items-center justify-center font-bold text-sm ${isLight ? "bg-slate-100 text-emerald-700 border-slate-200" : "bg-[#041C16] border border-[#103B30]/35 text-emerald-400"}`}>
                أ
              </div>
              <div className="text-right">
                <h6 className={`text-xs font-bold ${isLight ? "text-slate-900" : "text-white"}`}>أحمد محمد</h6>
                <span className={`text-[9px] block font-semibold ${isLight ? "text-slate-500" : "text-slate-400"}`}>مواطن سعودي</span>
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
            /* OVERVIEW TAB - DASHBOARD (Mockup 2 Style) */
            <div className="space-y-8 animate-fade-in">
              <OnboardingSpotlight 
                targetSelector="#wajih-welcome-banner"
                onboardingKey="wajih-individual-onboarding-banner"
                title="مستشارك المالي الذكي: وجيه AI"
                description="مرحباً بك في منصتك المالية والامتثالية الموحدة! هذا هو الجزء المخصص لـ (وجيه AI)، مستشارك الذكي المعتمد والمرتبط بأنظمة البنك المركزي (ساما). يمكنك الضغط هنا لبدء محادثة فورية، صياغة الخطابات القانونية، أو مراجعة اللوائح والالتزامات المالية والامتثال التنظيمي بسهولة تامة."
                buttonText="حسنًا، فهمت"
                padding={4}
                borderRadius={24}
              />

              <SidebarOnboarding
                onboardingKey="wajih-individual-sidebar-onboarding"
                triggerKey="wajih-individual-onboarding-banner"
                title="قائمة الخيارات والتنقل الذكي"
                description="تتيح لك القائمة الجانبية التنقل المباشر والسهل بين لوحة التحكم، التحليل المالي، مراجعة التنبيهات والقرارات، ومتابعة القضايا والشكاوى القانونية لـ وجيه AI."
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
                  
                  <div className="space-y-4 relative z-10 text-right">
                    <div className="flex items-center gap-2.5 justify-start">
                      <WajihLogo showText={false} size={48} theme={isLight ? "light" : "dark"} />
                      <div>
                        <h4 className={`text-lg font-black ${isLight ? "text-slate-900" : "text-white"}`}>مستشارك الذكي: وجيه AI</h4>
                        <span className={`text-xs font-bold ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>بإشراف البنك المركزي السعودي (ساما)</span>
                      </div>
                    </div>
                    <p className={`text-xs md:text-sm leading-relaxed font-bold ${isLight ? "text-slate-600" : "text-slate-350"}`}>
                      مرحباً بك! وجيه هو مساعدك المالي الذكي لمساعدتك في صياغة الشكاوى المصرفية، تتبع وفهم قروضك الشخصية والالتزامات الائتمانية، تحليل ميزانيتك الشهرية وتقييم الملاءة الائتمانية والادخار بشكل نظامي.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2 justify-start">
                    <button 
                      onClick={() => setActiveTab("assistant")}
                      className="bg-[#004B3E] hover:bg-[#003B31] text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>استشارة وجيه AI</span>
                    </button>
                  </div>
                </div>
              </div>


              {/* Two Column Layout: Health and Spending analysis charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Spending Analysis chart (12 cols) */}
                <div className={`lg:col-span-12 border rounded-3xl p-6 text-right space-y-4 shadow-xs transition-colors duration-300 ${
                  isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                }`}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`font-extrabold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>تحليل ومصادر الإنفاق الشهري</h4>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                        البيانات للحساب البنكي SA8080000000123456784820
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>رصد وتصنيف نفقاتك لتبسيط سبل التوفير.</p>
                  </div>

                  {/* Progress bars simulating a budget split */}
                  <div className="space-y-4 pt-2">
                    {[
                      { label: "السكن والإيجار", amount: 4500, percent: 35, color: "bg-emerald-600" },
                      { label: "أقساط القروض والديون", amount: 3800, percent: 29, color: "bg-amber-600" },
                      { label: "المطاعم والكماليات", amount: 2500, percent: 20, color: "bg-blue-600" },
                      { label: "فواتير وخدمات عامة", amount: 1200, percent: 9, color: "bg-red-600" },
                      { label: "مدخرات شخصية طارئة", amount: 850, percent: 7, color: "bg-emerald-800" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className={isLight ? "text-slate-700" : "text-slate-300"}>{item.label}</span>
                          <span className={`font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>{item.amount.toLocaleString()} ر.س ({item.percent}%)</span>
                        </div>
                        <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-[#041C16]"}`}>
                          <div className={`h-2.5 rounded-full ${item.color} transition-all`} style={{ width: `${item.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Row: Active Cases and Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
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

                  {cases.filter(c => c.pathType === "individual").length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 font-bold">
                      لا توجد شكاوى نشطة.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cases.filter(c => c.pathType === "individual").slice(0, 2).map((c) => (
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

                {/* Smart Alerts list */}
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
            /* ASSISTANT CHAT TAB */
            <div className="animate-fade-in flex-1 flex flex-col h-full">
              <SmartAssistant 
                pathType="individual"
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
            /* CASES & OBLIGATIONS TAB */
            <div className="space-y-6 animate-fade-in text-right">
              {/* Monthly Loan Installments Section */}
              <div className={`border rounded-3xl p-6 transition-colors duration-300 ${
                isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dashed border-slate-200/50">
                  <div className="space-y-1">
                    <h3 className={`text-base font-extrabold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                      <CreditCard className="w-5 h-5 text-emerald-555" />
                      <span>الالتزامات والأقساط الشهرية القائمة</span>
                    </h3>
                    <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>تتبع الأقساط النشطة والالتزامات المسجلة في تقرير سمة الائتماني الموحد.</p>
                  </div>
                  <div className="text-right sm:text-left bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/20 font-black text-xs">
                    إجمالي الأقساط القائمة: 5,750 ر.س / شهرياً
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {/* Item 1 */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isLight ? "bg-slate-50 border-slate-100" : "bg-[#041C16] border-[#103B30]/30"
                  }`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">تمويل عقاري سكني</span>
                      <span className={`text-sm font-black ${isLight ? "text-slate-800" : "text-white"}`}>3,200 ر.س <span className="text-[10px] font-normal text-slate-400">/شهرياً</span></span>
                      <span className="text-[9px] text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block font-bold">مصرف الراجحي</span>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                      <PiggyBank className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isLight ? "bg-slate-50 border-slate-100" : "bg-[#041C16] border-[#103B30]/30"
                  }`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">تمويل شخصي مرن</span>
                      <span className={`text-sm font-black ${isLight ? "text-slate-800" : "text-white"}`}>1,800 ر.س <span className="text-[10px] font-normal text-slate-400">/شهرياً</span></span>
                      <span className="text-[9px] text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block font-bold">مصرف الإنماء</span>
                    </div>
                    <div className="w-10 h-10 bg-[#103B30]/10 text-emerald-400 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isLight ? "bg-slate-50 border-slate-100" : "bg-[#041C16] border-[#103B30]/30"
                  }`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">بطاقة ائتمانية نشطة</span>
                      <span className={`text-sm font-black ${isLight ? "text-slate-800" : "text-white"}`}>750 ر.س <span className="text-[10px] font-normal text-slate-400">/شهرياً</span></span>
                      <span className="text-[9px] text-emerald-650 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block font-bold">البنك الأهلي السعودي</span>
                    </div>
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Management */}
              <div>
                <CaseManagement 
                  pathType="individual"
                  cases={cases}
                  onToggleDoc={onToggleDoc}
                  onAddCase={onAddCase}
                  onDeleteCase={onDeleteCase}
                  theme={theme}
                />
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            /* INDIVIDUAL DETAILED FINANCIAL ANALYTICS */
            <div className="space-y-5 animate-fade-in text-right">
              <div>
                <h3 className={`text-base font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>التحليل المالي الذكي للأفراد</h3>
                <p className={`text-[11px] mt-0.5 ${isLight ? "text-slate-500" : "text-slate-450"}`}>
                  مؤشرات ملاءتك المالية وتحليلات إنفاقك المستوردة من واجهة المصرفية المفتوحة.
                </p>
              </div>

              {/* Dynamic Bank & Account Selectors Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. Left Selection Column */}
                <div className={`lg:col-span-4 border rounded-3xl p-5 space-y-5 transition-colors duration-300 ${
                  isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-dashed border-slate-200/50">
                      <PiggyBank className="w-4 h-4 text-emerald-555" />
                      <h4 className={`text-xs font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>بوابة الربط المصرفي</h4>
                    </div>

                    {/* Selector 1: Choose Bank */}
                    <div className="space-y-1.5">
                      <label className={`text-[11px] font-bold block ${isLight ? "text-slate-700" : "text-slate-300"}`}>اختر البنك المرتبط:</label>
                      <div className="flex flex-col gap-1.5">
                        {Object.entries(BANKS_DATA).map(([key, bank]) => (
                          <button
                            key={key}
                            onClick={() => {
                              setSelectedBank(key);
                              const firstAccKey = Object.keys(bank.accounts)[0];
                              setSelectedAccount(firstAccKey);
                            }}
                            className={`p-2.5 rounded-xl border text-right text-[11px] font-bold transition flex items-center justify-between cursor-pointer ${
                              selectedBank === key
                                ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                                : isLight
                                ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                                : "bg-[#041C16] border-[#103B30]/40 text-slate-300 hover:bg-[#103B30]/60"
                            }`}
                          >
                            <span>{bank.name}</span>
                            {selectedBank === key && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selector 2: Choose Account */}
                    <div className="space-y-1.5">
                      <label className={`text-[11px] font-bold block ${isLight ? "text-slate-700" : "text-slate-300"}`}>اختر الحساب البنكي:</label>
                      <select
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className={`w-full border rounded-xl px-2.5 py-2 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                          isLight 
                            ? "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white" 
                            : "bg-[#020907] border-[#103B30]/40 text-white focus:border-emerald-500"
                        }`}
                      >
                        {Object.entries(BANKS_DATA[selectedBank]?.accounts || {}).map(([key, acc]) => (
                          <option key={key} value={key}>
                            {acc.name} (**** {acc.lastDigits})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Open Banking explanation badge */}
                    <div className={`p-3 rounded-xl border flex items-start gap-2 transition-colors ${
                      isLight ? "bg-emerald-50/50 border-emerald-150 text-emerald-950" : "bg-[#041C16]/60 border border-[#103B30]/30 text-emerald-400"
                    }`}>
                      <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-[10px] leading-relaxed font-bold">
                        ملاحظة توضيحية: الربط الموحد وجلب البيانات المالية يتم بشكل مشفر وموثوق عبر Open Banking بموافقة المستخدم المسبقة وبإشراف البنك المركزي السعودي (SAMA).
                      </p>
                    </div>

                  </div>
                </div>

                {/* 2. Right Stats Column */}
                <div className="lg:col-span-8 space-y-5">
                  
                  {/* Account Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    
                    {/* Full IBAN Card */}
                    <div className={`border p-3.5 rounded-2xl space-y-1 text-right shadow-xs transition-colors duration-300 ${
                      isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                    }`}>
                      <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-400"}`}>الآيبان الكامل (IBAN)</span>
                      <div className={`text-[9px] font-mono font-bold break-all leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                        {BANKS_DATA[selectedBank]?.accounts[selectedAccount]?.iban || BANKS_DATA.rajhi.accounts.checking.iban}
                      </div>
                      <span className="text-[8px] text-emerald-850 font-bold bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded-md inline-block">حساب موثق</span>
                    </div>

                    {/* Balance Card */}
                    <div className={`border p-3.5 rounded-2xl space-y-1 text-right shadow-xs transition-colors duration-300 ${
                      isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                    }`}>
                      <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-400"}`}>الرصيد الحالي</span>
                      <div className={`text-base font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                        {(BANKS_DATA[selectedBank]?.accounts[selectedAccount]?.balance || BANKS_DATA.rajhi.accounts.checking.balance).toLocaleString()} ر.س
                      </div>
                      <span className="text-[8px] text-blue-800 font-bold bg-blue-50 border border-blue-100 px-1 py-0.5 rounded-md inline-block">رصيد متوفر</span>
                    </div>

                    {/* Income Card */}
                    <div className={`border p-3.5 rounded-2xl space-y-1 text-right shadow-xs transition-colors duration-300 ${
                      isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                    }`}>
                      <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-400"}`}>الدخل الشهري المودع</span>
                      <div className={`text-base font-bold text-emerald-600`}>
                        {(BANKS_DATA[selectedBank]?.accounts[selectedAccount]?.income || BANKS_DATA.rajhi.accounts.checking.income).toLocaleString()} ر.س
                      </div>
                      <span className="text-[8px] text-emerald-850 font-bold bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded-md inline-block">تحويل رواتب</span>
                    </div>

                    {/* Spending Card */}
                    <div className={`border p-3.5 rounded-2xl space-y-1 text-right shadow-xs transition-colors duration-300 ${
                      isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                    }`}>
                      <span className={`text-[9px] font-bold block ${isLight ? "text-slate-500" : "text-slate-400"}`}>المصروف هذا الشهر</span>
                      <div className={`text-base font-bold text-blue-600 dark:text-blue-400`}>
                        <span dir="ltr">-{(BANKS_DATA[selectedBank]?.accounts[selectedAccount]?.spending || BANKS_DATA.rajhi.accounts.checking.spending).toLocaleString()}</span> ر.س
                      </div>
                      <span className="text-[8px] text-blue-800 font-bold bg-blue-50 border border-blue-100 px-1 py-0.5 rounded-md inline-block">نفقات مرصودة</span>
                    </div>

                  </div>

                  {/* Spending Breakdown Category Chart */}
                  <div className={`border rounded-3xl p-5 text-right space-y-3.5 shadow-xs transition-colors duration-300 ${
                    isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
                  }`}>
                    <div>
                      <h4 className={`font-extrabold text-xs ${isLight ? "text-slate-900" : "text-white"}`}>تحليل وتفاصيل الإنفاق على هذا الحساب</h4>
                      <p className={`text-[10px] mt-0.5 font-bold ${isLight ? "text-slate-500" : "text-slate-400"}`}>تحديث فوري لتصنيف المعاملات والمدفوعات الصادرة تلقائياً.</p>
                    </div>

                    <div className="space-y-3 pt-1">
                      {(BANKS_DATA[selectedBank]?.accounts[selectedAccount]?.spendingCategories || BANKS_DATA.rajhi.accounts.checking.spendingCategories).map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className={isLight ? "text-slate-700" : "text-slate-300"}>{item.label}</span>
                            <span className={`font-mono ${isLight ? "text-slate-500" : "text-slate-400"}`}>{item.amount.toLocaleString()} ر.س ({item.percent}%)</span>
                          </div>
                          <div className={`w-full h-1 rounded-full overflow-hidden ${isLight ? "bg-slate-100" : "bg-[#041C16]"}`}>
                            <div className={`h-1 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.percent}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

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
                <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>صندوق التنبيهات الذكية للأفراد</h3>
                <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>تنبيهات فورية مرسلة من محرك التدقيق والتحليل السحابي الخاص بـ وجيه AI.</p>
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
                            paidAlerts.includes(alert.id)
                              ? "bg-emerald-600 border-emerald-500 text-white"
                              : alert.type === "danger"
                              ? (isLight ? "bg-red-100 text-red-800 border-red-200" : "bg-red-950/40 text-red-400 border-red-900/40")
                              : alert.type === "warning"
                              ? (isLight ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-amber-950/40 text-amber-400 border-amber-900/40")
                              : (isLight ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-[#020907] border border-[#103B30]/30 text-emerald-400")
                          }`}>{paidAlerts.includes(alert.id) ? "تم السداد بنجاح" : alert.badge}</span>

                          {(alert.badge === "تذكير بالسداد" || alert.badge === "مستحق السداد") && !paidAlerts.includes(alert.id) && (
                            <button
                              onClick={() => setPaidAlerts([...paidAlerts, alert.id])}
                              className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-black px-2.5 py-0.5 rounded-md transition duration-150 cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                            >
                              انقر للدفع
                            </button>
                          )}

                          {alert.badge === "إشعار سمة" && (
                            <button
                              onClick={() => setSimahViewed(true)}
                              className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-black px-2.5 py-0.5 rounded-md transition duration-150 cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
                            >
                              {simahViewed ? "تم الإطلاع" : "انقر للإطلاع"}
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

        </div>

      </div>

      {/* Floating Wajih Assistant button when not in Assistant view */}
      {activeTab !== "assistant" && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setActiveTab("assistant")}
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-3.5 rounded-full shadow-2xl border border-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            id="floating-wajih-trigger-ind"
            title="اسأل وجيه AI"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>اسأل وجيه AI</span>
          </button>
        </div>
      )}

      {/* Guided Tour Disabled */}

    </div>
  );
}

import React, { useState, useEffect } from "react";
import { UserPath, WajihCase, UploadedFile, AlertItem, ChatMessage } from "./types";
import { INDIVIDUAL_ALERTS, BUSINESS_ALERTS, INITIAL_CASES, INITIAL_FILES } from "./data/mockData";
import Portal from "./components/Portal";
import RouteSelection from "./components/RouteSelection";
import IndividualDashboard from "./components/IndividualDashboard";
import BusinessDashboard from "./components/BusinessDashboard";
import { findFaqResponse } from "./data/wajeehFaqs";

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('wajih-theme') as 'light' | 'dark') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('wajih-theme', next);
      return next;
    });
  };

  // Navigation / View state
  const [currentView, setCurrentView] = useState<'portal' | 'route_selection' | 'individual_dashboard' | 'business_dashboard'>('portal');
  const [activePath, setActivePath] = useState<UserPath>('individual');

  // Shared platform records state
  const [cases, setCases] = useState<WajihCase[]>(INITIAL_CASES);
  const [files, setFiles] = useState<UploadedFile[]>(INITIAL_FILES);
  const [alerts, setAlerts] = useState<AlertItem[]>(INDIVIDUAL_ALERTS);

  // Chat History / AI Assistant state
  const [individualChat, setIndividualChat] = useState<ChatMessage[]>([]);
  const [businessChat, setBusinessChat] = useState<ChatMessage[]>([]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Synchronize alerts with path selection
  useEffect(() => {
    // Clear onboarding dismissals once on initial app load so the user can see them and play with them on reload!
    localStorage.removeItem("wajih-individual-onboarding-banner");
    localStorage.removeItem("wajih-individual-sidebar-onboarding");
    localStorage.removeItem("wajih-business-onboarding-banner");
    localStorage.removeItem("wajih-business-sidebar-onboarding");
  }, []);

  useEffect(() => {
    if (currentView === 'individual_dashboard') {
      setAlerts(INDIVIDUAL_ALERTS);
    } else if (currentView === 'business_dashboard') {
      setAlerts(BUSINESS_ALERTS);
    }
  }, [currentView]);

  // Handler for selecting user path from selection screen
  const handleSelectPath = (path: UserPath) => {
    setActivePath(path);
    if (path === 'individual') {
      setCurrentView('individual_dashboard');
    } else {
      setCurrentView('business_dashboard');
    }
  };

  // Handler for submitting a message to Wajih AI
  const handleSendMessage = async (text: string, category?: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    // Update specific chat list based on active view
    if (activePath === 'individual') {
      setIndividualChat(prev => [...prev, userMsg]);
    } else {
      setBusinessChat(prev => [...prev, userMsg]);
    }

    setIsSendingChat(true);

    // Simulate Wajih AI's response after a natural delay
    setTimeout(() => {
      const responseText = findFaqResponse(text) || "حالياً أستطيع مساعدتك في مجموعة من الأسئلة الشائعة داخل وجيه AI. جرّب اختيار أحد الأسئلة المقترحة.";

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date(),
        isSimulated: true
      };

      if (activePath === 'individual') {
        setIndividualChat(prev => [...prev, assistantMsg]);
        
        // Dynamic Case Creation Simulation based on response
        if (text.toLowerCase().includes("شكوى") || text.toLowerCase().includes("خصم") || text.toLowerCase().includes("عملية")) {
          setTimeout(() => {
            simulateAutoCaseCreation(text, responseText);
          }, 800);
        }
      } else {
        setBusinessChat(prev => [...prev, assistantMsg]);

        // Dynamic Case Creation Simulation for businesses
        if (text.toLowerCase().includes("ترخيص") || text.toLowerCase().includes("رخصة") || text.toLowerCase().includes("سجل") || text.toLowerCase().includes("غسيل")) {
          setTimeout(() => {
            simulateAutoCaseCreation(text, responseText);
          }, 800);
        }
      }
      setIsSendingChat(false);
    }, 600);
  };

  // Helper to dynamically simulate Case creation from chat to highlight "Case Management Integration"
  const simulateAutoCaseCreation = (userQuery: string, aiResponse: string) => {
    // Check if the case already exists to avoid duplicates
    const normalizedQuery = userQuery.toLowerCase();
    let title = "";
    let category = "complaint";
    let desc = userQuery;
    let requiredDocs: string[] = [];

    if (normalizedQuery.includes("خصم") || normalizedQuery.includes("شكوى")) {
      title = "شكوى اعتراض مالي مصعدة";
      category = "complaint";
      requiredDocs = ["الهوية الوطنية", "كشف حساب بنكي موقع", "إثبات الاعتراض المسبق"];
    } else if (normalizedQuery.includes("عملية مشبوهة") || normalizedQuery.includes("احتيال")) {
      title = "بلاغ عاجل عن احتيال مصرفي";
      category = "scam";
      requiredDocs = ["الهوية الوطنية", "كشف حساب العملية المعترض عليها", "رقم بلاغ الجرائم المعلوماتية"];
    } else if (normalizedQuery.includes("ترخيص") || normalizedQuery.includes("رخصة")) {
      title = "طلب رخصة فنتك وسيط مدفوعات";
      category = "license";
      requiredDocs = ["السجل التجاري للمنشأة", "دراسة الجدوى الفنية", "شهادة رأس المال المستثمر", "شهادة الأمن السيبراني NCA"];
    } else if (normalizedQuery.includes("غسيل") || normalizedQuery.includes("aml")) {
      title = "اعتماد سياسة مكافحة غسيل الأموال (AML)";
      category = "aml";
      requiredDocs = ["هوية مسؤول الالتزام MLRO", "مسودة لائحة السياسات الداخلية", "محضر اجتماع مجلس الإدارة"];
    }

    if (!title) return;

    // Guard: don't create if already exists
    const duplicate = cases.some(c => c.title === title && c.pathType === activePath);
    if (duplicate) return;

    const newCase: WajihCase = {
      id: `case-${Math.floor(100 + Math.random() * 900)}`,
      title,
      pathType: activePath,
      category,
      status: 'pending_docs',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      description: desc,
      suggestedAction: "يرجى مراجعة وتأكيد تسليم المرفقات المطلوبة لرفع درجة الجاهزية التنظيمية وصياغة الخطاب النهائي.",
      requiredDocs: requiredDocs.map(name => ({ name, submitted: false })),
      generatedDocument: aiResponse.includes("مسودة") ? aiResponse : undefined
    };

    setCases(prev => [newCase, ...prev]);

    // Send a system-like alert about the case creation
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      title: `تم تأسيس حالة ذكية جديدة تلقائياً`,
      desc: `بناءً على محادثتك، قام وجيه AI بفتح ملف حالة بعنوان "${title}". تفضل بقسم الحالات لاستكمالها.`,
      type: 'success',
      date: 'الآن',
      badge: 'إدارة الحالات'
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  // Handler for toggling document checkbox inside Case detail
  const handleToggleDoc = (caseId: string, docName: string) => {
    setCases(prevCases => {
      return prevCases.map(c => {
        if (c.id !== caseId) return c;

        const updatedDocs = c.requiredDocs.map(doc => 
          doc.name === docName ? { ...doc, submitted: !doc.submitted } : doc
        );

        // Recalculate progress (Readiness score)
        const submittedCount = updatedDocs.filter(d => d.submitted).length;
        const totalCount = updatedDocs.length;
        const progress = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

        // Automatically advance status based on progress
        let status = c.status;
        if (progress === 100) {
          status = "completed";
        } else if (progress > 0) {
          status = "under_review";
        } else {
          status = "pending_docs";
        }

        return {
          ...c,
          requiredDocs: updatedDocs,
          progress,
          status
        };
      });
    });
  };

  // Handler for adding a new Case manually from form
  const handleAddCase = (title: string, category: string, desc: string, requiredDocs: string[]) => {
    const newCase: WajihCase = {
      id: `case-${Math.floor(100 + Math.random() * 900)}`,
      title,
      pathType: activePath,
      category,
      status: 'pending_docs',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
      description: desc,
      suggestedAction: "يرجى مراجعة وتأكيد تسليم المرفقات المطلوبة لرفع درجة الجاهزية التنظيمية.",
      requiredDocs: requiredDocs.map(name => ({ name, submitted: false }))
    };

    setCases(prev => [newCase, ...prev]);

    // Push new alert
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      title: `تم تسجيل طلب وحالة جديدة`,
      desc: `تم فتح حالة "${title}" بنجاح في سجلات الالتزام.`,
      type: 'info',
      date: 'الآن',
      badge: 'إنشاء يدوي'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Handler for deleting a case
  const handleDeleteCase = (caseId: string) => {
    setCases(prev => prev.filter(c => c.id !== caseId));
  };

  // Handler for simulated file uploads
  const handleUploadFile = (name: string, size: string, type: string) => {
    // Generate specialized AI Audit Results based on file name or type
    let summary = `تم تحليل وتدقيق الملف "${name}". كشف الفحص الأولي عن مطابقة المستند لبعض التعليمات والضوابط السعودية الصادرة مؤخراً.`;
    let readinessScore = 70;
    let issuesFound: string[] = ["غياب التوقيع والختم المعتمد على المستند الورقي المرفوع"];
    let recommendations: string[] = ["توقيع المستند وتحديث التاريخ ليتوافق مع الربع الحالي"];

    const lowerName = name.toLowerCase();

    if (lowerName.includes("حساب") || lowerName.includes("كشف")) {
      summary = "كشف حساب مصرفي للأفراد يوضح الرواتب والمعاملات اليومية لشهر يونيو 2026.";
      readinessScore = 85;
      issuesFound = [
        "وجود حركات مالية دولية متكررة بقيمة 2000 ريال دون تصنيف واضح لغرض التحويل"
      ];
      recommendations = [
        "برمجة كود التصنيف التلقائي للحوالات لتفادي تصنيفها كنشاط غير مبرر اقتصادياً",
        "تعديل المصاريف الاستهلاكية غير الضرورية لتفادي انخفاض نسبة الادخار"
      ];
    } else if (lowerName.includes("سياسة") || lowerName.includes("kyc") || lowerName.includes("aml")) {
      summary = "مسودة وثيقة اعرف عميلك (KYC) ومعايير التحقق من هويات العملاء والمستفيد الحقيقي.";
      readinessScore = 75;
      issuesFound = [
        "تفتقر المسودة لتحديد آلية التحقق من هويات العملاء ذوي المخاطر العالية (EDD)",
        "غياب حصر المستفيد الحقيقي (Ultimate Beneficial Owner)"
      ];
      recommendations = [
        "إضافة ملحق خاص بحصر وثائق المستفيد الحقيقي للامتثال لتعليمات ساما لمكافحة غسيل الأموال",
        "تحديث هويات العملاء المنتهية بشكل سنوي وتأكيد تجميد الحسابات غير المحدثة تلقائياً"
      ];
    }

    const newFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name,
      size,
      uploadedAt: new Date().toLocaleDateString('ar-SA') + ' ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      type,
      status: 'analyzed',
      analysisResult: {
        summary,
        readinessScore,
        issuesFound,
        recommendations
      }
    };

    setFiles(prev => [newFile, ...prev]);

    // Auto update any pending case related to files
    if (lowerName.includes("حساب") || lowerName.includes("كشف")) {
      // Find individuals case for complaint and mark statement as submitted
      setCases(prev => prev.map(c => {
        if (c.id === "case-001") {
          const updatedDocs = c.requiredDocs.map(d => 
            d.name.includes("كشف حساب") ? { ...d, submitted: true } : d
          );
          const submittedCount = updatedDocs.filter(d => d.submitted).length;
          const progress = Math.round((submittedCount / updatedDocs.length) * 100);
          return { ...c, requiredDocs: updatedDocs, progress, status: progress === 100 ? "completed" : "under_review" };
        }
        return c;
      }));
    }

    // Trigger an alert about the upload audit completion
    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      title: `اكتمال التدقيق التلقائي للمستند`,
      desc: `تم فحص مستندك "${name}" بالكامل بنجاح. الجاهزية: ${readinessScore}%.`,
      type: 'success',
      date: 'الآن',
      badge: 'تدقيق ذكي'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleExitToPortal = () => {
    setCurrentView('portal');
  };

  const handleExitToRouteSelection = () => {
    setCurrentView('route_selection');
  };

  return (
    <div>
      {currentView === 'portal' && (
        <Portal 
          theme={theme}
          onToggleTheme={toggleTheme}
          onStartWajih={() => setCurrentView('route_selection')} 
        />
      )}

      {currentView === 'route_selection' && (
        <RouteSelection 
          theme={theme}
          onToggleTheme={toggleTheme}
          onSelectPath={handleSelectPath} 
          onBackToPortal={handleExitToPortal} 
        />
      )}

      {currentView === 'individual_dashboard' && (
        <IndividualDashboard 
          theme={theme}
          onToggleTheme={toggleTheme}
          cases={cases}
          files={files}
          alerts={alerts}
          chatHistory={individualChat}
          isSendingChat={isSendingChat}
          onSendMessage={handleSendMessage}
          onClearChat={() => setIndividualChat([])}
          onUploadFile={handleUploadFile}
          onDeleteFile={handleDeleteFile}
          onToggleDoc={handleToggleDoc}
          onAddCase={handleAddCase}
          onDeleteCase={handleDeleteCase}
          onExit={handleExitToRouteSelection}
        />
      )}

      {currentView === 'business_dashboard' && (
        <BusinessDashboard 
          theme={theme}
          onToggleTheme={toggleTheme}
          cases={cases}
          files={files}
          alerts={alerts}
          chatHistory={businessChat}
          isSendingChat={isSendingChat}
          onSendMessage={handleSendMessage}
          onClearChat={() => setBusinessChat([])}
          onUploadFile={handleUploadFile}
          onDeleteFile={handleDeleteFile}
          onToggleDoc={handleToggleDoc}
          onAddCase={handleAddCase}
          onDeleteCase={handleDeleteCase}
          onExit={handleExitToRouteSelection}
        />
      )}
    </div>
  );
}

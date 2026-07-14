import { WajihCase, UploadedFile, AlertItem } from "../types";

export const INDIVIDUAL_QUICK_SERVICES = [
  { id: "financial_health", title: "تحليل وضعي المالي", icon: "PiggyBank", desc: "تقييم الراتب والادخار ونسب الاستقطاع", cat: "financial_health" },
  { id: "scam_detection", title: "اكتشاف عملية مشبوهة", icon: "ShieldAlert", desc: "الإبلاغ العاجل عن العمليات أو الاحتيال", cat: "scam" },
  { id: "loan_analysis", title: "فهم قرض أو بطاقة", icon: "CreditCard", desc: "مراجعة فوائد البطاقات وعقود التمويل", cat: "loan" },
  { id: "submit_complaint", title: "تقديم شكوى مالية", icon: "FileText", desc: "تجهيز شكوى رسمية للبنك المركزي السعودي", cat: "complaint" },
  { id: "financial_tips", title: "نصائح مالية ذكية", icon: "Sparkles", desc: "توصيات شخصية لتقليل الالتزامات الشهرية", cat: "tips" }
];

export const BUSINESS_QUICK_SERVICES = [
  { id: "license_request", title: "تقديم طلب ترخيص", icon: "Award", desc: "متطلبات التقنية المالية وبوابات الدفع", cat: "license" },
  { id: "submit_report", title: "رفع البيانات الإشرافية", icon: "UploadCloud", desc: "التقارير الدورية ومتطلبات الافصاح المالي", cat: "supervisory" },
  { id: "aml_requirements", title: "متطلبات AML/CFT", icon: "ShieldCheck", desc: "مكافحة غسيل الأموال وتمويل الإرهاب", cat: "aml" },
  { id: "policy_query", title: "استفسار عن السياسات", icon: "BookOpen", desc: "قوانين البنك المركزي وهيئة السوق المالية", cat: "policy" },
  { id: "sandbox_apply", title: "البيئة التجريبية التشريعية", icon: "FlaskConical", desc: "اختبار الابتكارات المالية بشكل مرخص مؤقتاً", cat: "sandbox" },
  { id: "risk_analysis", title: "تحليل مخاطر الالتزام", icon: "TrendingUp", desc: "فحص السجلات لتفادي المخالفات التنظيمية", cat: "risk" }
];

export const INDIVIDUAL_ALERTS: AlertItem[] = [
  {
    id: "a1",
    title: "قسط القرض الشخصي مستحق قريباً",
    desc: "نود تذكيرك بأن قسط التمويل الشخصي البالغ 1,450 ريال مستحق الصرف في تاريخ 25 يوليو 2026. يرجى التأكد من توفر الرصيد الكافي وتفادي تعثر الالتزامات.",
    type: "warning",
    date: "اليوم، 10:30 ص",
    badge: "تذكير بالسداد"
  },
  {
    id: "a2",
    title: "فاتورة البطاقة الائتمانية مستحقة",
    desc: "تم إصدار الفاتورة الشهرية للبطاقة الائتمانية المنتهية بـ (4902) بمبلغ 2,800 ريال. يرجى سداد الحد الأدنى على الأقل لتفادي الغرامات وتراكم الأرباح البنكية.",
    type: "danger",
    date: "أمس، 02:15 م",
    badge: "مستحق السداد"
  },
  {
    id: "a3",
    title: "تحديث تقرير سمة الائتماني",
    desc: "أصدرت شركة سمة تقريرك الائتماني الجديد. درجة ملاءتك الائتمانية مستقرة عند 740 نقطة (منخفض المخاطر).",
    type: "success",
    date: "3 يوليو 2026",
    badge: "إشعار سمة"
  }
];

export const BUSINESS_ALERTS: AlertItem[] = [
  {
    id: "ba1",
    title: "طلب ترخيص معلّق لنقص مستندات",
    desc: "تنبيه عاجل: تم تعليق طلب الترخيص رقم #1902 الخاص ببوابتكم المالية لنقص مستند 'شهادة الأمن السيبراني (NCA)' و'مسودة مكافحة غسيل الأموال'. يرجى إرفاقها لتمكين المراجعة.",
    type: "danger",
    date: "اليوم، 09:00 ص",
    badge: "إجراء مطلوب فوراً"
  },
  {
    id: "ba2",
    title: "التقرير الإشرافي ربع السنوي مستحق قريبًا",
    desc: "نود تذكيركم بأن موعد رفع التقرير الإشرافي ربع السنوي للالتزام المالي لساما مستحق خلال 8 أيام. يرجى الرفع تفادياً للمخالفات الإدارية.",
    type: "warning",
    date: "أمس، 11:45 ص",
    badge: "تاريخ استحقاق هام"
  },
  {
    id: "ba3",
    title: "تجديد ترخيص البيئة التجريبية بنجاح",
    desc: "تم تمديد صلاحية ترخيص منتج التمويل الجماعي التابع لكم داخل البيئة التجريبية (Sandbox) لمدة 6 أشهر إضافية للامتثال التنظيمي السليم.",
    type: "success",
    date: "1 يوليو 2026",
    badge: "تحديث الترخيص"
  }
];

export const INITIAL_CASES: WajihCase[] = [
  {
    id: "case-001",
    title: "شكوى حسم قسط إضافي",
    pathType: "individual",
    category: "complaint",
    status: "under_review",
    progress: 60,
    createdAt: "2026-07-01",
    description: "تم حسم مبلغ 1,450 ريال مرتين كقسط تمويلي شخصي لشهر يونيو من قبل البنك التمويل الأهلي.",
    suggestedAction: "بانتظار رد البنك النهائي على التذكرة المصعدة عبر ساما تهتم.",
    requiredDocs: [
      { name: "كشف حساب يونيو موثق", submitted: true },
      { name: "صورة التذكرة السابقة بالبنك", submitted: true },
      { name: "خطاب الاعتراض المكتوب", submitted: true }
    ],
    generatedDocument: `إلى إدارة حماية العملاء بالبنك المركزي السعودي المحترمين،
الموضوع: شكوى رسمية ضد البنك لخصم قسط مالي متكرر دون مسوغ قانوني

أتقدم أنا المواطن أحمد محمد، بالشكوى ضد بنك التمويل الأهلي، حيث تم استقطاع قسط التمويل الشخصي مرتين لشهر يونيو بقيمة 1,450 ريال لكل عملية. أرجو إلزام البنك بإعادة المبلغ الإضافي فوراً وجبر الضرر.`
  },
  {
    id: "case-002",
    title: "رخصة بوابة دفع مبتكرة (FinTech)",
    pathType: "business",
    category: "license",
    status: "pending_docs",
    progress: 35,
    createdAt: "2026-07-05",
    description: "طلب ترخيص شركة تقنيات دفع وسيطة لتقديم حلول الشراء الميسر في التجارة الإلكترونية.",
    suggestedAction: "يرجى استكمال رفع وثيقة فحص الثغرات الأمنية وخطة مكافحة الاحتيال الداخلي.",
    requiredDocs: [
      { name: "دراسة الجدوى الفنية والمالية", submitted: true },
      { name: "شهادة رأس المال المودع بالبنك", submitted: true },
      { name: "وثيقة سياسة الأمن السيبراني (NCA)", submitted: false },
      { name: "خطة التدابير لمكافحة غسيل الأموال (AML)", submitted: false }
    ]
  }
];

export const INITIAL_FILES: UploadedFile[] = [
  {
    id: "file-001",
    name: "كشف_الحساب_الربعي_يونيو.pdf",
    size: "2.4 MB",
    uploadedAt: "2026-07-04 14:30",
    type: "pdf",
    status: "analyzed",
    analysisResult: {
      summary: "كشف حساب مصرفي للأفراد يوضح التدفقات النقدية والرواتب لشهر يونيو 2026.",
      readinessScore: 88,
      issuesFound: [
        "وجود عمليات تحويل نقدية دولية متكررة بقيمة 2000 ريال دون كود تصنيف موحد",
        "معدل الإنفاق الاستهلاكي يتجاوز 40% من الدخل الإجمالي"
      ],
      recommendations: [
        "برمجة التصنيف التلقائي للحوالات لتفادي تصنيفها كنشاط غير مبرر",
        "زيادة المدخرات بنسبة 5% للوصول للحد الآمن للصحة المالية"
      ]
    }
  },
  {
    id: "file-002",
    name: "سياسة_اعرف_عميلك_مسودة.docx",
    size: "1.1 MB",
    uploadedAt: "2026-07-06 09:15",
    type: "docx",
    status: "analyzed",
    analysisResult: {
      summary: "مسودة وثيقة اعرف عميلك (KYC) وسياسات القبول والرفض للمنشأة المالية.",
      readinessScore: 72,
      issuesFound: [
        "تفتقر المسودة لتعريف واضح للمستفيد الحقيقي (Ultimate Beneficial Owner)",
        "عدم تحديد آلية تحديث الهويات المنتهية للعملاء بشكل سنوي"
      ],
      recommendations: [
        "إدراج بند خاص بجمع معلومات المستفيد الحقيقي وفق المادة 4 من اللائحة الإشرافية",
        "توضيح دور مسؤول الالتزام في الحالات التي تحتاج عناية واجبة مشددة (EDD)"
      ]
    }
  }
];

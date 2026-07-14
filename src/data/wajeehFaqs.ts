export interface FAQItem {
  question: string;
  answer: string;
}

export const wajeehFaqs: FAQItem[] = [
  {
    "question": "من أنت؟",
    "answer": "أنا وجيه AI، مستشارك الذكي داخل المنصة. أساعدك في فهم الخدمات المصرفية، توضيح بعض المفاهيم المالية، وإرشادك إلى الأقسام المناسبة داخل وجيه."
  },
  {
    "question": "كيف تقدر تساعدني؟",
    "answer": "أستطيع مساعدتك في التعرف على الخدمات المتاحة، فهم التحليل المالي بشكل مبسط، معرفة التنبيهات الذكية، والوصول إلى قسم الشكاوى والالتزامات بسهولة."
  },
  {
    "question": "ما هو التحليل المالي؟",
    "answer": "التحليل المالي في وجيه يساعدك على فهم أنماط الإنفاق لديك بشكل مبسط، مثل توزيع المصروفات على الفئات المختلفة، ومتابعة سلوكك المالي بصورة أوضح."
  },
  {
    "question": "ما فائدة التنبيهات الذكية؟",
    "answer": "التنبيهات الذكية تساعدك على ملاحظة أمور مهمة مثل وجود تغيّر في الإنفاق، تكرار بعض العمليات، أو مؤشرات مالية تستحق الانتباه حتى تتمكن من اتخاذ قرارات أفضل."
  },
  {
    "question": "كيف أقدم شكوى؟",
    "answer": "يمكنك التوجه إلى قسم الشكاوى والالتزامات داخل وجيه، وهناك ستجد المسار المخصص لتقديم الشكوى أو الاطلاع على المعلومات المرتبطة بها بشكل واضح ومنظم."
  },
  {
    "question": "هل وجيه يقدم نصائح مالية؟",
    "answer": "نعم، وجيه يقدم إرشادات وتوصيات عامة مبنية على المعلومات والخصائص المتاحة داخل المنصة، بهدف مساعدتك على فهم وضعك المالي بشكل أفضل."
  },
  {
    "question": "هل يمكنني الاعتماد على وجيه في فهم مصروفاتي؟",
    "answer": "نعم، وجيه يساعدك في قراءة مؤشرات الإنفاق وفهم توزيع مصروفاتك بشكل مبسط، لكنه يظل أداة مساندة للتوعية والإرشاد وليس بديلاً عن قرارك المالي الشخصي."
  },
  {
    "question": "ما الفرق بين الرئيسية والتحليل المالي？",
    "answer": "قسم الرئيسية يعرض لك نظرة عامة وتجربة الدخول الأساسية، بينما قسم التحليل المالي يركز على قراءة الإنفاق والأنماط المالية وتقديم فهم أوضح لبياناتك المالية."
  },
  {
    "question": "هل بياناتي آمنة داخل وجيه؟",
    "answer": "تم تصميم تجربة وجيه بحيث تكون ضمن بيئة رقمية منظمة، مع التركيز على الخصوصية وسرية البيانات وفق الإطار العام للمنصة ومتطلباتها."
  },
  {
    "question": "كيف أبدأ باستخدام وجيه؟",
    "answer": "ابدأ من الصفحة الرئيسية، تعرّف على المستشار الذكي وجيه، ثم انتقل عبر القائمة الجانبية إلى التحليل المالي أو التنبيهات الذكية أو الشكاوى والالتزامات حسب ما تحتاجه."
  }
];

export function normalizeArabic(text: string): string {
  if (!text) return "";
  let norm = text;
  // Remove tashkeel (diacritics)
  norm = norm.replace(/[\u064B-\u0652]/g, "");
  // Normalize Alef
  norm = norm.replace(/[أإآ]/g, "ا");
  // Normalize Teh Marbuta
  norm = norm.replace(/ة/g, "ه");
  // Normalize Yeh/Alef Maksura
  norm = norm.replace(/ى/g, "ي");
  // Remove common Arabic and English punctuation
  norm = norm.replace(/[؟?\.!،,;\-\(\)\[\]\{\}]/g, " ");
  // Replace multiple spaces with a single space and trim
  norm = norm.replace(/\s+/g, " ").trim();
  return norm;
}

export function findFaqResponse(userQuestion: string): string | null {
  const normalizedUser = normalizeArabic(userQuestion);
  if (!normalizedUser) return null;

  // 1. Exact match on normalized strings
  for (const faq of wajeehFaqs) {
    const normalizedFaq = normalizeArabic(faq.question);
    if (normalizedUser === normalizedFaq) {
      return faq.answer;
    }
  }

  // 2. Substring/keyword matches
  for (const faq of wajeehFaqs) {
    const normalizedFaq = normalizeArabic(faq.question);
    if (normalizedUser.includes(normalizedFaq) || normalizedFaq.includes(normalizedUser)) {
      return faq.answer;
    }
  }

  return null;
}

import React, { useState } from "react";
import { FolderKanban, CheckCircle2, Clock, FileText, ChevronLeft, ArrowRight, Clipboard, Copy, Check, Plus, AlertCircle, Trash2 } from "lucide-react";
import { WajihCase, UserPath } from "../types";

interface CaseManagementProps {
  pathType: UserPath;
  cases: WajihCase[];
  onToggleDoc: (caseId: string, docName: string) => void;
  onAddCase: (title: string, category: string, desc: string, requiredDocs: string[]) => void;
  onDeleteCase: (caseId: string) => void;
  theme?: "light" | "dark";
}

export default function CaseManagement({
  pathType,
  cases,
  onToggleDoc,
  onAddCase,
  onDeleteCase,
  theme = "dark"
}: CaseManagementProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // New Case Modal Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("complaint");
  const [newDesc, setNewDesc] = useState("");
  const [newDocs, setNewDocs] = useState("");

  const filteredCases = cases.filter(c => c.pathType === pathType);
  const activeCase = cases.find(c => c.id === selectedCaseId);

  const isLight = theme === "light";

  const getStatusBadge = (status: WajihCase["status"]) => {
    switch (status) {
      case "completed":
        return <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
          isLight ? "bg-emerald-50 text-emerald-800 border border-emerald-150" : "bg-emerald-950/40 text-emerald-300 border border-emerald-800/30"
        }`}>مكتملة</span>;
      case "under_review":
        return <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
          isLight ? "bg-blue-50 text-blue-800 border border-blue-150" : "bg-blue-950/40 text-blue-300 border border-blue-800/30"
        }`}>تحت المراجعة والتدقيق</span>;
      case "pending_docs":
        return <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
          isLight ? "bg-amber-50 text-amber-800 border border-amber-150" : "bg-amber-950/40 text-amber-300 border border-amber-800/30"
        }`}>نواقص في المستندات</span>;
      case "draft":
        return <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
          isLight ? "bg-slate-100 text-slate-700 border border-slate-200" : "bg-slate-900 text-slate-400 border border-slate-800/30"
        }`}>مسودة</span>;
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    
    const docList = newDocs
      .split("\n")
      .map(d => d.trim())
      .filter(d => d.length > 0);

    const defaultDocs = docList.length > 0 ? docList : ["الهوية الوطنية / الإقامة", "كشف حساب بنكي لآخر 3 أشهر"];

    onAddCase(newTitle, newCat, newDesc, defaultDocs);
    setNewTitle("");
    setNewDesc("");
    setNewDocs("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      
      {activeCase ? (
        /* Detailed Case View */
        <div className={`rounded-3xl border shadow-sm p-6 md:p-8 space-y-8 animate-fade-in transition-colors duration-300 ${
          isLight ? "bg-white border-slate-200 text-slate-800" : "bg-[#062D24] border-[#103B30]/50 text-white"
        }`}>
          
          {/* Header */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6 ${
            isLight ? "border-slate-100" : "border-[#103B30]/30"
          }`}>
            <button 
              onClick={() => setSelectedCaseId(null)}
              className={`text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isLight ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لقائمة الحالات</span>
            </button>
            
            <div className="flex items-center gap-3">
              {getStatusBadge(activeCase.status)}
              <span className={`text-xs font-semibold ${isLight ? "text-slate-400" : "text-slate-500"}`}>تاريخ الإنشاء: {activeCase.createdAt}</span>
            </div>
          </div>

          {/* Main info grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left detailed columns (8 cols) */}
            <div className="lg:col-span-8 space-y-6 text-right">
              
              <div>
                <h3 className={`text-2xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>{activeCase.title}</h3>
                <p className="text-xs text-emerald-600 font-bold mt-1.5">الرقم المرجعي للحالة: {activeCase.id}</p>
              </div>

              <div className={`rounded-2xl p-5 border space-y-2 transition-colors duration-300 ${
                isLight ? "bg-slate-50 border-slate-150 text-slate-800" : "bg-[#041C16] border border-[#103B30]/40 text-slate-100"
              }`}>
                <h4 className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>شرح وتوصيف الحالة:</h4>
                <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-350"}`}>{activeCase.description}</p>
              </div>

              {/* Legal Draft Document Section */}
              {activeCase.generatedDocument ? (
                <div className={`border rounded-2xl overflow-hidden shadow-xs transition-colors duration-300 ${
                  isLight ? "border-slate-200" : "border-[#103B30]/40"
                }`}>
                  <div className={`px-5 py-3.5 border-b flex items-center justify-between ${
                    isLight ? "bg-slate-50 border-slate-150" : "bg-[#041C16] border-[#103B30]/40"
                  }`}>
                    <span className={`font-bold text-sm flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                      <FileText className="w-4.5 h-4.5 text-emerald-600" />
                      مخرجات وجيه: صياغة مسودة الخطاب الرسمي
                    </span>
                    <button 
                      onClick={() => handleCopyText(activeCase.generatedDocument || "")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                        isLight 
                          ? "bg-white border-slate-200 hover:bg-slate-50 text-slate-700" 
                          : "bg-[#041C16] border-[#103B30]/50 hover:bg-[#103B30] text-emerald-300"
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ النص</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className={`p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto text-right border-t ${
                    isLight ? "bg-slate-50/50 text-slate-800 border-slate-100" : "bg-[#020907] text-emerald-250 border-slate-950"
                  }`}>
                    {activeCase.generatedDocument}
                  </div>
                </div>
              ) : (
                <div className={`border p-5 rounded-2xl space-y-2 ${
                  isLight ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-amber-950/20 border-amber-900/30 text-amber-200"
                }`}>
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 text-amber-700" />
                    الخطاب القانوني قيد الإعداد
                  </h4>
                  <p className="text-xs leading-relaxed">
                    لم يقم وجيه AI بصياغة مستند نهائي لهذه الحالة بعد. يمكنك بدء المحادثة مع وجيه AI في "المساعد الذكي" وطلب صياغة خطاب شكوى أو تقرير امتثال ليرفق تلقائياً في هذا القسم.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>الإجراء القانوني الموصى به حالياً:</h4>
                <div className={`border p-4 rounded-xl text-sm flex items-start gap-3 ${
                  isLight ? "bg-emerald-50 border-emerald-150 text-emerald-950" : "bg-[#041C16] border border-[#103B30]/35 text-emerald-100"
                }`}>
                  <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-bold">{activeCase.suggestedAction}</p>
                </div>
              </div>

            </div>

            {/* Right details sidebar (4 cols): Documents Checklist and Readiness */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Readiness Card */}
              <div className={`rounded-2xl p-6 text-center space-y-4 shadow-md ${
                isLight ? "bg-emerald-800 text-white" : "bg-[#041C16] text-white border border-[#103B30]/50"
              }`}>
                <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                  isLight ? "bg-emerald-700 text-emerald-100" : "bg-[#103B30] text-emerald-300"
                }`}>مؤشر الجاهزية</span>
                <div className="text-4xl font-black">{activeCase.progress}%</div>
                <div className={`w-full rounded-full h-2 overflow-hidden ${isLight ? "bg-emerald-900" : "bg-[#020907]"}`}>
                  <div className="bg-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${activeCase.progress}%` }}></div>
                </div>
                <p className={`text-[11px] leading-relaxed ${isLight ? "text-emerald-100" : "text-emerald-250"}`}>
                  {activeCase.progress === 100 
                    ? "جاهز للتقديم والمراجعة النهائية بنسبة 100%. أوراقك مكتملة." 
                    : "يرجى تقديم واستكمال النواقص المذكورة أدناه لرفع نسبة الجاهزية التنظيمية."}
                </p>
              </div>

              {/* Documents Checklist Card */}
              <div className={`border rounded-2xl p-5 space-y-4 shadow-xs transition-colors duration-300 ${
                isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
              }`}>
                <h4 className={`font-bold text-sm border-b pb-2.5 ${isLight ? "text-slate-900 border-slate-100" : "text-white border-[#103B30]/35"}`}>المستندات المطلوبة والمرفقات</h4>
                
                <div className="space-y-3">
                  {activeCase.requiredDocs.map((doc, idx) => (
                    <div 
                      key={idx}
                      onClick={() => onToggleDoc(activeCase.id, doc.name)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer text-right ${
                        doc.submitted 
                          ? isLight ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" : "bg-[#041C16]/40 border-emerald-950 text-emerald-200" 
                          : isLight ? "bg-slate-50 border-slate-150 hover:border-slate-300 text-slate-600" : "bg-[#020907] border-[#103B30]/40 hover:border-[#103B30] text-slate-450"
                      }`}
                    >
                      <span className="text-xs font-semibold">{doc.name}</span>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        doc.submitted 
                          ? "bg-emerald-600 border-emerald-600 text-white" 
                          : isLight ? "bg-white border-slate-300" : "bg-[#020907] border-[#103B30]/60"
                      }`}>
                        {doc.submitted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-400 text-center font-semibold pt-1">
                  اضغط على الملف لتحديد تسليمه يدوياً وتحديث مؤشر الجاهزية.
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Case List View */
        <div className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>إدارة الحالات والطلبات الذكية</h3>
              <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>قائمة التظلمات، التراخيص، وتقارير الالتزام المفعلة باسمك.</p>
            </div>

            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-750 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md shadow-emerald-700/5"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء حالة جديدة</span>
            </button>
          </div>

          {/* Cases grid or list */}
          {filteredCases.length === 0 ? (
            <div className={`border rounded-3xl p-12 text-center space-y-4 shadow-xs transition-colors duration-300 ${
              isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
                isLight ? "bg-slate-50 text-slate-400 border border-slate-150" : "bg-[#041C16] text-slate-400 border border-[#103B30]/30"
              }`}>
                <FolderKanban className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className={`font-black text-sm ${isLight ? "text-slate-900" : "text-white"}`}>لا توجد حالات مسجلة حالياً</h4>
                <p className={`text-xs max-w-sm mx-auto ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  يمكنك إنشاء تذكرة اعتراض، أو طلب ترخيص جديد بالنقر على الزر بالأعلى، أو التحدث مع وجيه AI ليقوم بإنشائها لك تلقائياً.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCases.map((c) => {
                const completedDocsCount = c.requiredDocs.filter(d => d.submitted).length;
                const totalDocsCount = c.requiredDocs.length;

                return (
                  <div 
                    key={c.id}
                    className={`border rounded-2xl p-5 md:p-6 transition flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:shadow-sm text-right ${
                      isLight 
                        ? "bg-white border-slate-200 hover:border-emerald-500 text-slate-800" 
                        : "bg-[#062D24] border border-[#103B30]/50 hover:border-emerald-550 text-white"
                    }`}
                    onClick={() => setSelectedCaseId(c.id)}
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className={`font-extrabold text-base ${isLight ? "text-slate-900" : "text-white"}`}>{c.title}</h4>
                        {getStatusBadge(c.status)}
                        <span className={`text-[10px] border px-2 py-0.5 rounded-md font-bold ${
                          isLight ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-[#020907] border border-[#103B30]/40 text-slate-350"
                        }`}>
                          {c.id}
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-2 leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>{c.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400">
                        <span>تاريخ البدء: {c.createdAt}</span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className={isLight ? "text-slate-650" : "text-slate-400"}>المستندات: {completedDocsCount} من {totalDocsCount}</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress indicators */}
                    <div className={`flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 ${
                      isLight ? "border-slate-100" : "border-[#103B30]/20"
                    }`}>
                      <div className="text-left space-y-1">
                        <div className="text-xs text-slate-400 font-bold">نسبة الجاهزية</div>
                        <div className={`text-base font-black ${isLight ? "text-slate-900" : "text-white"}`}>{c.progress}%</div>
                        <div className={`w-24 rounded-full h-1.5 overflow-hidden ${isLight ? "bg-slate-100" : "bg-[#020907]"}`}>
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${c.progress}%` }}></div>
                        </div>
                      </div>

                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("هل أنت متأكد من رغبتك في حذف هذه الحالة الذكية؟")) {
                            onDeleteCase(c.id);
                          }
                        }}
                        className={`p-2 rounded-lg transition ${
                          isLight ? "text-slate-300 hover:text-red-600 hover:bg-slate-50" : "text-slate-400 hover:text-red-500 hover:bg-[#020907]"
                        }`}
                        title="حذف الحالة"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* New Case Creation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl shadow-2xl border w-full max-w-lg p-6 md:p-8 space-y-6 animate-scale-up text-right transition-colors duration-300 ${
            isLight ? "bg-white border-slate-200 text-slate-800" : "bg-[#062D24] border border-[#103B30]/50 text-white"
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-4 ${isLight ? "border-slate-100" : "border-[#103B30]/25"}`}>
              <h3 className={`font-black text-lg ${isLight ? "text-slate-900" : "text-white"}`}>إنشاء ملف حالة جديدة</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className={`text-xl font-bold ${isLight ? "text-slate-400 hover:text-slate-700" : "text-slate-550 hover:text-white"}`}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>عنوان التذكرة / اسم الحالة:</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: شكوى فائدة إضافية للبنك، أو طلب ترخيص فنتك"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition ${
                    isLight 
                      ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white" 
                      : "bg-[#020907] border-[#103B30]/50 text-white placeholder-slate-500"
                  }`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>التصنيف:</label>
                <select 
                  value={newCat} 
                  onChange={(e) => setNewCat(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition ${
                    isLight 
                      ? "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white" 
                      : "bg-[#020907] border-[#103B30]/50 text-white"
                  }`}
                >
                  <option value="complaint">تقديم شكوى مالية</option>
                  <option value="scam">بلاغ احتيال مالي</option>
                  <option value="license">طلب ترخيص جديد</option>
                  <option value="aml">امتثال مكافحة غسيل الأموال</option>
                  <option value="tips">استشارة أو توصية عامة</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>وصف تفصيلي للحالة والوقائع المبدئية:</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="اشرح المشكلة بالتفصيل ومطالبك القانونية ليتسنى لوجيه إعداد المستند..."
                  rows={4}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition ${
                    isLight 
                      ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white" 
                      : "bg-[#020907] border-[#103B30]/50 text-white placeholder-slate-500"
                  }`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>المستندات المطلوبة (اكتب مستنداً واحداً في كل سطر):</label>
                <textarea 
                  value={newDocs} 
                  onChange={(e) => setNewDocs(e.target.value)}
                  placeholder="كشف حساب يونيو&#10;خطاب الاعتراض المكتوب&#10;شهادة السجل التجاري"
                  rows={3}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition ${
                    isLight 
                      ? "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white" 
                      : "bg-[#020907] border-[#103B30]/50 text-white placeholder-slate-500"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-4 justify-start">
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  إنشاء الحالة
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isLight 
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-600" 
                      : "bg-[#020907] border border-[#103B30]/40 hover:bg-[#041C16] text-slate-300"
                  }`}
                >
                  إلغاء
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

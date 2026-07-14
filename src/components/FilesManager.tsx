import React, { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw, Eye, Trash2, ArrowRight } from "lucide-react";
import { UploadedFile } from "../types";

interface FilesManagerProps {
  files: UploadedFile[];
  onUploadFile: (name: string, size: string, type: string) => void;
  onDeleteFile: (fileId: string) => void;
  theme?: "light" | "dark";
}

export default function FilesManager({ 
  files, 
  onUploadFile, 
  onDeleteFile, 
  theme = "dark" 
}: FilesManagerProps) {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isUploadingSim, setIsUploadingSim] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const [simFileName, setSimFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find(f => f.id === selectedFileId);
  const isLight = theme === "light";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    simulateUpload(selectedFiles[0].name, selectedFiles[0].size);
  };

  const simulateUpload = (name: string, rawSize: number) => {
    setIsUploadingSim(true);
    setSimFileName(name);
    setSimProgress(0);

    const sizeStr = (rawSize / (1024 * 1024)).toFixed(2) + " MB";
    const extension = name.split(".").pop() || "pdf";

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setSimProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onUploadFile(name, sizeStr, extension);
          setIsUploadingSim(false);
          setSimFileName("");
        }, 500);
      }
    }, 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload(e.dataTransfer.files[0].name, e.dataTransfer.files[0].size);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      
      {activeFile ? (
        /* Detailed File Audit View */
        <div className={`rounded-3xl border shadow-sm p-6 md:p-8 space-y-6 animate-fade-in transition-colors duration-300 ${
          isLight ? "bg-white border-slate-200 text-slate-800" : "bg-[#062D24] border border-[#103B30]/50 text-white"
        }`}>
          
          <div className={`flex items-center justify-between border-b pb-4 ${
            isLight ? "border-slate-100" : "border-[#103B30]/30"
          }`}>
            <button 
              onClick={() => setSelectedFileId(null)}
              className={`text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isLight ? "text-slate-500 hover:text-slate-800" : "text-slate-400 hover:text-white"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لقائمة الملفات</span>
            </button>
            <span className={`text-xs font-semibold ${isLight ? "text-slate-400" : "text-slate-500"}`}>مرفوع في: {activeFile.uploadedAt}</span>
          </div>

          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors duration-300 ${
            isLight ? "bg-slate-50 border-slate-150" : "bg-[#041C16] border border-[#103B30]/40"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                isLight ? "bg-slate-200 text-slate-700" : "bg-emerald-950/50 text-emerald-300 border border-emerald-900/30"
              }`}>
                {activeFile.type.toUpperCase()}
              </div>
              <div>
                <h3 className={`font-black text-lg ${isLight ? "text-slate-900" : "text-white"}`}>{activeFile.name}</h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-slate-550" : "text-slate-400"}`}>الحجم: {activeFile.size} • النوع: مستند رقمي معتمد</p>
              </div>
            </div>

            {/* Audit Score Badge */}
            {activeFile.analysisResult && (
              <div className={`px-4 py-2.5 rounded-xl border text-center transition-colors ${getScoreColor(activeFile.analysisResult.readinessScore)}`}>
                <div className="text-[10px] font-bold uppercase">درجة التدقيق والجاهزية</div>
                <div className="text-2xl font-black">{activeFile.analysisResult.readinessScore}%</div>
              </div>
            )}
          </div>

          {activeFile.analysisResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* Summary and issues (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                <div className="space-y-2 text-right">
                  <h4 className={`font-extrabold text-sm flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                    خلاصة تدقيق وجيه الذاتي:
                  </h4>
                  <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-350"}`}>{activeFile.analysisResult.summary}</p>
                </div>

                {/* Critical Issues */}
                <div className="space-y-3 text-right">
                  <h4 className={`font-extrabold text-sm flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                    <AlertCircle className="w-4.5 h-4.5 text-red-600" />
                    الثغرات والمخاطر المكتشفة ({activeFile.analysisResult.issuesFound.length}):
                  </h4>
                  <div className="space-y-2">
                    {activeFile.analysisResult.issuesFound.map((issue, idx) => (
                      <div key={idx} className="bg-red-50 border border-red-150 p-3.5 rounded-xl text-xs text-red-950 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                        <p className="leading-relaxed font-semibold">{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Suggestions sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className={`border rounded-2xl p-5 space-y-3.5 shadow-xs transition-colors duration-300 ${
                  isLight ? "bg-white border-slate-200" : "bg-[#041C16] border border-[#103B30]/35"
                }`}>
                  <h4 className={`font-extrabold text-xs border-b pb-2 ${isLight ? "text-slate-900 border-slate-100" : "text-emerald-450 border-[#103B30]/30"}`}>
                    توصيات وجيه للمعالجة الفورية:
                  </h4>
                  
                  <div className="space-y-3">
                    {activeFile.analysisResult.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className={`text-xs font-semibold leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-8 text-slate-450 text-xs">
              لم يكتمل فحص الملف بعد.
            </div>
          )}

        </div>
      ) : (
        /* Files Checklist and Uploader list */
        <div className="space-y-6">
          
          {/* Top description */}
          <div>
            <h3 className={`text-xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>مستشار فحص وتدقيق الملفات الذكي</h3>
            <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>قم برفع كشوفات الحساب، مسودات السياسات، أو الهويات الشخصية ليقوم وجيه بتدقيقها للتوافق.</p>
          </div>

          {/* Upload Dropzone */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 text-center space-y-4 transition cursor-pointer shadow-xs ${
              isLight 
                ? "bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/10" 
                : "bg-[#062D24] border-[#103B30]/50 hover:border-emerald-500 hover:bg-[#0A3229]"
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept=".pdf,.docx,.xlsx,.png,.jpg"
            />
            
            {isUploadingSim ? (
              <div className="space-y-4 animate-pulse">
                <RefreshCw className="w-10 h-10 text-emerald-650 animate-spin mx-auto" />
                <div className="space-y-1.5">
                  <p className={`text-sm font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>جاري فحص وتدقيق {simFileName}...</p>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>فحص الهياكل التنظيمية والتراخيص المحلية بنسبة {simProgress}%</p>
                </div>
                <div className={`w-48 h-1.5 rounded-full mx-auto overflow-hidden ${isLight ? "bg-slate-100" : "bg-[#020907]"}`}>
                  <div className="bg-emerald-600 h-1.5 rounded-full transition-all" style={{ width: `${simProgress}%` }}></div>
                </div>
              </div>
            ) : (
              <>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                  isLight ? "bg-emerald-50 text-emerald-700" : "bg-[#041C16] text-emerald-400"
                }`}>
                  <Upload className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className={`text-sm font-bold ${isLight ? "text-slate-800" : "text-slate-200"}`}>اسحب مستندك إلى هنا أو انقر للتصفح</p>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>يدعم صيغ PDF، Word، Excel، والصور (الحد الأقصى 10 ميجا)</p>
                </div>
                <div className={`inline-block border rounded-lg px-4 py-1.5 text-[10px] font-bold ${
                  isLight ? "bg-slate-50 border-slate-200 text-slate-600" : "bg-[#020907] border-[#103B30]/35 text-slate-400"
                }`}>
                  تشفير عالي وآمن ومحاكاة محلية متوافقة مع NCA
                </div>
              </>
            )}
          </div>

          {/* Uploaded Files Table list */}
          <div className={`border rounded-3xl overflow-hidden shadow-xs text-right transition-colors duration-300 ${
            isLight ? "bg-white border-slate-200" : "bg-[#062D24] border border-[#103B30]/50"
          }`}>
            <div className={`px-6 py-4 border-b ${isLight ? "bg-slate-50 border-slate-150" : "bg-[#041C16] border-[#103B30]/40"}`}>
              <h4 className={`font-extrabold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>الملفات المرفوعة والمفحوصة</h4>
            </div>

            {files.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-400">
                لا توجد مستندات مرفوعة حالياً. اسحب أي ملف للأعلى لتشغيل الفاحص الذكي.
              </div>
            ) : (
              <div className={`divide-y ${isLight ? "divide-slate-100" : "divide-[#103B30]/20"}`}>
                {files.map((file) => (
                  <div 
                    key={file.id}
                    className={`px-6 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-50/10`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isLight ? "bg-slate-100 text-slate-600" : "bg-[#041C16] text-slate-400 border border-[#103B30]/30"
                      }`}>
                        {file.type.toUpperCase()}
                      </div>
                      <div>
                        <h5 className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}>{file.name}</h5>
                        <p className={`text-xs mt-0.5 ${isLight ? "text-slate-400" : "text-slate-500"}`}>الحجم: {file.size} • تاريخ الرفع: {file.uploadedAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      {/* Status indicator */}
                      <span className={`flex items-center gap-1.5 text-xs font-semibold border px-2.5 py-1 rounded-full ${
                        isLight ? "bg-emerald-50 border-emerald-150 text-emerald-800" : "bg-[#041C16] border border-emerald-900/30 text-emerald-300"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>جاهز ومفحوص (درجة {file.analysisResult?.readinessScore || 70}%)</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedFileId(file.id)}
                          className={`p-2 rounded-lg transition cursor-pointer ${
                            isLight ? "text-slate-500 hover:text-emerald-700 hover:bg-slate-100" : "text-slate-400 hover:text-emerald-400 hover:bg-[#020907]"
                          }`}
                          title="عرض تفاصيل التدقيق"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm("هل أنت متأكد من رغبتك في حذف هذا الملف؟")) {
                              onDeleteFile(file.id);
                            }
                          }}
                          className={`p-2 rounded-lg transition cursor-pointer ${
                            isLight ? "text-slate-300 hover:text-red-600 hover:bg-slate-100" : "text-slate-500 hover:text-red-500 hover:bg-[#020907]"
                          }`}
                          title="حذف الملف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}


import React, { useState, useRef } from 'react';
import { FileText, Download, Printer, Upload, Palette } from 'lucide-react';
import { InspectionData, AppSettings, StyleVariant, InspectionItem } from './types';
import ReportTemplate from './components/ReportTemplate';
import { generateDocx } from './services/docxExport';
import { generatePdf } from './services/pdfExport';

const getMockData = (): InspectionData => {
  const items: InspectionItem[] = [
    { no: 1, title: "Carpet clean", titleArabic: "نظافة السجاد", maxScore: 3, givenScore: 3, observations: [{label: "Spots", checked: true}, {label: "Dusty", checked: false}, {label: "Smelly", checked: false}, {label: "Other", checked: false}] },
    { no: 2, title: "Floor & Stair and ceiling Clean", titleArabic: "نظافة الارضيات و الحوائط و السقف", maxScore: 8, givenScore: 8, observations: [{label: "Spots", checked: false}, {label: "Dusty", checked: true}, {label: "Other", checked: false}] },
    { no: 3, title: "Floor & Vinyl shining", titleArabic: "تلميع الارضيات الرخام/ الفينيل", maxScore: 6, givenScore: 4, observations: [{label: "Need Scrub", checked: true}, {label: "Polish Build", checked: false}, {label: "Need Wax", checked: false}, {label: "Other", checked: false}] },
    { no: 4, title: "Cleaning office furniture, tables and chairs", titleArabic: "نظافة اثاث المكاتب و المناضد و الكراسي", maxScore: 4, givenScore: 4, observations: [{label: "Clean", checked: true}, {label: "Dusty", checked: false}, {label: "Shine", checked: false}, {label: "Spots", checked: false}, {label: "Other", checked: false}] },
    { no: 5, title: "Chemicals use", titleArabic: "استعمال المواد الكيميائية بالطرق المعتمدة", maxScore: 10, givenScore: 7, observations: [{label: "List", checked: true}, {label: "Date", checked: true}, {label: "Enough", checked: false}, {label: "Dilution", checked: true}, {label: "No chemical label", checked: false}, {label: "Other", checked: false}] },
    { no: 6, title: "Bathroom & public toilet clean & checklist", titleArabic: "نظافة دورات المياه و الحمامات", maxScore: 7, givenScore: 5, observations: [{label: "Bad smell", checked: true}, {label: "Spots", checked: false}, {label: "Rust", checked: false}, {label: "Checklist not complete", checked: true}, {label: "Trash not collect", checked: false}, {label: "Other", checked: false}] },
    { no: 7, title: "Stainless steel shining", titleArabic: "تلميع الاستانلس ستيل", maxScore: 5, givenScore: 5, observations: [{label: "Rust", checked: false}, {label: "Not clean", checked: false}, {label: "Other", checked: false}] },
    { no: 8, title: "Normal Waste collect & Disposed", titleArabic: "جمع والتخلص من النفايات العادية", maxScore: 6, givenScore: 6, observations: [{label: "Over full", checked: false}, {label: "Mixed", checked: false}, {label: "Not collected", checked: false}, {label: "Trash pin Damage", checked: false}, {label: "Other", checked: false}] },
    { no: 9, title: "PPE", titleArabic: "الالتزام باستخدام معدات السلامة", maxScore: 6, givenScore: 6, observations: [{label: "Not approved", checked: false}, {label: "Not available", checked: false}, {label: "Damage", checked: false}, {label: "Wet floor signs", checked: true}, {label: "Other", checked: false}] },
    { no: 10, title: "Medical waste collect and transport", titleArabic: "جمع ونقل النفايات الطبية", maxScore: 10, givenScore: 10, observations: [{label: "Mixed", checked: false}, {label: "Tag", checked: false}, {label: "Tie", checked: false}, {label: "Over full", checked: false}, {label: "Thickness", checked: false}, {label: "Other", checked: false}] },
    { no: 11, title: "Infection control instruction follow", titleArabic: "التزام المقاول و عمالته بتوجيهات الطب الوقائي", maxScore: 9, givenScore: 9, observations: [{label: "Yes", checked: true}, {label: "NO", checked: false}, {label: "Other", checked: false}] },
    { no: 12, title: "Emergency respond time frame", titleArabic: "الاستجابة السريعة في حالة طارئة", maxScore: 7, givenScore: 7, observations: [{label: "Late", checked: false}, {label: "Not qualified", checked: false}, {label: "Not suitable supply", checked: false}, {label: "Other", checked: false}] },
    { no: 13, title: "Uniform & ID & personal hygiene", titleArabic: "حمل بطاقات التعريف و ارتداء الزي الرسمي", maxScore: 5, givenScore: 4, observations: [{label: "Not available", checked: true}, {label: "Damage", checked: false}, {label: "Not approved", checked: false}, {label: "Other", checked: false}] },
    { no: 14, title: "Cleaning of H.K container & Trolley & Equipment & Tools", titleArabic: "نظافة الحاويات و عربات نقل النفايات", maxScore: 7, givenScore: 7, observations: [{label: "Wheel Damage", checked: false}, {label: "Not clean", checked: false}, {label: "Not enough", checked: false}, {label: "Other", checked: false}] },
    { no: 15, title: "Chemical store & safety", titleArabic: "تخزين المواد الكيميائية المستخدمة", maxScore: 5, givenScore: 5, observations: [{label: "MSDS", checked: true}, {label: "Shelves standard", checked: true}, {label: "Temperature", checked: false}, {label: "Other", checked: false}] },
    { no: 16, title: "Adherence for Environment Service directive", titleArabic: "الالتزام بتوجيهات الادارة وحسن التعامل", maxScore: 4, givenScore: 4, observations: [{label: "Yes", checked: true}, {label: "No", checked: false}, {label: "Other", checked: false}] },
  ];

  const maxTotalScore = items.reduce((acc, item) => acc + item.maxScore, 0);
  const totalScore = items.reduce((acc, item) => acc + item.givenScore, 0);

  return {
    id: "HK-F002-A-2025-001",
    date: new Date().toISOString().split('T')[0],
    time: "09:45 AM",
    areaRoom: "MAIN LOBBY / ADMISSIONS",
    areaType: "Public",
    inspectorName: "MOHAMMAD AL-OSAIMI",
    supervisorReviewer: "ABDULLAH AL-ZAHRANI",
    approver: "H.K. MANAGER",
    items,
    unavailableTools: ["High Duster", "Microfiber Pads"],
    isSupervisorAvailable: true,
    totalScore,
    maxTotalScore
  };
};

const App: React.FC = () => {
  const [reportData, setReportData] = useState<InspectionData | null>(getMockData());
  const [settings, setSettings] = useState<AppSettings>({ style: 'Classic', includeSummary: true });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    setReportData(getMockData());
  };

  const themes: { id: StyleVariant; label: string; color: string }[] = [
    { id: 'Classic', label: 'Government Classic', color: 'bg-slate-800' },
    { id: 'Modern', label: 'Corporate Modern', color: 'bg-blue-600' },
    { id: 'Audit', label: 'Strict Compliance', color: 'bg-rose-600' },
    { id: 'Emerald', label: 'Clean Emerald', color: 'bg-emerald-600' },
    { id: 'Minimal', label: 'Pure Minimalist', color: 'bg-slate-200' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-slate-900 text-white p-6 overflow-y-auto no-print shadow-2xl z-10 flex flex-col h-full border-r border-slate-800">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20"><FileText size={24} /></div>
          <div><h1 className="font-bold text-xl leading-tight">AuditPro</h1><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium A4 Engine</p></div>
        </div>
        
        <section className="mb-8">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Source Data</h2>
          <button onClick={() => fileInputRef.current?.click()} className="w-full group border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 transition-all bg-slate-800/20 hover:bg-slate-800/40">
            <Upload className="mx-auto text-slate-600 mb-3 group-hover:text-blue-400 group-hover:scale-110 transition-transform" size={32} />
            <p className="text-sm font-bold text-slate-300">Import Excel/CSV</p>
            <p className="text-[10px] text-slate-500 mt-1">Automatic Template Mapping</p>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv,.xlsx" />
          </button>
        </section>

        <section className="mb-8 flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={14} className="text-blue-400" />
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Report Themes</h2>
          </div>
          <div className="space-y-3">
            {themes.map((t) => (
              <button 
                key={t.id} 
                onClick={() => setSettings({...settings, style: t.id})} 
                className={`w-full group relative overflow-hidden py-3 px-4 text-xs font-bold border rounded-xl text-left transition-all flex items-center gap-3 ${settings.style === t.id ? 'bg-white text-slate-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <div className={`w-3 h-3 rounded-full ${t.color} border border-white/20`}></div>
                <span className="flex-1">{t.label}</span>
                {settings.style === t.id && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-auto pt-6 border-t border-slate-800 space-y-3">
          <button onClick={generatePdf} className="w-full group flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all">
            <Printer size={20} className="group-hover:rotate-12 transition-transform" /> 
            <span>GENERATE PDF (A4)</span>
          </button>
          <button onClick={() => reportData && generateDocx(reportData, settings.style)} className="w-full flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-slate-300 py-3.5 rounded-xl font-bold hover:bg-slate-700 transition-all text-sm">
            <Download size={18} /> 
            <span>EXPORT WORD (.docx)</span>
          </button>
        </section>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-slate-950 overflow-y-auto p-4 md:p-12 flex justify-center no-scrollbar relative">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {reportData && (
          <div className="print-area relative shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all duration-700 origin-top scale-[0.45] sm:scale-75 md:scale-90 lg:scale-[0.85] xl:scale-[0.95] mb-20 hover:scale-[1.0] cursor-zoom-in">
            <ReportTemplate data={reportData} variant={settings.style} showSummary={settings.includeSummary} />
            
            {/* Tooltip for user convenience */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest no-print opacity-0 group-hover:opacity-100 transition-opacity">
              WYSIWYG Print Preview
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;


import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, Printer, Palette, Table as TableIcon, LayoutGrid, Check, Image as ImageIcon, X } from 'lucide-react';
import { InspectionData, AppSettings, StyleVariant, InspectionItem, AreaType } from './types';
import ReportTemplate from './components/ReportTemplate';
import { generateDocx } from './services/docxExport';
import { generateExcel } from './services/excelExport';

const getInitialDataForArea = (type: AreaType): InspectionData => {
  let items: InspectionItem[] = [];
  let formNumber = "";
  
  if (type === 'Mid Risk Area') {
    formNumber = "HK-F002-C";
    items = [
      { no: 1, title: "Carpet clean", titleArabic: "نظافة السجاد", maxScore: 3, lowScoreMarker: 1, givenScore: 0, observations: [{label: "Spots", checked: false}, {label: "Dusty", checked: false}, {label: "Smelly", checked: false}, {label: "Other", checked: false}] },
      { no: 2, title: "Floor & Stair and ceiling Clean", titleArabic: "نظافة الارضيات و البلاط و السلالم والاسقف", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Spots", checked: false}, {label: "Dusty", checked: false}, {label: "Other", checked: false}] },
      { no: 3, title: "Floor & Vinyl shining", titleArabic: "تلميع الارضيات الرخام / الفينيل", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Need Scrub", checked: false}, {label: "Polish Build", checked: false}, {label: "Need Wax", checked: false}, {label: "Other", checked: false}] },
      { no: 4, title: "Cleaning office furniture, tables and chairs", titleArabic: "نظافة اثاث المكاتب و المناضد و الكراسي", maxScore: 4, lowScoreMarker: 1, givenScore: 0, observations: [{label: "Clean", checked: false}, {label: "Dusty", checked: false}, {label: "Shine", checked: false}, {label: "Spots", checked: false}, {label: "Other", checked: false}] },
      { no: 5, title: "Chemicals use", titleArabic: "استعمال المواد الكيميائية بالطرق المعتمدة", maxScore: 10, lowScoreMarker: 3, givenScore: 0, observations: [{label: "List", checked: false}, {label: "Date", checked: false}, {label: "Enough", checked: false}, {label: "Dilution", checked: false}, {label: "No chemical label", checked: false}, {label: "Other", checked: false}] },
      { no: 6, title: "Bathroom & public toilet clean & checklist", titleArabic: "الالتزام بنظافة الحمامات ودورات المياه وتعبئة checklist", maxScore: 7, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Bad smell", checked: false}, {label: "Spots", checked: false}, {label: "Rust", checked: false}, {label: "Checklist not complete", checked: false}, {label: "Trash not collect", checked: false}, {label: "Other", checked: false}] },
      { no: 7, title: "Stainless steel shining", titleArabic: "تلميع الاستانلس ستيل", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Rust", checked: false}, {label: "Not clean", checked: false}, {label: "Other", checked: false}] },
      { no: 8, title: "Normal Waste collect & Disposed", titleArabic: "جمع والتخلص من النفايات العادية", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Over full", checked: false}, {label: "Mixed", checked: false}, {label: "Not collected", checked: false}, {label: "Trash pin Damage", checked: false}, {label: "Other", checked: false}] },
      { no: 9, title: "PPE", titleArabic: "الالتزام باستخدام معدات السلامة و الوقاية الشخصية", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Not approved", checked: false}, {label: "Not available", checked: false}, {label: "Damage", checked: false}, {label: "Wet floor signs", checked: false}, {label: "Other", checked: false}] },
      { no: 10, title: "Medical waste collect and transport", titleArabic: "جمع ونقل المخلفات الطبية مع الالتزام بتوجيهات جهة الاشراف", maxScore: 10, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Mixed", checked: false}, {label: "Tag", checked: false}, {label: "Tie", checked: false}, {label: "Over full", checked: false}, {label: "Thickness", checked: false}, {label: "Other", checked: false}] },
      { no: 11, title: "Infection control instruction follow", titleArabic: "التزام المقاول وعمالته بتوجيهات ادارة الطب الوقائي ومكافحة العدوى", maxScore: 9, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Yes", checked: false}, {label: "NO", checked: false}, {label: "Other", checked: false}] },
      { no: 12, title: "Emergency respond time frame", titleArabic: "الاستجابة السريعة لاي حالة طارئة", maxScore: 7, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Late", checked: false}, {label: "Not qualified", checked: false}, {label: "Not suitable supply", checked: false}, {label: "Other", checked: false}] },
      { no: 13, title: "Uniform & ID & personal hygiene", titleArabic: "حمل بطاقات التعريف و ارتداء الزي الرسمي المعتمد والالتزام بالنظافة الشخصية", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Not available", checked: false}, {label: "Damage", checked: false}, {label: "Not approved", checked: false}, {label: "Other", checked: false}] },
      { no: 14, title: "Cleaning of H.K container & Trolley & Equipment & Tools", titleArabic: "نظافة الحاويات وعربات نقل النفايات ومعدات و أجهزة النظافة", maxScore: 7, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Wheel Damage", checked: false}, {label: "Not clean", checked: false}, {label: "Not enough", checked: false}, {label: "Other", checked: false}] },
      { no: 15, title: "Chemical store & safety", titleArabic: "تخزين المواد الكيميائية المستخدمة في النظافة", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "MSDS", checked: false}, {label: "Shelves standard", checked: false}, {label: "Temperature", checked: false}, {label: "Other", checked: false}] },
      { no: 16, title: "Adherence for Environment Service directive", titleArabic: "الالتزام بالتوجيهات الادارية وعدم التأخر بتسليم المعاملات", maxScore: 4, lowScoreMarker: 1, givenScore: 0, observations: [{label: "Yes", checked: false}, {label: "No", checked: false}, {label: "Other", checked: false}] },
    ];
  } else if (type === 'High Risk Area') {
    formNumber = "HK-F002-B";
    items = [
      { no: 1, title: "Floor & Stair and ceiling Clean", titleArabic: "نظافة الارضيات و البلاط و السلالم و الأسقف", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Spots", checked: false}, {label: "Dusty", checked: false}, {label: "Other", checked: false}] },
      { no: 2, title: "Floor & Vinyl shining", titleArabic: "تلميع الارضيات الرخام / الفينيل", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Need scrub", checked: false}, {label: "Polish build", checked: false}, {label: "Need Wax", checked: false}, {label: "Other", checked: false}] },
      { no: 3, title: "Chemicals use", titleArabic: "استعمال المواد الكيميائية بالطرق المعتمدة", maxScore: 12, lowScoreMarker: 4, givenScore: 0, observations: [{label: "List", checked: false}, {label: "Date", checked: false}, {label: "Enough", checked: false}, {label: "Dilution", checked: false}, {label: "No chemical label", checked: false}, {label: "Other", checked: false}] },
      { no: 4, title: "Area clean & hygiene according the requirement", titleArabic: "نظافة المناطق الحرجة حسب المواصفات", maxScore: 12, lowScoreMarker: 4, givenScore: 0, observations: [{label: "Spical disinfected", checked: false}, {label: "Disposable", checked: false}, {label: "Checklist", checked: false}, {label: "High training staff", checked: false}, {label: "Other", checked: false}] },
      { no: 5, title: "Bathroom & public toilet clean & checklist", titleArabic: "الالتزام بنظافة الحمامات ودورات المياه وتعبئة checklist", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Bad smell", checked: false}, {label: "Spots", checked: false}, {label: "Rust", checked: false}, {label: "Checklist not complete", checked: false}, {label: "Trash not collect", checked: false}, {label: "Other", checked: false}] },
      { no: 6, title: "Stainless steel shining", titleArabic: "تلميع الإستانلس ستيل", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Rust", checked: false}, {label: "Not clean", checked: false}, {label: "Other", checked: false}] },
      { no: 7, title: "Normal Waste collect & Disposed", titleArabic: "جمع والتخلص من النفايات العادية", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Over full", checked: false}, {label: "Mixed", checked: false}, {label: "Not collected", checked: false}, {label: "Trash pin Damage", checked: false}, {label: "Other", checked: false}] },
      { no: 8, title: "PPE", titleArabic: "الالتزام باستخدام معدات السلامة و الوقاية الشخصية", maxScore: 7, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Not approved", checked: false}, {label: "Not available", checked: false}, {label: "Damage", checked: false}, {label: "Wet floor signs", checked: false}, {label: "Other", checked: false}] },
      { no: 9, title: "Medical waste collect and transport", titleArabic: "جمع ونقل المخلفات الطبية مع الالتزام بتوجيهات جهة الاشراف", maxScore: 10, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Mixed", checked: false}, {label: "Tag", checked: false}, {label: "Tie", checked: false}, {label: "Over full", checked: false}, {label: "Thickness", checked: false}, {label: "Other", checked: false}] },
      { no: 10, title: "Infection control instruction follow", titleArabic: "التزام المقاول وعمالته بتوجيهات ادارة الطب الوقائي ومكافحة العدوى", maxScore: 7, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Yes", checked: false}, {label: "NO", checked: false}, {label: "Other", checked: false}] },
      { no: 11, title: "Emergency respond time frame", titleArabic: "الاستجابة السريعة لأي حالة طارئة", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Late", checked: false}, {label: "Not qualified", checked: false}, {label: "Not suitable supply", checked: false}, {label: "Other", checked: false}] },
      { no: 12, title: "Uniform & ID & personal hygiene", titleArabic: "حمل بطاقات التعريف و ارتداء الزي الرسمي المعتمد", maxScore: 4, lowScoreMarker: 1, givenScore: 0, observations: [{label: "Not available", checked: false}, {label: "Damage", checked: false}, {label: "Not approved", checked: false}, {label: "Other", checked: false}] },
      { no: 13, title: "Cleaning of H.K container & Trolley & Equipment & Tools", titleArabic: "نظافة الحاويات وعربات نقل النفايات ومعدات و أجهزة النظافة", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Wheel Damage", checked: false}, {label: "Not clean", checked: false}, {label: "Not enough", checked: false}, {label: "Other", checked: false}] },
      { no: 14, title: "Chemical store & safety", titleArabic: "تخزين المواد الكيميائية المستخدمة في النظافة", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "MSDS", checked: false}, {label: "Shelves standard", checked: false}, {label: "Other", checked: false}] },
      { no: 15, title: "Adherence for Environment Service directive", titleArabic: "الالتزام بالتوجيهات الادارية وعدم التأخر بتسليم المعاملات", maxScore: 4, lowScoreMarker: 1, givenScore: 0, observations: [{label: "Yes", checked: false}, {label: "No", checked: false}, {label: "Other", checked: false}] },
    ];
  } else {
    formNumber = "HK-F002-A";
    items = [
      { no: 1, title: "Carpet clean", titleArabic: "نظافة السجاد", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Spots", checked: false}, {label: "Smelly", checked: false}, {label: "Dusty", checked: false}, {label: "Other", checked: false}] },
      { no: 2, title: "Floor & Stair and ceiling Clean", titleArabic: "نظافة الارضيات و البلاط و السلالم والاسقف", maxScore: 10, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Spots", checked: false}, {label: "Other", checked: false}, {label: "Dusty", checked: false}] },
      { no: 3, title: "Floor & Vinyl shining", titleArabic: "تلميع الارضيات الرخام / الفينيل", maxScore: 8, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Need Scrub", checked: false}, {label: "Need Wax", checked: false}, {label: "Polish Build", checked: false}, {label: "Other", checked: false}] },
      { no: 4, title: "Cleaning office furniture, tables and chairs", titleArabic: "نظافة اثاث المكاتب و المناضد و الكراسي", maxScore: 4, lowScoreMarker: 1, givenScore: 0, observations: [{label: "Clean", checked: false}, {label: "Shine", checked: false}, {label: "Other", checked: false}, {label: "Dusty", checked: false}, {label: "Spots", checked: false}] },
      { no: 5, title: "Chemicals use", titleArabic: "استعمال المواد الكيميائية بالطرق المعتمدة", maxScore: 10, lowScoreMarker: 3, givenScore: 0, observations: [{label: "List", checked: false}, {label: "Enough", checked: false}, {label: "No chemical label", checked: false}, {label: "Date", checked: false}, {label: "Dilution", checked: false}, {label: "Other", checked: false}] },
      { no: 6, title: "Bathroom & public toilet clean & checklist", titleArabic: "الالتزام بنظافة الحمامات ودورات المياه وتعبئة checklist", maxScore: 7, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Bad smell", checked: false}, {label: "Rust", checked: false}, {label: "Trash not collect", checked: false}, {label: "Spots", checked: false}, {label: "Checklist not complete", checked: false}, {label: "Other", checked: false}] },
      { no: 7, title: "Stainless steel shining", titleArabic: "تلميع الإستانلس ستيل", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Rust", checked: false}, {label: "Other", checked: false}, {label: "Not clean", checked: false}] },
      { no: 8, title: "Normal Waste collect & Disposed", titleArabic: "جمع والتخلص من النفايات العادية", maxScore: 7, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Over full", checked: false}, {label: "Not collected", checked: false}, {label: "Other", checked: false}, {label: "Mixed", checked: false}, {label: "Trash pin Damage", checked: false}] },
      { no: 9, title: "PPE", titleArabic: "الالتزام باستخدام معدات السلامة و الوقاية الشخصية", maxScore: 7, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Not approved", checked: false}, {label: "Damage", checked: false}, {label: "Other", checked: false}, {label: "Not available", checked: false}, {label: "Wet floor signs", checked: false}] },
      { no: 10, title: "Infection Control Instruction Follow", titleArabic: "الالتزام بتوجيهات ادارة الطب الوقائي ومكافحة العدوى", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Yes", checked: false}, {label: "Other", checked: false}, {label: "No", checked: false}] },
      { no: 11, title: "Emergency Respond Time Frame", titleArabic: "الاستجابة السريعة لأي حالة طارئة", maxScore: 6, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Late", checked: false}, {label: "Not suitable supply", checked: false}, {label: "Other", checked: false}, {label: "Not qualified", checked: false}] },
      { no: 12, title: "Uniform & ID & personal hygiene", titleArabic: "حمل بطاقات التعريف و ارتداء الزي الرسمي المعتمد", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "Not available", checked: false}, {label: "Not approved", checked: false}, {label: "Other", checked: false}, {label: "Damage", checked: false}] },
      { no: 13, title: "Cleaning of H.K container & Trolley & Equipment & Tools", titleArabic: "نظافة الحاويات وعربات نقل النفايات ومعدات و أجهزة النظافة", maxScore: 10, lowScoreMarker: 3, givenScore: 0, observations: [{label: "Wheel damage", checked: false}, {label: "Not enough", checked: false}, {label: "Other", checked: false}, {label: "Not clean", checked: false}] },
      { no: 14, title: "Chemical store & safety", titleArabic: "تخزين المواد الكيميائية المستخدمة في النظافة", maxScore: 5, lowScoreMarker: 2, givenScore: 0, observations: [{label: "MSDS", checked: false}, {label: "Other", checked: false}, {label: "Shelves standard", checked: false}] },
      { no: 15, title: "Adherence Environment Service directive", titleArabic: "الالتزام بالتوجيهات الادارية وعدم التأخر بتسليم المعاملات", maxScore: 4, lowScoreMarker: 1, givenScore: 0, observations: [{label: "Yes (2)", checked: false}, {label: "Other", checked: false}, {label: "No (0)", checked: false}] },
    ];
  }

  const maxTotalScore = items.reduce((acc, item) => acc + item.maxScore, 0);

  return {
    id: `${formNumber}-2026-01-10`,
    formNumber,
    date: "2026-01-10",
    time: "---",
    areaRoom: "---",
    areaType: type,
    inspectorName: "---",
    supervisorName: "---",
    items,
    comments: "...",
    missingTools: [],
    isToolAvailable: true,
    totalScore: 0,
    maxTotalScore
  };
};

const App: React.FC = () => {
  const [reportData, setReportData] = useState<InspectionData>(getInitialDataForArea('Public Area'));
  const [settings, setSettings] = useState<AppSettings>({ style: 'Classic', includeSummary: true });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleAreaChange = (type: AreaType) => {
    setReportData(getInitialDataForArea(type));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const areaTypes: AreaType[] = ['Public Area', 'High Risk Area', 'Mid Risk Area'];
  const styleVariants: {id: StyleVariant, color: string, name: string}[] = [
    { id: 'Classic', color: 'bg-[#1a4a44]', name: 'زيتي كلاسيك' },
    { id: 'Executive', color: 'bg-[#1e3a8a]', name: 'أزرق تنفيذي' },
    { id: 'Slate', color: 'bg-[#334155]', name: 'رمادي إداري' },
    { id: 'Sand', color: 'bg-[#78350f]', name: 'بيج ملكي' },
    { id: 'Minimal', color: 'bg-[#000000]', name: 'أبيض وأسود' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-slate-900 text-white p-6 overflow-y-auto no-print shadow-2xl z-10 flex flex-col h-full border-r border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-teal-600 rounded-lg shadow-lg shadow-teal-500/20"><FileText size={24} /></div>
          <div><h1 className="font-bold text-xl leading-tight text-teal-400">AuditPro</h1><p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium Templates</p></div>
        </div>
        
        {/* Branding Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon size={14} className="text-teal-400" />
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Branding & Logo</h2>
          </div>
          <div className="relative group">
            {logoUrl ? (
              <div className="relative w-full h-24 bg-slate-800 rounded-xl border border-slate-700 p-2 flex items-center justify-center overflow-hidden">
                <img src={logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                <button 
                  onClick={() => setLogoUrl(null)}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => logoInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-slate-700 bg-slate-800/30 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-800/50 hover:border-teal-500/50 transition-all text-slate-500 hover:text-teal-400 group"
              >
                <ImageIcon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase">Click to Upload Logo</span>
              </button>
            )}
            <input 
              ref={logoInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleLogoUpload} 
            />
          </div>
        </section>

        {/* Risk Category Selection */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid size={14} className="text-teal-400" />
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Category</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {areaTypes.map((type) => (
              <button 
                key={type}
                onClick={() => handleAreaChange(type)}
                className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl text-right transition-all border ${reportData.areaType === type ? 'bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-900/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Style Selection */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={14} className="text-teal-400" />
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Report Theme</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {styleVariants.map((v) => (
              <button 
                key={v.id}
                onClick={() => setSettings({...settings, style: v.id})}
                className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all ${settings.style === v.id ? 'border-teal-500 bg-slate-800/50' : 'border-slate-800 bg-transparent hover:bg-slate-800/30'}`}
              >
                <div className={`w-8 h-8 rounded-lg ${v.color} flex items-center justify-center shadow-inner`}>
                   {settings.style === v.id && <Check size={16} className="text-white" />}
                </div>
                <span className={`text-[11px] font-bold ${settings.style === v.id ? 'text-teal-400' : 'text-slate-400'}`}>{v.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-auto pt-6 border-t border-slate-800 space-y-2">
          <button onClick={() => window.print()} className="w-full group flex items-center justify-center gap-3 bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-500 shadow-xl shadow-teal-900/20 active:scale-[0.98] transition-all">
            <Printer size={20} className="group-hover:rotate-12 transition-transform" /> 
            <span>PRINT TO A4 PDF</span>
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => reportData && generateDocx(reportData, settings.style)} className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 transition-all text-[11px]">
              <Download size={16} /> 
              <span>WORD</span>
            </button>
            <button onClick={() => reportData && generateExcel(reportData, settings.style)} className="flex items-center justify-center gap-2 bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all text-[11px] shadow-lg shadow-green-900/10">
              <TableIcon size={16} /> 
              <span>EXCEL</span>
            </button>
          </div>
        </section>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-slate-950 overflow-y-auto p-4 md:p-12 flex justify-center no-scrollbar relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="print-area relative shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all duration-700 origin-top scale-[0.45] sm:scale-75 md:scale-90 lg:scale-[0.85] xl:scale-[0.95] mb-20">
          <ReportTemplate data={reportData} variant={settings.style} showSummary={settings.includeSummary} logoUrl={logoUrl} />
        </div>
      </div>
    </div>
  );
};

export default App;

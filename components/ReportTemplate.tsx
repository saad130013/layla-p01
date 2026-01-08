
import React from 'react';
import { FileText, Shield, CheckCircle, ClipboardList } from 'lucide-react';
import { InspectionData, StyleVariant, InspectionItem } from '../types';

interface Props {
  data: InspectionData;
  variant: StyleVariant;
  showSummary: boolean;
}

const ReportTemplate: React.FC<Props> = ({ data, variant, showSummary }) => {
  const getTheme = () => {
    switch (variant) {
      case 'Modern': 
        return { 
          accent: 'text-blue-600', 
          border: 'border-slate-300', 
          headerBg: 'bg-blue-50', 
          font: 'font-sans',
          scoreColor: 'text-blue-700',
          tableHeader: 'bg-blue-600 text-white'
        };
      case 'Audit': 
        return { 
          accent: 'text-rose-600', 
          border: 'border-slate-400', 
          headerBg: 'bg-rose-50', 
          font: 'font-sans',
          scoreColor: 'text-rose-700',
          tableHeader: 'bg-slate-800 text-white'
        };
      case 'Emerald': 
        return { 
          accent: 'text-emerald-600', 
          border: 'border-emerald-200', 
          headerBg: 'bg-emerald-50', 
          font: 'font-sans',
          scoreColor: 'text-emerald-700',
          tableHeader: 'bg-emerald-700 text-white'
        };
      case 'Minimal': 
        return { 
          accent: 'text-slate-900', 
          border: 'border-slate-200', 
          headerBg: 'bg-slate-50', 
          font: 'font-sans',
          scoreColor: 'text-slate-900',
          tableHeader: 'bg-slate-100 text-slate-900'
        };
      default: // Classic
        return { 
          accent: 'text-slate-800', 
          border: 'border-slate-800', 
          headerBg: 'bg-slate-100', 
          font: 'font-serif',
          scoreColor: 'text-slate-900',
          tableHeader: 'bg-slate-100 text-slate-900'
        };
    }
  };

  const theme = getTheme();

  const renderItemBox = (item: InspectionItem) => (
    <div key={item.no} className={`border ${theme.border} p-1 text-[7.5pt] flex flex-col h-full bg-white relative avoid-break`}>
      <div className={`font-bold border-b mb-1 pb-0.5 text-center ${theme.headerBg} uppercase truncate`}>
        {item.no}- {item.title}
      </div>
      
      <div className="grid grid-cols-5 gap-0.5 text-[6.5pt] mb-1 font-mono text-slate-500">
        <span>M:{item.maxScore}</span>
        <span>E:{item.maxScore}</span>
        <span>G:{Math.floor(item.maxScore * 0.7)}</span>
        <span>L:{Math.floor(item.maxScore * 0.4)}</span>
        <span>B:0</span>
      </div>

      <div className="flex flex-wrap gap-x-2 gap-y-0.5 flex-1 content-start leading-tight">
        {item.observations.map((obs, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 border ${theme.border} flex items-center justify-center text-[6pt] font-bold`}>
              {obs.checked ? '✓' : ''}
            </div>
            <span className="capitalize text-slate-600 scale-[0.9] origin-left">{obs.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-1 pt-1 border-t flex items-center gap-1">
        <span className="font-bold text-[6.5pt] opacity-70">SCORE:</span>
        <div className="flex-1 relative">
           <div className={`border-b-2 ${theme.border} w-full h-1 mt-2 border-dotted`}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`a4-container ${theme.font} text-[10pt] leading-tight select-none`}>
      {/* Dynamic Header based on Theme */}
      <div className={`flex justify-between items-start mb-3 border-b-2 ${theme.border} pb-2`}>
        <div className="w-1/3 text-[8pt] space-y-0.5">
          <p className="font-bold uppercase tracking-tight">Support Services Division</p>
          <p className="text-slate-600">Environmental Services Dept.</p>
          <p className="text-[7pt] font-mono">ID: {data.id}</p>
        </div>
        
        <div className="w-1/3 flex flex-col items-center">
          <div className="w-12 h-12 mb-1 flex items-center justify-center">
             {variant === 'Classic' ? (
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Seal_of_the_Saudi_Arabian_National_Guard.svg" className="w-full opacity-90" alt="Logo" />
             ) : variant === 'Audit' ? (
                <Shield className="text-rose-600" size={40} />
             ) : variant === 'Emerald' ? (
                <CheckCircle className="text-emerald-600" size={40} />
             ) : (
                <ClipboardList className="text-blue-600" size={40} />
             )}
          </div>
          <p className={`font-black text-[10pt] uppercase text-center ${theme.accent}`}>
            Inspection Audit Report
            <br />
            <span className="text-[7pt] font-medium text-slate-500">({data.areaType} Area Classification)</span>
          </p>
        </div>

        <div className="w-1/3 text-right text-[7.5pt] leading-relaxed" dir="rtl">
          <p className="font-bold">المملكة العربية السعودية - الحرس الوطني</p>
          <p>الشؤون الصحية - مدينة الملك عبدالعزيز الطبية</p>
          <p className="text-slate-500">جدة - إدارة خدمات البيئة</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className={`grid grid-cols-2 border ${theme.border} mb-3 text-[8.5pt] bg-white`}>
        <div className={`p-2 border-r ${theme.border} space-y-2`}>
          <div className="flex items-center gap-2">
             <span className="font-bold w-12 text-slate-500">DATE:</span> 
             <span className="border-b border-slate-200 flex-1 font-mono">{data.date}</span>
             <span className="font-bold w-12 text-slate-500 ml-2">TIME:</span> 
             <span className="border-b border-slate-200 flex-1 font-mono">{data.time}</span>
          </div>
          <div className="flex items-center">
             <span className="font-bold w-12 text-slate-500">AREA:</span> 
             <span className="border-b border-slate-200 flex-1 font-bold text-blue-800">{data.areaRoom}</span>
          </div>
        </div>
        <div className="p-2 space-y-2">
           <div className="flex items-center">
             <span className="font-bold w-24 text-slate-500">SUPERVISOR:</span> 
             <span className="border-b border-slate-200 flex-1 italic">{data.supervisorReviewer}</span>
           </div>
           <div className="flex items-center">
             <span className="font-bold w-24 text-slate-500">APPROVED BY:</span> 
             <span className="border-b border-slate-200 flex-1 italic text-[7pt]">{data.approver}</span>
           </div>
        </div>
      </div>

      {/* Inspector Details */}
      <div className={`border ${theme.border} mb-3 p-2 text-[8.5pt] bg-slate-50/50`}>
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-500">PRIMARY INSPECTOR:</span>
          <span className="border-b border-slate-300 flex-1 font-bold">{data.inspectorName}</span>
          <span className="font-bold text-slate-500">SIGNATURE:</span>
          <span className="border-b border-slate-300 w-40 h-5"></span>
        </div>
      </div>

      {/* The 16 Main Audit Items */}
      <div className={`grid grid-cols-3 border-t border-l ${theme.border} mb-3 shadow-sm`}>
        {data.items.slice(0, 15).map(renderItemBox)}
        {renderItemBox(data.items[15])}
        <div className={`border ${theme.border} bg-slate-50 flex items-center justify-center opacity-10`}><FileText size={48}/></div>
        <div className={`border ${theme.border} bg-slate-50 flex items-center justify-center opacity-10`}><FileText size={48}/></div>
      </div>

      {/* Supplemental Info */}
      <div className={`grid grid-cols-3 border ${theme.border} mb-3 min-h-[100px] text-[7.5pt]`}>
        <div className={`p-1.5 border-r ${theme.border}`}>
           <p className={`font-bold border-b mb-1 text-center ${theme.headerBg} py-0.5 text-[7pt]`}>INSPECTOR NOTES</p>
           <div className="p-1 text-[7pt] italic text-slate-600">
             {data.items.find(i => i.inspectorComment)?.inspectorComment || "No additional remarks recorded during this visit."}
           </div>
        </div>
        <div className={`p-1.5 border-r ${theme.border}`}>
           <p className={`font-bold border-b mb-1 text-center ${theme.headerBg} py-0.5 text-[7pt]`}>RESOURCES GAP ANALYSIS</p>
           <div className="grid grid-cols-1 gap-1 px-1">
             {[1, 2, 3, 4, 5].map(num => (
               <div key={num} className="border-b border-slate-100 flex items-center py-0.5">
                 <span className="mr-1 font-bold text-slate-400">{num}.</span>
                 <span className="text-blue-900 font-medium">{data.unavailableTools[num-1] || ""}</span>
               </div>
             ))}
           </div>
        </div>
        <div className="p-1.5 bg-slate-50/30">
           <p className={`font-bold border-b mb-1 text-center ${theme.headerBg} py-0.5 text-[7pt]`}>SUPERVISOR STATUS</p>
           <div className="p-1 space-y-2 mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 border ${theme.border} flex items-center justify-center font-bold bg-white`}>{data.isSupervisorAvailable ? '✓' : ''}</div>
                  <span className="font-medium">On-Site</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 border ${theme.border} flex items-center justify-center font-bold bg-white`}>{!data.isSupervisorAvailable ? '✓' : ''}</div>
                  <span className="font-medium text-slate-400">Absent</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-bold text-[6.5pt] text-slate-500">AUTHORIZED NAME:</span>
                <span className={`border-b-2 ${theme.border} block ${theme.scoreColor} font-bold mt-1 text-[9pt]`}>
                  {data.supervisorReviewer}
                </span>
              </div>
           </div>
        </div>
      </div>

      {/* Bilingual Compliance Grid */}
      <div className={`border ${theme.border} overflow-hidden shadow-sm`}>
        <table className="w-full text-[7.5pt] border-collapse" dir="rtl">
          <thead className={theme.tableHeader}>
            <tr className={`border-b ${theme.border}`}>
              <th className={`border-l ${theme.border} p-1.5 w-16 text-center`}>الدرجة</th>
              <th className={`border-l ${theme.border} p-1.5 w-10 text-center`}>#</th>
              <th className={`border-l ${theme.border} p-1.5 text-right pr-3 font-bold`}>بند الفحص الإداري</th>
              <th className={`border-l ${theme.border} p-1.5 w-16 text-center`}>الدرجة</th>
              <th className={`border-l ${theme.border} p-1.5 w-10 text-center`}>#</th>
              <th className={`p-1.5 text-right pr-3 font-bold`}>بند الفحص الإداري</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => {
              const itemLeft = data.items[i + 8];
              const itemRight = data.items[i];
              return (
                <tr key={i} className={`border-b ${theme.border} last:border-0 hover:bg-slate-50 transition-colors`}>
                  <td className={`border-l ${theme.border} text-center font-bold bg-slate-50/50 w-20`}> / ({itemLeft?.maxScore})</td>
                  <td className={`border-l ${theme.border} text-center font-mono text-slate-400`}>{i + 9}</td>
                  <td className={`border-l ${theme.border} text-right pr-3 text-slate-800 font-medium py-1.5`}>{itemLeft?.titleArabic}</td>
                  <td className={`border-l ${theme.border} text-center font-bold bg-slate-50/50 w-20`}> / ({itemRight?.maxScore})</td>
                  <td className={`border-l ${theme.border} text-center font-mono text-slate-400`}>{i + 1}</td>
                  <td className={`text-right pr-3 text-slate-800 font-medium py-1.5`}>{itemRight?.titleArabic}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Compliance Bar (Visual Decoration) */}
      <div className="mt-4 flex items-center gap-3 avoid-break">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div className={`h-full ${theme.accent.replace('text-', 'bg-')} opacity-40`} style={{width: '75%'}}></div>
        </div>
        <div className={`px-3 py-1 border-2 ${theme.border} rounded font-black text-[9pt] ${theme.scoreColor} uppercase italic tracking-widest`}>
          Quality Compliance Score: ____ %
        </div>
      </div>

      {/* Footer Meta */}
      <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between text-[6.5pt] text-slate-400 font-mono italic">
        <div className="flex gap-4">
          <span>RUN_ID: {data.id}</span>
          <span>STAMP: {new Date().toISOString()}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="font-bold text-slate-900 border px-1 rounded uppercase">Standard: HK-F002-A</span>
          <span className="font-bold text-slate-900">SHEET 1 / 1</span>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplate;

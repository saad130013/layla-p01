
import React from 'react';
import { InspectionData, StyleVariant, InspectionItem } from '../types';

interface Props {
  data: InspectionData;
  variant: StyleVariant;
  showSummary: boolean;
  logoUrl?: string | null;
}

const ReportTemplate: React.FC<Props> = ({ data, variant, logoUrl }) => {
  // تعريف الألوان بناءً على الاستايل
  const themes = {
    Classic: { primary: '#1a4a44', secondary: '#f0fdfa', text: '#1a4a44', border: '#1a4a44' },
    Executive: { primary: '#1e3a8a', secondary: '#eff6ff', text: '#1e3a8a', border: '#1e3a8a' },
    Slate: { primary: '#334155', secondary: '#f8fafc', text: '#334155', border: '#334155' },
    Sand: { primary: '#78350f', secondary: '#fffbeb', text: '#78350f', border: '#78350f' },
    Minimal: { primary: '#000000', secondary: '#ffffff', text: '#000000', border: '#000000' }
  };

  const theme = themes[variant] || themes.Classic;

  const renderItemBox = (item: InspectionItem) => (
    <div key={item.no} className="border-r border-b p-1.5 text-[6.5pt] flex flex-col h-full bg-white relative avoid-break" style={{ borderColor: theme.border }}>
      <div className="font-bold border-b mb-1 pb-0.5 text-left uppercase truncate text-[7.5pt]" style={{ color: theme.primary, borderColor: `${theme.primary}20` }}>
        {item.no}- {item.title}
      </div>
      
      <div className="flex justify-between text-[6pt] mb-1 font-bold text-slate-500">
        <span>MAX: {item.maxScore} | EXC: {item.maxScore}</span>
        {item.lowScoreMarker && <span className="text-red-600">LOW: {item.lowScoreMarker}</span>}
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 flex-1 content-start leading-tight">
        {item.observations.map((obs, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 border flex items-center justify-center text-[7.5pt] rounded-[1px]" style={{ borderColor: theme.border }}>
              {obs.checked ? '☒' : '☐'}
            </div>
            <span className="truncate opacity-90 text-slate-700">{obs.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-1 flex items-center justify-end gap-1">
        <span className="font-bold text-[6pt] text-slate-400 uppercase">SCORE:</span>
        <div className="w-6 h-5 text-white flex items-center justify-center font-bold text-[8.5pt] rounded-sm" style={{ backgroundColor: theme.primary }}>
          {item.givenScore}
        </div>
      </div>
    </div>
  );

  return (
    <div className="a4-container font-sans text-[8pt] leading-tight select-none shadow-2xl border border-slate-200 p-[8mm]">
      {/* Official Header */}
      <div className="flex flex-col mb-4">
        {logoUrl && (
          <div className="flex justify-center mb-4">
            <img src={logoUrl} alt="Organization Logo" className="max-h-24 w-auto object-contain" />
          </div>
        )}
        <div className="flex justify-between items-start">
          <div className="w-[30%] text-[6.5pt] font-bold" style={{ color: theme.primary }}>
            <p className="uppercase leading-tight">KINGDOM OF SAUDI ARABIA</p>
            <p className="leading-tight">SAUDI NATIONAL GUARD HEALTH AFFAIRS</p>
            <p className="leading-tight opacity-70">SUPPORT SERVICES - ENVIRONMENTAL</p>
          </div>
          
          <div className="w-[40%] text-center">
            <div className="text-white py-1.5 px-4 inline-block rounded-sm shadow-sm" style={{ backgroundColor: theme.primary }}>
              <h1 className="font-black text-[11pt] uppercase tracking-tighter">AUDIT & INSPECTION REPORT</h1>
            </div>
            <p className="text-[7pt] font-bold mt-1" style={{ color: theme.primary }}>({data.areaType.toUpperCase()})</p>
          </div>

          <div className="w-[30%] text-right text-[6.5pt] font-bold" style={{ color: theme.primary }}>
            <p className="uppercase">Form # {data.formNumber}</p>
            <p>QUALITY CONTROL DEPT.</p>
            <p className="opacity-70">CONFIDENTIAL DOCUMENT</p>
          </div>
        </div>
      </div>

      {/* Top Info Bar */}
      <div className="grid grid-cols-4 border mb-2 text-[7pt] bg-white overflow-hidden rounded-sm" style={{ borderColor: theme.border }}>
        <div className="p-1 border-r" style={{ borderColor: theme.border }}>
          <div className="text-[5.5pt] font-bold uppercase mb-0.5 opacity-60">AREA / LOCATION:</div>
          <div className="font-bold text-slate-400 truncate">{data.areaRoom}</div>
        </div>
        <div className="p-1 border-r" style={{ borderColor: theme.border }}>
          <div className="text-[5.5pt] font-bold uppercase mb-0.5 opacity-60">DATE:</div>
          <div className="font-bold text-slate-800">{data.date}</div>
        </div>
        <div className="p-1 border-r" style={{ borderColor: theme.border }}>
          <div className="text-[5.5pt] font-bold uppercase mb-0.5 opacity-60">SUPERVISOR:</div>
          <div className="font-bold text-slate-400">---</div>
        </div>
        <div className="p-1">
          <div className="text-[5.5pt] font-bold uppercase mb-0.5 opacity-60">AUDITOR:</div>
          <div className="font-bold text-slate-400">---</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="border-t border-l mb-3 grid grid-cols-3 rounded-sm overflow-hidden" style={{ borderColor: theme.border }}>
        {data.items.map(renderItemBox)}
      </div>

      {/* Comments & Missing Tools Section */}
      <div className="grid grid-cols-3 border mb-3 min-h-[70px] rounded-sm" style={{ borderColor: theme.border }}>
        <div className="col-span-1 p-2 border-r" style={{ borderColor: theme.border }}>
          <div className="text-center font-bold text-[8pt] uppercase mb-1 border-b pb-1" style={{ borderColor: theme.border, color: theme.primary }}>COMMENTS</div>
          <div className="text-[7pt] text-slate-400 italic line-clamp-3">{data.comments}</div>
        </div>
        <div className="col-span-1 p-2 border-r" style={{ borderColor: theme.border }}>
          <div className="text-center font-bold text-[8pt] uppercase mb-1 border-b pb-1" style={{ borderColor: theme.border, color: theme.primary }}>MISSING TOOLS</div>
          <div className="space-y-0.5 text-[6.5pt] text-slate-400">
            {[1, 2, 3, 4].map(n => <p key={n}>{n}. ................................................................</p>)}
          </div>
        </div>
        <div className="col-span-1 p-2 flex flex-col justify-between bg-slate-50/50">
          <div className="flex justify-center gap-4 mt-1">
            <div className="flex items-center gap-1.5">
               <div className="w-4 h-4 rounded-full border bg-white" style={{ borderColor: theme.border }}></div>
               <span className="text-[7pt] font-bold">AVAIL</span>
            </div>
            <div className="flex items-center gap-1.5">
               <div className="w-4 h-4 rounded-full border bg-white" style={{ borderColor: theme.border }}></div>
               <span className="text-[7pt] font-bold">N/A</span>
            </div>
          </div>
          <div className="mt-auto px-4">
             <div className="border-b border-dotted border-slate-300 w-full mb-0.5"></div>
             <div className="text-[5.5pt] text-slate-400 text-center uppercase font-bold">Supervisor Name</div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="border overflow-hidden mb-4 rounded-sm" style={{ borderColor: theme.border }}>
        <table className="w-full text-[6pt] border-collapse" dir="rtl">
          <tbody>
            {[...Array(Math.ceil(data.items.length / 3))].map((_, rowIndex) => {
              const startIdx = rowIndex * 3;
              return (
                <tr key={rowIndex} className="border-b last:border-0 h-5" style={{ borderColor: `${theme.border}20` }}>
                  {/* Column Group 3 */}
                  <td className="w-8 text-center border-l bg-slate-50 font-bold" style={{ borderColor: `${theme.border}20` }}>{data.items[startIdx + 2]?.givenScore || 0}/{data.items[startIdx + 2]?.maxScore || 0}</td>
                  <td className="w-5 text-center border-l text-slate-400" style={{ borderColor: `${theme.border}20` }}>{startIdx + 3}</td>
                  <td className="text-right pr-2 border-l font-bold" style={{ borderColor: theme.border }}>{data.items[startIdx + 2]?.titleArabic}</td>
                  
                  {/* Column Group 2 */}
                  <td className="w-8 text-center border-l bg-slate-50 font-bold" style={{ borderColor: `${theme.border}20` }}>{data.items[startIdx + 1]?.givenScore || 0}/{data.items[startIdx + 1]?.maxScore || 0}</td>
                  <td className="w-5 text-center border-l text-slate-400" style={{ borderColor: `${theme.border}20` }}>{startIdx + 2}</td>
                  <td className="text-right pr-2 border-l font-bold" style={{ borderColor: theme.border }}>{data.items[startIdx + 1]?.titleArabic}</td>
                  
                  {/* Column Group 1 */}
                  <td className="w-8 text-center border-l bg-slate-50 font-bold" style={{ borderColor: `${theme.border}20` }}>{data.items[startIdx]?.givenScore || 0}/{data.items[startIdx]?.maxScore || 0}</td>
                  <td className="w-5 text-center border-l text-slate-400" style={{ borderColor: `${theme.border}20` }}>{startIdx + 1}</td>
                  <td className="text-right pr-2 font-bold">{data.items[startIdx]?.titleArabic}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-center px-10 pt-4 border-t" style={{ borderColor: theme.border }}>
        <div className="text-center">
           <div className="w-48 border-b mb-1" style={{ borderColor: theme.border }}></div>
           <div className="text-[7pt] font-black uppercase" style={{ color: theme.primary }}>AUDITOR SIGNATURE</div>
        </div>
        <div className="text-right">
           <span className="font-black text-[10pt] italic tracking-tight" style={{ color: theme.primary }}>Quality Compliance Score: ________ %</span>
        </div>
        <div className="text-center">
           <div className="w-48 border-b mb-1" style={{ borderColor: theme.border }}></div>
           <div className="text-[7pt] font-black uppercase" style={{ color: theme.primary }}>OFFICIAL APPROVAL</div>
        </div>
      </div>

      <div className="absolute bottom-2 right-4 text-[5pt] text-slate-400 font-bold tracking-widest uppercase">
        Form Reference: {data.id} | Variant: {variant}
      </div>
    </div>
  );
};

export default ReportTemplate;

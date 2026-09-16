import React, { useState } from 'react';
import { CHALLENGE_TEMPLATES } from '../../data/mockData';
import { OPERATOR_TEMPLATES } from '../../data/operatorMockData';
import { challengeTypeLabel } from '../../utils/memberDisplay';
import { Sparkles, Eye, ArrowRight } from 'lucide-react';

export const TemplateGalleryView: React.FC<{ onUseTemplate: (tplId: string) => void }> = ({ onUseTemplate }) => {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const preview = CHALLENGE_TEMPLATES.find((t) => t.id === previewId);
  const statusOf = (id: string) => OPERATOR_TEMPLATES.find((t) => t.id === id)?.status ?? 'published';
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="border-b border-zinc-200 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Ready-made starting points — change anything before launch</p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">Challenge Templates</h1>
        <p className="text-sm text-zinc-600 mt-1">Browse, preview, then create through the same guided Wizard. Every field stays editable before launch.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CHALLENGE_TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col justify-between hover:border-orange-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-orange-600">{challengeTypeLabel(tpl.type)}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusOf(tpl.id) === 'published' ? 'bg-emerald-100 text-emerald-800' : statusOf(tpl.id) === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-600'}`}>{statusOf(tpl.id)}</span>
              </div>
              <h3 className="font-extrabold text-sm text-zinc-900">{tpl.name}</h3>
              <p className="text-xs text-zinc-600 mt-1 line-clamp-3">{tpl.description}</p>
              <p className="text-[11px] text-zinc-500 mt-2">{tpl.durationDays} days · editable into Wizard</p>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-100 flex gap-1.5">
              <button onClick={() => setPreviewId(tpl.id)} className="flex-1 px-2 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"><Eye className="w-3.5 h-3.5" /> Preview</button>
              <button onClick={() => onUseTemplate(tpl.id)} className="flex-1 px-2 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1">Use <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {preview && (
        <div className="bg-zinc-900 text-white rounded-2xl p-5 sm:p-6">
          <p className="text-[10px] uppercase font-bold tracking-wider text-orange-300">Template preview — {preview.name}</p>
          <p className="text-sm mt-1 text-zinc-200">{preview.description}</p>
          <div className="mt-2 text-xs text-zinc-300">Type: <strong className="text-white">{challengeTypeLabel(preview.type)}</strong> · Duration: <strong className="text-white">{preview.durationDays} days</strong> · Allowed edits before launch: targets, schedule, group, story.</div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => onUseTemplate(preview.id)} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl cursor-pointer">Edit &amp; create through Wizard</button>
            <button onClick={() => setPreviewId(null)} className="px-4 py-2 bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 cursor-pointer">Close preview</button>
          </div>
        </div>
      )}
    </div>
  );
};

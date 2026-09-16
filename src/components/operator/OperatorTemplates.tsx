import React from 'react';
import { OPERATOR_TEMPLATES } from '../../data/operatorMockData';

export const OperatorTemplates: React.FC<{ onUseTemplate: (id: string) => void }> = ({ onUseTemplate }) => (
  <div className="space-y-4">
    <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Challenge Templates</h1>
    <p className="text-xs text-zinc-500">Content-management scope: templates are pre-filled configurations, not an authority. Publish/retire are mock lifecycle actions — each requires confirmation, writes to the Audit Log, and depends on content-role permission. Management exposes metadata members never see.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {OPERATOR_TEMPLATES.map((t) => (
        <div key={t.id} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-2">
          <div className="flex items-center justify-between"><h2 className="font-extrabold text-sm">{t.name}</h2>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${t.status === 'published' ? 'bg-emerald-100 text-emerald-800' : t.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-700'}`}>{t.status}</span></div>
          <p className="text-[11px] text-zinc-500 capitalize">{t.type} · {t.uses} uses · {t.locales} · updated {t.updated}</p>
          <p className="text-[11px] text-zinc-600">Editable fields: {t.editableFields}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">View / build</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button onClick={() => onUseTemplate(t.id)} className="px-2.5 py-1.5 bg-orange-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Preview / build via Wizard</button>
            <button title="Mock duplicate — no confirmation needed; creates a draft copy." className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Duplicate (mock · view)</button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-1">Act (mock — confirm → audit trail)</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button title="Intent: make template available. Requires confirm; writes publish event to Audit Log; content-permission-dependent." className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Publish (mock · confirm → audit)</button>
            <button title="Intent: withdraw template. Requires confirm; writes retire event to Audit Log; content-permission-dependent." className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Retire (mock · confirm → audit)</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

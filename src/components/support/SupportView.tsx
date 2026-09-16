import React, { useState } from 'react';
import { SUPPORT_HISTORY_MOCK } from '../../data/mockData';
import { Heart, Info } from 'lucide-react';

export const SupportView: React.FC = () => {
  const [tab, setTab] = useState<'tiizi' | 'cause'>('tiizi');
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="border-b border-zinc-200 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">Experience reference only — mock capability</p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">Support Tiizi &amp; Community Causes</h1>
        <p className="text-sm text-zinc-600 mt-1">Two separate concepts. Tiizi never implies charitable custody, verified totals, or escrow in this prototype.</p>
      </div>
      <div className="flex gap-1.5 bg-zinc-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('tiizi')} className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${tab === 'tiizi' ? 'bg-white shadow text-zinc-900' : 'text-zinc-600'}`}>A. Support Tiizi</button>
        <button onClick={() => setTab('cause')} className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${tab === 'cause' ? 'bg-white shadow text-zinc-900' : 'text-zinc-600'}`}>B. Community Cause support</button>
      </div>
      {tab === 'tiizi' ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-orange-600" /><h2 className="font-extrabold text-sm">Keep Tiizi running (mock)</h2></div>
          <p className="text-xs text-zinc-600 leading-relaxed">Voluntary contributions toward platform upkeep in the experience model. No real payment is processed; amounts below are <strong>prototype data</strong>.</p>
          <div className="flex flex-wrap gap-2">
            {['KES 200', 'KES 500', 'KES 1,000', 'Custom'].map((a) => (
              <button key={a} className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold rounded-xl cursor-pointer">{a} (mock)</button>
            ))}
          </div>
          <p className="text-[11px] text-zinc-500 flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Channel shown as M-Pesa / card mock. Nothing is charged.</p>
        </div>
      ) : (
        <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-5 sm:p-6 space-y-3">
          <h2 className="font-extrabold text-sm text-emerald-950">Dedicate movement to a cause (not money custody)</h2>
          <p className="text-xs text-emerald-900 leading-relaxed">Challenges may dedicate kilometres or days to awareness (e.g. City Parks Preservation Initiative). External sponsor pledges are self/community-reported and fulfilled outside Tiizi.</p>
          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900">Tiizi does <strong>not</strong> hold charitable funds, verify donation totals, or escrow pledges in this reference. No “Amount Raised” totals are shown — only dedicated movement and self-reported pledge notes.</div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5">
        <h3 className="font-extrabold text-sm text-zinc-900">History <span className="ml-1 text-[10px] font-bold uppercase bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">Prototype data</span></h3>
        <div className="mt-3 divide-y divide-zinc-100">
          {SUPPORT_HISTORY_MOCK.map((h) => (
            <div key={h.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div><p className="font-bold text-zinc-900">{h.title}</p><p className="text-zinc-500">{h.kind} · {h.date} · {h.note}</p></div>
              <span className="font-extrabold text-zinc-800 whitespace-nowrap">{h.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

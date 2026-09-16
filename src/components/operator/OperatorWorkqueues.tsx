import React, { useState } from 'react';
import { APPROVALS_QUEUE, OPERATOR_ALERTS } from '../../data/operatorMockData';
import { ApprovalItem } from '../../types';

export const OperatorApprovals: React.FC = () => {
  const [items, setItems] = useState<ApprovalItem[]>(APPROVALS_QUEUE);
  const act = (id: string, status: ApprovalItem['status']) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Approvals / Review queue</h1>
      <p className="text-xs text-zinc-500">One operator attention queue. Only mock approval types that Tiizi needs — not an approval for every workflow. Each item is labelled mock.</p></div>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-extrabold">{i.title} <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${i.severity === 'high' ? 'bg-rose-100 text-rose-800' : i.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-600'}`}>{i.severity}</span> <span className="ml-1 text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded">{i.mockLabel}</span></p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{i.kind.replace('_', ' ')} · {i.detail} · Age {i.age} · Status: <strong>{i.status}</strong></p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => act(i.id, 'approved')} className="px-2.5 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Approve</button>
              <button onClick={() => act(i.id, 'dismissed')} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Dismiss</button>
              <button onClick={() => act(i.id, 'escalated')} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Escalate</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <h2 className="font-extrabold text-sm">Moderation / safety (reference capability)</h2>
        <p className="text-[11px] text-zinc-500 mt-0.5">Reported groups, challenges, content, users. Mock actions: review · dismiss · restrict · escalate. No elaborate social moderation beyond Tiizi needs.</p>
        <div className="mt-2 space-y-1.5 text-xs">
          <div className="p-2.5 bg-zinc-50 rounded-xl flex justify-between"><span><strong>Reported challenge:</strong> Midnight Ultra (mock ×2)</span><span className="font-bold text-amber-700">in queue ↑</span></div>
          <div className="p-2.5 bg-zinc-50 rounded-xl flex justify-between"><span><strong>Reported group:</strong> Zenith Mind &amp; Motion cover (mock ×1)</span><span className="font-bold text-amber-700">in queue ↑</span></div>
        </div>
      </div>
    </div>
  );
};

export const OperatorAttention: React.FC = () => (
  <div className="space-y-3">
    <h2 className="font-extrabold text-sm">Operator attention — what must Tiizi Operations act on?</h2>
    {OPERATOR_ALERTS.map((a) => (
      <div key={a.id} className="bg-white border border-zinc-200 rounded-2xl p-4 text-xs">
        <p className="font-bold">{a.title}</p>
        <p className="text-zinc-600 mt-0.5">{a.detail}</p>
        <p className="text-[11px] text-zinc-500 mt-1">Severity: <strong>{a.severity}</strong> · Owner: {a.owner} · Age: {a.age} · Category: {a.category}</p>
      </div>
    ))}
  </div>
);

import React, { useState } from 'react';
import { APPROVALS_QUEUE, OPERATOR_ALERTS } from '../../data/operatorMockData';
import { ApprovalItem } from '../../types';

export const OperatorApprovals: React.FC = () => {
  const [items, setItems] = useState<ApprovalItem[]>(APPROVALS_QUEUE);
  const act = (id: string, status: ApprovalItem['status']) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  const formal = items.filter((i) => ['group_join', 'challenge_creation', 'content_publish', 'template_publish'].includes(i.kind));
  const review = items.filter((i) => ['moderation', 'account_review'].includes(i.kind));
  const attention = items.filter((i) => ['donation_review', 'localisation_gap'].includes(i.kind));
  const renderRow = (i: ApprovalItem) => (
    <div key={i.id} className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <p className="text-xs font-extrabold">{i.title} <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${i.severity === 'high' ? 'bg-rose-100 text-rose-800' : i.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-600'}`}>{i.severity}</span> <span className="ml-1 text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded">{i.mockLabel}</span></p>
        <p className="text-[11px] text-zinc-500 mt-0.5">{i.kind.replace('_', ' ')} · {i.detail} · Age {i.age} · Status: <strong>{i.status}</strong></p>
        <p className="text-[10px] text-zinc-400 mt-0.5">Mock action only — requires confirmation, writes to Audit Log, and depends on operator role permission (no new authority created).</p>
      </div>
      <div className="flex gap-1.5">
        <button onClick={() => act(i.id, 'approved')} className="px-2.5 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Approve</button>
        <button onClick={() => act(i.id, 'dismissed')} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Dismiss</button>
        <button onClick={() => act(i.id, 'escalated')} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Escalate</button>
      </div>
    </div>
  );
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Review &amp; Attention</h1>
      <p className="text-xs text-zinc-500">One operator queue holding approvals, reviews, moderation, support interventions, exceptions, reconciliation and attention items — not every item is a formal approval workflow. Each item is labelled mock.</p></div>
      <div className="space-y-2">
        <h2 className="font-extrabold text-xs uppercase tracking-wider text-zinc-500">Formal approvals (mock)</h2>
        {formal.map(renderRow)}
      </div>
      <div className="space-y-2">
        <h2 className="font-extrabold text-xs uppercase tracking-wider text-zinc-500">Moderation / account reviews (mock)</h2>
        {review.map(renderRow)}
      </div>
      <div className="space-y-2">
        <h2 className="font-extrabold text-xs uppercase tracking-wider text-zinc-500">Operational attention &amp; reconciliation (mock — not approvals)</h2>
        {attention.map(renderRow)}
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <h2 className="font-extrabold text-sm">Moderation / safety (reference capability)</h2>
        <p className="text-[11px] text-zinc-500 mt-0.5">Reported groups, challenges, content, users. Mock review actions (review · dismiss · restrict · escalate) each state intent, require confirmation, write to the Audit Log, and depend on moderation permission. No elaborate social moderation beyond Tiizi needs; no new approval authority created.</p>
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

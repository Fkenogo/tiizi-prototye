import React, { useState } from 'react';
import { APPROVALS_QUEUE, OPERATOR_ALERTS } from '../../data/operatorMockData';
import { ApprovalItem } from '../../types';
import { logOperatorAction, getOperatorFeedFor } from '../../utils/operatorAudit';

// Relevant mock actions per queue-item kind — never every action everywhere.
const ACTIONS_FOR: Record<ApprovalItem['kind'], ApprovalItem['status'][]> = {
  group_join: ['approved', 'rejected', 'assigned'],
  challenge_creation: ['approved', 'rejected', 'changes_requested'],
  content_publish: ['approved', 'changes_requested', 'dismissed'],
  template_publish: ['approved', 'changes_requested', 'dismissed'],
  moderation: ['dismissed', 'escalated', 'resolved'],
  account_review: ['approved', 'rejected', 'assigned', 'escalated'],
  donation_review: ['resolved', 'assigned', 'dismissed'],
  localisation_gap: ['assigned', 'resolved', 'dismissed'],
};

const ACTION_LABEL: Record<ApprovalItem['status'], string> = {
  pending: 'Pending',
  approved: 'Approve',
  rejected: 'Reject',
  changes_requested: 'Request changes',
  dismissed: 'Dismiss',
  escalated: 'Escalate',
  assigned: 'Assign',
  resolved: 'Resolve',
};

export const OperatorApprovals: React.FC = () => {
  const [items, setItems] = useState<ApprovalItem[]>(APPROVALS_QUEUE);
  const [selected, setSelected] = useState<string | null>(null);
  const [assignee, setAssignee] = useState('Support');
  const [auditTick, setAuditTick] = useState(0);
  void auditTick;

  const item = items.find((i) => i.id === selected) ?? null;
  const formal = items.filter((i) => ['group_join', 'challenge_creation', 'content_publish', 'template_publish'].includes(i.kind));
  const review = items.filter((i) => ['moderation', 'account_review'].includes(i.kind));
  const attention = items.filter((i) => ['donation_review', 'localisation_gap'].includes(i.kind));

  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);

  const decide = (id: string, status: ApprovalItem['status']) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const extra = status === 'assigned' ? ` Assign to ${assignee}.` : '';
    if (!confirmAct(`${ACTION_LABEL[status]}: "${target.title}"?${extra}`)) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    logOperatorAction(`Queue item ${status.replace('_', ' ')}`, `Review › ${target.title}`, `${target.kind} → ${status}${status === 'assigned' ? ` · owner: ${assignee}` : ''} (mock)`);
    setAuditTick((t) => t + 1);
  };

  const sessionActions = item ? getOperatorFeedFor(`Review › ${item.title}`) : [];

  const renderRow = (i: ApprovalItem) => (
    <button key={i.id} onClick={() => setSelected(i.id)} className={`w-full text-left bg-white rounded-2xl border p-4 cursor-pointer ${selected === i.id ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-zinc-200 hover:border-zinc-300'}`}>
      <p className="text-xs font-extrabold">{i.title} <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${i.severity === 'high' ? 'bg-rose-100 text-rose-800' : i.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-600'}`}>{i.severity}</span> <span className="ml-1 text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded">{i.mockLabel}</span></p>
      <p className="text-[11px] text-zinc-500 mt-0.5">{i.kind.replace('_', ' ')} · Age {i.age} · Status: <strong>{i.status.replace('_', ' ')}</strong></p>
    </button>
  );

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Review &amp; Attention</h1>
      <p className="text-xs text-zinc-500">One queue holding approvals, reviews, moderation, support interventions, exceptions, reconciliation and attention items — not every item is a formal approval workflow. Select an item to see the full story and the actions that fit it. Mock actions need confirmation and write to the Audit Log.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
        <div className="space-y-4">
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
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit lg:sticky lg:top-4">
          {!item && <p className="text-xs text-zinc-500">Select a queue item to inspect it (mock).</p>}
          {item && (
            <>
              <h2 className="font-extrabold text-sm">{item.title}</h2>
              <div className="text-xs space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect</p>
                <dl className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Subject</dt><dd className="font-bold">{item.kind.replace('_', ' ')}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Attention</dt><dd className="font-bold capitalize">{item.severity}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Requester</dt><dd className="font-bold">{item.requester ?? '—'}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Date · Age</dt><dd className="font-bold">{item.date ?? '—'} · {item.age}</dd></div>
                </dl>
                <p><strong>Reason:</strong> {item.detail}</p>
                <p><strong>Affected:</strong> {item.entity ?? '—'}</p>
                <p><strong>Context:</strong> {item.context ?? '—'}</p>
                <p><strong>Prior actions:</strong> {item.priorActions ?? 'None (mock).'}</p>
                <p className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl"><strong>Recommended next step:</strong> {item.recommendation ?? '—'}</p>
                <p><strong>Status:</strong> {item.status.replace('_', ' ')}</p>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Act — only what fits this item (mock — confirm → audit trail)</p>
              <div className="flex flex-wrap gap-1.5">
                {ACTIONS_FOR[item.kind].map((a) => (
                  <button key={a} onClick={() => decide(item.id, a)} className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer ${a === 'approved' || a === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-700'}`}>{ACTION_LABEL[a]}</button>
                ))}
              </div>
              {(ACTIONS_FOR[item.kind].includes('assigned')) && (
                <label className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-zinc-500">Assign to:</span>
                  <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="px-2 py-1 text-[11px] bg-zinc-50 border border-zinc-200 rounded-lg">
                    <option>Support</option><option>Moderation</option><option>Content</option><option>Platform</option>
                  </select>
                </label>
              )}
              <div className="text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Prior session actions</p>
                {sessionActions.length === 0 && <p className="text-[11px] text-zinc-500">None yet (mock).</p>}
                {sessionActions.map((a) => (<p key={a.id} className="text-[11px] text-zinc-700 mt-0.5">• {a.action} — {a.summary}</p>))}
              </div>
            </>
          )}
        </div>
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

import React from 'react';
import { OPERATOR_ALERTS } from '../../data/operatorMockData';
import { OperatorSection } from '../../types';
import { getOperatorFeed } from '../../utils/operatorAudit';

interface OperatorOverviewProps {
  onNavigate: (s: OperatorSection) => void;
  counts?: {
    draftsAwaiting?: number;
    attentionOpen?: number;
  };
}

export const OperatorOverview: React.FC<OperatorOverviewProps> = ({ onNavigate, counts }) => {
  const sessionActions = getOperatorFeed().length;
  const sections: { title: string; body: string; go: OperatorSection; cta: string }[] = [
    { title: 'Needs attention', body: `${OPERATOR_ALERTS.filter((a) => a.severity === 'high').length} high-severity items incl. an account appeal and a flagged challenge (mock).`, go: 'approvals', cta: 'Open Review & Attention' },
    { title: 'Pending review', body: `${counts?.attentionOpen ?? 7} queue items: approvals, moderation, account and attention (mock).`, go: 'approvals', cta: 'Review queue' },
    { title: 'Group requests', body: 'Join requests waiting in restricted groups (mock).', go: 'groups', cta: 'Open Groups' },
    { title: 'Suspended / flagged entities', body: 'Suspended accounts, restricted and flagged groups (mock).', go: 'users', cta: 'Open Users' },
    { title: 'Content not ready', body: 'Activities missing translations or review; template drafts awaiting publication (mock).', go: 'activities', cta: 'Open Activities' },
    { title: `Template drafts (${counts?.draftsAwaiting ?? 1})`, body: 'Drafts become member-visible only when published (mock).', go: 'templates', cta: 'Open Templates' },
    { title: 'Donation / support issues', body: 'Unmatched cause records and reconciliation attention (mock).', go: 'donations', cta: 'Open Donations' },
    { title: 'Platform health', body: 'Degraded notification delivery and content queue (simulated).', go: 'health', cta: 'Open Health' },
    { title: `Recent admin changes (${sessionActions} this session)`, body: 'Session mock actions plus reference history.', go: 'audit', cta: 'Open Audit Log' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">Can you run Tiizi from here? Yes — start below.</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Control centre (mock): every card names what exists, what needs attention, and where to act. All data is prototype-only.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sections.map((s) => (
          <div key={s.title} className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{s.title}</p>
              <p className="text-xs text-zinc-600 mt-1">{s.body}</p>
            </div>
            <button onClick={() => onNavigate(s.go)} className="self-start px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-bold rounded-lg cursor-pointer">{s.cta} →</button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5">
        <h2 className="font-extrabold text-sm">What requires action now (attention layer preview)</h2>
        <div className="mt-3 space-y-2">
          {OPERATOR_ALERTS.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
              <div className="flex-1">
                <p className="font-bold">{a.title} <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${a.severity === 'high' ? 'bg-rose-100 text-rose-800' : a.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-700'}`}>{a.severity}</span></p>
                <p className="text-zinc-600 mt-0.5">{a.detail} Owner: {a.owner} · Age: {a.age} · {a.category}</p>
              </div>
              <button onClick={() => onNavigate('approvals')} className="shrink-0 px-2.5 py-1 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Open →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

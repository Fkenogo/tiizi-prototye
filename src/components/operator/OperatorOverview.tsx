import React from 'react';
import { OPERATOR_ALERTS } from '../../data/operatorMockData';

const CARDS = [
  { label: 'Active users', value: '132', sub: '6 suspended · 9 invited (mock)' },
  { label: 'Suspended users', value: '6', sub: '1 appeal pending (mock)' },
  { label: 'Active Groups', value: '3', sub: '1 restricted · 1 flagged (mock)' },
  { label: 'Active Challenges', value: '4', sub: '1 upcoming · 1 closed · 1 flagged' },
  { label: 'Pending approvals', value: '7', sub: '2 high severity (mock)' },
  { label: 'Flagged items', value: '2', sub: '1 group · 1 challenge (mock)' },
  { label: 'Content readiness issues', value: '4', sub: '2 missing translation · 2 needs review' },
  { label: 'Failed / system alerts', value: '2', sub: 'notifications degraded · content queue (simulated)' },
  { label: 'Recent operator actions', value: '6', sub: 'see Audit Log (mock history)' },
];

export const OperatorOverview: React.FC = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-xl sm:text-2xl font-black tracking-tight">Who is using Tiizi? What needs attention?</h1>
      <p className="text-xs text-zinc-500 mt-0.5">Operational cards only — no vanity metrics. Everything below is mock.</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {CARDS.map((c) => (
        <div key={c.label} className="bg-white rounded-2xl border border-zinc-200 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{c.label}</p>
          <p className="text-2xl font-black tabular-nums mt-0.5">{c.value}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5">
      <h2 className="font-extrabold text-sm">What requires action now (attention layer preview)</h2>
      <div className="mt-3 space-y-2">
        {OPERATOR_ALERTS.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs">
            <div>
              <p className="font-bold">{a.title} <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${a.severity === 'high' ? 'bg-rose-100 text-rose-800' : a.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-700'}`}>{a.severity}</span></p>
              <p className="text-zinc-600 mt-0.5">{a.detail} Owner: {a.owner} · Age: {a.age} · {a.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

import React, { useState } from 'react';
import { OPERATOR_ACTIVITIES, METRIC_COMPATIBILITY } from '../../data/operatorMockData';

const FILTERS = ['all', 'draft', 'published', 'retired', 'eligible', 'needs_review', 'missing_content', 'missing_translation'] as const;

export const OperatorActivities: React.FC = () => {
  const [f, setF] = useState<(typeof FILTERS)[number]>('all');
  const rows = OPERATOR_ACTIVITIES.filter((a) => {
    if (f === 'all') return true;
    if (f === 'draft' || f === 'published' || f === 'retired') return a.lifecycle === f;
    if (f === 'eligible') return a.challengeEligible;
    return a.readiness === f;
  });
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Activities &amp; Knowledge</h1>
      <p className="text-xs text-zinc-500">Canonical activity management: code, display name, domain, metrics/units, readiness, lifecycle, eligibility, localisation, version. Raw backend IDs are hidden; short codes shown.</p></div>
      <div className="flex flex-wrap gap-1">
        {FILTERS.map((x) => (<button key={x} onClick={() => setF(x)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border capitalize cursor-pointer ${f === x ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200'}`}>{x.replace('_', ' ')}</button>))}
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-x-auto">
        <table className="w-full text-[11px] min-w-[760px]">
          <thead><tr className="text-left text-zinc-400 uppercase text-[10px] border-b border-zinc-100">
            <th className="p-2.5">Code · Activity</th><th className="p-2.5">Domain</th><th className="p-2.5">Lifecycle</th><th className="p-2.5">Readiness</th><th className="p-2.5">Eligible</th><th className="p-2.5">Metrics / units</th><th className="p-2.5">Locales</th><th className="p-2.5">Version</th>
          </tr></thead>
          <tbody>{rows.map((a) => (<tr key={a.id} className="border-b border-zinc-50 hover:bg-zinc-50/60">
            <td className="p-2.5"><span className="font-mono font-bold">{a.code}</span> · <strong>{a.displayName}</strong><br /><span className="text-zinc-500">{a.category} · upd. {a.updated}</span></td>
            <td className="p-2.5">{a.domain}</td>
            <td className="p-2.5"><span className={`px-1.5 py-0.5 rounded font-bold capitalize ${a.lifecycle === 'published' ? 'bg-emerald-100 text-emerald-800' : a.lifecycle === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-700'}`}>{a.lifecycle}</span></td>
            <td className="p-2.5"><span className={`px-1.5 py-0.5 rounded font-bold ${a.readiness === 'ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{a.readiness.replace('_', ' ')}</span></td>
            <td className="p-2.5">{a.challengeEligible ? 'Yes' : 'No'}</td>
            <td className="p-2.5">{a.metrics}</td><td className="p-2.5">{a.locales}</td><td className="p-2.5 font-mono">{a.version}</td>
          </tr>))}</tbody>
        </table>
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <h2 className="font-extrabold text-sm">Metric / unit compatibility (what can be measured)</h2>
        <p className="text-[11px] text-zinc-500">Governed combinations only — no arbitrary pairings. Incomplete combos are blocked, not guessed.</p>
        <div className="mt-2 overflow-x-auto"><table className="w-full text-[11px] min-w-[560px]">
          <thead><tr className="text-left text-zinc-400 uppercase text-[10px] border-b"><th className="p-2">Activity</th><th className="p-2">Metric</th><th className="p-2">Units</th><th className="p-2">Challenge-eligible</th><th className="p-2">Note</th></tr></thead>
          <tbody>{METRIC_COMPATIBILITY.map((m, i) => (<tr key={i} className="border-b border-zinc-50"><td className="p-2 font-bold">{m.activity}</td><td className="p-2">{m.metric}</td><td className="p-2 font-mono">{m.units}</td><td className="p-2">{m.eligible ? 'Yes' : 'No'}</td><td className="p-2 text-zinc-500">{m.note}</td></tr>))}</tbody>
        </table></div>
      </div>
    </div>
  );
};

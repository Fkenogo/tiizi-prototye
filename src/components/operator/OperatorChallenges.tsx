import React, { useState } from 'react';
import { OPERATOR_CHALLENGES } from '../../data/operatorMockData';

export const OperatorChallenges: React.FC = () => {
  const [status, setStatus] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'closed'>('all');
  const rows = OPERATOR_CHALLENGES.filter((c) => status === 'all' || c.status === status);
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Challenges</h1>
      <p className="text-xs text-zinc-500">Inspect any challenge without becoming a participant. Terminal/finalized states are locked and explicit.</p></div>
      <div className="flex gap-1 bg-white border border-zinc-200 p-1 rounded-xl w-fit">
        {(['all', 'active', 'upcoming', 'completed', 'closed'] as const).map((s) => (<button key={s} onClick={() => setStatus(s)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize cursor-pointer ${status === s ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>{s}</button>))}
      </div>
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-x-auto">
        <table className="w-full text-[11px] min-w-[720px]">
          <thead><tr className="text-left uppercase text-[10px] text-zinc-400 border-b border-zinc-100"><th className="p-2.5">Challenge</th><th className="p-2.5">Group · Type</th><th className="p-2.5">Status</th><th className="p-2.5">Participants</th><th className="p-2.5">Window</th><th className="p-2.5">Result</th><th className="p-2.5">Flags</th></tr></thead>
          <tbody>{rows.map((c) => (<tr key={c.id} className="border-b border-zinc-50 hover:bg-zinc-50/60">
            <td className="p-2.5 font-bold">{c.title}<br /><span className="font-mono font-normal text-zinc-400">{c.id}</span></td>
            <td className="p-2.5">{c.group}<br /><span className="capitalize text-zinc-500">{c.type}</span></td>
            <td className="p-2.5"><span className={`px-1.5 py-0.5 rounded font-bold capitalize ${c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : c.status === 'upcoming' ? 'bg-sky-100 text-sky-800' : 'bg-zinc-200 text-zinc-700'}`}>{c.status}</span>{c.finalized && <span className="ml-1 text-[10px] font-bold text-zinc-500">· finalized</span>}</td>
            <td className="p-2.5 tabular-nums">{c.participants}</td>
            <td className="p-2.5">{c.start} → {c.end}</td>
            <td className="p-2.5 text-zinc-600">{c.resultSummary}</td>
            <td className="p-2.5">{c.flagged ? <span className="text-rose-700 font-bold">{c.flagged}</span> : <span className="text-zinc-400">—</span>}</td>
          </tr>))}</tbody>
        </table>
      </div>
      <p className="text-[11px] text-zinc-500">Operator detail opens read-only: roster, results, config, reports — never a “Join &amp; log” consumer control.</p>
    </div>
  );
};

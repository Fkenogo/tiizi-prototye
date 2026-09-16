import React, { useState } from 'react';
import { OPERATOR_CHALLENGES } from '../../data/operatorMockData';
import { OperatorChallengeRow } from '../../types';
import { logOperatorAction, getOperatorFeedFor } from '../../utils/operatorAudit';

export const OperatorChallenges: React.FC = () => {
  const [status, setStatus] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'closed'>('all');
  const [challenges, setChallenges] = useState<OperatorChallengeRow[]>(OPERATOR_CHALLENGES);
  const [selected, setSelected] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [auditTick, setAuditTick] = useState(0);
  void auditTick;

  const rows = challenges.filter((c) => status === 'all' || c.status === status);
  const ch = challenges.find((c) => c.id === selected) ?? null;
  const sessionActions = ch ? getOperatorFeedFor(`Challenges › ${ch.title}`) : [];

  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);
  const touch = (fn: () => void) => { fn(); setAuditTick((t) => t + 1); };

  const restrict = () => {
    if (!ch || !confirmAct(`Restrict "${ch.title}" pending review? It stays visible but hidden from browse until review closes.`)) return;
    touch(() => {
      setHidden((p) => ({ ...p, [ch.id]: true }));
      logOperatorAction('Challenge restricted', `Challenges › ${ch.title}`, `visible → hidden pending review (mock)`);
    });
  };
  const reopen = () => {
    if (!ch) return;
    touch(() => {
      setHidden((p) => ({ ...p, [ch.id]: false }));
      logOperatorAction('Review item reopened', `Challenges › ${ch.title}`, `restriction lifted → visible (mock)`);
    });
  };
  const escalate = () => {
    if (!ch || !confirmAct(`Escalate "${ch.title}" to a senior operator?`)) return;
    touch(() => logOperatorAction('Challenge escalated', `Challenges › ${ch.title}`, `escalated for senior review (mock)`));
  };

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Challenges</h1>
      <p className="text-xs text-zinc-500">What exists: every challenge. State: upcoming / active / completed / closed, plus finalized and flags. Attention: the Flags column. Select a row to inspect it — opening a challenge never joins it. Active challenge truth is never rewritten from here. Mock actions need confirmation and write to the Audit Log.</p></div>
      <div className="flex gap-1 bg-white border border-zinc-200 p-1 rounded-xl w-fit">
        {(['all', 'active', 'upcoming', 'completed', 'closed'] as const).map((s) => (<button key={s} onClick={() => setStatus(s)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize cursor-pointer ${status === s ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>{s}</button>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-x-auto h-fit">
          <table className="w-full text-[11px] min-w-[640px]">
            <thead><tr className="text-left uppercase text-[10px] text-zinc-400 border-b border-zinc-100"><th className="p-2.5">Challenge</th><th className="p-2.5">Group · Type</th><th className="p-2.5">Status</th><th className="p-2.5">Result</th><th className="p-2.5">Flags</th></tr></thead>
            <tbody>{rows.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c.id)} className={`border-b border-zinc-50 hover:bg-zinc-50/60 cursor-pointer ${selected === c.id ? 'bg-orange-50/60' : ''}`}>
                <td className="p-2.5 font-bold">{c.title}<br /><span className="font-mono font-normal text-zinc-400">{c.id}</span>{hidden[c.id] && <span className="ml-1 text-[10px] font-bold text-amber-700">· hidden pending review</span>}</td>
                <td className="p-2.5">{c.group}<br /><span className="capitalize text-zinc-500">{c.type}</span></td>
                <td className="p-2.5"><span className={`px-1.5 py-0.5 rounded font-bold capitalize ${c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : c.status === 'upcoming' ? 'bg-sky-100 text-sky-800' : 'bg-zinc-200 text-zinc-700'}`}>{c.status}</span>{c.finalized && <span className="ml-1 text-[10px] font-bold text-zinc-500">· finalized</span>}</td>
                <td className="p-2.5 text-zinc-600">{c.resultSummary}</td>
                <td className="p-2.5">{c.flagged ? <span className="text-rose-700 font-bold">{c.flagged}</span> : <span className="text-zinc-400">—</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          {!ch && <p className="text-xs text-zinc-500">Select a challenge to inspect it (mock). Detail is read-only: roster, results, setup, reports — never a “Join &amp; log” control.</p>}
          {ch && (
            <>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-extrabold text-sm">{ch.title}</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded capitalize bg-zinc-100 text-zinc-600">{ch.status}</span>
              </div>
              <div className="text-xs space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect</p>
                <dl className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Group</dt><dd className="font-bold">{ch.group}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Type</dt><dd className="font-bold capitalize">{ch.type}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Participants</dt><dd className="font-bold tabular-nums">{ch.participants}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Window</dt><dd className="font-bold">{ch.start} → {ch.end}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Result state</dt><dd className="font-bold">{ch.resultSummary}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Finalized</dt><dd className="font-bold">{ch.finalized ? 'Yes — locked' : 'No'}</dd></div>
                </dl>
                <p><strong>Setup (mock):</strong> activities, targets and schedule as members see them — shown, never edited here.</p>
                <p><strong>Flags / reports:</strong> {ch.flagged ?? 'none (mock)'}</p>
                {hidden[ch.id] && <p className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900"><strong>Hidden pending review</strong> (mock) — hidden from browse, data untouched.</p>}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Act (mock — confirm → audit trail)</p>
              <div className="flex flex-wrap gap-1.5">
                {!hidden[ch.id]
                  ? <button onClick={restrict} className="px-2.5 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Restrict / hide pending review (mock)</button>
                  : <button onClick={reopen} className="px-2.5 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Reopen review item (mock)</button>}
                <button onClick={escalate} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Escalate (mock)</button>
              </div>
              <div className="text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Related audit events</p>
                {sessionActions.length === 0 && <p className="text-[11px] text-zinc-500">No session actions yet (mock).</p>}
                {sessionActions.map((a) => (<p key={a.id} className="text-[11px] text-zinc-700 mt-0.5">• {a.action} — {a.summary}</p>))}
                {ch.finalized && <p className="text-[11px] text-zinc-500 mt-0.5">• Challenge finalized by system schedule (mock seed).</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { OPERATOR_GROUPS } from '../../data/operatorMockData';

export const OperatorGroups: React.FC = () => {
  const [q, setQ] = useState('');
  const rows = OPERATOR_GROUPS.filter((g) => !q.trim() || g.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Groups</h1>
      <p className="text-xs text-zinc-500">Operational-control scope: inspect state, stewards, members, challenges, rules, reports, creation permissions, history. Suspend/reactivate are mock content-management actions — they require confirmation, write to the Audit Log, and depend on role permission. Operator never silently edits group truth.</p></div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search groups..." className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {rows.map((g) => (
          <div key={g.id} className="bg-white rounded-2xl border border-zinc-200 p-4 space-y-2">
            <div className="flex items-center justify-between"><h2 className="font-extrabold text-sm">{g.name}</h2>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${g.state === 'healthy' ? 'bg-emerald-100 text-emerald-800' : g.state === 'restricted' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{g.state}</span></div>
            {g.flag && <p className="text-[11px] p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-900">{g.flag}</p>}
            <dl className="text-[11px] text-zinc-600 space-y-1">
              <div className="flex justify-between"><dt>Members</dt><dd className="font-bold text-zinc-900">{g.members}</dd></div>
              <div className="flex justify-between"><dt>Stewards</dt><dd className="font-bold text-zinc-900">{g.stewards}</dd></div>
              <div className="flex justify-between"><dt>Active / completed</dt><dd className="font-bold text-zinc-900">{g.activeChallenges} / {g.completedChallenges}</dd></div>
              <div className="flex justify-between"><dt>Creation permission</dt><dd className="font-bold text-zinc-900">{g.creationPermission === 'open' ? 'Open to members' : 'Stewards only'}</dd></div>
              <div className="flex justify-between"><dt>Pending requests</dt><dd className="font-bold text-zinc-900">{g.pendingRequests}</dd></div>
            </dl>
            <div className="flex gap-1.5 pt-1">
              <button className="flex-1 px-2 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer" title="View-only: rules, roster and reports.">Inspect rules (mock · view)</button>
              <button className="flex-1 px-2 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer" title="View-only: past changes from the Audit Log.">History (mock · view)</button>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-1">Act (mock — confirm → audit trail)</p>
            <div className="flex gap-1.5">
              <button title="Intent: pause group visibility pending review. Requires confirm; writes to Audit Log; permission-dependent." className="flex-1 px-2 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Suspend (mock · confirm → audit)</button>
              <button title="Intent: restore group after review. Requires confirm; writes to Audit Log; permission-dependent." className="flex-1 px-2 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Reactivate (mock · confirm → audit)</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { OPERATOR_USERS } from '../../data/operatorMockData';

export const OperatorUsers: React.FC = () => {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended' | 'invited' | 'inactive'>('all');
  const [selected, setSelected] = useState<string | null>(OPERATOR_USERS[0].id);
  const rows = OPERATOR_USERS.filter((u) => (filter === 'all' || u.state === filter) && (!q.trim() || (u.name + u.handle).toLowerCase().includes(q.toLowerCase())));
  const user = OPERATOR_USERS.find((u) => u.id === selected)!;
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">Users</h1>
        <p className="text-xs text-zinc-500">Support-action scope: inspect who this user is, their state, access, groups and challenges. Mock suspend/reactivate are support interventions — they require confirmation, write to the Audit Log, and depend on operator role permission. Impersonation is <strong>not</strong> offered (prototype-only if ever).</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users by name or handle..." className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl" />
        <div className="flex gap-1 bg-white border border-zinc-200 p-1 rounded-xl">
          {(['all', 'active', 'suspended', 'invited', 'inactive'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize cursor-pointer ${filter === f ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden">
          {rows.map((u) => (
            <button key={u.id} onClick={() => setSelected(u.id)} className={`w-full text-left p-3 flex items-center gap-3 cursor-pointer ${selected === u.id ? 'bg-orange-50/70' : 'hover:bg-zinc-50'}`}>
              <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate">{u.name} <span className="text-zinc-400 font-medium">{u.handle}</span></p>
                <p className="text-[11px] text-zinc-500">{u.role} · {u.groups} groups · {u.challenges} challenges · {u.lastActive}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${u.state === 'active' ? 'bg-emerald-100 text-emerald-800' : u.state === 'suspended' ? 'bg-rose-100 text-rose-800' : u.state === 'invited' ? 'bg-sky-100 text-sky-800' : 'bg-zinc-200 text-zinc-700'}`}>{u.state}</span>
            </button>
          ))}
          {rows.length === 0 && <p className="p-6 text-xs text-zinc-500 text-center">No users match. Try clearing filters (mock).</p>}
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover" />
            <div><h2 className="font-extrabold text-sm">{user.name}</h2><p className="text-[11px] text-zinc-500">{user.handle} · {user.role} · {user.state}</p></div>
          </div>
          {user.issue && <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900"><strong>Issue requiring support (mock):</strong> {user.issue}</div>}
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Groups</dt><dd className="font-bold">{user.groups}</dd></div>
            <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Challenges</dt><dd className="font-bold">{user.challenges}</dd></div>
            <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Recognitions</dt><dd className="font-bold">{user.recognitions}</dd></div>
            <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Last active</dt><dd className="font-bold">{user.lastActive}</dd></div>
          </dl>
          <div className="text-xs text-zinc-600 space-y-1">
            <p><strong>Support view (mock):</strong> recent errors — none for actives; suspended shows accuracy flags.</p>
            <p><strong>Access:</strong> {user.role} — see Access &amp; Roles for scope. No impersonation control rendered.</p>
          </div>
          <div className="flex gap-2">
            <button title="Intent: restrict access pending review. Requires confirm; writes suspend event to Audit Log; permission-dependent." className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold rounded-lg cursor-pointer">Suspend (mock · confirm → audit)</button>
            <button title="Intent: restore access after review. Requires confirm; writes reactivate event to Audit Log; permission-dependent." className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold rounded-lg cursor-pointer">Reactivate (mock · confirm → audit)</button>
            <button className="px-3 py-1.5 bg-zinc-100 text-zinc-500 text-xs font-bold rounded-lg cursor-not-allowed" title="Not offered">Impersonate (not offered)</button>
          </div>
          <p className="text-[10px] text-zinc-400">Mock support actions only — each requires confirmation, writes to the Audit Log, and depends on the operator's role permission. No silent superuser edits.</p>
        </div>
      </div>
    </div>
  );
};

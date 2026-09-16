import React, { useState } from 'react';
import { OPERATOR_USERS } from '../../data/operatorMockData';
import { OperatorUserRow } from '../../types';
import { logOperatorAction, getOperatorFeedFor } from '../../utils/operatorAudit';

const ROLE_CATALOGUE = [
  'Tiizi Admin',
  'Tiizi Operator',
  'Content Manager',
  'Support Operator',
  'Group Steward',
  'Member',
] as const;

const PLATFORM_ROLES = ['Tiizi Admin', 'Tiizi Operator', 'Content Manager', 'Support Operator'];

// Prototype-only membership snapshots (mock detail for the management view).
const USER_GROUPS: Record<string, string[]> = {
  'user-amina': ['Nairobi Morning Movers', 'Zenith Mind & Motion'],
  'user-wanjiku': ['Nairobi Morning Movers', 'Kilimani Endurance Club', 'Zenith Mind & Motion'],
  'user-kipchoge': ['Nairobi Morning Movers', 'Kilimani Endurance Club'],
  'user-david': ['Nairobi Morning Movers'],
  'user-sarah': ['Nairobi Morning Movers', 'Zenith Mind & Motion'],
  'user-eric': ['Nairobi Morning Movers'],
};

const USER_CHALLENGES: Record<string, string[]> = {
  'user-amina': ['Walk Nairobi Together', 'Race to 100 KM', '30 Days of Morning Movement'],
  'user-wanjiku': ['Walk Nairobi Together', 'Race to 100 KM', '30 Days of Morning Movement', 'Sunrise 5K Prep Week'],
  'user-kipchoge': ['Walk Nairobi Together', 'Race to 100 KM', 'Arboretum Interval Night'],
  'user-david': ['Walk Nairobi Together', '30 Days of Morning Movement'],
  'user-sarah': ['Walk Nairobi Together', '30 Days of Morning Movement'],
  'user-eric': ['Walk Nairobi Together', 'Race to 100 KM'],
};

const USER_RECOGNITIONS: Record<string, string[]> = {
  'user-amina': ['Podium Finisher — Position #2', '30-Day Consistency record'],
  'user-wanjiku': ['Founding Group Steward record'],
  'user-kipchoge': ['First Finisher — Position #1'],
  'user-david': ['Habit Re-ignition record'],
};

type UserTab = 'overview' | 'groups' | 'challenges' | 'roles' | 'recognition' | 'support' | 'activity';

const TABS: { id: UserTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'groups', label: 'Groups' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'roles', label: 'Roles & Access' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'support', label: 'Support / Issues' },
  { id: 'activity', label: 'Activity / Audit' },
];

export const OperatorUsers: React.FC = () => {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'suspended' | 'invited' | 'inactive'>('all');
  const [users, setUsers] = useState<OperatorUserRow[]>(OPERATOR_USERS);
  const [roles, setRoles] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(OPERATOR_USERS.map((u) => [u.id, [u.role]]))
  );
  const [selected, setSelected] = useState<string>(OPERATOR_USERS[0].id);
  const [tab, setTab] = useState<UserTab>('overview');
  const [grantRole, setGrantRole] = useState<string>('Support Operator');
  const [auditTick, setAuditTick] = useState(0);

  const rows = users.filter((u) => (filter === 'all' || u.state === filter) && (!q.trim() || (u.name + u.handle).toLowerCase().includes(q.toLowerCase())));
  const user = users.find((u) => u.id === selected) ?? users[0];
  const userRoles = roles[user.id] ?? ['Member'];
  const elevated = userRoles.filter((r) => PLATFORM_ROLES.includes(r));

  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);

  const touch = (fn: () => void) => { fn(); setAuditTick((t) => t + 1); };
  void auditTick;

  const setState = (id: string, state: OperatorUserRow['state']) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, state } : u)));

  const suspend = () => {
    if (!confirmAct(`Suspend ${user.name}? Access is restricted pending review.`)) return;
    touch(() => {
      setState(user.id, 'suspended');
      logOperatorAction('User suspended', `Users › ${user.name}`, `active → suspended · reason: review pending (mock)`);
    });
  };
  const reactivate = () => {
    if (!confirmAct(`Reactivate ${user.name}? Access is restored after review.`)) return;
    touch(() => {
      setState(user.id, 'active');
      logOperatorAction('User reactivated', `Users › ${user.name}`, `suspended → active · after review (mock)`);
    });
  };
  const reviewState = () => {
    touch(() => logOperatorAction('Account state reviewed', `Users › ${user.name}`, `state confirmed: ${user.state} · roles: ${userRoles.join(', ')} (mock)`));
  };
  const grant = () => {
    if (userRoles.includes(grantRole)) return;
    if (!confirmAct(`Grant "${grantRole}" to ${user.name}?`)) return;
    touch(() => {
      setRoles((prev) => ({ ...prev, [user.id]: [...(prev[user.id] ?? []), grantRole] }));
      logOperatorAction('Role granted', `Users › ${user.name}`, `+ ${grantRole} (mock)`);
    });
  };
  const revoke = (role: string) => {
    if (!confirmAct(`Revoke "${role}" from ${user.name}?`)) return;
    touch(() => {
      setRoles((prev) => ({ ...prev, [user.id]: (prev[user.id] ?? []).filter((r) => r !== role) }));
      logOperatorAction('Role revoked', `Users › ${user.name}`, `− ${role} (mock)`);
    });
  };
  const removeElevated = () => {
    if (elevated.length === 0) return;
    if (!confirmAct(`Remove all elevated (platform) access from ${user.name}? Group Steward / Member roles stay.`)) return;
    touch(() => {
      setRoles((prev) => ({ ...prev, [user.id]: (prev[user.id] ?? []).filter((r) => !PLATFORM_ROLES.includes(r)) }));
      logOperatorAction('Elevated access removed', `Users › ${user.name}`, `removed: ${elevated.join(', ')} (mock)`);
    });
  };
  const changePlatformRole = (role: string) => {
    if (!confirmAct(`Change ${user.name}'s platform role to "${role}"? Replaces other platform roles.`)) return;
    touch(() => {
      setRoles((prev) => ({
        ...prev,
        [user.id]: [...(prev[user.id] ?? []).filter((r) => !PLATFORM_ROLES.includes(r)), role],
      }));
      logOperatorAction('Platform role changed', `Users › ${user.name}`, `platform role → ${role} (mock)`);
    });
  };

  const sessionActions = getOperatorFeedFor(`Users › ${user.name}`);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">Users</h1>
        <p className="text-xs text-zinc-500">What exists: every account. State: active / suspended / invited / inactive. Attention: suspended appeals and accuracy flags. Select a user to inspect, act, and see what changed. Mock actions need confirmation and write to the Audit Log. Impersonation is <strong>not</strong> offered.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users by name or handle..." className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl" />
        <div className="flex gap-1 bg-white border border-zinc-200 p-1 rounded-xl">
          {(['all', 'active', 'suspended', 'invited', 'inactive'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize cursor-pointer ${filter === f ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden h-fit">
          {rows.map((u) => (
            <button key={u.id} onClick={() => { setSelected(u.id); setTab('overview'); }} className={`w-full text-left p-3 flex items-center gap-3 cursor-pointer ${selected === u.id ? 'bg-orange-50/70' : 'hover:bg-zinc-50'}`}>
              <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate">{u.name} <span className="text-zinc-400 font-medium">{u.handle}</span></p>
                <p className="text-[11px] text-zinc-500">{(roles[u.id] ?? [u.role]).join(', ')} · {u.groups} groups · {u.challenges} challenges · {u.lastActive}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${u.state === 'active' ? 'bg-emerald-100 text-emerald-800' : u.state === 'suspended' ? 'bg-rose-100 text-rose-800' : u.state === 'invited' ? 'bg-sky-100 text-sky-800' : 'bg-zinc-200 text-zinc-700'}`}>{u.state}</span>
            </button>
          ))}
          {rows.length === 0 && <p className="p-6 text-xs text-zinc-500 text-center">No users match. Try clearing filters (mock).</p>}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <h2 className="font-extrabold text-sm">{user.name}</h2>
              <p className="text-[11px] text-zinc-500">{user.handle} · {userRoles.join(', ')} · {user.state}</p>
            </div>
            {user.issue && <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">needs attention</span>}
          </div>
          <div className="flex gap-1 flex-wrap">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${tab === t.id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>{t.label}</button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect</p>
              <dl className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">State</dt><dd className="font-bold capitalize">{user.state}</dd></div>
                <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Last active</dt><dd className="font-bold">{user.lastActive}</dd></div>
                <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Groups</dt><dd className="font-bold">{user.groups}</dd></div>
                <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Challenges</dt><dd className="font-bold">{user.challenges}</dd></div>
              </dl>
              {user.issue && <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900"><strong>Needs attention (mock):</strong> {user.issue}</div>}
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Act (mock — confirm → audit trail)</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={suspend} className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold rounded-lg cursor-pointer">Suspend (mock)</button>
                <button onClick={reactivate} className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold rounded-lg cursor-pointer">Reactivate (mock)</button>
                <button onClick={reviewState} className="px-3 py-1.5 bg-zinc-100 text-xs font-bold rounded-lg cursor-pointer">Review account state (mock)</button>
                <button className="px-3 py-1.5 bg-zinc-100 text-zinc-500 text-xs font-bold rounded-lg cursor-not-allowed" title="Not offered">Impersonate (not offered)</button>
              </div>
            </div>
          )}

          {tab === 'groups' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect — memberships (mock)</p>
              {(USER_GROUPS[user.id] ?? ['No group memberships in this prototype slice (mock).']).map((g) => (
                <div key={g} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl font-bold">{g}</div>
              ))}
              <p className="text-[11px] text-zinc-500">Next step: open Groups to manage the group itself.</p>
            </div>
          )}

          {tab === 'challenges' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect — participation (mock)</p>
              {(USER_CHALLENGES[user.id] ?? ['No challenge participation in this prototype slice (mock).']).map((c) => (
                <div key={c} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl font-bold">{c}</div>
              ))}
              <p className="text-[11px] text-zinc-500">Next step: open Challenges for result and flag detail.</p>
            </div>
          )}

          {tab === 'roles' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect — current roles (mock, experience-only)</p>
              <div className="flex flex-wrap gap-1.5">
                {userRoles.map((r) => (
                  <span key={r} className="inline-flex items-center gap-1 text-[11px] font-bold bg-zinc-100 px-2 py-1 rounded-lg">
                    {r}
                    {!['Member'].includes(r) && (
                      <button onClick={() => revoke(r)} className="text-rose-700 hover:underline cursor-pointer" title={`Revoke ${r} (mock · confirm → audit)`}>×</button>
                    )}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500">Group Steward is a group-level role — Tiizi Admin / Operator / Content / Support are platform roles. They never grant silent superuser power here.</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Act — grant / change (mock — confirm → audit trail)</p>
              <div className="flex flex-wrap gap-2 items-center">
                <select value={grantRole} onChange={(e) => setGrantRole(e.target.value)} className="px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg">
                  {ROLE_CATALOGUE.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
                <button onClick={grant} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">Grant role (mock)</button>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[11px] text-zinc-500">Platform role:</span>
                {PLATFORM_ROLES.map((r) => (
                  <button key={r} onClick={() => changePlatformRole(r)} className="px-2.5 py-1 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer" title={`Change platform role to ${r} (mock · confirm → audit)`}>{r}</button>
                ))}
              </div>
              <button onClick={removeElevated} disabled={elevated.length === 0} className="px-3 py-1.5 bg-white border border-rose-200 text-rose-800 text-xs font-bold rounded-lg cursor-pointer disabled:opacity-40">Remove elevated access (mock)</button>
            </div>
          )}

          {tab === 'recognition' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect — recognition records (mock)</p>
              {(USER_RECOGNITIONS[user.id] ?? ['No recognition records (mock).']).map((r) => (
                <div key={r} className="p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-xl font-bold">{r}</div>
              ))}
              <p className="text-[11px] text-zinc-500">Recognition is recorded where platform policy qualifies it — never granted by hand here.</p>
            </div>
          )}

          {tab === 'support' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Support / issues (mock)</p>
              <p className="text-zinc-600">{user.issue ?? 'No open issues for this user (mock). Recent errors: none.'}</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={suspend} className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold rounded-lg cursor-pointer">Suspend (mock)</button>
                <button onClick={reactivate} className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold rounded-lg cursor-pointer">Reactivate (mock)</button>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Recent operator actions on this user (this session + mock history)</p>
              {sessionActions.length === 0 && <p className="text-zinc-500">No session actions yet — act above and they appear here and in the Audit Log (mock).</p>}
              {sessionActions.map((a) => (
                <div key={a.id} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl"><p className="font-bold">{a.action}</p><p className="text-zinc-500">{a.actor} · {a.when} · {a.summary}</p></div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-zinc-400">Mock management only — each action needs confirmation, writes to the Audit Log, and depends on the operator's role permission.</p>
        </div>
      </div>
    </div>
  );
};

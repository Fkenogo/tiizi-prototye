import React, { useState } from 'react';
import { OPERATOR_GROUPS } from '../../data/operatorMockData';
import { CHARTER_CLAUSE_SUGGESTIONS, GROUP_CHARTERS, GROUP_COUNCILS } from '../../data/mockData';
import { GroupCharter, GroupCouncil } from '../../types';
import { logOperatorAction, getOperatorFeedFor } from '../../utils/operatorAudit';

type GroupTab = 'overview' | 'members' | 'stewards' | 'council' | 'charter' | 'challenges' | 'rules' | 'requests' | 'reports' | 'history';

const TABS: { id: GroupTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'stewards', label: 'Stewards' },
  { id: 'council', label: 'Council' },
  { id: 'charter', label: 'Charter' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'rules', label: 'Rules' },
  { id: 'requests', label: 'Join requests' },
  { id: 'reports', label: 'Reports / Flags' },
  { id: 'history', label: 'History' },
];

interface JoinRequest { name: string; date: string; status: 'pending' | 'approved' | 'rejected'; }
interface Report { text: string; status: 'open' | 'dismissed' | 'restricted'; }

const MEMBER_POOL = ['Amina Odhiambo', 'Wanjiku Kimani', 'Kipchoge Ngetich', 'David Mwangi', 'Sarah Chen', 'Eric Mutua', 'Faith Njeri', 'Peter Kamau'];

export const OperatorGroups: React.FC = () => {
  const [q, setQ] = useState('');
  const [groups, setGroups] = useState(OPERATOR_GROUPS);
  const [selected, setSelected] = useState<string>(OPERATOR_GROUPS[0].id);
  const [tab, setTab] = useState<GroupTab>('overview');
  const [meta, setMeta] = useState<Record<string, { name: string; tagline: string; location: string }>>(() =>
    Object.fromEntries(OPERATOR_GROUPS.map((g) => [g.id, { name: g.name, tagline: 'Moving early, supporting each other, staying accountable.', location: 'Nairobi, Kenya' }]))
  );
  const [stewards, setStewards] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(OPERATOR_GROUPS.map((g) => [g.id, g.stewards.split(',').map((s) => s.trim())]))
  );
  const [stewardHistory, setStewardHistory] = useState<Record<string, string[]>>({
    'grp-nairobi-movers': ['Wanjiku Kimani became steward Oct 2025 (mock)'],
    'grp-kilimani-endurance': ['Kipchoge Ngetich became steward Nov 2025 (mock)'],
    'grp-zenith-mind': ['Wanjiku Kimani became steward Dec 2025 (mock)'],
  });
  const [newSteward, setNewSteward] = useState('');
  const [councils, setCouncils] = useState<Record<string, GroupCouncil>>(GROUP_COUNCILS);
  const [councilDraft, setCouncilDraft] = useState('');
  const [charters, setCharters] = useState<Record<string, GroupCharter>>(GROUP_CHARTERS);
  const [customClause, setCustomClause] = useState('');
  const [requests, setRequests] = useState<Record<string, JoinRequest[]>>({
    'grp-nairobi-movers': [{ name: 'Faith Njeri', date: 'Sep 12', status: 'pending' }, { name: 'Brian Otieno', date: 'Sep 10', status: 'pending' }],
    'grp-kilimani-endurance': [
      { name: 'Faith Njeri', date: 'Sep 11', status: 'pending' },
      { name: 'Peter Kamau', date: 'Sep 9', status: 'pending' },
      { name: 'Grace Achieng (mock)', date: 'Sep 8', status: 'pending' },
    ],
    'grp-zenith-mind': [],
  });
  const [reports, setReports] = useState<Record<string, Report[]>>({
    'grp-nairobi-movers': [],
    'grp-kilimani-endurance': [],
    'grp-zenith-mind': [{ text: 'Member-reported cover photo (mock ×1)', status: 'open' }],
  });
  const [creationRule, setCreationRule] = useState<Record<string, 'open' | 'stewards_only'>>(() =>
    Object.fromEntries(OPERATOR_GROUPS.map((g) => [g.id, g.creationPermission]))
  );
  const [auditTick, setAuditTick] = useState(0);

  const rows = groups.filter((g) => !q.trim() || g.name.toLowerCase().includes(q.toLowerCase()));
  const group = groups.find((g) => g.id === selected) ?? groups[0];
  const m = meta[group.id];
  const council = councils[group.id] ?? { enabled: false, members: [] };
  const charter = charters[group.id] ?? { version: 'v1 · draft', state: 'draft', clauses: [], updated: '—' };
  const sessionActions = getOperatorFeedFor(`Groups › ${group.name}`);

  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);
  const touch = (fn: () => void) => { fn(); setAuditTick((t) => t + 1); };
  void auditTick;

  const act = (action: string, summary: string) =>
    touch(() => logOperatorAction(action, `Groups › ${group.name}`, summary));

  const saveMeta = () => {
    if (!confirmAct(`Save group metadata for ${m.name}? Members see name, tagline and location.`)) return;
    touch(() => {
      setGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, name: m.name } : g)));
      logOperatorAction('Group metadata edited', `Groups › ${group.name}`, `name/tagline/location updated (mock)`);
    });
  };

  const addSteward = () => {
    const name = newSteward.trim();
    if (!name) return;
    if (!confirmAct(`Add ${name} as Group Steward of ${m.name}? Distinct from Tiizi Admin/Operator roles.`)) return;
    touch(() => {
      setStewards((prev) => ({ ...prev, [group.id]: [...(prev[group.id] ?? []), name] }));
      setStewardHistory((prev) => ({ ...prev, [group.id]: [...(prev[group.id] ?? []), `${name} added as steward (mock)`] }));
      logOperatorAction('Steward added', `Groups › ${group.name}`, `${name} → Group Steward (mock)`);
      setNewSteward('');
    });
  };
  const removeSteward = (name: string) => {
    if (!confirmAct(`Remove ${name} as steward? They stay an ordinary member.`)) return;
    touch(() => {
      setStewards((prev) => ({ ...prev, [group.id]: (prev[group.id] ?? []).filter((s) => s !== name) }));
      setStewardHistory((prev) => ({ ...prev, [group.id]: [...(prev[group.id] ?? []), `${name} removed as steward (mock)`] }));
      logOperatorAction('Steward removed', `Groups › ${group.name}`, `${name} steward → member (mock)`);
    });
  };

  const toggleCouncil = () => {
    const next = !council.enabled;
    if (!confirmAct(next ? `Enable an optional council for ${m.name}? Councils are advisory configuration only — no voting authority.` : `Disable the council for ${m.name}? Configuration is kept as draft.`)) return;
    touch(() => {
      setCouncils((prev) => ({ ...prev, [group.id]: { ...council, enabled: next } }));
      logOperatorAction(next ? 'Council enabled' : 'Council disabled', `Groups › ${group.name}`, `council ${next ? 'enabled (advisory config, mock)' : 'disabled (mock)'}`);
    });
  };
  const addCouncilMember = () => {
    const name = councilDraft.trim();
    if (!name) return;
    touch(() => {
      setCouncils((prev) => ({ ...prev, [group.id]: { ...council, members: [...council.members, name] } }));
      logOperatorAction('Council member added', `Groups › ${group.name}`, `${name} → council (mock)`);
      setCouncilDraft('');
    });
  };
  const setCouncilKind = (kind: GroupCouncil['kind']) =>
    touch(() => {
      setCouncils((prev) => ({ ...prev, [group.id]: { ...council, kind } }));
      logOperatorAction('Council configured', `Groups › ${group.name}`, `council kind → ${kind} (mock)`);
    });

  const toggleClause = (clause: string) => {
    const has = charter.clauses.includes(clause);
    touch(() => {
      setCharters((prev) => ({
        ...prev,
        [group.id]: { ...charter, clauses: has ? charter.clauses.filter((c) => c !== clause) : [...charter.clauses, clause], version: `${charter.version.split(' ')[0]} · ${charter.state}` },
      }));
      logOperatorAction(has ? 'Charter clause removed' : 'Charter clause selected', `Groups › ${group.name}`, `${has ? '−' : '+'} "${clause.slice(0, 48)}…" (mock)`);
    });
  };
  const addCustomClause = () => {
    const c = customClause.trim();
    if (!c) return;
    touch(() => {
      setCharters((prev) => ({ ...prev, [group.id]: { ...charter, clauses: [...charter.clauses, c] } }));
      logOperatorAction('Charter custom clause added', `Groups › ${group.name}`, `+ custom: "${c.slice(0, 48)}…" (mock)`);
      setCustomClause('');
    });
  };
  const publishCharter = () => {
    if (!confirmAct(`Publish charter ${charter.version} for ${m.name}? Members can read it in the group.`)) return;
    touch(() => {
      setCharters((prev) => ({ ...prev, [group.id]: { ...charter, state: 'active', version: `${charter.version.split(' ')[0]} · active`, updated: 'Just now (mock)' } }));
      logOperatorAction('Charter published', `Groups › ${group.name}`, `charter → active (mock)`);
    });
  };

  const decideRequest = (idx: number, status: 'approved' | 'rejected') => {
    const r = (requests[group.id] ?? [])[idx];
    if (!confirmAct(`${status === 'approved' ? 'Approve' : 'Reject'} join request from ${r.name}?`)) return;
    touch(() => {
      setRequests((prev) => ({ ...prev, [group.id]: (prev[group.id] ?? []).map((x, i) => (i === idx ? { ...x, status } : x)) }));
      logOperatorAction(`Join request ${status}`, `Groups › ${group.name}`, `${r.name} → ${status} (mock)`);
    });
  };

  const decideReport = (idx: number, status: Report['status']) =>
    touch(() => {
      setReports((prev) => ({ ...prev, [group.id]: (prev[group.id] ?? []).map((x, i) => (i === idx ? { ...x, status } : x)) }));
      logOperatorAction(`Report ${status}`, `Groups › ${group.name}`, `report #${idx + 1} → ${status} (mock)`);
    });

  const setGroupState = (state: 'healthy' | 'restricted' | 'flagged') => {
    if (!confirmAct(`Mark ${m.name} as ${state}? ${state === 'healthy' ? 'Reactivates normal visibility.' : 'Restricts visibility pending review.'}`)) return;
    touch(() => {
      setGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, state } : g)));
      logOperatorAction(state === 'healthy' ? 'Group reactivated' : 'Group suspended', `Groups › ${group.name}`, `state → ${state} (mock)`);
    });
  };

  const setCreation = (rule: 'open' | 'stewards_only') => {
    if (!confirmAct(rule === 'open'
      ? `Set creation to open? Any ordinary member may create Challenges (product default).`
      : `Restrict creation to stewards? A valid group rule is recorded (the exception).`)) return;
    touch(() => {
      setCreationRule((prev) => ({ ...prev, [group.id]: rule }));
      setGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, creationPermission: rule } : g)));
      logOperatorAction('Creation rule changed', `Groups › ${group.name}`, `creation → ${rule === 'open' ? 'open to members' : 'stewards only'} (mock)`);
    });
  };

  const pendingCount = (requests[group.id] ?? []).filter((r) => r.status === 'pending').length;
  const openReports = (reports[group.id] ?? []).filter((r) => r.status === 'open').length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">Groups</h1>
        <p className="text-xs text-zinc-500">What exists: every group. State: healthy / restricted / flagged. Attention: {pendingCount} pending join requests and {openReports} open reports in this group. Select a group to manage it — every edit is mock, confirmed, and audit-logged. Group truth is never silently overridden.</p>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search groups..." className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-4">
        <div className="space-y-2 h-fit">
          {rows.map((g) => (
            <button key={g.id} onClick={() => { setSelected(g.id); setTab('overview'); }} className={`w-full text-left bg-white rounded-2xl border p-4 cursor-pointer ${selected === g.id ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-zinc-200 hover:border-zinc-300'}`}>
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-sm">{g.name}</h2>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${g.state === 'healthy' ? 'bg-emerald-100 text-emerald-800' : g.state === 'restricted' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{g.state}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">{g.members} members · {g.activeChallenges} active / {g.completedChallenges} done · {g.pendingRequests} join requests · {g.creationPermission === 'open' ? 'Open creation' : 'Stewards-only creation'}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-extrabold text-sm">{m.name}</h2>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${group.state === 'healthy' ? 'bg-emerald-100 text-emerald-800' : group.state === 'restricted' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{group.state}</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${tab === t.id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                {t.label}
                {t.id === 'requests' && pendingCount > 0 && <span className="ml-1 text-[10px] bg-amber-500 text-white px-1 rounded-full">{pendingCount}</span>}
                {t.id === 'reports' && openReports > 0 && <span className="ml-1 text-[10px] bg-rose-500 text-white px-1 rounded-full">{openReports}</span>}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect — metadata (mock)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Name</span>
                  <input value={m.name} onChange={(e) => setMeta((p) => ({ ...p, [group.id]: { ...m, name: e.target.value } }))} className="mt-0.5 w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Location</span>
                  <input value={m.location} onChange={(e) => setMeta((p) => ({ ...p, [group.id]: { ...m, location: e.target.value } }))} className="mt-0.5 w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
              </div>
              <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Tagline</span>
                <input value={m.tagline} onChange={(e) => setMeta((p) => ({ ...p, [group.id]: { ...m, tagline: e.target.value } }))} className="mt-0.5 w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Act (mock — confirm → audit trail)</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={saveMeta} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">Save metadata (mock)</button>
                <button onClick={() => setGroupState('restricted')} className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold rounded-lg cursor-pointer">Suspend (mock)</button>
                <button onClick={() => setGroupState('healthy')} className="px-3 py-1.5 bg-white border border-zinc-200 text-xs font-bold rounded-lg cursor-pointer">Reactivate (mock)</button>
              </div>
            </div>
          )}

          {tab === 'members' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect — roster snapshot (mock, {group.members} members)</p>
              {MEMBER_POOL.slice(0, 6).map((name) => (
                <div key={name} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between"><span className="font-bold">{name}</span><span className="text-zinc-500">{(stewards[group.id] ?? []).includes(name) ? 'Steward' : 'Member'}</span></div>
              ))}
              <p className="text-[11px] text-zinc-500">Full roster lives in the member app; this console manages stewards, council, requests and flags.</p>
            </div>
          )}

          {tab === 'stewards' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Current stewards — distinct from Tiizi Admin / Operator roles</p>
              {(stewards[group.id] ?? []).map((s) => (
                <div key={s} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between items-center">
                  <span className="font-bold">{s} <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Group Steward</span></span>
                  <button onClick={() => removeSteward(s)} className="text-[11px] font-bold text-rose-700 hover:underline cursor-pointer">Remove (mock)</button>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={newSteward} onChange={(e) => setNewSteward(e.target.value)} placeholder="Add steward by name..." className="flex-1 px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" />
                <button onClick={addSteward} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">Add steward (mock)</button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Steward history (mock)</p>
              {(stewardHistory[group.id] ?? []).map((h, i) => (<p key={i} className="text-[11px] text-zinc-500">• {h}</p>))}
            </div>
          )}

          {tab === 'council' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Optional council — advisory configuration only (mock)</p>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${council.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'}`}>{council.enabled ? 'Enabled' : 'Disabled'}</span>
                <button onClick={toggleCouncil} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">{council.enabled ? 'Disable (mock)' : 'Enable (mock)'}</button>
              </div>
              {council.enabled && (
                <>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['advisory', 'challenge_committee', 'moderation'] as const).map((k) => (
                      <button key={k} onClick={() => setCouncilKind(k)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${council.kind === k ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>{k.replace('_', ' ')}</button>
                    ))}
                  </div>
                  <input value={council.purpose ?? ''} onChange={(e) => touch(() => setCouncils((p) => ({ ...p, [group.id]: { ...council, purpose: e.target.value } })))} placeholder="Council purpose..." className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" />
                  {council.members.map((cm) => (<div key={cm} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl font-bold">{cm}</div>))}
                  <div className="flex gap-2">
                    <input value={councilDraft} onChange={(e) => setCouncilDraft(e.target.value)} placeholder="Name a council member..." className="flex-1 px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" />
                    <button onClick={addCouncilMember} className="px-3 py-1.5 bg-zinc-100 text-xs font-bold rounded-lg cursor-pointer">Add (mock)</button>
                  </div>
                  <p className="text-[11px] text-zinc-500">Steward rep: {council.stewardRep ?? (stewards[group.id] ?? [])[0] ?? '—'}. No voting authority is modelled.</p>
                </>
              )}
            </div>
          )}

          {tab === 'charter' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Charter {charter.version} · {charter.state} · updated {charter.updated}</p>
              <p className="text-[11px] text-zinc-500">Pick suggested clauses, add custom ones, then publish. Members read the active charter in the group.</p>
              {CHARTER_CLAUSE_SUGGESTIONS.map((area) => (
                <div key={area.area} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl space-y-1.5">
                  <p className="font-bold">{area.area}</p>
                  {area.clauses.map((c) => (
                    <label key={c} className="flex items-start gap-2 text-[11px] cursor-pointer">
                      <input type="checkbox" checked={charter.clauses.includes(c)} onChange={() => toggleClause(c)} className="mt-0.5 accent-orange-600" />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              ))}
              <div className="flex gap-2">
                <input value={customClause} onChange={(e) => setCustomClause(e.target.value)} placeholder="Add a custom clause..." className="flex-1 px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" />
                <button onClick={addCustomClause} className="px-3 py-1.5 bg-zinc-100 text-xs font-bold rounded-lg cursor-pointer">Add (mock)</button>
              </div>
              <div className="p-2.5 bg-white border border-zinc-200 rounded-xl">
                <p className="font-bold text-[11px] uppercase text-zinc-400">Current selection ({charter.clauses.length})</p>
                {charter.clauses.map((c) => (<p key={c} className="text-[11px] mt-1">• {c}</p>))}
              </div>
              <button onClick={publishCharter} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">Publish charter (mock · confirm → audit)</button>
            </div>
          )}

          {tab === 'challenges' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect — {group.activeChallenges} active / {group.completedChallenges} completed (mock)</p>
              <p className="text-zinc-600">Challenge truth is managed in Challenges — this tab links there. Active challenge rows, windows and results are read-only from here.</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Creation rule (product default: open to members)</p>
              <div className="flex gap-2">
                <button onClick={() => setCreation('open')} className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${creationRule[group.id] === 'open' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>Open to members (mock)</button>
                <button onClick={() => setCreation('stewards_only')} className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${creationRule[group.id] === 'stewards_only' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>Stewards only (mock rule)</button>
              </div>
            </div>
          )}

          {tab === 'rules' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Group rules (mock)</p>
              <p className="text-zinc-600">Rules mirror the charter plus the creation rule: <strong>{creationRule[group.id] === 'open' ? 'any member may create Challenges' : 'creation is steward-curated by group rule'}</strong>. Edits happen via the Charter tab and are audit-logged.</p>
            </div>
          )}

          {tab === 'requests' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Join requests — {pendingCount} pending (mock)</p>
              {(requests[group.id] ?? []).length === 0 && <p className="text-zinc-500">No requests (mock).</p>}
              {(requests[group.id] ?? []).map((r, i) => (
                <div key={i} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1"><p className="font-bold">{r.name}</p><p className="text-[11px] text-zinc-500">Requested {r.date} · <strong>{r.status}</strong></p></div>
                  {r.status === 'pending' && (
                    <div className="flex gap-1.5">
                      <button onClick={() => decideRequest(i, 'approved')} className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Approve</button>
                      <button onClick={() => decideRequest(i, 'rejected')} className="px-2.5 py-1 bg-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'reports' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Reports / flags — {openReports} open (mock)</p>
              {(reports[group.id] ?? []).length === 0 && <p className="text-zinc-500">No reports (mock).</p>}
              {(reports[group.id] ?? []).map((r, i) => (
                <div key={i} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1"><p className="font-bold">{r.text}</p><p className="text-[11px] text-zinc-500">Status: <strong>{r.status}</strong></p></div>
                  {r.status === 'open' && (
                    <div className="flex gap-1.5">
                      <button onClick={() => decideReport(i, 'dismissed')} className="px-2.5 py-1 bg-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Dismiss</button>
                      <button onClick={() => decideReport(i, 'restricted')} className="px-2.5 py-1 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Restrict (mock)</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Group history — session actions + mock seed</p>
              {sessionActions.length === 0 && <p className="text-zinc-500">No session actions yet — act above and they appear here and in the Audit Log (mock).</p>}
              {sessionActions.map((a) => (
                <div key={a.id} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl"><p className="font-bold">{a.action}</p><p className="text-zinc-500">{a.actor} · {a.when} · {a.summary}</p></div>
              ))}
              <p className="text-[11px] text-zinc-500">• Group created by steward (mock seed) · creation rule history in Audit Log.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

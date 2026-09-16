import React, { useState } from 'react';
import { DONATION_RECORDS, LOCALE_COVERAGE, ACCESS_ROLES, PLATFORM_HEALTH, HEALTH_EVENTS, AUDIT_LOG, OPERATOR_USERS } from '../../data/operatorMockData';
import { DonationRecord } from '../../types';
import { logOperatorAction, getOperatorFeed, getOperatorFeedFor } from '../../utils/operatorAudit';

// ---------- Donations / Support ----------

const KIND_LABEL: Record<DonationRecord['kind'], string> = {
  tiizi_support: 'A. General Support Tiizi',
  challenge_support: 'B. Challenge-linked Support Tiizi',
  cause_support: 'C. Community Cause support',
};

export const OperatorDonations: React.FC = () => {
  const [records, setRecords] = useState<DonationRecord[]>(DONATION_RECORDS);
  const [selected, setSelected] = useState<string | null>(null);
  const [auditTick, setAuditTick] = useState(0);
  void auditTick;

  const rec = records.find((r) => r.id === selected) ?? null;
  const sessionActions = rec ? getOperatorFeedFor(`Donations › ${rec.id}`) : [];

  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);

  const resolve = () => {
    if (!rec || !confirmAct(`Resolve attention on ${rec.id}? A resolution note is recorded.`)) return;
    setRecords((prev) => prev.map((r) => (r.id === rec.id ? { ...r, status: 'recorded' as const, history: `${r.history ?? ''} · resolved (mock)` } : r)));
    logOperatorAction('Support record resolved', `Donations › ${rec.id}`, `${rec.contributor} · ${rec.amount} → recorded (mock)`);
    setAuditTick((t) => t + 1);
  };
  const assign = () => {
    if (!rec || !confirmAct(`Assign ${rec.id} to Support for follow-up?`)) return;
    logOperatorAction('Support record assigned', `Donations › ${rec.id}`, `assigned to Support (mock)`);
    setAuditTick((t) => t + 1);
  };
  const escalate = () => {
    if (!rec || !confirmAct(`Escalate ${rec.id}?`)) return;
    logOperatorAction('Support record escalated', `Donations › ${rec.id}`, `escalated (mock)`);
    setAuditTick((t) => t + 1);
  };

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Donations / Support</h1>
      <p className="text-xs text-zinc-500">Three distinct concepts, never mixed: A. general Support Tiizi · B. optional challenge-linked Support Tiizi (voluntary, never scored) · C. Community Cause support (movement dedications + self-reported external pledges). Tiizi holds no charitable funds, verifies no totals, shows no “Amount Raised”, and implies no custody or escrow. Select a record to inspect it. Mock actions need confirmation and write to the Audit Log.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
        <div className="space-y-4">
          {(['tiizi_support', 'challenge_support', 'cause_support'] as const).map((kind) => (
            <div key={kind} className="bg-white rounded-2xl border border-zinc-200 p-4">
              <h2 className="font-extrabold text-sm">{KIND_LABEL[kind]} (mock records)</h2>
              {kind === 'challenge_support' && <p className="text-[11px] text-zinc-500 mt-0.5">Gifts members chose while joining or taking part — $0 always allowed, never affects eligibility, progress or results.</p>}
              {kind === 'cause_support' && <p className="text-[11px] text-zinc-500 mt-0.5">Movement dedications + self-reported pledges fulfilled outside Tiizi.</p>}
              <div className="mt-2 divide-y divide-zinc-100 text-xs">
                {records.filter((d) => d.kind === kind).map((d) => (
                  <button key={d.id} onClick={() => setSelected(d.id)} className={`w-full text-left py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 cursor-pointer ${selected === d.id ? 'bg-orange-50/60 rounded-xl px-2' : ''}`}>
                    <div><p className="font-bold">{d.contributor} · {d.amount}</p><p className="text-zinc-500">{d.date} · {d.channel}</p></div>
                    <div className="flex gap-1.5 items-center">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${d.status === 'recorded' ? 'bg-emerald-100 text-emerald-800' : d.status === 'attention' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-600'}`}>{d.status}</span>
                      <span className="text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded">recon: {d.reconciliation}</span>
                    </div>
                  </button>
                ))}
                {records.filter((d) => d.kind === kind).length === 0 && <p className="text-[11px] text-zinc-500 py-2">No records (mock).</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          {!rec && <p className="text-xs text-zinc-500">Select a record to inspect it (mock).</p>}
          {rec && (
            <>
              <h2 className="font-extrabold text-sm">{rec.contributor} · {rec.amount}</h2>
              <div className="text-xs space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect</p>
                <dl className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Concept</dt><dd className="font-bold">{KIND_LABEL[rec.kind]}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Date</dt><dd className="font-bold">{rec.date}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Channel</dt><dd className="font-bold">{rec.channel}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Status</dt><dd className="font-bold capitalize">{rec.status}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Reconciliation</dt><dd className="font-bold">{rec.reconciliation}</dd></div>
                  <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Linked challenge</dt><dd className="font-bold">{rec.challenge ?? '—'}</dd></div>
                </dl>
                <p><strong>Linked cause:</strong> {rec.cause ?? '— (not a cause record)'}</p>
                <p><strong>Notes:</strong> {rec.note}</p>
                <p><strong>Issue / attention history:</strong> {rec.history ?? 'none (mock)'}</p>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Act (mock — confirm → audit trail)</p>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={resolve} className="px-2.5 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Resolve (mock)</button>
                <button onClick={assign} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Assign (mock)</button>
                <button onClick={escalate} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Escalate (mock)</button>
              </div>
              <div className="text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Audit trail</p>
                {sessionActions.map((a) => (<p key={a.id} className="text-[11px] text-zinc-700 mt-0.5">• {a.action} — {a.summary}</p>))}
                {sessionActions.length === 0 && <p className="text-[11px] text-zinc-500">No session actions yet (mock).</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Content & Localisation ----------

interface ContentItem {
  id: string;
  name: string;
  kind: 'Activity' | 'Template' | 'System copy';
  en: string;
  sw: 'ready' | 'partial' | 'missing';
  readiness: 'ready' | 'needs_review' | 'missing';
  fallback: string;
  updated: string;
  editor: string;
}

const CONTENT_ITEMS: ContentItem[] = [
  { id: 'c-walk', name: 'Walking — description + form', kind: 'Activity', en: 'Ready', sw: 'ready', readiness: 'ready', fallback: '— (source)', updated: 'Aug 2026', editor: 'Content Manager (mock)' },
  { id: 'c-plank', name: 'Plank — safety guidance v3', kind: 'Activity', en: 'Ready', sw: 'missing', readiness: 'needs_review', fallback: 'en', updated: 'Sep 2026 (draft)', editor: 'Content Manager (mock)' },
  { id: 'c-side-plank', name: 'Side Plank — labels + parts', kind: 'Activity', en: 'Ready', sw: 'missing', readiness: 'missing', fallback: 'en', updated: 'Jun 2026', editor: 'Content Manager (mock)' },
  { id: 'c-medit', name: 'Mindful Meditation — overview', kind: 'Activity', en: 'Partial', sw: 'missing', readiness: 'missing', fallback: 'en', updated: 'May 2026', editor: 'Content Manager (mock)' },
  { id: 'c-tpl-morning', name: '30-Day Morning Movement — template copy', kind: 'Template', en: 'Ready', sw: 'ready', readiness: 'ready', fallback: '— (source)', updated: 'Sep 2026', editor: 'Content Manager (mock)' },
  { id: 'c-sys-streak', name: 'Streak reminders — system copy', kind: 'System copy', en: 'Ready (98%)', sw: 'partial', readiness: 'needs_review', fallback: 'en', updated: 'Sep 2026', editor: 'Tiizi Operator (mock)' },
];

export const OperatorContent: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>(CONTENT_ITEMS);
  const [selected, setSelected] = useState<string>(CONTENT_ITEMS[0].id);
  const [swDraft, setSwDraft] = useState('');
  const [auditTick, setAuditTick] = useState(0);
  void auditTick;

  const item = items.find((i) => i.id === selected) ?? items[0];
  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);
  const touch = (action: string, summary: string) => {
    logOperatorAction(action, `Content › ${item.name}`, summary);
    setAuditTick((t) => t + 1);
  };

  const addTranslation = () => {
    if (!swDraft.trim()) return;
    if (!confirmAct(`Save Swahili translation for "${item.name}"?`)) return;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, sw: 'ready' as const, readiness: 'ready' as const, updated: 'Just now (mock)' } : i)));
    touch('Translation added', `sw copy saved (mock)`);
    setSwDraft('');
  };
  const markReady = () => {
    if (!confirmAct(`Mark "${item.name}" ready? It becomes usable wherever readiness gates apply.`)) return;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, readiness: 'ready' as const, updated: 'Just now (mock)' } : i)));
    touch('Content marked ready', `readiness → ready (mock)`);
  };
  const returnRevision = () => {
    if (!confirmAct(`Return "${item.name}" for revision?`)) return;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, readiness: 'needs_review' as const, updated: 'Just now (mock)' } : i)));
    touch('Content returned', `readiness → needs_review (mock)`);
  };

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Content &amp; Localisation</h1>
      <p className="text-xs text-zinc-500">What exists: activities, templates and system copy. State: ready / needs review / missing. Attention: missing Swahili and partial coverage. Select an item to see English source, translations, fallback and history — no full CMS, just the review loop. Mock actions need confirmation and write to the Audit Log.</p></div>
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-x-auto">
        <table className="w-full text-xs min-w-[560px]">
          <thead><tr className="text-left text-[10px] uppercase text-zinc-400 border-b"><th className="p-2.5">Locale</th><th className="p-2.5">Activities</th><th className="p-2.5">Templates</th><th className="p-2.5">System copy</th><th className="p-2.5">Fallback</th><th className="p-2.5">State</th></tr></thead>
          <tbody>{LOCALE_COVERAGE.map((l) => (<tr key={l.locale} className="border-b border-zinc-50"><td className="p-2.5 font-bold">{l.label} ({l.locale})</td><td className="p-2.5">{l.activities}</td><td className="p-2.5">{l.templates}</td><td className="p-2.5">{l.systemCopy}</td><td className="p-2.5">{l.fallback}</td><td className="p-2.5"><span className={`px-1.5 py-0.5 rounded font-bold ${l.state === 'ready' ? 'bg-emerald-100 text-emerald-800' : l.state === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-600'}`}>{l.state}</span></td></tr>))}</tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden h-fit">
          {items.map((i) => (
            <button key={i.id} onClick={() => setSelected(i.id)} className={`w-full text-left p-3 cursor-pointer ${selected === i.id ? 'bg-orange-50/70' : 'hover:bg-zinc-50'}`}>
              <p className="text-xs font-bold">{i.name}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{i.kind} · sw: {i.sw} · <strong className={i.readiness === 'ready' ? 'text-emerald-700' : 'text-amber-700'}>{i.readiness.replace('_', ' ')}</strong></p>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          <h2 className="font-extrabold text-sm">{item.name}</h2>
          <div className="text-xs space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Inspect</p>
            <dl className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">English source</dt><dd className="font-bold">{item.en}</dd></div>
              <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Swahili</dt><dd className="font-bold">{item.sw}</dd></div>
              <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Readiness</dt><dd className="font-bold">{item.readiness.replace('_', ' ')}</dd></div>
              <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Fallback</dt><dd className="font-bold">{item.fallback}</dd></div>
              <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Updated</dt><dd className="font-bold">{item.updated}</dd></div>
              <div className="p-2.5 bg-zinc-50 rounded-xl"><dt className="text-[10px] uppercase font-bold text-zinc-400">Editor</dt><dd className="font-bold">{item.editor}</dd></div>
            </dl>
          </div>
          <div className="text-xs space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Act (mock — confirm → audit trail)</p>
            <div className="flex gap-2">
              <input value={swDraft} onChange={(e) => setSwDraft(e.target.value)} placeholder="Paste Swahili translation... (mock)" className="flex-1 px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" />
              <button onClick={addTranslation} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">Add translation</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={markReady} className="px-2.5 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Mark ready</button>
              <button onClick={returnRevision} className="px-2.5 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Return for revision</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Access & Roles ----------

const ROLE_SUMMARY: Record<string, string> = {
  'Tiizi Admin': 'Full console incl. roles + settings (mock)',
  'Tiizi Operator': 'Review queues, content ops, support actions (mock)',
  'Content Manager': 'Draft/publish/retire content (mock)',
  'Support Operator': 'Inspect + suspend/reactivate with audit trail (mock)',
  'Group Steward': 'Own group(s): roster, rules, challenges (mock)',
  'Member': 'Own participation only (mock)',
};

export const OperatorAccess: React.FC = () => {
  const [holders, setHolders] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    for (const u of OPERATOR_USERS) {
      map[u.role] = [...(map[u.role] ?? []), u.name];
    }
    return map;
  });
  const [selectedRole, setSelectedRole] = useState('Tiizi Operator');
  const [grantTo, setGrantTo] = useState(OPERATOR_USERS[0].id);
  const [scope, setScope] = useState<Record<string, string>>(() =>
    Object.fromEntries(ACCESS_ROLES.map((r) => [r.role, r.scope]))
  );
  const [scopeDraft, setScopeDraft] = useState('');
  const [auditTick, setAuditTick] = useState(0);
  void auditTick;

  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);
  const touch = (action: string, summary: string) => {
    logOperatorAction(action, `Access › ${selectedRole}`, summary);
    setAuditTick((t) => t + 1);
  };

  const grant = () => {
    const user = OPERATOR_USERS.find((u) => u.id === grantTo);
    if (!user || (holders[selectedRole] ?? []).includes(user.name)) return;
    if (!confirmAct(`Grant "${selectedRole}" to ${user.name}? (mock, experience-only)`)) return;
    setHolders((p) => ({ ...p, [selectedRole]: [...(p[selectedRole] ?? []), user.name] }));
    touch('Role granted', `${user.name} → ${selectedRole} (mock)`);
  };
  const revoke = (name: string) => {
    if (!confirmAct(`Revoke "${selectedRole}" from ${name}? (mock)`)) return;
    setHolders((p) => ({ ...p, [selectedRole]: (p[selectedRole] ?? []).filter((n) => n !== name) }));
    touch('Role revoked', `${name} − ${selectedRole} (mock)`);
  };
  const changeScope = () => {
    if (!scopeDraft.trim()) return;
    if (!confirmAct(`Change scope of "${selectedRole}" to "${scopeDraft.trim()}"? (mock)`)) return;
    setScope((p) => ({ ...p, [selectedRole]: scopeDraft.trim() }));
    touch('Role scope changed', `${selectedRole} scope → ${scopeDraft.trim()} (mock)`);
    setScopeDraft('');
  };

  const sessionActions = getOperatorFeedFor(`Access › ${selectedRole}`);

  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Access &amp; Roles</h1>
      <p className="text-xs text-zinc-500">Experience model only — not production RBAC. Select a role to see who holds it, grant or revoke it, change its scope, and review its history. Not every operator has universal access — scope is shown per role. Mock actions need confirmation and write to the Audit Log.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden h-fit">
          {ACCESS_ROLES.map((r) => (
            <button key={r.role} onClick={() => setSelectedRole(r.role)} className={`w-full text-left p-3 cursor-pointer ${selectedRole === r.role ? 'bg-orange-50/70' : 'hover:bg-zinc-50'}`}>
              <p className="text-xs font-bold">{r.role} <span className="ml-1 text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded">{(holders[r.role] ?? []).length} holders</span></p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{scope[r.role] ?? r.scope}</p>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          <h2 className="font-extrabold text-sm">{selectedRole}</h2>
          <p className="text-xs text-zinc-600">{ROLE_SUMMARY[selectedRole] ?? 'Experience-only role (mock).'}</p>
          <div className="text-xs space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Holders (mock) — scope: {scope[selectedRole]}</p>
            {((holders[selectedRole] ?? []).length === 0) && <p className="text-zinc-500">No holders (mock).</p>}
            {(holders[selectedRole] ?? []).map((n) => (
              <div key={n} className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between items-center">
                <span className="font-bold">{n}</span>
                <button onClick={() => revoke(n)} className="text-[11px] font-bold text-rose-700 hover:underline cursor-pointer">Revoke (mock)</button>
              </div>
            ))}
            <div className="flex gap-2 items-center flex-wrap">
              <select value={grantTo} onChange={(e) => setGrantTo(e.target.value)} className="px-2 py-1.5 text-[11px] bg-zinc-50 border border-zinc-200 rounded-lg">
                {OPERATOR_USERS.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
              </select>
              <button onClick={grant} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">Grant role (mock)</button>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <input value={scopeDraft} onChange={(e) => setScopeDraft(e.target.value)} placeholder="New scope, e.g. Own group(s) (mock)" className="flex-1 px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg" />
              <button onClick={changeScope} className="px-3 py-1.5 bg-zinc-100 text-xs font-bold rounded-lg cursor-pointer">Change scope (mock)</button>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Role history</p>
            {sessionActions.length === 0 && <p className="text-[11px] text-zinc-500">No session changes yet (mock).</p>}
            {sessionActions.map((a) => (<p key={a.id} className="text-[11px] text-zinc-700 mt-0.5">• {a.action} — {a.summary}</p>))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Health / Audit / Settings ----------

export const OperatorHealth: React.FC<{ simulatedIncident: boolean }> = ({ simulatedIncident }) => (
  <div className="space-y-4">
    <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Platform Health <span className="text-[10px] font-mono bg-zinc-200 px-1.5 py-0.5 rounded align-middle">UX SIMULATION — not real telemetry</span></h1>
    <p className="text-xs text-zinc-500">Categories with healthy / degraded / incident / maintenance. Recent events below (simulated).</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {PLATFORM_HEALTH.map((h) => {
        const forced = simulatedIncident && h.name === 'API' ? 'incident' : h.state;
        return (
          <div key={h.name} className="bg-white rounded-2xl border border-zinc-200 p-4">
            <div className="flex items-center justify-between"><p className="font-bold text-xs">{h.name}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${forced === 'healthy' ? 'bg-emerald-100 text-emerald-800' : forced === 'degraded' ? 'bg-amber-100 text-amber-800' : forced === 'incident' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'}`}>{forced}</span></div>
            <p className="text-[11px] text-zinc-500 mt-1">{h.detail}</p>
            <p className="text-[10px] text-zinc-400 mt-1">Updated: {h.updated}</p>
          </div>
        );
      })}
    </div>
    <div className="bg-white rounded-2xl border border-zinc-200 p-4">
      <h2 className="font-extrabold text-sm">Recent events (simulated)</h2>
      <ul className="mt-2 space-y-1.5 text-xs">{HEALTH_EVENTS.map((e) => (<li key={e.id} className="p-2.5 bg-zinc-50 rounded-xl"><strong>{e.time}:</strong> {e.text}</li>))}</ul>
    </div>
  </div>
);

export const OperatorAudit: React.FC = () => {
  const feed = getOperatorFeed();
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Audit Log</h1>
      <p className="text-xs text-zinc-500">What changed, who, when, where, previous/new summary. Session mock actions appear first, then the reference history (mock).</p></div>
      <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
        {feed.map((a) => (
          <div key={a.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 bg-orange-50/40">
            <span className="font-mono text-[10px] text-zinc-400 w-24 shrink-0">{a.when}</span>
            <div className="flex-1"><p className="font-bold">{a.action}</p><p className="text-zinc-500">{a.actor} · {a.where} · {a.summary}</p></div>
          </div>
        ))}
        {AUDIT_LOG.map((a) => (
          <div key={a.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="font-mono text-[10px] text-zinc-400 w-24 shrink-0">{a.when}</span>
            <div className="flex-1"><p className="font-bold">{a.action}</p><p className="text-zinc-500">{a.actor} · {a.where} · {a.summary}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OperatorSettings: React.FC = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Settings</h1>
    <p className="text-xs text-zinc-500">Operator preferences (mock). Commercial area below is explicitly placeholder.</p></div>
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 text-xs space-y-2">
      <p><strong>Environment:</strong> Prototype · <strong>Timezone default:</strong> Africa/Nairobi (EAT) · <strong>Session:</strong> mock operator</p>
      <p className="text-zinc-500">Notification routing, review SLAs and data retention are mock toggles in this reference.</p>
    </div>
    <div className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/60 p-4 sm:p-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">Experimental / Placeholder — needs founder decision</p>
      <h2 className="font-extrabold text-sm mt-1">Commercial / subscription (not a pricing system)</h2>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {[['Plan', '— (undecided)'], ['Subscription status', 'trial (mock)'], ['Billing state', '— (mock)'], ['Group entitlement', '— (if model adopts it)'], ['Trial', '30d (mock)'], ['Grace / suspended', '— (mock)']].map(([k, v]) => (
          <div key={k} className="bg-white rounded-xl border border-amber-200 p-2.5"><p className="text-[10px] uppercase font-bold text-zinc-400">{k}</p><p className="font-bold">{v}</p></div>
        ))}
      </div>
      <p className="text-[11px] text-amber-900 mt-2">Classified in assumptions register as NEEDS FOUNDER DECISION. Core UX is unaffected by these placeholders.</p>
    </div>
  </div>
);

import React from 'react';
import { DONATION_RECORDS, LOCALE_COVERAGE, ACCESS_ROLES, PLATFORM_HEALTH, HEALTH_EVENTS, AUDIT_LOG } from '../../data/operatorMockData';

export const OperatorDonations: React.FC = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Donations / Support</h1>
    <p className="text-xs text-zinc-500">A. Support Tiizi vs B. Community Cause support — strictly separated. No custodial charity processing is implied.</p></div>
    {(['tiizi_support', 'cause_support'] as const).map((kind) => (
      <div key={kind} className="bg-white rounded-2xl border border-zinc-200 p-4">
        <h2 className="font-extrabold text-sm">{kind === 'tiizi_support' ? 'A. Support Tiizi contributions (mock records)' : 'B. Community Cause support (mock records)'}</h2>
        <div className="mt-2 divide-y divide-zinc-100 text-xs">
          {DONATION_RECORDS.filter((d) => d.kind === kind).map((d) => (
            <div key={d.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div><p className="font-bold">{d.contributor} · {d.amount}</p><p className="text-zinc-500">{d.date} · {d.channel} · {d.note}</p></div>
              <div className="flex gap-1.5 items-center">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${d.status === 'recorded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{d.status}</span>
                <span className="text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded">recon: {d.reconciliation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const OperatorContent: React.FC = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Content &amp; Localisation</h1>
    <p className="text-xs text-zinc-500">Readiness by locale with fallback. Plausible mock locales only — never assume full coverage.</p></div>
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-x-auto">
      <table className="w-full text-xs min-w-[560px]">
        <thead><tr className="text-left text-[10px] uppercase text-zinc-400 border-b"><th className="p-2.5">Locale</th><th className="p-2.5">Activities</th><th className="p-2.5">Templates</th><th className="p-2.5">System copy</th><th className="p-2.5">Fallback</th><th className="p-2.5">State</th></tr></thead>
        <tbody>{LOCALE_COVERAGE.map((l) => (<tr key={l.locale} className="border-b border-zinc-50"><td className="p-2.5 font-bold">{l.label} ({l.locale})</td><td className="p-2.5">{l.activities}</td><td className="p-2.5">{l.templates}</td><td className="p-2.5">{l.systemCopy}</td><td className="p-2.5">{l.fallback}</td><td className="p-2.5"><span className={`px-1.5 py-0.5 rounded font-bold ${l.state === 'ready' ? 'bg-emerald-100 text-emerald-800' : l.state === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-600'}`}>{l.state}</span></td></tr>))}</tbody>
      </table>
    </div>
  </div>
);

export const OperatorAccess: React.FC = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Access &amp; Roles</h1>
    <p className="text-xs text-zinc-500">Experience model only — not production RBAC authority. Assigned role, scope, status, summary, recent changes.</p></div>
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-x-auto">
      <table className="w-full text-xs min-w-[620px]">
        <thead><tr className="text-left text-[10px] uppercase text-zinc-400 border-b"><th className="p-2.5">Role</th><th className="p-2.5">Scope</th><th className="p-2.5">Holders</th><th className="p-2.5">Status</th><th className="p-2.5">Summary</th><th className="p-2.5">Last change</th></tr></thead>
        <tbody>{ACCESS_ROLES.map((r) => (<tr key={r.role} className="border-b border-zinc-50"><td className="p-2.5 font-bold">{r.role}</td><td className="p-2.5">{r.scope}</td><td className="p-2.5 tabular-nums">{r.holders}</td><td className="p-2.5">{r.status}</td><td className="p-2.5 text-zinc-600">{r.summary}</td><td className="p-2.5">{r.lastChange}</td></tr>))}</tbody>
      </table>
    </div>
  </div>
);

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

export const OperatorAudit: React.FC = () => (
  <div className="space-y-4">
    <div><h1 className="text-xl sm:text-2xl font-black tracking-tight">Audit Log</h1>
    <p className="text-xs text-zinc-500">Immutable-looking history: what changed, who, when, where, previous/new summary (mock).</p></div>
    <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
      {AUDIT_LOG.map((a) => (
        <div key={a.id} className="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <span className="font-mono text-[10px] text-zinc-400 w-24 shrink-0">{a.when}</span>
          <div className="flex-1"><p className="font-bold">{a.action}</p><p className="text-zinc-500">{a.actor} · {a.where} · {a.summary}</p></div>
        </div>
      ))}
    </div>
  </div>
);

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

import React, { useState } from 'react';
import { OPERATOR_ACTIVITIES, METRIC_COMPATIBILITY, LOAD_BASIS_OPTIONS, LoadReportingBasis } from '../../data/operatorMockData';
import { OperatorActivityRow } from '../../types';
import { logOperatorAction, getOperatorFeedFor } from '../../utils/operatorAudit';

const FILTERS = ['all', 'draft', 'published', 'retired', 'eligible', 'needs_review', 'missing_content', 'missing_translation'] as const;

interface ActivityEditor extends OperatorActivityRow {
  description: string;
  components: { label: string }[];
  componentMode: 'both' | 'either' | 'none';
  versionNotes: string;
  history: string[];
}

interface CompatRow {
  activity: string;
  metric: string;
  units: string;
  eligible: boolean;
  enabled: boolean;
  loadBasis?: LoadReportingBasis;
  note: string;
}

const seedEditor = (a: OperatorActivityRow): ActivityEditor => ({
  ...a,
  description: `${a.displayName}: prototype description (mock). Safe form guidance lives with the member Activity Guide.`,
  components:
    a.id === 'act-side-plank'
      ? [{ label: 'Left Side' }, { label: 'Right Side' }]
      : a.id === 'act-single-leg-balance'
        ? [{ label: 'Left Leg' }, { label: 'Right Leg' }]
        : [],
  componentMode: a.id === 'act-side-plank' || a.id === 'act-single-leg-balance' ? 'both' : 'none',
  versionNotes: '',
  history: [`${a.version} · ${a.updated} (mock seed)`],
});

const ALL_METRICS = ['Repetitions', 'Duration', 'Distance', 'Completion', 'Weight'];

export const OperatorActivities: React.FC = () => {
  const [f, setF] = useState<(typeof FILTERS)[number]>('all');
  const [activities, setActivities] = useState<ActivityEditor[]>(OPERATOR_ACTIVITIES.map(seedEditor));
  const [selected, setSelected] = useState<string | null>(null);
  const [compat, setCompat] = useState<CompatRow[]>(METRIC_COMPATIBILITY.map((m) => ({ ...m, enabled: true })));
  const [compatActivity, setCompatActivity] = useState<string>('Loaded Squat (planned)');
  const [auditTick, setAuditTick] = useState(0);

  const rows = activities.filter((a) => {
    if (f === 'all') return true;
    if (f === 'draft' || f === 'published' || f === 'retired') return a.lifecycle === f;
    if (f === 'eligible') return a.challengeEligible;
    return a.readiness === f;
  });
  const ed = activities.find((a) => a.id === selected) ?? null;
  const sessionActions = selected ? getOperatorFeedFor(`Activities › ${activities.find((a) => a.id === selected)?.displayName ?? ''}`) : [];

  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);
  const touch = (fn: () => void) => { fn(); setAuditTick((t) => t + 1); };
  void auditTick;

  const patch = (id: string, p: Partial<ActivityEditor>) =>
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...p } : a)));

  const lifecycle = (id: string, to: OperatorActivityRow['lifecycle'], verb: string, extra?: string) => {
    const a = activities.find((x) => x.id === id);
    if (!a) return;
    if (to === 'retired' && a.lifecycle === 'published') {
      if (!confirmAct(`Retire ${a.displayName}? History is kept — future challenges can't use it.`)) return;
    } else if (!confirmAct(`${verb} ${a.displayName}?${extra ?? ''}`)) return;
    touch(() => {
      const version = to === 'published' ? `v${(parseInt(a.version.replace(/\D/g, '') || '1', 10) + 1)}` : a.version;
      patch(id, {
        lifecycle: to,
        version,
        challengeEligible: to === 'published' ? a.challengeEligible : to === 'draft' ? false : a.challengeEligible,
        history: [`${version} · ${verb} (mock)` , ...a.history],
      });
      logOperatorAction(`Activity ${verb.toLowerCase()}`, `Activities › ${a.displayName}`, `${a.lifecycle} → ${to} · history kept (mock)`);
    });
  };

  const duplicate = (id: string) => {
    const a = activities.find((x) => x.id === id);
    if (!a) return;
    touch(() => {
      const copy: ActivityEditor = { ...seedEditor(a), id: `${a.id}-copy`, code: `${a.code}-COPY`, displayName: `${a.displayName} (copy)`, lifecycle: 'draft', version: 'v1-draft', updated: 'Just now (mock)', history: ['v1-draft · duplicated (mock)', ...a.history] };
      setActivities((prev) => [copy, ...prev]);
      setSelected(copy.id);
      logOperatorAction('Activity duplicated', `Activities › ${a.displayName}`, `→ ${copy.displayName} as draft (mock)`);
    });
  };

  const createActivity = () => {
    const n = activities.length + 1;
    touch(() => {
      const fresh: ActivityEditor = {
        ...seedEditor({ id: `act-custom-${n}`, code: `CUSTOM${n}`, displayName: `New Activity ${n}`, domain: 'Fitness', category: 'Cardio', lifecycle: 'draft', readiness: 'missing_content', challengeEligible: false, metrics: '—', locales: 'en draft', version: 'v1-draft', updated: 'Just now (mock)' }),
      };
      setActivities((prev) => [fresh, ...prev]);
      setSelected(fresh.id);
      logOperatorAction('Activity created', `Activities › ${fresh.displayName}`, `created as draft (mock)`);
    });
  };

  const toggleMetric = (metric: string) => {
    if (!ed) return;
    const current = ed.metrics.split('·').map((s) => s.trim()).filter(Boolean);
    const has = current.some((c) => c.startsWith(metric));
    const next = has ? current.filter((c) => !c.startsWith(metric)) : [...current, `${metric} (?)`];
    patch(ed.id, { metrics: next.join(' · ') || '—' });
  };

  const addComponent = () => {
    if (!ed) return;
    patch(ed.id, { components: [...ed.components, { label: `Part ${ed.components.length + 1}` }], componentMode: 'both' });
  };

  const compatFor = compat.filter((c) => c.activity === compatActivity);
  const incomplete = compatFor.filter((c) => !c.eligible || !c.enabled);

  const setCompatRow = (idx: number, p: Partial<CompatRow>) =>
    setCompat((prev) => prev.map((c, i) => (i === idx ? { ...c, ...p } : c)));
  const compatIndex = (row: CompatRow) => compat.indexOf(row);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Activities &amp; Knowledge</h1>
          <p className="text-xs text-zinc-500">What exists: every activity. State: draft / published / retired. Attention: needs-review and missing translations. Select an activity to edit it — lifecycle is Draft → Published → Retired; history is never deleted. Mock actions need confirmation and write to the Audit Log.</p>
        </div>
        <button onClick={createActivity} className="px-3.5 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer self-start">+ Create Activity (mock)</button>
      </div>
      <div className="flex flex-wrap gap-1">
        {FILTERS.map((x) => (<button key={x} onClick={() => setF(x)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border capitalize cursor-pointer ${f === x ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200'}`}>{x.replace('_', ' ')}</button>))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden h-fit max-h-[560px] overflow-y-auto">
          {rows.map((a) => (
            <button key={a.id} onClick={() => setSelected(a.id)} className={`w-full text-left p-3 cursor-pointer ${selected === a.id ? 'bg-orange-50/70' : 'hover:bg-zinc-50'}`}>
              <p className="text-xs font-bold"><span className="font-mono">{a.code}</span> · {a.displayName}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                <span className={`font-bold capitalize ${a.lifecycle === 'published' ? 'text-emerald-700' : a.lifecycle === 'draft' ? 'text-amber-700' : 'text-zinc-500'}`}>{a.lifecycle}</span>
                {' · '}{a.readiness.replace('_', ' ')} · {a.challengeEligible ? 'eligible' : 'not eligible'}
              </p>
            </button>
          ))}
          {rows.length === 0 && <p className="p-6 text-xs text-zinc-500 text-center">No activities match (mock).</p>}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          {!ed && <p className="text-xs text-zinc-500">Select an activity to inspect and edit it (mock).</p>}
          {ed && (
            <>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-extrabold text-sm">{ed.displayName}</h2>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${ed.lifecycle === 'published' ? 'bg-emerald-100 text-emerald-800' : ed.lifecycle === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-700'}`}>{ed.lifecycle} · {ed.version}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Activity code</span>
                  <input value={ed.code} onChange={(e) => patch(ed.id, { code: e.target.value })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg font-mono" /></label>
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Display name</span>
                  <input value={ed.displayName} onChange={(e) => patch(ed.id, { displayName: e.target.value })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg font-bold" /></label>
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Domain</span>
                  <select value={ed.domain} onChange={(e) => patch(ed.id, { domain: e.target.value as 'Fitness' | 'Wellness' })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <option>Fitness</option><option>Wellness</option>
                  </select></label>
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Category</span>
                  <input value={ed.category} onChange={(e) => patch(ed.id, { category: e.target.value })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
              </div>
              <label className="block text-xs"><span className="text-[10px] uppercase font-bold text-zinc-400">Description</span>
                <textarea value={ed.description} onChange={(e) => patch(ed.id, { description: e.target.value })} rows={2} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" /></label>

              <div className="text-xs space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Supported metrics (toggle) + units</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_METRICS.map((m) => {
                    const on = ed.metrics.includes(m);
                    return <button key={m} onClick={() => toggleMetric(m)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border cursor-pointer ${on ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200'}`}>{m}</button>;
                  })}
                </div>
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Units summary (e.g. "Distance (km, m) · Duration (min)")</span>
                  <input value={ed.metrics} onChange={(e) => patch(ed.id, { metrics: e.target.value })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-[11px]" /></label>
              </div>

              <div className="text-xs space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Components (optional parts — values are never silently summed)</p>
                {ed.components.length === 0 && <p className="text-[11px] text-zinc-500">No components — logged as a single value (e.g. Squat).</p>}
                {ed.components.map((c, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={c.label} onChange={(e) => patch(ed.id, { components: ed.components.map((x, j) => (j === i ? { label: e.target.value } : x)) })} className="flex-1 px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" />
                    <button onClick={() => patch(ed.id, { components: ed.components.filter((_, j) => j !== i), componentMode: ed.components.length <= 2 ? 'none' : ed.componentMode })} className="text-[11px] font-bold text-rose-700 cursor-pointer">Remove</button>
                  </div>
                ))}
                <div className="flex gap-2 items-center flex-wrap">
                  <button onClick={addComponent} className="px-2.5 py-1 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">+ Add part (mock)</button>
                  {ed.components.length > 0 && (
                    <select value={ed.componentMode} onChange={(e) => patch(ed.id, { componentMode: e.target.value as 'both' | 'either' })} className="px-2 py-1 text-[11px] bg-zinc-50 border border-zinc-200 rounded-lg" title="Whether every part is required">
                      <option value="both">Require every part (e.g. Left + Right)</option>
                      <option value="either">Any part counts</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Readiness</span>
                  <select value={ed.readiness} onChange={(e) => patch(ed.id, { readiness: e.target.value as ActivityEditor['readiness'] })} className="mt-0.5 w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <option value="ready">ready</option><option value="needs_review">needs_review</option><option value="missing_content">missing_content</option><option value="missing_translation">missing_translation</option>
                  </select></label>
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Challenge eligible</span>
                  <select value={ed.challengeEligible ? 'yes' : 'no'} onChange={(e) => patch(ed.id, { challengeEligible: e.target.value === 'yes' })} className="mt-0.5 w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <option value="yes">Yes</option><option value="no">No</option>
                  </select></label>
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Locales</span>
                  <input value={ed.locales} onChange={(e) => patch(ed.id, { locales: e.target.value })} className="mt-0.5 w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
              </div>
              <label className="block text-xs"><span className="text-[10px] uppercase font-bold text-zinc-400">Version notes</span>
                <input value={ed.versionNotes} onChange={(e) => patch(ed.id, { versionNotes: e.target.value })} placeholder="What changed in this edit? (mock)" className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" /></label>

              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Lifecycle (mock — confirm → audit trail, history kept)</p>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => lifecycle(ed.id, 'draft', 'Save draft of')} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Save Draft</button>
                <button onClick={() => lifecycle(ed.id, 'published', 'Publish')} className="px-2.5 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Publish</button>
                <button onClick={() => lifecycle(ed.id, 'draft', 'Unpublish', ' Future challenges stop offering it; past records stay intact.')} className="px-2.5 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer" title="Returns future usage to draft/disabled without destroying history">Unpublish → draft</button>
                <button onClick={() => lifecycle(ed.id, 'retired', 'Retire')} className="px-2.5 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Retire</button>
                {ed.lifecycle === 'retired' && <button onClick={() => lifecycle(ed.id, 'draft', 'Restore to draft')} className="px-2.5 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Restore to draft</button>}
                <button onClick={() => duplicate(ed.id)} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Duplicate</button>
              </div>
              <div className="text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Version history (mock)</p>
                {ed.history.map((h, i) => (<p key={i} className="text-[11px] text-zinc-500 mt-0.5">• {h}</p>))}
                {sessionActions.map((a) => (<p key={a.id} className="text-[11px] text-zinc-700 mt-0.5">• {a.action} — {a.summary}</p>))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-extrabold text-sm">Metric / unit compatibility (editable mock)</h2>
            <p className="text-[11px] text-zinc-500">Only enabled + eligible combinations can be used. Incomplete rows stay blocked — nothing is guessed. Weight rows additionally record a load reporting basis.</p>
          </div>
          <select value={compatActivity} onChange={(e) => setCompatActivity(e.target.value)} className="px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg">
            {Array.from(new Set(compat.map((c) => c.activity))).map((a) => (<option key={a} value={a}>{a}</option>))}
          </select>
        </div>
        <div className="mt-2 overflow-x-auto"><table className="w-full text-[11px] min-w-[680px]">
          <thead><tr className="text-left text-zinc-400 uppercase text-[10px] border-b"><th className="p-2">Metric</th><th className="p-2">Valid units</th><th className="p-2">Enabled</th><th className="p-2">Challenge-eligible</th><th className="p-2">Load basis (Weight only)</th><th className="p-2">State</th></tr></thead>
          <tbody>{compatFor.map((row) => {
            const idx = compatIndex(row);
            return (
              <tr key={`${row.activity}-${row.metric}`} className="border-b border-zinc-50">
                <td className="p-2 font-bold">{row.metric}</td>
                <td className="p-2"><input value={row.units} onChange={(e) => { setCompatRow(idx, { units: e.target.value }); }} className="w-32 px-1.5 py-1 bg-zinc-50 border border-zinc-200 rounded font-mono" /></td>
                <td className="p-2"><input type="checkbox" checked={row.enabled} onChange={(e) => { setCompatRow(idx, { enabled: e.target.checked }); touch(() => logOperatorAction('Compatibility edited', `Activities › ${row.activity}`, `${row.metric}: enabled → ${e.target.checked} (mock)`)); }} className="accent-orange-600 w-4 h-4" /></td>
                <td className="p-2"><input type="checkbox" checked={row.eligible} onChange={(e) => { setCompatRow(idx, { eligible: e.target.checked }); touch(() => logOperatorAction('Compatibility edited', `Activities › ${row.activity}`, `${row.metric}: eligible → ${e.target.checked} (mock)`)); }} className="accent-orange-600 w-4 h-4" /></td>
                <td className="p-2">
                  {row.metric === 'Weight' ? (
                    <select value={row.loadBasis ?? 'TOTAL_LOADED_IMPLEMENT'} onChange={(e) => setCompatRow(idx, { loadBasis: e.target.value as LoadReportingBasis })} className="px-1.5 py-1 bg-zinc-50 border border-zinc-200 rounded text-[10px]">
                      {LOAD_BASIS_OPTIONS.map((o) => (<option key={o.id} value={o.id}>{o.label}</option>))}
                    </select>
                  ) : <span className="text-zinc-400">—</span>}
                </td>
                <td className="p-2">{!row.enabled ? <span className="font-bold text-zinc-500">disabled</span> : row.eligible ? <span className="font-bold text-emerald-700">usable</span> : <span className="font-bold text-amber-700">incomplete — blocked</span>}</td>
              </tr>
            );
          })}</tbody>
        </table></div>
        {incomplete.length > 0 && <p className="text-[11px] text-amber-800 mt-2">{incomplete.length} combination(s) incomplete or disabled for {compatActivity} — blocked until fixed (mock).</p>}
      </div>
    </div>
  );
};

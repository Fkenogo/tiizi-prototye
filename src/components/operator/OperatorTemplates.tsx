import React, { useState } from 'react';
import { OPERATOR_TEMPLATES } from '../../data/operatorMockData';
import { ChallengeTemplateDraft, ChallengeType, OperatorTemplateRow } from '../../types';
import { logOperatorAction, getOperatorFeedFor } from '../../utils/operatorAudit';

export interface MemberTemplateEntry {
  id: string;
  name: string;
  type: ChallengeType;
  description: string;
  durationDays: number;
  activityId?: string;
  metric?: string;
  unit?: string;
  targetValue?: number;
  activityIds?: string[];
  metrics?: string[];
  units?: string[];
  targetValues?: number[];
}

interface OperatorTemplatesProps {
  opTemplates: OperatorTemplateRow[];
  onOpTemplatesChange: (t: OperatorTemplateRow[]) => void;
  drafts: Record<string, ChallengeTemplateDraft>;
  onDraftsChange: (d: Record<string, ChallengeTemplateDraft>) => void;
  visibility: Record<string, 'members' | 'hidden'>;
  onVisibilityChange: (v: Record<string, 'members' | 'hidden'>) => void;
  memberEntries: MemberTemplateEntry[];
  onUseTemplate: (id: string) => void;
  onCreateTemplateMode: () => void;
  onPublishMemberEntry: (entry: MemberTemplateEntry) => void;
  onWithdrawMemberEntry: (id: string) => void;
}

export const draftToMemberEntry = (d: ChallengeTemplateDraft): MemberTemplateEntry => ({
  id: d.id,
  name: d.name,
  type: d.type,
  description: d.description,
  durationDays: d.durationDays,
  ...(d.activityId ? { activityId: d.activityId, metric: d.metric, unit: d.unit, targetValue: d.targetValue } : {}),
  ...(d.activityIds ? { activityIds: d.activityIds, metrics: d.metrics, units: d.units, targetValues: d.targetValues } : {}),
});

export const OperatorTemplates: React.FC<OperatorTemplatesProps> = ({
  opTemplates, onOpTemplatesChange, drafts, onDraftsChange, visibility, onVisibilityChange,
  memberEntries, onUseTemplate, onCreateTemplateMode, onPublishMemberEntry, onWithdrawMemberEntry,
}) => {
  const [selected, setSelected] = useState<string>(opTemplates[0]?.id ?? '');
  const [edit, setEdit] = useState({ name: '', description: '', durationDays: 14, editableFields: '', locales: '' });
  const [editing, setEditing] = useState(false);
  const [auditTick, setAuditTick] = useState(0);
  void auditTick;

  const tpl = opTemplates.find((t) => t.id === selected) ?? opTemplates[0];
  const draft = tpl ? drafts[tpl.id] : undefined;
  const memberEntry = tpl ? memberEntries.find((m) => m.id === tpl.id) : undefined;
  const vis = tpl ? (visibility[tpl.id] ?? 'members') : 'members';
  const sessionActions = tpl ? getOperatorFeedFor(`Templates › ${tpl.name}`) : [];

  if (!tpl) return <p className="text-xs text-zinc-500">No templates (mock).</p>;

  const confirmAct = (message: string) => window.confirm(`${message}\n\nMock action — requires confirmation and writes to the Audit Log.`);
  const touch = (fn: () => void) => { fn(); setAuditTick((t) => t + 1); };
  const patch = (id: string, p: Partial<OperatorTemplateRow>) =>
    onOpTemplatesChange(opTemplates.map((t) => (t.id === id ? { ...t, ...p } : t)));

  const startEdit = () => {
    setEdit({ name: tpl.name, description: memberEntry?.description ?? draft?.description ?? '', durationDays: memberEntry?.durationDays ?? draft?.durationDays ?? 14, editableFields: tpl.editableFields, locales: tpl.locales });
    setEditing(true);
  };
  const saveEdit = () => {
    if (tpl.status !== 'draft') return;
    touch(() => {
      patch(tpl.id, { name: edit.name, editableFields: edit.editableFields, locales: edit.locales, updated: 'Just now (mock)' });
      if (draft) onDraftsChange({ ...drafts, [tpl.id]: { ...draft, name: edit.name, description: edit.description, durationDays: edit.durationDays } });
      logOperatorAction('Template draft edited', `Templates › ${tpl.name}`, `name/description/duration/editable fields updated (mock)`);
      setEditing(false);
    });
  };

  const publish = () => {
    const entry = draft ? draftToMemberEntry(draft) : memberEntry;
    if (!confirmAct(`Publish "${tpl.name}"? It appears in member Template browse. Drafts and retired templates stay hidden.`)) return;
    touch(() => {
      patch(tpl.id, { status: 'published', updated: 'Just now (mock)' });
      if (entry) onPublishMemberEntry(entry);
      logOperatorAction('Template published', `Templates › ${tpl.name}`, `draft → published · visible to members (mock)`);
    });
  };
  const unpublish = () => {
    if (!confirmAct(`Unpublish "${tpl.name}"? Members stop seeing it; the draft stays for editing.`)) return;
    touch(() => {
      patch(tpl.id, { status: 'draft', updated: 'Just now (mock)' });
      onWithdrawMemberEntry(tpl.id);
      logOperatorAction('Template unpublished', `Templates › ${tpl.name}`, `published → draft · withdrawn from members (mock)`);
    });
  };
  const retire = () => {
    if (!confirmAct(`Retire "${tpl.name}"? History is kept; members stop seeing it.`)) return;
    touch(() => {
      patch(tpl.id, { status: 'retired', updated: 'Just now (mock)' });
      onWithdrawMemberEntry(tpl.id);
      logOperatorAction('Template retired', `Templates › ${tpl.name}`, `→ retired · history kept (mock)`);
    });
  };
  const restore = () => {
    touch(() => {
      patch(tpl.id, { status: 'draft', updated: 'Just now (mock)' });
      logOperatorAction('Template restored', `Templates › ${tpl.name}`, `retired → draft (mock)`);
    });
  };
  const duplicate = () => {
    touch(() => {
      const copy: OperatorTemplateRow = { ...tpl, id: `${tpl.id}-copy`, name: `${tpl.name} (copy)`, status: 'draft', uses: 0, updated: 'Just now (mock)', editableFields: 'all (draft)' };
      onOpTemplatesChange([copy, ...opTemplates]);
      if (draft) onDraftsChange({ ...drafts, [copy.id]: { ...draft, id: copy.id, name: copy.name } });
      setSelected(copy.id);
      logOperatorAction('Template duplicated', `Templates › ${tpl.name}`, `→ ${copy.name} as draft (mock)`);
    });
  };
  const setVis = (v: 'members' | 'hidden') => {
    touch(() => {
      onVisibilityChange({ ...visibility, [tpl.id]: v });
      logOperatorAction('Template visibility changed', `Templates › ${tpl.name}`, `visibility → ${v} (mock)`);
    });
  };

  const draftsAwaiting = opTemplates.filter((t) => t.status === 'draft').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Challenge Templates</h1>
          <p className="text-xs text-zinc-500">What exists: every template. State: draft / published / retired. Attention: {draftsAwaiting} draft(s) awaiting publication. Templates use the same creation flow as challenges — authoring ends in a Draft Template, never a live Challenge. Published templates appear in member browse; drafts and retired stay hidden. Mock actions need confirmation and write to the Audit Log.</p>
        </div>
        <button onClick={onCreateTemplateMode} className="px-3.5 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer self-start">+ Create Template (mock)</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4">
        <div className="space-y-2 h-fit">
          {opTemplates.map((t) => (
            <button key={t.id} onClick={() => { setSelected(t.id); setEditing(false); }} className={`w-full text-left bg-white rounded-2xl border p-4 cursor-pointer ${selected === t.id ? 'border-orange-500 ring-1 ring-orange-500/20' : 'border-zinc-200 hover:border-zinc-300'}`}>
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-sm">{t.name}</h2>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${t.status === 'published' ? 'bg-emerald-100 text-emerald-800' : t.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-zinc-200 text-zinc-700'}`}>{t.status}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 capitalize">{t.type} · {t.uses} uses · {t.locales} · updated {t.updated}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 space-y-3 h-fit">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-extrabold text-sm">{tpl.name}</h2>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded capitalize bg-zinc-100 text-zinc-600">{tpl.status}</span>
          </div>
          {!editing ? (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Preview</p>
              <p className="text-zinc-600">{memberEntry?.description ?? draft?.description ?? 'No description (mock).'}</p>
              <p className="text-[11px] text-zinc-500">Type: <strong>{tpl.type}</strong> · Duration: <strong>{memberEntry?.durationDays ?? draft?.durationDays ?? '—'} days</strong> · Uses: {tpl.uses} · Locales: {tpl.locales}</p>
              <p className="text-[11px] text-zinc-500">Editable fields: {tpl.editableFields}</p>
              <p className="text-[11px] text-zinc-500">Member visibility: <strong>{vis === 'members' ? 'Shown when published' : 'Hidden even if published'}</strong> · {tpl.status === 'published' && vis === 'members' ? 'In member browse now (mock).' : 'Hidden from member browse (mock).'}</p>
              {draft?.supportTiizi?.enabled && <p className="text-[11px] text-zinc-500">Optional Support Tiizi offer: on ({draft.supportTiizi.suggestedAmounts.map((a) => `$${a}`).join(', ')}{draft.supportTiizi.allowCustom ? ', custom' : ''}; {draft.supportTiizi.offerWhen}).</p>}
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Edit draft (mock — published templates edit via new draft/duplicate)</p>
              <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Name</span>
                <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg font-bold" /></label>
              <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Description</span>
                <textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} rows={2} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Duration (days)</span>
                  <input type="number" value={edit.durationDays} onChange={(e) => setEdit({ ...edit, durationDays: Number(e.target.value) })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
                <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Locales</span>
                  <input value={edit.locales} onChange={(e) => setEdit({ ...edit, locales: e.target.value })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
              </div>
              <label className="block"><span className="text-[10px] uppercase font-bold text-zinc-400">Allowed editable fields</span>
                <input value={edit.editableFields} onChange={(e) => setEdit({ ...edit, editableFields: e.target.value })} className="mt-0.5 w-full px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg" /></label>
              <div className="flex gap-2">
                <button onClick={saveEdit} className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-lg cursor-pointer">Save Draft (mock)</button>
                <button onClick={() => setEditing(false)} className="px-3 py-1.5 bg-zinc-100 text-xs font-bold rounded-lg cursor-pointer">Cancel</button>
              </div>
            </div>
          )}
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">View / build</p>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => onUseTemplate(tpl.id)} className="px-2.5 py-1.5 bg-orange-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Preview / build via Wizard</button>
            <button onClick={duplicate} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Duplicate (mock)</button>
            {tpl.status === 'draft' && !editing && <button onClick={startEdit} className="px-2.5 py-1.5 bg-zinc-100 text-[11px] font-bold rounded-lg cursor-pointer">Edit draft (mock)</button>}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Act (mock — confirm → audit trail)</p>
          <div className="flex flex-wrap gap-1.5">
            {tpl.status === 'draft' && <button onClick={publish} className="px-2.5 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg cursor-pointer">Publish (mock)</button>}
            {tpl.status === 'published' && <button onClick={unpublish} className="px-2.5 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer" title="Withdraw from member browse; draft kept">Unpublish / withdraw (mock)</button>}
            {tpl.status !== 'retired' && <button onClick={retire} className="px-2.5 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Retire (mock)</button>}
            {tpl.status === 'retired' && <button onClick={restore} className="px-2.5 py-1.5 bg-white border border-zinc-200 text-[11px] font-bold rounded-lg cursor-pointer">Restore to draft (mock)</button>}
          </div>
          <div className="flex gap-1.5 items-center text-xs">
            <span className="text-[11px] text-zinc-500">Visibility:</span>
            <button onClick={() => setVis('members')} className={`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${vis === 'members' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>Members</button>
            <button onClick={() => setVis('hidden')} className={`px-2 py-1 text-[11px] font-bold rounded-lg cursor-pointer ${vis === 'hidden' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>Hidden</button>
          </div>
          <div className="text-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">History (mock)</p>
            {sessionActions.map((a) => (<p key={a.id} className="text-[11px] text-zinc-700 mt-0.5">• {a.action} — {a.summary}</p>))}
            <p className="text-[11px] text-zinc-500 mt-0.5">• Created {tpl.updated} · {tpl.uses} member uses (mock seed).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

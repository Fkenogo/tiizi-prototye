import React, { useState } from 'react';
import { Member, Group, Challenge, NotificationPreference } from '../../types';
import { Award, Bell, Globe, Lock, LifeBuoy, User } from 'lucide-react';

const ALL_PREFS: { id: NotificationPreference; label: string }[] = [
  { id: 'group_invite', label: 'Group invitations' },
  { id: 'challenge_invite', label: 'Challenge invitations' },
  { id: 'challenge_start', label: 'Challenge starts' },
  { id: 'challenge_end', label: 'Challenge ends' },
  { id: 'streak_reminder', label: 'Streak action reminders' },
  { id: 'collective_milestone', label: 'Collective milestones' },
  { id: 'kudo', label: 'Kudos on my activity' },
  { id: 'recognition', label: 'Platform Recognition issued' },
  { id: 'moderation', label: 'Moderation / system messages' },
];

export const ProfileFullView: React.FC<{ member: Member; groups: Group[]; challenges: Challenge[] }> = ({ member, groups, challenges }) => {
  const [tab, setTab] = useState<'identity' | 'settings'>('identity');
  const [prefs, setPrefs] = useState<NotificationPreference[]>(['group_invite', 'challenge_invite', 'challenge_start', 'challenge_end', 'streak_reminder', 'collective_milestone', 'kudo', 'recognition', 'moderation']);
  const [lang, setLang] = useState('English');
  const [showToNonMembers, setShowToNonMembers] = useState(true);
  const myChallenges = challenges.filter((c) => c.participants.some((p) => p.memberId === member.id));
  const toggle = (p: NotificationPreference) => setPrefs((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-4">
        <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-500/30" />
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">{member.name}</h1>
          <p className="text-xs text-zinc-500">{member.handle} · {member.location} · Joined {member.joinedDate}</p>
          <p className="text-xs text-zinc-600 mt-1">{member.bio}</p>
        </div>
      </div>
      <div className="flex gap-1.5 bg-zinc-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('identity')} className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${tab === 'identity' ? 'bg-white shadow text-zinc-900' : 'text-zinc-600'}`}>Identity &amp; history</button>
        <button onClick={() => setTab('settings')} className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${tab === 'settings' ? 'bg-white shadow text-zinc-900' : 'text-zinc-600'}`}>Preferences &amp; settings</button>
      </div>
      {tab === 'identity' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Groups ({groups.length}) · Active challenges ({myChallenges.length}) · Completed ({member.stats.challengesCompleted})</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">{groups.slice(0, 6).map((g) => (<span key={g.id} className="text-[11px] font-semibold bg-zinc-100 px-2 py-1 rounded-lg">{g.name}</span>))}</div>
            <div className="mt-3 space-y-1.5">{myChallenges.map((c) => (<div key={c.id} className="text-xs p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl"><span className="font-bold">{c.title}</span> <span className="text-zinc-500">· {c.groupName} · {c.type} · {c.status}</span></div>))}</div>
          </div>
          <div className="bg-white rounded-2xl border border-amber-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Platform Recognition (policy-qualified — not automatic)</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Challenge Engine → Derived Truth → Platform Policy → Recognition record. Not every governed outcome qualifies. Kudos are separate peer encouragement and never count as Recognition.</p>
            <div className="mt-2 space-y-2">{(member.recognitions ?? []).map((r) => (<div key={r.id} className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs"><p className="font-bold text-zinc-900">{r.title}</p><p className="text-zinc-600">{r.summary}</p><p className="text-[11px] text-zinc-500 mt-1">{r.challengeTitle} · {r.issuedAt} · {r.governedProof}</p></div>))}
              {(!member.recognitions || member.recognitions.length === 0) && <p className="text-xs text-zinc-500">No recognitions yet. Kudos from peers appear in the community feed, not here.</p>}</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5"><Bell className="w-3.5 h-3.5" /> Notification preferences (purposeful only)</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">{ALL_PREFS.map((p) => (<label key={p.id} className="flex items-center gap-2 text-xs p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl cursor-pointer"><input type="checkbox" checked={prefs.includes(p.id)} onChange={() => toggle(p.id)} className="accent-orange-600 w-4 h-4" /><span className="font-medium">{p.label}</span></label>))}</div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Language preference</h3>
            <div className="flex gap-1.5">{['English', 'Kiswahili'].map((l) => (<button key={l} onClick={() => setLang(l)} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${lang === l ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-600 border-zinc-200'}`}>{l}{l === 'Kiswahili' ? ' (partial mock)' : ''}</button>))}</div>
            <p className="text-[11px] text-zinc-500">Some content unavailable in Kiswahili falls back to English (mock locale fallback).</p>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Privacy controls + account</h3>
            <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={showToNonMembers} onChange={(e) => setShowToNonMembers(e.target.checked)} className="accent-orange-600 w-4 h-4" /> Show my profile to non-members</label>
            <div className="flex flex-wrap gap-2 pt-1">
              <button className="px-3.5 py-1.5 bg-zinc-100 text-xs font-bold rounded-lg cursor-pointer">Export my data (mock)</button>
              <button className="px-3.5 py-1.5 bg-zinc-100 text-xs font-bold rounded-lg cursor-pointer">Deactivate account (mock)</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5"><LifeBuoy className="w-3.5 h-3.5" /> Support / help</h3>
            <p className="text-xs text-zinc-600 mt-1">Prototype help: groups, challenges, streak rules, recognition vs kudos. Contact steward or Tiizi support (mock).</p>
          </div>
        </div>
      )}
    </div>
  );
};

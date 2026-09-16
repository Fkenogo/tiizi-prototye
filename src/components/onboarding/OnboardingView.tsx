import React, { useState } from 'react';
import { OnboardingPersonaState } from '../../types';
import { Flame, Users, Trophy, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

const STATES: OnboardingPersonaState[] = [
  { id: 'brand_new', title: 'Brand new to Tiizi', description: 'What is Tiizi, why Groups, what a Challenge is, and what participation means.', nextSteps: ['Explore what Tiizi is below', 'Discover a Group', 'Preview a Challenge before joining'] },
  { id: 'no_group', title: 'No Group yet', description: 'You have an account but have not joined a community circle. Groups host every Challenge.', nextSteps: ['Browse Community Groups', 'Request to join or accept an invite', 'Then find a Challenge inside your Group'] },
  { id: 'in_group_no_challenge', title: 'In a Group, no Challenge', description: 'You belong to a circle but have no active commitment. Discovery is the next move.', nextSteps: ['Open your Group hub', 'Browse upcoming + active Challenges', 'Join one — logging unlocks after joining'] },
  { id: 'invited_group', title: 'Invited to a Group', description: 'Someone invited you. Review the circle, its stewards and rules, then accept.', nextSteps: ['Review the invitation (expires in 7 days in prototype)', 'Accept to enter the Group hub', 'Meet stewards and active Challenges'] },
  { id: 'invited_challenge', title: 'Invited to a Challenge', description: 'Preview what is involved, when it runs, and what you will do before committing.', nextSteps: ['Preview the Challenge (no logging yet)', 'Join the Challenge', 'Log your first activity on start day'] },
  { id: 'active_commitments', title: 'Active commitments', description: 'You have joined Challenges. Today tells you exactly what to do next.', nextSteps: ['Open Today for ordered actions', 'Complete streak requirements before day-end', 'Cheer community moments with Kudos'] },
];

export const OnboardingView: React.FC<{ onBrowseGroups: () => void; onBrowseChallenges: () => void; onOpenToday: () => void }> = ({
  onBrowseGroups, onBrowseChallenges, onOpenToday,
}) => {
  const [active, setActive] = useState<OnboardingPersonaState['id']>('brand_new');
  const state = STATES.find((s) => s.id === active)!;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="border-b border-zinc-200 pb-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">Welcome to Tiizi</p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 mt-1">Move together. Stay accountable.</h1>
        <p className="text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
          Tiizi is group fitness &amp; wellness built on shared Challenges inside community Groups.
          Groups host. Challenges commit. Participation — joining a Challenge yourself, then logging your activities — is what moves the group forward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <Users className="w-5 h-5 text-orange-600 mb-2" />
          <h3 className="font-extrabold text-sm text-zinc-900">Why Groups?</h3>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">Accountability lives in circles: stewards, rules, rosters and shared rhythm. Every Challenge is hosted inside a Group — never floating alone.</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <Trophy className="w-5 h-5 text-amber-600 mb-2" />
          <h3 className="font-extrabold text-sm text-zinc-900">What is a Challenge?</h3>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">A shared commitment: Together (one shared total), Race (finish your goal), or Streak (a little every day). Each one lists its activities, goal, and schedule.</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <Activity className="w-5 h-5 text-emerald-600 mb-2" />
          <h3 className="font-extrabold text-sm text-zinc-900">What is participation?</h3>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">Being in a Group doesn't automatically join you to its Challenges. You join each Challenge yourself — only then does logging count. Creators are never joined automatically.</p>
        </div>
      </div>

      <div className="bg-zinc-900 text-white rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <h2 className="font-extrabold text-sm">Where are you right now? Pick your starting state</h2>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {STATES.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${active === s.id ? 'bg-orange-600 border-orange-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}>
              {s.title}
            </button>
          ))}
        </div>
        <p className="text-sm font-bold">{state.title}</p>
        <p className="text-xs text-zinc-300 mt-0.5">{state.description}</p>
        <ul className="mt-3 space-y-1.5">
          {state.nextSteps.map((n, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-zinc-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <span>{i + 1}. {n}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={onBrowseGroups} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5">Discover a Group <ArrowRight className="w-3.5 h-3.5" /></button>
          <button onClick={onBrowseChallenges} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl border border-zinc-700 cursor-pointer">Find a Challenge</button>
          <button onClick={onOpenToday} className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl cursor-pointer">What should I do next? → Today</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 bg-white border border-zinc-200 rounded-2xl"><p className="font-bold text-zinc-900">How do I join?</p><p className="text-zinc-600 mt-1">Open a Group → preview a Challenge → Join affirmatively. Logging unlocks only after joining.</p></div>
        <div className="p-4 bg-white border border-zinc-200 rounded-2xl"><p className="font-bold text-zinc-900">How do I create or discover a Group?</p><p className="text-zinc-600 mt-1">Directory search by name, place or focus. Create needs a name, story, location and rules.</p></div>
        <div className="p-4 bg-white border border-zinc-200 rounded-2xl"><p className="font-bold text-zinc-900">No forced setup</p><p className="text-zinc-600 mt-1">Prototype never blocks browsing. Join and log only when you choose a commitment.</p></div>
      </div>
    </div>
  );
};

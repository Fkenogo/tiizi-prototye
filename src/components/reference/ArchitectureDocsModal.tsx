import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Compass,
  CheckCircle2,
  Users,
  Flame,
  Award,
  Calendar,
  Layers,
  Shield,
  Clock,
  Activity,
  Sparkles,
} from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<'ia' | 'engines' | 'flows' | 'questions'>('ia');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400">
                  Engineering Experience Reference
                </span>
                <span className="text-xs text-zinc-400">• v2.0 Greenfield</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                Tiizi UX Architecture & Product Thesis
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation tabs inside modal */}
        <div className="bg-zinc-100 px-5 border-b border-zinc-200 flex items-center gap-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSection('ia')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'ia'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            1. Information Architecture & Navigation
          </button>
          <button
            onClick={() => setActiveSection('engines')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'engines'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            2. The 3 Challenge Engines
          </button>
          <button
            onClick={() => setActiveSection('questions')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'questions'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            3. Experience Questions Solved
          </button>
          <button
            onClick={() => setActiveSection('flows')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'flows'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-600 hover:text-zinc-900'
            }`}
          >
            4. Journeys Checklist (A — L)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 text-xs text-zinc-700 leading-relaxed">
          {/* SECTION 1: IA & Navigation */}
          {activeSection === 'ia' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900 mb-1">
                  Navigational Hypothesis: Today-Driven Hybrid Hierarchy
                </h3>
                <p>
                  Tiizi rejects the legacy 5-tab generic mobile shell (Home / Groups / + / Challenges / Profile).
                  Instead, the primary entry point is organized around the immediate human question:
                  <strong className="text-zinc-900"> "What should I do right now?"</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h4 className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Today (Immediate Action)</span>
                  </h4>
                  <p className="text-zinc-600">
                    Surfaces uncompleted streak items, daily countdown to timezone boundary (EAT), group momentum, and 1-tap quick logging.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h4 className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>Challenges (Governed Undertakings)</span>
                  </h4>
                  <p className="text-zinc-600">
                    Filterable by family (Collective, Competitive, Streak), active vs. completed, and affirmative joining requirements.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h4 className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-orange-500" />
                    <span>Groups (Social Accountability Context)</span>
                  </h4>
                  <p className="text-zinc-600">
                    Houses community identity, stewards, membership rosters, and challenge launches. Preserves the rule: <em>Group Membership ≠ Challenge Participation</em>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <h4 className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-orange-500" />
                    <span>Activity Guide (Canonical Truth)</span>
                  </h4>
                  <p className="text-zinc-600">
                    Fitness & Wellness catalogue with execution form, precautions, bilateral components (Left/Right), and governed metrics.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: The 3 Engines */}
          {activeSection === 'engines' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>Engine A: Collective Challenge (Shared Target)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded">
                    Exceedable &gt; 100%
                  </span>
                </div>
                <p className="text-zinc-700 leading-relaxed">
                  • Individual contributions accumulate into collective progress.<br />
                  • Target can exceed 100% (e.g. 524 / 500 km = 104%). The full contribution that crosses the goal counts.<br />
                  • Emphasizes shared momentum, contributor breakdown, and collective milestone celebration rather than a competitive leaderboard.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-rose-950 flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose-700" />
                    <span>Engine B: Competitive Challenge (Standard Competition Ranking)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-rose-800 uppercase bg-rose-100 px-2 py-0.5 rounded">
                    Ties: 1, 2, 2, 4
                  </span>
                </div>
                <p className="text-zinc-700 leading-relaxed">
                  • Finishing order is recorded. One person finishing does not end the challenge.<br />
                  • Standard competition ranking is used (1, 2, 2, 4). Tied participants share podium rank, and subsequent rank skips.<br />
                  • Participants who have not yet reached the 100 km goal are grouped cleanly as active in-progress without receiving an artificial rank.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-orange-950 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-700" />
                    <span>Engine C: Daily Streak Challenge (Consistency Over Ranking)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-orange-800 uppercase bg-orange-100 px-2 py-0.5 rounded">
                    Strict Reset • No Leaderboard
                  </span>
                </div>
                <p className="text-zinc-700 leading-relaxed">
                  • Daily cadence with strict midnight boundary governed by the Challenge timezone (e.g. Africa/Nairobi EAT).<br />
                  • All configured daily requirements must be completed for that day to count.<br />
                  • A missed day strictly resets <strong>Current Streak</strong> to 0, while <strong>Days Completed</strong> (cumulative) and <strong>Best Streak</strong> remain preserved.<br />
                  • No leaderboard: displays group consistency roster with today's completion status.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: Questions Solved */}
          {activeSection === 'questions' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-1">
                  Q: How should Fitness and Wellness coexist?
                </h4>
                <p className="text-zinc-600">
                  A: As equal citizens in the canonical catalogue and multi-activity challenge creator. A streak challenge can require both a 15-min brisk walk and a 5-min diaphragmatic breathwork practice without treating wellness as an afterthought.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-1">
                  Q: How does Activity Logging become almost effortless?
                </h4>
                <p className="text-zinc-600">
                  A: The logging modal only presents fields governed by the selected challenge. No extraneous calorie, heart rate, or wearable metrics. Immediate feedback clearly communicates engine impact (e.g. "+6.2 km applied to shared goal!").
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-1">
                  Q: How should community activity support accountability without becoming social noise?
                </h4>
                <p className="text-zinc-600">
                  A: Tiizi has no universal public social feed, infinite comments, or follow counts. Instead, social interactions focus on contextual moments: milestone kudos, finish celebrations, and streak continuity cheers.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-1">
                  Q: How can Templates accelerate creation without creating a second system?
                </h4>
                <p className="text-zinc-600">
                  A: Templates are simply pre-populated shortcuts into the unified 5-step Challenge Creation Wizard. The creator reviews and adjusts the pre-filled parameters through the standard guided flow.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: Journeys Checklist */}
          {activeSection === 'flows' && (
            <div className="space-y-2">
              {[
                { id: 'A', name: 'New Member & Onboarding', desc: 'Browse ethos, discover Nairobi Morning Movers, inspect active challenges, join.' },
                { id: 'B', name: 'Create Group & Stewardship', desc: 'Establish identity, rules, member roster, and become group steward.' },
                { id: 'C', name: 'Create Collective Challenge', desc: 'Walk Nairobi Together 500 km shared target with live rule summary.' },
                { id: 'D', name: 'Create Competitive Race', desc: 'Race to 100 KM with standard competition podium ranking (1, 2, 2, 4).' },
                { id: 'E', name: 'Create Streak Challenge', desc: '30 Days of Morning Movement with multi-activity daily checklist.' },
                { id: 'F', name: 'Join Challenge Affirmatively', desc: 'Distinguishes between Group Membership and Challenge Participation.' },
                { id: 'G', name: 'Log Activity & Engine Acceptance', desc: 'Fast adaptive submission with immediate milestone feedback.' },
                { id: 'H', name: 'Collective Progress & Over-100% Target', desc: 'Real-time accumulation bar that can exceed 100%.' },
                { id: 'I', name: 'Competitive Standings & Finish Order', desc: 'Standard competition ranking with tied podium spots.' },
                { id: 'J', name: 'Streak Participation & Reset Demonstration', desc: 'Demonstrates active streak vs David Mwangi missed-yesterday reset.' },
                { id: 'K', name: 'Challenge Completion & Run Again', desc: 'Immutable historical results; Run Again spawns a new cycle with the same setup and 0 participants (rejoin affirmatively).' },
                { id: 'L', name: 'Community Moments & Kudos', desc: 'Lightweight social encouragement without social media clutter.' },
              ].map((j) => (
                <div key={j.id} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {j.id}
                  </span>
                  <div>
                    <h4 className="font-bold text-zinc-900">{j.name}</h4>
                    <p className="text-zinc-600 mt-0.5">{j.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

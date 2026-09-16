import React from 'react';
import { Member } from '../../types';
import { ALL_MEMBERS } from '../../data/mockData';
import {
  X,
  Compass,
  Users,
  Layers,
  Sparkles,
  TrendingUp,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Flame,
  Award,
} from 'lucide-react';

interface ReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: Member;
  onSwitchMember: (member: Member) => void;
  onSelectJourney: (journeyId: string) => void;
  onOpenArchitectureDocs: () => void;
  onOpenAssumptionsRegister?: () => void;
  onToggleExceededState: () => void;
  targetExceeded: boolean;
}

export const ReferenceDrawer: React.FC<ReferenceDrawerProps> = ({
  isOpen,
  onClose,
  currentMember,
  onSwitchMember,
  onSelectJourney,
  onOpenArchitectureDocs,
  onOpenAssumptionsRegister,
  onToggleExceededState,
  targetExceeded,
}) => {
  if (!isOpen) return null;

  const journeys = [
    {
      id: 'journey-today',
      title: 'Journey 1: Action-Oriented Today',
      description: 'Prioritizes daily streak checklist, active team progress, and contextual logging.',
      badge: 'Action Home',
    },
    {
      id: 'journey-collective',
      title: 'Journey 2: Collective Challenge Engine',
      description: 'Shared community target; tracks collective milestones and allows >100% over-achievement.',
      badge: 'Shared Goal',
    },
    {
      id: 'journey-competitive',
      title: 'Journey 3: Competitive Race Engine',
      description: 'Race to finish with governed rank calculation (1, 2, 2, 4 tie-breakers) and finish podium.',
      badge: 'Podium Race',
    },
    {
      id: 'journey-streak',
      title: 'Journey 4: Daily Streak Consistency',
      description: 'Non-competitive habit engine with strict daily reset, timezones, and no leaderboards.',
      badge: 'Habit Engine',
    },
    {
      id: 'journey-create',
      title: 'Journey 5: Challenge Creation Wizard',
      description: 'Natural language configuration preview with canonical activity validation.',
      badge: 'Creation Flow',
    },
    {
      id: 'journey-catalogue',
      title: 'Journey 6: Canonical Activity Guide',
      description: 'Governed activity ontology with canonical metrics, units, and form guidance.',
      badge: 'Knowledge',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-900 text-zinc-100 shadow-2xl flex flex-col border-l border-zinc-800">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Experience Reference</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    V2 Spec
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Engineering prototype states & governed engines
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
            {/* Section 1: Persona Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-zinc-400 text-[11px] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-orange-400" />
                  Active Persona Context
                </span>
                <span className="text-[10px] text-zinc-500">
                  Testing different member roles
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {ALL_MEMBERS.map((member) => {
                  const isSelected = member.id === currentMember.id;
                  let personaTag = 'Member';
                  if (member.id === 'user-wanjiku') personaTag = 'Group Steward & Creator';
                  if (member.id === 'user-david') personaTag = 'Streak Missed Yesterday';
                  if (member.id === 'user-kipchoge') personaTag = '1st Finisher • Top Distance';
                  if (member.id === 'user-amina') personaTag = 'Active Streak (17 Days)';

                  return (
                    <button
                      key={member.id}
                      onClick={() => onSwitchMember(member)}
                      className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500/10 border-orange-500/50 text-white ring-1 ring-orange-500/30'
                          : 'bg-zinc-800/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-white truncate text-xs">
                            {member.name}
                          </p>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-orange-300 font-semibold mt-0.5">
                          {personaTag}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                          {member.bio}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Engine State Simulations */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <span className="font-bold uppercase tracking-wider text-zinc-400 text-[11px] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Governed Engine State Controls
              </span>

              <div className="p-3.5 rounded-xl bg-zinc-800/70 border border-zinc-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Collective Target Over-Achievement</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Verify &gt;100% accumulation (524 km of 500 km goal)
                    </p>
                  </div>
                  <button
                    onClick={onToggleExceededState}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      targetExceeded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    {targetExceeded ? 'Exceeded (105%)' : 'Active (87%)'}
                  </button>
                </div>
                <div className="text-[11px] text-zinc-400 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800">
                  <span className="font-semibold text-zinc-200">Product Truth: </span>
                  Collective challenges do not stop at 100%. Accumulated contributions continue until the scheduled deadline.
                </div>
              </div>
            </div>

            {/* Section 3: Engineering Journeys Quick-Jump */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <span className="font-bold uppercase tracking-wider text-zinc-400 text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Quick Journey Verification
              </span>

              <div className="space-y-2">
                {journeys.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => {
                      onSelectJourney(j.id);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-200 group-hover:text-white">
                        {j.title}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-700/60 px-2 py-0.5 rounded">
                        {j.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {j.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Architecture & Domain Truth */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              {onOpenAssumptionsRegister && (
                <button
                  onClick={() => {
                    onOpenAssumptionsRegister();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/90 border border-amber-500/40 text-amber-300 font-bold transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Governed Assumptions Register (10)</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                </button>
              )}

              <button
                onClick={() => {
                  onOpenArchitectureDocs();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-linear-to-r from-orange-950/40 to-amber-950/20 border border-orange-500/30 text-orange-300 hover:text-orange-200 font-bold transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-400" />
                  <span>Open Architecture & Product Truth Docs</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

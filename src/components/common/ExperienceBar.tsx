import React, { useState } from 'react';
import { Member } from '../../types';
import { ALL_MEMBERS } from '../../data/mockData';
import {
  Compass,
  Users,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface ExperienceBarProps {
  currentMember: Member;
  onSwitchMember: (member: Member) => void;
  onSelectJourney: (journeyId: string) => void;
  onOpenArchitectureDocs: () => void;
  onToggleExceededState?: () => void;
  targetExceeded: boolean;
}

export const ExperienceBar: React.FC<ExperienceBarProps> = ({
  currentMember,
  onSwitchMember,
  onSelectJourney,
  onOpenArchitectureDocs,
  onToggleExceededState,
  targetExceeded,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Engineering Experience Reference"
      className="bg-zinc-900 text-zinc-100 border-b border-zinc-800 text-xs select-none transition-all sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Badge & Persona Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-md font-semibold tracking-wide uppercase text-[10px]">
            <Compass className="w-3 h-3" />
            <span>Experience Reference</span>
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-md border border-zinc-700/60">
            <span className="text-zinc-400 text-[11px]">Viewing as:</span>
            <select
              value={currentMember.id}
              onChange={(e) => {
                const found = ALL_MEMBERS.find((m) => m.id === e.target.value);
                if (found) onSwitchMember(found);
              }}
              className="bg-transparent text-white font-medium text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="user-amina" className="bg-zinc-900 text-white">
                Amina (Active Member • 17d Streak)
              </option>
              <option value="user-wanjiku" className="bg-zinc-900 text-white">
                Wanjiku (Group Steward & Creator)
              </option>
              <option value="user-david" className="bg-zinc-900 text-white">
                David (Missed Streak Yesterday)
              </option>
              <option value="user-kipchoge" className="bg-zinc-900 text-white">
                Kipchoge (1st Finisher • Top Distance)
              </option>
            </select>
          </div>

          {onToggleExceededState && (
            <button
              onClick={onToggleExceededState}
              className={`px-2 py-1 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-colors ${
                targetExceeded
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
              }`}
              title="Simulate Collective target exceeding 100% (524 km / 500 km)"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Target: {targetExceeded ? 'Exceeded (105%)' : '87% Active'}</span>
            </button>
          )}
        </div>

        {/* Right: Quick Journeys & Architecture Docs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden md:flex items-center gap-1 text-[11px]">
            <span className="text-zinc-400 mr-1">Journeys:</span>
            <button
              onClick={() => onSelectJourney('journey-today')}
              className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
            >
              J: Today Action
            </button>
            <button
              onClick={() => onSelectJourney('journey-collective')}
              className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
            >
              C: Collective
            </button>
            <button
              onClick={() => onSelectJourney('journey-competitive')}
              className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
            >
              D: Competitive (1,2,2,4)
            </button>
            <button
              onClick={() => onSelectJourney('journey-streak')}
              className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 transition-colors"
            >
              E: Streak (Missed/Done)
            </button>
            <button
              onClick={() => onSelectJourney('journey-create')}
              className="px-1.5 py-0.5 bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 border border-orange-500/30 rounded transition-colors"
            >
              + Create Wizard
            </button>
          </div>

          <button
            onClick={onOpenArchitectureDocs}
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-900 px-2.5 py-1 rounded-md font-semibold text-xs transition-colors shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-600" />
            <span>UX Architecture Reference</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { Group, Member, Challenge, CommunityMoment } from '../../types';
import { ALL_MEMBERS } from '../../data/mockData';
import {
  Users,
  Shield,
  Plus,
  MapPin,
  Calendar,
  CheckCircle2,
  Lock,
  Globe,
  Share2,
  ArrowRight,
  Sparkles,
  Info,
  Flame,
} from 'lucide-react';
import { ChallengeCard } from '../challenges/ChallengeCard';
import { KudoButton } from '../common/KudoButton';

interface GroupDetailViewProps {
  group: Group;
  currentMember: Member;
  challenges: Challenge[];
  moments: CommunityMoment[];
  onSelectChallenge: (challengeId: string) => void;
  onJoinChallenge: (challengeId: string) => void;
  onLogChallenge: (challengeId: string) => void;
  onOpenCreateChallenge: () => void;
  onOpenCreateGroup: () => void;
  onKudoMoment: (momentId: string) => void;
}

export const GroupDetailView: React.FC<GroupDetailViewProps> = ({
  group,
  currentMember,
  challenges,
  moments,
  onSelectChallenge,
  onJoinChallenge,
  onLogChallenge,
  onOpenCreateChallenge,
  onOpenCreateGroup,
  onKudoMoment,
}) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'members' | 'about'>('challenges');
  const [isJoined, setIsJoined] = useState<boolean>(true); // Prototype default joined

  const isSteward = group.stewardIds.includes(currentMember.id);
  const groupChallenges = challenges.filter((c) => c.groupId === group.id);
  const groupStewards = ALL_MEMBERS.filter((m) => group.stewardIds.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Group Hero Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs">
        <div className="relative h-48 sm:h-64 w-full bg-zinc-900">
          <img
            src={group.image}
            alt={group.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Location & Privacy badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-white bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>{group.location}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCreateGroup}
                className="text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                + Create Another Group
              </button>
            </div>
          </div>

          {/* Group Identity Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase font-bold tracking-wider text-orange-300 bg-orange-950/60 px-2 py-0.5 rounded">
                Tiizi Community Hub
              </span>
              <span className="text-xs text-zinc-300">
                • {group.memberCount} active members
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {group.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-200 mt-1 max-w-2xl font-medium">
              "{group.tagline}"
            </p>
          </div>
        </div>

        {/* Action & Steward Sub-bar */}
        <div className="p-4 sm:p-5 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-medium">Stewarded by:</span>
            <div className="flex items-center gap-2">
              {groupStewards.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-orange-500"
                  />
                  <span className="text-xs font-bold text-zinc-900">{s.name}</span>
                  <span className="text-[10px] text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded font-semibold">
                    Steward
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsJoined(!isJoined)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isJoined
                  ? 'bg-zinc-200 hover:bg-zinc-300 text-zinc-800'
                  : 'bg-zinc-900 hover:bg-black text-white'
              }`}
            >
              {isJoined ? 'Member of Group' : 'Join Group'}
            </button>

            <button
              onClick={onOpenCreateChallenge}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Challenge in Group</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="px-5 border-b border-zinc-200 flex items-center gap-6">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`py-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'challenges'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Active Challenges ({groupChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'members'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Community Members ({ALL_MEMBERS.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            About & Community Culture
          </button>
        </div>
      </div>

      {/* Tab 1: Challenges in this Group */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-zinc-900">
              Active & Upcoming Group Challenges
            </h2>
            <span className="text-xs text-zinc-500">
              Note: Being in this Group does not auto-enroll you. Join challenges affirmatively!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                currentMember={currentMember}
                onSelect={onSelectChallenge}
                onJoin={onJoinChallenge}
                onLog={onLogChallenge}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Members Roster */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-zinc-900">
            Group Members & Contributors
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_MEMBERS.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-900">{m.name}</span>
                      {m.role === 'steward' && (
                        <span className="text-[10px] text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded font-semibold">
                          Steward
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500">{m.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-zinc-900 block tabular-nums">
                    {m.stats.challengesCompleted}
                  </span>
                  <span className="text-[10px] text-zinc-400">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: About & Rules */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900">
              Community Purpose
            </h2>
            <p className="text-sm text-zinc-700 mt-1 leading-relaxed">
              {group.description}
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Group Culture & Accountability Principles
            </h3>
            <ul className="space-y-2">
              {group.rules.map((rule, idx) => (
                <li key={idx} className="text-xs text-zinc-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

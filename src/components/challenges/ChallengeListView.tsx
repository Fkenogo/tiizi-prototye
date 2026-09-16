import React, { useState } from 'react';
import { Challenge, Member, ChallengeType } from '../../types';
import { ChallengeCard } from './ChallengeCard';
import {
  Search,
  Filter,
  Plus,
  Users,
  Flame,
  Award,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ChallengeListViewProps {
  challenges: Challenge[];
  currentMember: Member;
  onSelectChallenge: (challengeId: string) => void;
  onJoinChallenge: (challengeId: string) => void;
  onLogChallenge: (challengeId: string) => void;
  onOpenCreateChallenge: () => void;
  onRunAgain?: (challenge: Challenge) => void;
}

export const ChallengeListView: React.FC<ChallengeListViewProps> = ({
  challenges,
  currentMember,
  onSelectChallenge,
  onJoinChallenge,
  onLogChallenge,
  onOpenCreateChallenge,
  onRunAgain,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'closed'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ChallengeType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChallenges = challenges.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    if (
      searchQuery.trim() &&
      !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Group Challenges
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Structured collective commitments, competitive endurance races, and daily habit streaks.
          </p>
        </div>

        <button
          onClick={onOpenCreateChallenge}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Challenge</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search challenges by title, group or activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl overflow-x-auto">
          {(['all', 'active', 'upcoming', 'completed', 'closed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer capitalize whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
              typeFilter === 'all'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setTypeFilter('collective')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
              typeFilter === 'collective'
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Together (Collective)
          </button>
          <button
            onClick={() => setTypeFilter('competitive')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
              typeFilter === 'competitive'
                ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Race (Competitive)
          </button>
          <button
            onClick={() => setTypeFilter('streak')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
              typeFilter === 'streak'
                ? 'bg-orange-100 text-orange-900 border-orange-300 font-bold'
                : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            Daily Streak
          </button>
        </div>
      </div>

      {/* Grid of Challenge Cards */}
      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              currentMember={currentMember}
              onSelect={onSelectChallenge}
              onJoin={onJoinChallenge}
              onLog={onLogChallenge}
              onRunAgain={onRunAgain}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">No challenges found</h3>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            No challenges match your active filters. Try clearing your search or launch a new challenge for your community.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => {
                setStatusFilter('all');
                setTypeFilter('all');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenCreateChallenge}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Start New Challenge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

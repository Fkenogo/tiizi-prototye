import React from 'react';
import { Challenge, Member, CommunityMoment, Group } from '../../types';
import {
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  Users,
  Compass,
  Play,
  Heart,
  Activity,
  Plus,
  Zap,
} from 'lucide-react';
import { KudoButton } from '../common/KudoButton';
import { motion } from 'motion/react';

interface TodayViewProps {
  currentMember: Member;
  challenges: Challenge[];
  activeGroup: Group;
  moments: CommunityMoment[];
  onSelectChallenge: (challengeId: string) => void;
  onOpenLogModal: (defaultChallengeId?: string, defaultActivityId?: string) => void;
  onNavigateToChallenges: () => void;
  onNavigateToGroup: () => void;
  onKudoMoment: (momentId: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  currentMember,
  challenges,
  activeGroup,
  moments,
  onSelectChallenge,
  onOpenLogModal,
  onNavigateToChallenges,
  onNavigateToGroup,
  onKudoMoment,
}) => {
  // Find streak challenge
  const streakChallenge = challenges.find((c) => c.type === 'streak' && c.status === 'active');
  const streakParticipant = streakChallenge?.participants.find(
    (p) => p.memberId === currentMember.id
  );

  // Find collective challenge
  const collectiveChallenge = challenges.find(
    (c) => c.type === 'collective' && c.status === 'active'
  );
  const collectiveParticipant = collectiveChallenge?.participants.find(
    (p) => p.memberId === currentMember.id
  );

  // Find competitive challenge
  const competitiveChallenge = challenges.find(
    (c) => c.type === 'competitive' && c.status === 'active'
  );
  const competitiveParticipant = competitiveChallenge?.participants.find(
    (p) => p.memberId === currentMember.id
  );

  const isMissedYesterday = streakParticipant?.missedYesterday;
  const todayDone = streakParticipant?.todayCompleted;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Human greeting & Timezone context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Tuesday, Sep 15 • Nairobi Time (EAT)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1 tracking-tight">
            Ready to move, {currentMember.name.split(' ')[0]}?
          </h1>
          <p className="text-sm text-zinc-600 mt-0.5">
            Here is your group's momentum and what needs your participation today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenLogModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Log an Activity</span>
          </button>
        </div>
      </div>

      {/* 2. Streak Today Focus Card */}
      {streakChallenge && streakParticipant && (
        <section aria-labelledby="streak-heading" className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 bg-linear-to-r from-orange-500/10 via-amber-500/5 to-transparent border-b border-zinc-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isMissedYesterday
                      ? 'bg-zinc-200 text-zinc-600'
                      : 'bg-linear-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/30'
                  }`}
                >
                  <Flame className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-700 uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded-full">
                      Daily Streak Challenge
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      Day {streakChallenge.streakMeta?.currentDayNumber} of{' '}
                      {streakChallenge.streakMeta?.totalDays}
                    </span>
                  </div>
                  <h2
                    id="streak-heading"
                    onClick={() => onSelectChallenge(streakChallenge.id)}
                    className="text-lg sm:text-xl font-extrabold text-zinc-900 mt-1 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    {streakChallenge.title}
                  </h2>
                </div>
              </div>

              {/* Streak Stats pill */}
              <div className="flex items-center gap-3 self-start sm:self-auto bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-xs">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                    Current Streak
                  </span>
                  <span className="text-xl font-extrabold text-orange-600 tabular-nums">
                    {streakParticipant.currentStreak}
                    <span className="text-xs font-medium text-zinc-500 ml-0.5">days</span>
                  </span>
                </div>
                <div className="h-7 w-px bg-zinc-200" />
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                    Completed
                  </span>
                  <span className="text-xl font-extrabold text-zinc-800 tabular-nums">
                    {streakParticipant.daysCompleted}
                    <span className="text-xs font-medium text-zinc-400 ml-0.5">/30</span>
                  </span>
                </div>
                <div className="h-7 w-px bg-zinc-200" />
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                    Best
                  </span>
                  <span className="text-xl font-extrabold text-zinc-700 tabular-nums">
                    {streakParticipant.bestStreak}d
                  </span>
                </div>
              </div>
            </div>

            {/* Missed Day Notice if applicable */}
            {isMissedYesterday && (
              <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Streak Reset Notice: </span>
                  Yesterday's daily requirement was missed, resetting your current streak to 0.
                  Your <span className="font-semibold">14 Days Completed</span> and{' '}
                  <span className="font-semibold">14-Day Best Streak</span> remain securely recorded.
                  Complete today to begin your new consecutive chain!
                </div>
              </div>
            )}
          </div>

          {/* Today's Requirements Checklist */}
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Today's Governed Requirements
                </h3>
                <span className="text-[11px] text-zinc-500 font-medium">
                  (Both must be done before 23:59 EAT)
                </span>
              </div>
              <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>8h 36m remaining today</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {streakChallenge.activities.map((act) => {
                const isDone = !!streakParticipant.todayRequirementsDone[act.activityId];
                return (
                  <div
                    key={act.activityId}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-zinc-50/80 border-zinc-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border-2 border-zinc-300 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isDone ? 'text-emerald-900' : 'text-zinc-900'}`}>
                          {act.labelOverride || act.activityId}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Target: {act.targetValue} {act.unit}
                          {isDone ? ' • Completed' : ' • Pending today'}
                        </p>
                      </div>
                    </div>

                    {!isDone ? (
                      <button
                        onClick={() => onOpenLogModal(streakChallenge.id, act.activityId)}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Complete Now
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                        Done Today
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Active Group Challenges Overview (Grid) */}
      <section aria-labelledby="active-challenges-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="active-challenges-heading" className="text-lg font-extrabold text-zinc-900 tracking-tight">
              Active Group Challenges
            </h2>
            <p className="text-xs text-zinc-500">
              Shared commitments with {activeGroup.name}
            </p>
          </div>
          <button
            onClick={onNavigateToChallenges}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View all challenges</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Collective Card */}
          {collectiveChallenge && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">
                    Together • Collective Goal
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    6 days left
                  </span>
                </div>

                <h3
                  onClick={() => onSelectChallenge(collectiveChallenge.id)}
                  className="text-base font-extrabold text-zinc-900 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  {collectiveChallenge.title}
                </h3>
                <p className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                  {collectiveChallenge.description}
                </p>

                {/* Collective Progress meter */}
                <div className="mt-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xs font-bold text-zinc-700">
                      Collective Distance
                    </span>
                    <span className="text-xs font-extrabold text-orange-600 tabular-nums">
                      {collectiveChallenge.collectiveProgress?.totalAccumulated} / {collectiveChallenge.targetValue} {collectiveChallenge.targetUnit}
                      <span className="text-[11px] font-semibold text-zinc-500 ml-1">
                        ({collectiveChallenge.collectiveProgress?.percent.toFixed(1)}%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, collectiveChallenge.collectiveProgress?.percent || 0)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[11px] text-zinc-500">
                    <span>Your share: <strong className="text-zinc-800 font-bold">{collectiveParticipant?.accumulatedValue || 0} km</strong></span>
                    <span>{collectiveChallenge.participants.length} contributors</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenLogModal(collectiveChallenge.id, 'act-walking')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Contribute Distance</span>
                </button>
                <button
                  onClick={() => onSelectChallenge(collectiveChallenge.id)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Competitive Card */}
          {competitiveChallenge && (
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider bg-rose-100 px-2 py-0.5 rounded-full">
                    Race • Qualifying 100 KM
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    15 days left
                  </span>
                </div>

                <h3
                  onClick={() => onSelectChallenge(competitiveChallenge.id)}
                  className="text-base font-extrabold text-zinc-900 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  {competitiveChallenge.title}
                </h3>
                <p className="text-xs text-zinc-600 mt-1 line-clamp-2 leading-relaxed">
                  First participants to accumulate 100 km qualify for podium ranks.
                </p>

                {/* Standing highlight */}
                <div className="mt-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">Your Progress</span>
                    <span className="font-extrabold text-zinc-900 tabular-nums">
                      {competitiveParticipant?.accumulatedValue || 0} / 100 km
                    </span>
                  </div>

                  <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (competitiveParticipant?.accumulatedValue || 0))}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span><strong>3</strong> finished already</span>
                    </span>
                    <span className="text-orange-600 font-semibold">
                      15.5 km until finish
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenLogModal(competitiveChallenge.id, 'act-running')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Running KM</span>
                </button>
                <button
                  onClick={() => onSelectChallenge(competitiveChallenge.id)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Podium Standings</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Community Accountability & Recent Moments */}
      <section aria-labelledby="community-moments-heading" className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 id="community-moments-heading" className="text-base font-extrabold text-zinc-900">
                Community Accountability Moments
              </h2>
              <p className="text-xs text-zinc-500">
                Real milestones from {activeGroup.name} members
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToGroup}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Group Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-zinc-100">
          {moments.map((m) => (
            <div key={m.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <img
                  src={m.actorAvatar}
                  alt={m.actorName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-zinc-200"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-zinc-900">{m.actorName}</span>
                    <span className="text-[10px] text-zinc-400">• {m.timestamp}</span>
                    <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                      {m.challengeTitle}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-zinc-800 mt-1">{m.headline}</p>
                  <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{m.detail}</p>
                </div>
              </div>

              <div className="shrink-0 pt-1">
                <KudoButton
                  initialCount={m.kudos}
                  hasKudoedInitial={m.hasKudoed}
                  size="sm"
                  onKudo={() => onKudoMoment(m.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

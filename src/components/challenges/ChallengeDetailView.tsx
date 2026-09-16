import React, { useState } from 'react';
import { Challenge, Member, ActivitySubmission } from '../../types';
import { CANONICAL_ACTIVITIES } from '../../data/canonicalActivities';
import {
  Users,
  Flame,
  Award,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Heart,
  TrendingUp,
  RotateCcw,
  Share2,
  Info,
  Calendar,
  Globe,
  ChevronRight,
  ShieldCheck,
  Check,
  Lock,
} from 'lucide-react';
import { KudoButton } from '../common/KudoButton';

interface ChallengeDetailViewProps {
  challenge: Challenge;
  currentMember: Member;
  submissions: ActivitySubmission[];
  onBack: () => void;
  onJoinChallenge: (challengeId: string) => void;
  onOpenLogModal: (challengeId: string, defaultActivityId?: string) => void;
  onOpenShareModal: (challenge: Challenge) => void;
  onRunAgain?: (challenge: Challenge) => void;
  onKudoSubmission: (submissionId: string) => void;
}

export const ChallengeDetailView: React.FC<ChallengeDetailViewProps> = ({
  challenge,
  currentMember,
  submissions,
  onBack,
  onJoinChallenge,
  onOpenLogModal,
  onOpenShareModal,
  onRunAgain,
  onKudoSubmission,
}) => {
  const [showGuidance, setShowGuidance] = useState(false);

  const isParticipant = challenge.participants.some(
    (p) => p.memberId === currentMember.id
  );
  const myData = challenge.participants.find(
    (p) => p.memberId === currentMember.id
  );

  const isCompleted = challenge.status === 'completed';

  // Sort participants based on challenge type
  const sortedParticipants = [...challenge.participants].sort((a, b) => {
    if (challenge.type === 'competitive') {
      if (a.finished && !b.finished) return -1;
      if (!a.finished && b.finished) return 1;
      if (a.finished && b.finished) {
        return (a.rank || 99) - (b.rank || 99);
      }
      return b.accumulatedValue - a.accumulatedValue;
    }
    if (challenge.type === 'streak') {
      return b.daysCompleted - a.daysCompleted;
    }
    // Collective
    return b.accumulatedValue - a.accumulatedValue;
  });

  const getCanonicalActivity = (id: string) =>
    CANONICAL_ACTIVITIES.find((a) => a.id === id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back navigation & Quick Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-2xs hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Challenges</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenShareModal(challenge)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {isCompleted && onRunAgain && (
            <button
              onClick={() => onRunAgain(challenge)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Run Again</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs">
        <div className="relative h-48 sm:h-56 w-full bg-zinc-900">
          <img
            src={challenge.coverImage}
            alt={challenge.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-500 text-white shadow-xs">
              {challenge.type === 'collective'
                ? 'Collective Challenge'
                : challenge.type === 'competitive'
                ? 'Competitive Race'
                : 'Daily Streak Challenge'}
            </span>

            <span className="text-xs font-semibold text-white bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>{challenge.timezone}</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs text-orange-300 font-bold uppercase tracking-wider">
              {challenge.groupName}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
              {challenge.title}
            </h1>
          </div>
        </div>

        {/* Challenge Meta Strip & Join/Log Bar */}
        <div className="p-5 sm:p-6 bg-zinc-50/70 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-4 text-xs text-zinc-600 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  {challenge.startDate} — {challenge.endDate} ({challenge.durationDays} days)
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>{challenge.participants.length} Active Participants</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-zinc-900 italic">
              "{challenge.summarySentence}"
            </p>
          </div>

          {/* Affirmative CTA */}
          <div className="shrink-0 flex items-center gap-3">
            {isParticipant ? (
              !isCompleted ? (
                <button
                  onClick={() => onOpenLogModal(challenge.id)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Activity</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-zinc-700 bg-zinc-200/90 border border-zinc-300 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Sealed Historical Challenge</span>
                </span>
              )
            ) : (
              !isCompleted ? (
                <button
                  onClick={() => onJoinChallenge(challenge.id)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Join This Challenge</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-lg">
                  Window Closed
                </span>
              )
            )}
          </div>
        </div>

        {/* State banners: upcoming / closed / flagged (no logging before participation) */}
        {challenge.status === 'upcoming' && (
          <div className="bg-sky-50 border-b border-sky-200 px-5 sm:px-6 py-3 text-xs text-sky-900 flex items-start gap-2">
            <Calendar className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span><strong>Upcoming:</strong> starts {challenge.startDate}. You can preview and join now; activity logging unlocks at start. No logging is shown before participation.</span>
          </div>
        )}
        {challenge.status === 'closed' && (
          <div className="bg-zinc-100 border-b border-zinc-200 px-5 sm:px-6 py-3 text-xs text-zinc-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <span><strong>Closed{challenge.isFull ? ' — capacity reached' : ''}:</strong> this window is no longer joinable{challenge.capacity ? ` (${challenge.capacity}/${challenge.capacity} prototype capacity)` : ''}. {challenge.finalized ? 'Results are finalized.' : ''}</span>
          </div>
        )}
        {challenge.isFlagged && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 sm:px-6 py-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Under mock review:</strong> {challenge.flaggedReason || 'flagged for operator review (prototype).'} Member view stays readable; actions may be limited.</span>
          </div>
        )}
        {challenge.finalized && challenge.status !== 'completed' && (
          <div className="bg-zinc-900 text-white px-5 sm:px-6 py-3 text-xs"><strong className="text-amber-400">Finalized:</strong> terminal state — record locked, read-only.</div>
        )}

        {/* Celebratory Finalized Historic Notice */}
        {isCompleted && (
          <div className="bg-zinc-900 text-white px-5 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5 text-xs">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-amber-400">Historical Archive:</strong> This challenge window has concluded. All participant milestones are finalized and permanently preserved.
              </span>
            </div>
            {onRunAgain && (
              <button
                onClick={() => onRunAgain(challenge)}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Run Again (Spawn New Cycle)</span>
              </button>
            )}
          </div>
        )}

        {/* Overview Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">About this Challenge</h2>
          <p className="text-sm text-zinc-700 leading-relaxed">
            {challenge.description}
          </p>

          {/* Social Cause Banner if applicable */}
          {challenge.isCause && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Social Cause Awareness: </span>
                {challenge.causeName}. Community participation raises awareness and collective solidarity.
              </div>
            </div>
          )}

          {/* Activity Guidance Accordion */}
          <div className="pt-2 border-t border-zinc-100">
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showGuidance ? 'Hide Movement & Form Guidance' : 'View Movement & Form Guidance'}</span>
            </button>

            {showGuidance && (
              <div className="mt-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
                {challenge.activities.map((act) => {
                  const canonical = getCanonicalActivity(act.activityId);
                  if (!canonical) return null;
                  return (
                    <div key={act.activityId} className="text-xs space-y-1">
                      <h4 className="font-bold text-zinc-900">
                        {canonical.name} ({canonical.category} • {canonical.subCategory})
                      </h4>
                      <p className="text-zinc-600 leading-relaxed">
                        <strong className="text-zinc-800">Form: </strong>
                        {canonical.howItWorks}
                      </p>
                      <p className="text-zinc-500 leading-relaxed">
                        <strong className="text-zinc-700">Safety & Guidance: </strong>
                        {canonical.safetyGuidance}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. ENGINE SPECIFIC PROGRESS & LEADERBOARD / CHECKLIST */}

      {/* ENGINE A: COLLECTIVE */}
      {challenge.type === 'collective' && (
        <section aria-labelledby="collective-heading" className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 id="collective-heading" className="text-lg font-extrabold text-zinc-900">
                Collective Target Progress
              </h2>
              <p className="text-xs text-zinc-500">
                Individual contributions accumulate toward one shared community outcome.
              </p>
            </div>

            {/* Target exceeded badge */}
            {(challenge.collectiveProgress?.percent || 0) >= 100 && (
              <div className="self-start sm:self-auto px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Target Exceeded! ({challenge.collectiveProgress?.percent.toFixed(1)}%)</span>
              </div>
            )}
          </div>

          {/* Progress Bar with Realistic Over-100% representation */}
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Accumulated Together
                </span>
                <div className="text-3xl font-extrabold text-zinc-900 tabular-nums mt-0.5">
                  {challenge.collectiveProgress?.totalAccumulated}{' '}
                  <span className="text-base font-bold text-zinc-500">
                    / {challenge.targetValue} {challenge.targetUnit}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold text-orange-600 tabular-nums">
                  {challenge.collectiveProgress?.percent.toFixed(1)}%
                </span>
                <span className="block text-[11px] text-zinc-500 font-medium">
                  {Math.max(0, challenge.targetValue - (challenge.collectiveProgress?.totalAccumulated || 0))} {challenge.targetUnit} to go
                </span>
              </div>
            </div>

            <div className="w-full h-3.5 bg-zinc-200 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  (challenge.collectiveProgress?.percent || 0) >= 100
                    ? 'bg-linear-to-r from-emerald-500 to-teal-500'
                    : 'bg-linear-to-r from-orange-500 via-amber-500 to-orange-600'
                }`}
                style={{
                  width: `${Math.min(100, challenge.collectiveProgress?.percent || 0)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
              <span>Start: 0 km</span>
              <span className="font-bold text-zinc-700">Goal: 500 km</span>
              <span>Exceedable &gt; 100%</span>
            </div>
          </div>

          {/* Contributors List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Community Contributors ({challenge.participants.length})
            </h3>

            <div className="divide-y divide-zinc-100">
              {sortedParticipants.map((p, idx) => {
                const isMe = p.memberId === currentMember.id;
                return (
                  <div
                    key={p.memberId}
                    className={`py-3 px-3 rounded-xl flex items-center justify-between gap-4 transition-colors ${
                      isMe ? 'bg-orange-50/60 border border-orange-200/60' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-zinc-400 w-5 text-center">
                        #{idx + 1}
                      </span>
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-zinc-900">{p.name}</span>
                          {isMe && (
                            <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500">
                          Last logged: {p.lastContributionAt}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-zinc-900 tabular-nums">
                        {p.accumulatedValue} {p.unit}
                      </span>
                      <span className="block text-[10px] text-zinc-400">
                        {((p.accumulatedValue / (challenge.collectiveProgress?.totalAccumulated || 1)) * 100).toFixed(0)}% of group total
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ENGINE B: COMPETITIVE */}
      {challenge.type === 'competitive' && (
        <section aria-labelledby="competitive-heading" className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 id="competitive-heading" className="text-lg font-extrabold text-zinc-900">
                Podium & Standings (Qualifying 100 KM)
              </h2>
              <p className="text-xs text-zinc-500">
                Governed standard competition ranking (1, 2, 2, 4). Challenge window remains open until time expires.
              </p>
            </div>

            <div className="text-xs text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              <span className="font-bold text-zinc-900">
                {challenge.participants.filter((p) => p.finished).length}
              </span>{' '}
              of {challenge.participants.length} finished
            </div>
          </div>

          {/* Finishers Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Qualifying Finishers (Standard Competition Standing: 1, 2, 2, 4)</span>
              </h3>
              <span className="text-[11px] text-zinc-500 font-medium">Shared ties preserve natural rank</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {challenge.participants
                .filter((p) => p.finished)
                .map((p) => (
                  <div
                    key={p.memberId}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                          #{p.rank}
                        </span>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Target Reached ({challenge.targetValue} {challenge.targetUnit})
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 mt-2">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-zinc-900 truncate">{p.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{p.finishedAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Active Participants In-Progress */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Active Participants In-Progress (No rank until 100k reached)
            </h3>

            <div className="divide-y divide-zinc-100">
              {challenge.participants
                .filter((p) => !p.finished)
                .map((p) => {
                  const isMe = p.memberId === currentMember.id;
                  const percent = Math.min(100, p.accumulatedValue);
                  return (
                    <div
                      key={p.memberId}
                      className={`py-3 px-3 rounded-xl flex items-center justify-between gap-4 ${
                        isMe ? 'bg-orange-50 border border-orange-200' : 'hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-zinc-900">{p.name}</span>
                            {isMe && (
                              <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500">
                            {100 - p.accumulatedValue} km remaining
                          </p>
                        </div>
                      </div>

                      <div className="w-32 sm:w-48 text-right">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-zinc-600">{p.accumulatedValue} km</span>
                          <span className="text-zinc-400 font-normal">{percent.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* ENGINE C: STREAK */}
      {challenge.type === 'streak' && (
        <section aria-labelledby="streak-detail-heading" className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 id="streak-detail-heading" className="text-lg font-extrabold text-zinc-900">
                Today's Daily Consistency
              </h2>
              <p className="text-xs text-zinc-500">
                Daily requirements must be completed before midnight EAT. A missed day resets current streak; cumulative days completed remains preserved.
              </p>
            </div>

            {myData && (
              <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-200">
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Current Streak
                  </span>
                  <span className="text-lg font-extrabold text-orange-600 tabular-nums">
                    {myData.currentStreak}d
                  </span>
                </div>
                <div className="h-6 w-px bg-zinc-200" />
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Done
                  </span>
                  <span className="text-lg font-extrabold text-zinc-900 tabular-nums">
                    {myData.daysCompleted} / {challenge.targetValue}
                  </span>
                </div>
                <div className="h-6 w-px bg-zinc-200" />
                <div className="text-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Best
                  </span>
                  <span className="text-lg font-extrabold text-zinc-700 tabular-nums">
                    {myData.bestStreak}d
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Today's Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Today's Required Activities
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challenge.activities.map((act) => {
                const isDone = !!myData?.todayRequirementsDone[act.activityId];
                return (
                  <div
                    key={act.activityId}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isDone
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-zinc-50 border-zinc-200'
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
                          {act.targetValue} {act.unit} required
                        </p>
                      </div>
                    </div>

                    {!isDone && isParticipant && (
                      <button
                        onClick={() => onOpenLogModal(challenge.id, act.activityId)}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Log Now
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Consistency Roster (No competitive leaderboard per brief) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Group Consistency Roster
            </h3>
            <div className="divide-y divide-zinc-100">
              {sortedParticipants.map((p) => {
                const isMe = p.memberId === currentMember.id;
                return (
                  <div
                    key={p.memberId}
                    className={`py-3 px-3 rounded-xl flex items-center justify-between gap-4 ${
                      isMe ? 'bg-orange-50/70 border border-orange-200/60' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-zinc-900">{p.name}</span>
                          {isMe && (
                            <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500">
                          Completed: {p.daysCompleted} / {challenge.targetValue} days
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-orange-600 block">
                          {p.currentStreak}d Streak
                        </span>
                        <span className="text-[10px] text-zinc-400">Best: {p.bestStreak}d</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.todayCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.todayCompleted ? 'Today Done' : 'Pending Today'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Verified Challenge Activity Stream */}
      <section aria-labelledby="activity-stream-heading" className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 id="activity-stream-heading" className="text-base font-extrabold text-zinc-900">
          Recent Challenge Submissions
        </h2>

        <div className="divide-y divide-zinc-100">
          {submissions
            .filter((s) => s.challengeId === challenge.id)
            .map((sub) => (
              <div key={sub.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={sub.memberAvatar}
                    alt={sub.memberName}
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-zinc-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900">{sub.memberName}</span>
                      <span className="text-[10px] text-zinc-400">• {sub.timestamp}</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-800 mt-0.5">
                      Logged {sub.value} {sub.unit} of {sub.activityName}
                    </p>
                    {sub.note && (
                      <p className="text-xs text-zinc-600 mt-1 italic">"{sub.note}"</p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  <KudoButton
                    initialCount={sub.kudosCount}
                    hasKudoedInitial={sub.kudosGivenBy.includes(currentMember.id)}
                    size="sm"
                    onKudo={() => onKudoSubmission(sub.id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

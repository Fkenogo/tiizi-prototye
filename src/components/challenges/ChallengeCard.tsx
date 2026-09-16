import React from 'react';
import { Challenge, Member } from '../../types';
import {
  Users,
  Flame,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
  RotateCcw,
  Check,
  Calendar,
  Lock,
  Sparkles,
} from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
  currentMember: Member;
  onSelect: (challengeId: string) => void;
  onJoin: (challengeId: string) => void;
  onLog: (challengeId: string) => void;
  onRunAgain?: (challenge: Challenge) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  currentMember,
  onSelect,
  onJoin,
  onLog,
  onRunAgain,
}) => {
  const isParticipant = challenge.participants.some(
    (p) => p.memberId === currentMember.id
  );
  const myData = challenge.participants.find(
    (p) => p.memberId === currentMember.id
  );

  const isCompletedChallenge = challenge.status === 'completed';
  const isUpcoming = challenge.status === 'upcoming';
  const isCompletedByMe = isParticipant && (myData?.finished || (challenge.type === 'streak' && myData?.daysCompleted === challenge.targetValue));

  const getFamilyBadge = () => {
    switch (challenge.type) {
      case 'collective':
        return {
          label: 'Together • Collective',
          className: 'bg-amber-100 text-amber-900 border-amber-200',
        };
      case 'competitive':
        return {
          label: 'Race • Competitive',
          className: 'bg-rose-100 text-rose-900 border-rose-200',
        };
      case 'streak':
        return {
          label: 'Streak • Consistency',
          className: 'bg-orange-100 text-orange-900 border-orange-200',
        };
    }
  };

  const getCardStateBadge = () => {
    if (isCompletedChallenge) {
      return {
        label: 'Closed / Finalized',
        className: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        icon: Lock,
      };
    }
    if (isUpcoming) {
      return {
        label: `Upcoming • Starts ${challenge.startDate}`,
        className: 'bg-sky-100 text-sky-900 border-sky-200',
        icon: Calendar,
      };
    }
    if (isCompletedByMe) {
      return {
        label: 'Completed by You',
        className: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        icon: CheckCircle2,
      };
    }
    if (isParticipant) {
      return {
        label: 'Joined & Active',
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: Check,
      };
    }
    return {
      label: 'Open to Join',
      className: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      icon: Users,
    };
  };

  const familyBadge = getFamilyBadge();
  const stateBadge = getCardStateBadge();
  const StateIcon = stateBadge.icon;

  return (
    <div
      onClick={() => onSelect(challenge.id)}
      className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden cursor-pointer group shadow-2xs hover:shadow-md ${
        isCompletedChallenge
          ? 'bg-zinc-50/70 border-zinc-300 opacity-90'
          : isCompletedByMe
          ? 'bg-white border-emerald-300 ring-1 ring-emerald-400/20'
          : isParticipant
          ? 'bg-white border-orange-200 ring-1 ring-orange-500/10'
          : 'bg-white border-zinc-200 hover:border-zinc-300'
      }`}
    >
      {/* Top Banner Image with Overlay */}
      <div className="relative h-36 w-full overflow-hidden bg-zinc-900">
        <img
          src={challenge.coverImage}
          alt={challenge.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isCompletedChallenge ? 'grayscale-40 opacity-70' : 'opacity-85'
          }`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/85 via-zinc-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${familyBadge.className}`}
          >
            {familyBadge.label}
          </span>

          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs flex items-center gap-1 ${stateBadge.className}`}
          >
            <StateIcon className="w-3 h-3" />
            <span>{stateBadge.label}</span>
          </span>
        </div>

        {/* Title on image bottom */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 font-medium truncate mb-0.5">
            <span>{challenge.groupName}</span>
            <span>•</span>
            <span>{challenge.timezone.split(' ')[0]}</span>
          </div>
          <h3 className="text-base font-extrabold text-white tracking-tight leading-snug group-hover:text-orange-400 transition-colors">
            {challenge.title}
          </h3>
        </div>
      </div>

      {/* Body Content tailored to Family Engine */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
            {challenge.description}
          </p>

          {/* Engine Specific Progress Snapshot */}
          <div className="mt-4 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
            {challenge.type === 'collective' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-zinc-700">Group Milestone</span>
                  <span className="font-extrabold text-orange-600 tabular-nums">
                    {challenge.collectiveProgress?.totalAccumulated} / {challenge.targetValue} {challenge.targetUnit}
                    <span className="text-[10px] text-zinc-400 font-medium ml-1">
                      ({challenge.collectiveProgress?.percent.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (challenge.collectiveProgress?.percent || 0) >= 100
                        ? 'bg-emerald-500'
                        : 'bg-linear-to-r from-orange-500 to-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(100, challenge.collectiveProgress?.percent || 0)}%`,
                    }}
                  />
                </div>
                {myData && (
                  <p className="text-[11px] text-zinc-600 mt-1.5 font-medium">
                    Your contribution: <strong className="text-zinc-900">{myData.accumulatedValue} km</strong>
                  </p>
                )}
              </div>
            )}

            {challenge.type === 'competitive' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-zinc-700">Race Target: {challenge.targetValue} {challenge.targetUnit}</span>
                  <span className="text-xs font-semibold text-rose-600">
                    {challenge.participants.filter((p) => p.finished).length} Qualified Finishers
                  </span>
                </div>
                {myData ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-600 mb-1">
                      <span>Your Distance:</span>
                      <span className="font-bold text-zinc-900">{myData.accumulatedValue} / {challenge.targetValue} {challenge.targetUnit}</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${Math.min(100, (myData.accumulatedValue / challenge.targetValue) * 100)}%` }}
                      />
                    </div>
                    {myData.finished && (
                      <p className="text-[11px] font-bold text-emerald-700 mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Finished in Position #{myData.rank || 1}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500">
                    Governed finishing positions (1, 2, 2, 4) with shared ties. Window closes on scheduled date.
                  </p>
                )}
              </div>
            )}

            {challenge.type === 'streak' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-zinc-700">Daily Habit</span>
                  <span className="text-xs font-bold text-orange-600">
                    {challenge.activities.length} daily requirements
                  </span>
                </div>
                {myData ? (
                  <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-0.5">
                    <span>
                      Streak: <strong className="text-orange-600 font-bold">{myData.currentStreak}d</strong>
                    </span>
                    <span>
                      Done: <strong className="text-zinc-800 font-bold">{myData.daysCompleted} / {challenge.targetValue}</strong>
                    </span>
                    <span
                      className={`font-semibold px-1.5 py-0.5 rounded text-[10px] ${
                        myData.todayCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {myData.todayCompleted ? 'Today Done' : 'Pending Today'}
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500">
                    Every daily requirement must be logged before the day ends in {challenge.timezone.split(' ')[0]}.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>{challenge.participants.length} participants</span>
          </div>

          <div className="flex items-center gap-2">
            {isCompletedChallenge ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRunAgain) onRunAgain(challenge);
                }}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
                title="Creates a new challenge with the same setup. New cycle starts with 0 participants — rejoin affirmatively."
              >
                <RotateCcw className="w-3 h-3" />
                <span>Run Again · new cycle (0 joined)</span>
              </button>
            ) : isParticipant ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLog(challenge.id);
                }}
                className="text-xs font-bold text-zinc-900 hover:text-orange-600 flex items-center gap-1 px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-orange-500" />
                <span>Log Activity</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin(challenge.id);
                }}
                className="text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Join</span>
              </button>
            )}

            <span className="text-zinc-400 group-hover:text-orange-500 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

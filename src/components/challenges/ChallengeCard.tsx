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

  const getFamilyBadge = () => {
    switch (challenge.type) {
      case 'collective':
        return {
          label: 'Together • Collective',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'competitive':
        return {
          label: 'Race • Competitive',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'streak':
        return {
          label: 'Daily Streak',
          className: 'bg-orange-100 text-orange-800 border-orange-200',
        };
    }
  };

  const badge = getFamilyBadge();
  const isCompleted = challenge.status === 'completed';

  return (
    <div
      onClick={() => onSelect(challenge.id)}
      className="bg-white rounded-2xl border border-zinc-200 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
    >
      {/* Top Banner Image with Overlay */}
      <div className="relative h-36 w-full overflow-hidden bg-zinc-900">
        <img
          src={challenge.coverImage}
          alt={challenge.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-xs ${badge.className}`}
          >
            {badge.label}
          </span>
          <span className="text-[11px] font-semibold text-white bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-400" />
            <span>{isCompleted ? 'Finalized' : `${challenge.durationDays}d duration`}</span>
          </span>
        </div>

        {/* Title on image bottom */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[11px] text-zinc-300 font-medium truncate">
            {challenge.groupName}
          </p>
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
                  <span className="font-bold text-zinc-700">Group Progress</span>
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
                  <p className="text-[11px] text-zinc-500 mt-1.5">
                    Your contribution: <strong className="text-zinc-800 font-bold">{myData.accumulatedValue} km</strong>
                  </p>
                )}
              </div>
            )}

            {challenge.type === 'competitive' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-zinc-700">Race Target: 100 KM</span>
                  <span className="text-xs font-semibold text-rose-600">
                    {challenge.participants.filter((p) => p.finished).length} Finished
                  </span>
                </div>
                {myData ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-600 mb-1">
                      <span>Your Distance:</span>
                      <span className="font-bold text-zinc-900">{myData.accumulatedValue} / 100 km</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${Math.min(100, myData.accumulatedValue)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500">
                    Governed standard podium ranking (1, 2, 2, 4) with finishing order.
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
                    Every daily requirement must be logged before midnight to keep streak alive.
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
            {isCompleted ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRunAgain) onRunAgain(challenge);
                }}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Run Again</span>
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
                <span>Log</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin(challenge.id);
                }}
                className="text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Join
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

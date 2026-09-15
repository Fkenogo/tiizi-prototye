import React, { useState, useEffect } from 'react';
import { Challenge, Member, MetricType, ActivitySubmission } from '../../types';
import { CANONICAL_ACTIVITIES } from '../../data/canonicalActivities';
import {
  X,
  CheckCircle2,
  Flame,
  ArrowRight,
  Clock,
  Sparkles,
  Info,
  Check,
  Award,
  AlertCircle,
} from 'lucide-react';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: Challenge[];
  currentMember: Member;
  initialChallengeId?: string;
  initialActivityId?: string;
  onActivitySubmitted: (
    submission: ActivitySubmission,
    updatedChallenge: Challenge
  ) => void;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  challenges,
  currentMember,
  initialChallengeId,
  initialActivityId,
  onActivitySubmitted,
}) => {
  const activeChallenges = challenges.filter(
    (c) => c.status === 'active' && c.participants.some((p) => p.memberId === currentMember.id)
  );

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    initialChallengeId || activeChallenges[0]?.id || ''
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [value, setValue] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [componentValues, setComponentValues] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{
    headline: string;
    detail: string;
    type: 'success' | 'milestone';
  } | null>(null);

  const currentChallenge = challenges.find((c) => c.id === selectedChallengeId);

  useEffect(() => {
    if (initialChallengeId) {
      setSelectedChallengeId(initialChallengeId);
    } else if (activeChallenges.length > 0 && !selectedChallengeId) {
      setSelectedChallengeId(activeChallenges[0].id);
    }
  }, [initialChallengeId, activeChallenges]);

  useEffect(() => {
    if (currentChallenge && currentChallenge.activities.length > 0) {
      if (
        initialActivityId &&
        currentChallenge.activities.some((a) => a.activityId === initialActivityId)
      ) {
        setSelectedActivityId(initialActivityId);
      } else {
        setSelectedActivityId(currentChallenge.activities[0].activityId);
      }
    }
  }, [currentChallenge, initialActivityId]);

  if (!isOpen) return null;

  const currentActivityConfig = currentChallenge?.activities.find(
    (a) => a.activityId === selectedActivityId
  );
  const canonicalActivity = CANONICAL_ACTIVITIES.find(
    (a) => a.id === selectedActivityId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChallenge || !currentActivityConfig) return;

    const unit = currentActivityConfig.unit;
    const metric = currentActivityConfig.metric;
    const activityName = canonicalActivity?.name || selectedActivityId;

    // Build Submission
    const newSubmission: ActivitySubmission = {
      id: `sub-${Date.now()}`,
      challengeId: currentChallenge.id,
      challengeTitle: currentChallenge.title,
      memberId: currentMember.id,
      memberName: currentMember.name,
      memberAvatar: currentMember.avatar,
      activityId: selectedActivityId,
      activityName,
      metric,
      value,
      unit,
      componentValues: Object.keys(componentValues).length > 0 ? componentValues : undefined,
      timestamp: 'Just now',
      verified: true,
      kudosCount: 0,
      kudosGivenBy: [],
      note: note.trim() || undefined,
    };

    // Calculate Engine updates
    const updatedChallenge = { ...currentChallenge };
    const pIndex = updatedChallenge.participants.findIndex(
      (p) => p.memberId === currentMember.id
    );

    let feedbackHeadline = 'Activity Logged & Accepted';
    let feedbackDetail = `Logged ${value} ${unit} of ${activityName}.`;

    if (pIndex >= 0) {
      const participant = { ...updatedChallenge.participants[pIndex] };

      if (updatedChallenge.type === 'collective') {
        participant.accumulatedValue = parseFloat(
          (participant.accumulatedValue + value).toFixed(1)
        );
        participant.lastContributionAt = 'Just now';

        const totalAcc = parseFloat(
          ((updatedChallenge.collectiveProgress?.totalAccumulated || 0) + value).toFixed(1)
        );
        const percent = (totalAcc / updatedChallenge.targetValue) * 100;
        updatedChallenge.collectiveProgress = {
          totalAccumulated: totalAcc,
          target: updatedChallenge.targetValue,
          percent,
          completedEarly: totalAcc >= updatedChallenge.targetValue,
        };

        if (totalAcc >= updatedChallenge.targetValue) {
          feedbackHeadline = '🎉 Collective Milestone Achieved!';
          feedbackDetail = `Your ${value} ${unit} helped the group reach ${totalAcc} ${unit} (${percent.toFixed(1)}%)! Target Exceeded!`;
        } else {
          feedbackHeadline = 'Contribution Applied to Group Target';
          feedbackDetail = `Added ${value} ${unit} to ${updatedChallenge.title}. Group is now at ${percent.toFixed(1)}%!`;
        }
      } else if (updatedChallenge.type === 'competitive') {
        participant.accumulatedValue = parseFloat(
          (participant.accumulatedValue + value).toFixed(1)
        );
        participant.lastContributionAt = 'Just now';

        if (participant.accumulatedValue >= updatedChallenge.targetValue && !participant.finished) {
          participant.finished = true;
          participant.finishedAt = 'Today, Just now';
          const alreadyFinishedCount = updatedChallenge.participants.filter((p) => p.finished).length;
          participant.rank = alreadyFinishedCount + 1;

          feedbackHeadline = '🏆 Qualifying Finish Line Crossed!';
          feedbackDetail = `You finished 100 KM and claimed Podium Position #${participant.rank}!`;
        } else {
          feedbackHeadline = 'Race Progress Updated';
          feedbackDetail = `You have reached ${participant.accumulatedValue} / ${updatedChallenge.targetValue} ${unit}.`;
        }
      } else if (updatedChallenge.type === 'streak') {
        participant.todayRequirementsDone = {
          ...participant.todayRequirementsDone,
          [selectedActivityId]: true,
        };

        // Check if ALL daily activities are done
        const allDone = updatedChallenge.activities.every(
          (act) => !!participant.todayRequirementsDone[act.activityId]
        );

        if (allDone && !participant.todayCompleted) {
          participant.todayCompleted = true;
          participant.currentStreak = (participant.currentStreak || 0) + 1;
          participant.daysCompleted = (participant.daysCompleted || 0) + 1;
          if (participant.currentStreak > (participant.bestStreak || 0)) {
            participant.bestStreak = participant.currentStreak;
          }
          feedbackHeadline = '🔥 Today is Officially DONE!';
          feedbackDetail = `All daily requirements satisfied. Your streak continues: ${participant.currentStreak} consecutive days!`;
        } else {
          feedbackHeadline = 'Requirement Logged';
          feedbackDetail = `${activityName} marked complete for today. Finish remaining items before 23:59 EAT to secure your day!`;
        }
      }

      updatedChallenge.participants[pIndex] = participant;
    }

    setFeedback({
      headline: feedbackHeadline,
      detail: feedbackDetail,
      type: feedbackHeadline.includes('🎉') || feedbackHeadline.includes('🏆') || feedbackHeadline.includes('🔥') ? 'milestone' : 'success',
    });

    setTimeout(() => {
      onActivitySubmitted(newSubmission, updatedChallenge);
      onClose();
      setFeedback(null);
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
              Log Activity Submission
            </span>
            <h2 className="text-base font-extrabold text-zinc-900 mt-0.5">
              Record Governed Progress
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback celebration overlay */}
        {feedback ? (
          <div className="p-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-md shadow-orange-500/20 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-zinc-900">{feedback.headline}</h3>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto leading-relaxed">
                {feedback.detail}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* 1. Select Challenge */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Target Challenge
              </label>
              <select
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-300 font-bold text-zinc-900 focus:outline-hidden focus:border-orange-500"
              >
                {activeChallenges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Select Activity within Challenge */}
            {currentChallenge && currentChallenge.activities.length > 1 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Challenge Activity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {currentChallenge.activities.map((act) => {
                    const canonical = CANONICAL_ACTIVITIES.find((a) => a.id === act.activityId);
                    const isSelected = selectedActivityId === act.activityId;
                    return (
                      <button
                        type="button"
                        key={act.activityId}
                        onClick={() => setSelectedActivityId(act.activityId)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold'
                            : 'bg-white border-zinc-200 text-zinc-700'
                        }`}
                      >
                        <p className="text-xs truncate">{canonical?.name || act.activityId}</p>
                        <p className="text-[10px] text-zinc-400 font-normal">
                          Req: {act.targetValue} {act.unit}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Dynamic Activity input fields */}
            {currentActivityConfig && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-zinc-900">
                    {canonicalActivity?.name || selectedActivityId}
                  </span>
                  <span className="text-[11px] font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                    {currentActivityConfig.metric}
                  </span>
                </div>

                {/* Component requirement if any (Left/Right) */}
                {canonicalActivity?.components && (
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-bold text-zinc-700">
                      Required Components:
                    </label>
                    <div className="flex gap-2">
                      {canonicalActivity.components.map((comp) => (
                        <button
                          type="button"
                          key={comp}
                          onClick={() =>
                            setComponentValues({
                              ...componentValues,
                              [comp]: !componentValues[comp],
                            })
                          }
                          className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                            componentValues[comp]
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                              : 'bg-white border-zinc-300 text-zinc-600'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${
                              componentValues[comp] ? 'text-emerald-600' : 'text-zinc-300'
                            }`}
                          />
                          <span>{comp} Completed</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input value */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">
                    {currentActivityConfig.metric === 'Distance' &&
                      `How far did you travel (${currentActivityConfig.unit})?`}
                    {currentActivityConfig.metric === 'Duration' &&
                      `How many ${currentActivityConfig.unit} did you complete?`}
                    {currentActivityConfig.metric === 'Repetitions' &&
                      `How many repetitions completed?`}
                    {currentActivityConfig.metric === 'Completion' && `Mark practice as completed`}
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={currentActivityConfig.metric === 'Distance' ? '0.1' : '1'}
                      min="0.1"
                      required
                      value={value}
                      onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 text-base font-extrabold bg-white rounded-xl border border-zinc-300 focus:outline-hidden focus:border-orange-500 tabular-nums"
                    />
                    <span className="text-xs font-bold text-zinc-500 uppercase px-3 py-2.5 bg-zinc-200 rounded-xl">
                      {currentActivityConfig.unit}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Optional Context Note */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">
                Note for Group Accountability (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Early morning lap through City Park with cool breeze"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Modal Submit */}
            <div className="pt-3 border-t border-zinc-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Validate</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

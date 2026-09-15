import React, { useState } from 'react';
import {
  Challenge,
  ChallengeType,
  Group,
  Member,
  MetricType,
  ChallengeActivityConfig,
} from '../../types';
import { CANONICAL_ACTIVITIES } from '../../data/canonicalActivities';
import { CHALLENGE_TEMPLATES } from '../../data/mockData';
import {
  X,
  Users,
  Flame,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
  Search,
  Check,
  Globe,
  Layers,
} from 'lucide-react';

interface CreateChallengeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  activeGroup: Group;
  currentMember: Member;
  onCreateChallenge: (newChallenge: Challenge) => void;
  initialTemplateId?: string;
}

export const CreateChallengeWizard: React.FC<CreateChallengeWizardProps> = ({
  isOpen,
  onClose,
  activeGroup,
  currentMember,
  onCreateChallenge,
  initialTemplateId,
}) => {
  const [step, setStep] = useState<number>(1); // 1: Type/Template, 2: Basics, 3: Activities & Metrics, 4: Schedule, 5: Review

  // Form State
  const [challengeType, setChallengeType] = useState<ChallengeType>('collective');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80'
  );
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>(['act-walking']);
  const [activityConfigs, setActivityConfigs] = useState<{
    [activityId: string]: { metric: MetricType; unit: string; targetValue: number };
  }>({
    'act-walking': { metric: 'Distance', unit: 'km', targetValue: 500 },
  });
  const [startDate, setStartDate] = useState('Sep 15, 2026');
  const [durationDays, setDurationDays] = useState(14);
  const [timezone, setTimezone] = useState('Africa/Nairobi (EAT)');
  const [activitySearch, setActivitySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Fitness' | 'Wellness'>('All');

  if (!isOpen) return null;

  // Apply template helper
  const handleApplyTemplate = (tplId: string) => {
    const tpl = CHALLENGE_TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;

    setChallengeType(tpl.type);
    setTitle(tpl.name);
    setDescription(tpl.description);
    setDurationDays(tpl.durationDays);

    if (tpl.type === 'streak' && tpl.activityIds) {
      setSelectedActivityIds(tpl.activityIds);
      const newConfigs: any = {};
      tpl.activityIds.forEach((actId, idx) => {
        newConfigs[actId] = {
          metric: tpl.metrics[idx],
          unit: tpl.units[idx],
          targetValue: tpl.targetValues[idx],
        };
      });
      setActivityConfigs(newConfigs);
    } else if (tpl.activityId) {
      setSelectedActivityIds([tpl.activityId]);
      setActivityConfigs({
        [tpl.activityId]: {
          metric: tpl.metric,
          unit: tpl.unit,
          targetValue: tpl.targetValue,
        },
      });
    }

    setStep(2);
  };

  // Dynamic Natural Language Summary
  const generateSummary = () => {
    const actNames = selectedActivityIds
      .map((id) => CANONICAL_ACTIVITIES.find((a) => a.id === id)?.name || id)
      .join(' & ');

    if (challengeType === 'collective') {
      const primary = activityConfigs[selectedActivityIds[0]] || { targetValue: 500, unit: 'km' };
      return `Everyone in ${activeGroup.name} contributes toward a shared goal of ${primary.targetValue} ${primary.unit} of ${actNames} over ${durationDays} days.`;
    }
    if (challengeType === 'competitive') {
      const primary = activityConfigs[selectedActivityIds[0]] || { targetValue: 100, unit: 'km' };
      return `First participants to log ${primary.targetValue} ${primary.unit} of ${actNames} before the ${durationDays}-day window ends win governed podium ranks.`;
    }
    // Streak
    const reqs = selectedActivityIds
      .map((id) => {
        const c = activityConfigs[id];
        const act = CANONICAL_ACTIVITIES.find((a) => a.id === id);
        return `${c?.targetValue || 10} ${c?.unit || 'min'} of ${act?.name || id}`;
      })
      .join(' and ');
    return `Complete ${reqs} every single day in ${timezone} to keep your daily streak alive over ${durationDays} days.`;
  };

  const handleToggleActivity = (actId: string) => {
    const act = CANONICAL_ACTIVITIES.find((a) => a.id === actId);
    if (!act) return;

    if (selectedActivityIds.includes(actId)) {
      if (selectedActivityIds.length === 1) return; // Must have at least 1
      setSelectedActivityIds(selectedActivityIds.filter((id) => id !== actId));
      const nextConfigs = { ...activityConfigs };
      delete nextConfigs[actId];
      setActivityConfigs(nextConfigs);
    } else {
      // In competitive or collective, single activity is standard; in streak multi is common
      const newSelected =
        challengeType === 'streak' ? [...selectedActivityIds, actId] : [actId];
      setSelectedActivityIds(newSelected);

      const defaultMetric = act.supportedMetrics[0];
      const defaultUnit = act.supportedUnits[defaultMetric]?.[0] || 'reps';
      setActivityConfigs({
        ...activityConfigs,
        [actId]: {
          metric: defaultMetric,
          unit: defaultUnit,
          targetValue: defaultMetric === 'Distance' ? 100 : defaultMetric === 'Duration' ? 15 : 20,
        },
      });
    }
  };

  const handleMetricChange = (actId: string, metric: MetricType) => {
    const act = CANONICAL_ACTIVITIES.find((a) => a.id === actId);
    if (!act) return;
    const defaultUnit = act.supportedUnits[metric]?.[0] || 'units';
    setActivityConfigs({
      ...activityConfigs,
      [actId]: {
        ...activityConfigs[actId],
        metric,
        unit: defaultUnit,
      },
    });
  };

  const handleCreate = () => {
    const activitiesConfig: ChallengeActivityConfig[] = selectedActivityIds.map((actId) => {
      const cfg = activityConfigs[actId];
      const act = CANONICAL_ACTIVITIES.find((a) => a.id === actId);
      return {
        activityId: actId,
        metric: cfg.metric,
        unit: cfg.unit,
        targetValue: cfg.targetValue,
        componentsRequired: act?.components,
        labelOverride: act?.name,
      };
    });

    const primaryTarget = activityConfigs[selectedActivityIds[0]]?.targetValue || 100;
    const primaryUnit = activityConfigs[selectedActivityIds[0]]?.unit || 'km';

    const newChallenge: Challenge = {
      id: `ch-custom-${Date.now()}`,
      title: title || (challengeType === 'collective' ? 'Group Movement Milestone' : challengeType === 'competitive' ? 'Endurance Sprint' : 'Daily Consistency Challenge'),
      description: description || generateSummary(),
      type: challengeType,
      groupId: activeGroup.id,
      groupName: activeGroup.name,
      creatorId: currentMember.id,
      creatorName: currentMember.name,
      coverImage,
      status: 'active',
      startDate,
      endDate: 'Oct 15, 2026',
      timezone,
      durationDays,
      activities: activitiesConfig,
      targetValue: challengeType === 'streak' ? durationDays : primaryTarget,
      targetUnit: challengeType === 'streak' ? 'days' : primaryUnit,
      summarySentence: generateSummary(),
      participants: [
        {
          memberId: currentMember.id,
          name: currentMember.name,
          avatar: currentMember.avatar,
          accumulatedValue: 0,
          unit: primaryUnit,
          lastContributionAt: 'Just joined',
          rank: null,
          finished: false,
          daysCompleted: 0,
          currentStreak: 0,
          bestStreak: 0,
          todayCompleted: false,
          todayRequirementsDone: {},
        },
      ],
      collectiveProgress:
        challengeType === 'collective'
          ? { totalAccumulated: 0, target: primaryTarget, percent: 0, completedEarly: false }
          : undefined,
      streakMeta:
        challengeType === 'streak'
          ? { totalDays: durationDays, currentDayNumber: 1 }
          : undefined,
    };

    onCreateChallenge(newChallenge);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Wizard Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider bg-orange-100 px-2 py-0.5 rounded-full">
                Step {step} of 5
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                In {activeGroup.name}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-zinc-900 mt-0.5">
              {step === 1 && 'Select Challenge Architecture'}
              {step === 2 && 'Challenge Basics & Identity'}
              {step === 3 && 'Choose Canonical Activities & Metrics'}
              {step === 4 && 'Schedule & Governing Timezone'}
              {step === 5 && 'Review Governed Challenge'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body Scrollable */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: TYPE & TEMPLATES */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Select a Challenge Family
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Tiizi operates three distinct Challenge engines. Choose the model that fits your goal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Together */}
                <div
                  onClick={() => setChallengeType('collective')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    challengeType === 'collective'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-zinc-900">
                      Together
                    </h4>
                    <p className="text-xs font-semibold text-amber-700 mt-0.5">
                      Collective Target
                    </p>
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      Everyone contributes toward one shared target. Momentum accumulates collectively and can exceed 100%.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-zinc-100 flex items-center text-[11px] font-bold text-orange-600">
                    <span>Ex: Walk 500 km Together</span>
                  </div>
                </div>

                {/* Race */}
                <div
                  onClick={() => setChallengeType('competitive')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    challengeType === 'competitive'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-3">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-zinc-900">
                      Race
                    </h4>
                    <p className="text-xs font-semibold text-rose-700 mt-0.5">
                      Competitive Target
                    </p>
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      Participants work toward a target and finishing order matters. Governing standard podium ranking (1, 2, 2, 4).
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-zinc-100 flex items-center text-[11px] font-bold text-rose-600">
                    <span>Ex: Race to 100 KM</span>
                  </div>
                </div>

                {/* Streak */}
                <div
                  onClick={() => setChallengeType('streak')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    challengeType === 'streak'
                      ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center mb-3">
                      <Flame className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-extrabold text-zinc-900">
                      Streak
                    </h4>
                    <p className="text-xs font-semibold text-orange-700 mt-0.5">
                      Daily Consistency
                    </p>
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      Complete all required activities every single day to keep your streak alive. No leaderboard, pure consistency.
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-zinc-100 flex items-center text-[11px] font-bold text-orange-600">
                    <span>Ex: 30 Days Movement</span>
                  </div>
                </div>
              </div>

              {/* Templates Shortcut Section */}
              <div className="pt-4 border-t border-zinc-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                      Or Accelerate with a Template
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Pre-populates canonical activities and rules into this composer.
                    </p>
                  </div>
                  <Sparkles className="w-4 h-4 text-orange-500" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CHALLENGE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleApplyTemplate(tpl.id)}
                      className="p-3 text-left bg-zinc-50 hover:bg-orange-50 hover:border-orange-300 border border-zinc-200 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-orange-600">
                          {tpl.name}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 group-hover:text-orange-600">
                          {tpl.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                        {tpl.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BASICS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Challenge Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Walk Nairobi Together, Morning Habit Kickstart"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-hidden focus:border-orange-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Description & Context for Members
                </label>
                <textarea
                  rows={3}
                  placeholder="Why are we doing this together? What does success look like?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-zinc-300 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Cover Atmosphere
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: 'Sunrise Trail',
                      url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
                    },
                    {
                      label: 'Endurance Track',
                      url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80',
                    },
                    {
                      label: 'Calm Mindfulness',
                      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
                    },
                  ].map((img) => (
                    <button
                      key={img.url}
                      onClick={() => setCoverImage(img.url)}
                      className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        coverImage === img.url
                          ? 'border-orange-500 ring-2 ring-orange-500/20'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CANONICAL ACTIVITIES & METRICS */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Select Canonical Activities
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Choose from Tiizi's governed fitness and wellness catalogue.
                    {challengeType === 'streak' && ' (Multi-activity supported for daily checklist)'}
                  </p>
                </div>

                {/* Fitness vs Wellness filter */}
                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg self-start sm:self-auto">
                  {(['All', 'Fitness', 'Wellness'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        categoryFilter === cat ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {CANONICAL_ACTIVITIES.filter((a) =>
                  categoryFilter === 'All' ? true : a.category === categoryFilter
                ).map((act) => {
                  const isSelected = selectedActivityIds.includes(act.id);
                  return (
                    <div
                      key={act.id}
                      onClick={() => handleToggleActivity(act.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-orange-50/70 border-orange-500 shadow-2xs'
                          : 'bg-white border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-zinc-900">{act.name}</span>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            ({act.subCategory})
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                          {act.description}
                        </p>
                        {act.components && (
                          <span className="inline-block mt-1 text-[10px] text-orange-700 bg-orange-100/70 px-1.5 py-0.2 rounded font-semibold">
                            Components: {act.components.join(' & ')}
                          </span>
                        )}
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-orange-600 text-white'
                            : 'border border-zinc-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Measurement Configuration for selected activities */}
              <div className="pt-3 border-t border-zinc-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Configure Measurement & Target
                </h4>

                {selectedActivityIds.map((actId) => {
                  const act = CANONICAL_ACTIVITIES.find((a) => a.id === actId);
                  const cfg = activityConfigs[actId] || {
                    metric: act?.supportedMetrics[0] || 'Distance',
                    unit: 'km',
                    targetValue: 50,
                  };
                  if (!act) return null;

                  return (
                    <div
                      key={actId}
                      className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-zinc-900">
                          {act.name}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          Supports: {act.supportedMetrics.join(', ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Metric selector */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                            Metric
                          </label>
                          <select
                            value={cfg.metric}
                            onChange={(e) =>
                              handleMetricChange(actId, e.target.value as MetricType)
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-zinc-300 font-medium"
                          >
                            {act.supportedMetrics.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Unit selector */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                            Unit
                          </label>
                          <select
                            value={cfg.unit}
                            onChange={(e) =>
                              setActivityConfigs({
                                ...activityConfigs,
                                [actId]: { ...cfg, unit: e.target.value },
                              })
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-zinc-300 font-medium"
                          >
                            {act.supportedUnits[cfg.metric]?.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Target Value */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                            {challengeType === 'streak'
                              ? 'Daily Requirement'
                              : challengeType === 'collective'
                              ? 'Shared Target'
                              : 'Race Finish Target'}
                          </label>
                          <input
                            type="number"
                            value={cfg.targetValue}
                            onChange={(e) =>
                              setActivityConfigs({
                                ...activityConfigs,
                                [actId]: {
                                  ...cfg,
                                  targetValue: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-zinc-300 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: SCHEDULE & TIMEZONE */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Schedule & Governing Timezone
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Timezone determines the midnight boundary for daily streaks and activity validation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-zinc-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Duration (Days)
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2 text-xs rounded-xl border border-zinc-300 font-bold"
                  >
                    <option value={7}>7 Days (1 Week Sprint)</option>
                    <option value={14}>14 Days (2 Weeks)</option>
                    <option value={21}>21 Days (Habit Builder)</option>
                    <option value={30}>30 Days (Monthly Cycle)</option>
                    <option value={60}>60 Days (Seasonal Journey)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Governing Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-zinc-300 font-medium"
                >
                  <option value="Africa/Nairobi (EAT)">Africa/Nairobi (EAT - UTC+3)</option>
                  <option value="Europe/London (BST/GMT)">Europe/London (GMT/BST)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                </select>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Streak checks close precisely at 23:59:59 in the governing timezone.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-orange-700 tracking-wider">
                  Live Rule Translation
                </span>
                <p className="text-sm font-extrabold text-zinc-900 leading-snug">
                  "{generateSummary()}"
                </p>
              </div>

              <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">Group</span>
                  <span className="font-bold text-zinc-900">{activeGroup.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">Challenge Family</span>
                  <span className="font-bold text-orange-600 uppercase">
                    {challengeType}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">Activities</span>
                  <span className="font-bold text-zinc-900">
                    {selectedActivityIds
                      .map((id) => CANONICAL_ACTIVITIES.find((a) => a.id === id)?.name)
                      .join(', ')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200">
                  <span className="text-zinc-500">Schedule</span>
                  <span className="font-bold text-zinc-900">
                    {startDate} ({durationDays} days) • {timezone}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Participation Model</span>
                  <span className="font-bold text-zinc-900">
                    Affirmative Join Required (No auto-enrollment)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Live Summary Bar on bottom of all steps */}
          {step < 5 && (
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-zinc-700">Preview: </span>
                <span className="text-zinc-600">{generateSummary()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50/80 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Challenge to Group</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

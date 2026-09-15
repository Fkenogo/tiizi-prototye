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
  Heart,
  ShieldCheck,
} from 'lucide-react';

interface CreateChallengeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  allGroups: Group[];
  activeGroup: Group;
  currentMember: Member;
  onCreateChallenge: (newChallenge: Challenge) => void;
  initialTemplateId?: string;
}

export const CreateChallengeWizard: React.FC<CreateChallengeWizardProps> = ({
  isOpen,
  onClose,
  allGroups,
  activeGroup,
  currentMember,
  onCreateChallenge,
  initialTemplateId,
}) => {
  // Step sequence:
  // 1: Choose Archetype & Template
  // 2: Host Group & Story (Title, Description, Cover)
  // 3: What are we doing? (Canonical Activities)
  // 4: What counts? (Metrics, Targets, Daily Rules)
  // 5: When? (Duration, Start Date, Timezone)
  // 6: Review & Launch
  const [step, setStep] = useState<number>(1);

  // Form State
  const [challengeType, setChallengeType] = useState<ChallengeType>('collective');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(activeGroup.id);
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
  const [isCause, setIsCause] = useState(false);
  const [causeName, setCauseName] = useState('');

  if (!isOpen) return null;

  const currentHostGroup = allGroups.find((g) => g.id === selectedGroupId) || activeGroup;

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
      const newConfigs: Record<string, { metric: MetricType; unit: string; targetValue: number }> = {};
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

  // Continuous Natural Language Preview Sentence
  const generateSummary = () => {
    const actNames = selectedActivityIds
      .map((id) => CANONICAL_ACTIVITIES.find((a) => a.id === id)?.name || id)
      .join(' & ');

    if (challengeType === 'collective') {
      const primary = activityConfigs[selectedActivityIds[0]] || { targetValue: 500, unit: 'km' };
      return `Everyone in ${currentHostGroup.name} contributes toward a shared goal of ${primary.targetValue} ${primary.unit} of ${actNames} over ${durationDays} days in ${timezone}.`;
    }
    if (challengeType === 'competitive') {
      const primary = activityConfigs[selectedActivityIds[0]] || { targetValue: 100, unit: 'km' };
      return `First participants in ${currentHostGroup.name} to log ${primary.targetValue} ${primary.unit} of ${actNames} before the ${durationDays}-day window ends win podium ranks.`;
    }
    // Streak
    const reqs = selectedActivityIds
      .map((id) => {
        const c = activityConfigs[id];
        const act = CANONICAL_ACTIVITIES.find((a) => a.id === id);
        return `${c?.targetValue || 15} ${c?.unit || 'min'} of ${act?.name || id}`;
      })
      .join(' and ');
    return `Complete ${reqs} every single day in ${timezone} to keep your daily streak alive over ${durationDays} days.`;
  };

  const handleToggleActivity = (actId: string) => {
    const act = CANONICAL_ACTIVITIES.find((a) => a.id === actId);
    if (!act) return;

    if (selectedActivityIds.includes(actId)) {
      if (selectedActivityIds.length === 1) return; // At least one activity required
      setSelectedActivityIds(selectedActivityIds.filter((id) => id !== actId));
      const nextConfigs = { ...activityConfigs };
      delete nextConfigs[actId];
      setActivityConfigs(nextConfigs);
    } else {
      setSelectedActivityIds([...selectedActivityIds, actId]);
      const defaultMetric = act.supportedMetrics[0];
      const defaultUnit = act.supportedUnits[defaultMetric]?.[0] || 'reps';
      let defaultValue = 100;
      if (challengeType === 'streak') {
        defaultValue = defaultMetric === 'Duration' ? 15 : 20;
      } else if (challengeType === 'collective') {
        defaultValue = defaultMetric === 'Distance' ? 500 : 1000;
      } else {
        defaultValue = defaultMetric === 'Distance' ? 100 : 500;
      }

      setActivityConfigs({
        ...activityConfigs,
        [actId]: {
          metric: defaultMetric,
          unit: defaultUnit,
          targetValue: defaultValue,
        },
      });
    }
  };

  const handleUpdateActivityConfig = (
    actId: string,
    field: 'metric' | 'unit' | 'targetValue',
    val: any
  ) => {
    const act = CANONICAL_ACTIVITIES.find((a) => a.id === actId);
    if (!act) return;

    const curr = activityConfigs[actId] || {
      metric: act.supportedMetrics[0],
      unit: act.supportedUnits[act.supportedMetrics[0]]?.[0] || '',
      targetValue: 10,
    };

    if (field === 'metric') {
      const newMetric = val as MetricType;
      const newUnit = act.supportedUnits[newMetric]?.[0] || '';
      setActivityConfigs({
        ...activityConfigs,
        [actId]: {
          ...curr,
          metric: newMetric,
          unit: newUnit,
        },
      });
    } else {
      setActivityConfigs({
        ...activityConfigs,
        [actId]: {
          ...curr,
          [field]: val,
        },
      });
    }
  };

  const handleFinish = () => {
    const finalActivities: ChallengeActivityConfig[] = selectedActivityIds.map((id) => {
      const cfg = activityConfigs[id];
      const act = CANONICAL_ACTIVITIES.find((a) => a.id === id);
      return {
        activityId: id,
        metric: cfg.metric,
        unit: cfg.unit,
        targetValue: Number(cfg.targetValue),
        labelOverride: act?.name,
      };
    });

    const primaryCfg = activityConfigs[selectedActivityIds[0]] || {
      targetValue: 100,
      unit: 'km',
    };

    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      title: title.trim() || `${currentHostGroup.name} Challenge`,
      description:
        description.trim() ||
        `Join our group challenge to build consistency and support each other.`,
      type: challengeType,
      groupId: currentHostGroup.id,
      groupName: currentHostGroup.name,
      creatorId: currentMember.id,
      creatorName: currentMember.name,
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80',
      status: 'active',
      startDate,
      endDate: 'Oct 15, 2026',
      timezone,
      durationDays,
      activities: finalActivities,
      targetValue: Number(primaryCfg.targetValue),
      targetUnit: primaryCfg.unit,
      summarySentence: generateSummary(),
      isCause,
      causeName: isCause ? causeName : undefined,
      participants: [
        {
          memberId: currentMember.id,
          name: currentMember.name,
          avatar: currentMember.avatar,
          accumulatedValue: 0,
          unit: primaryCfg.unit,
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
          ? {
              totalAccumulated: 0,
              target: Number(primaryCfg.targetValue),
              percent: 0,
              completedEarly: false,
            }
          : undefined,
      streakMeta:
        challengeType === 'streak'
          ? {
              totalDays: durationDays,
              currentDayNumber: 1,
            }
          : undefined,
    };

    onCreateChallenge(newChallenge);
    onClose();
  };

  const filteredActivities = CANONICAL_ACTIVITIES.filter((act) => {
    if (categoryFilter !== 'All' && act.category !== categoryFilter) return false;
    if (
      activitySearch.trim() &&
      !act.name.toLowerCase().includes(activitySearch.toLowerCase()) &&
      !act.subCategory.toLowerCase().includes(activitySearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const stepTitles = [
    'How does it work?',
    'Who is hosting?',
    'What are we doing?',
    'What counts & target?',
    'When does it run?',
    'Review & Launch',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-zinc-200">
        {/* Wizard Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                Step {step} of 6
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                {stepTitles[step - 1]}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-zinc-900 mt-1">
              Create a Group Challenge
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Natural-Language Summary Ribbon */}
        <div className="bg-orange-50/90 border-b border-orange-200/80 px-5 py-2.5 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-orange-950 uppercase tracking-wider text-[10px] mr-1.5">
              Live Challenge Summary:
            </span>
            <span className="text-orange-900 font-medium italic">
              "{generateSummary()}"
            </span>
          </div>
        </div>

        {/* Step Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-6">
          {/* STEP 1: CHOOSE ARCHETYPE & OPTIONAL TEMPLATE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  How should this challenge work?
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Choose how your community will participate and achieve progress together.
                </p>
              </div>

              {/* 3 Governed Archetypes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setChallengeType('collective')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    challengeType === 'collective'
                      ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-zinc-900">Collective Goal</h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      Everyone contributes to one shared milestone. Celebrates team solidarity and can exceed 100%.
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md inline-block self-start">
                    Shared Target
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setChallengeType('competitive')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    challengeType === 'competitive'
                      ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-zinc-900">Competitive Race</h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      First participants to reach the target win governed podium ranks (1, 2, 2, 4 tie-breaker rules).
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] uppercase font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md inline-block self-start">
                    Podium Race
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setChallengeType('streak')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                    challengeType === 'streak'
                      ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
                      <Flame className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-zinc-900">Daily Streak</h4>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      Build daily habit consistency. Complete requirements every day before midnight. No ranking leaderboard.
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] uppercase font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md inline-block self-start">
                    Consistency
                  </span>
                </button>
              </div>

              {/* Ready-to-go Community Templates */}
              <div className="pt-3 border-t border-zinc-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  Or start with a proven community blueprint
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CHALLENGE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl.id)}
                      className="p-3 rounded-xl bg-zinc-50 hover:bg-orange-50/60 border border-zinc-200 hover:border-orange-300 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-orange-600">
                          {tpl.type}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          {tpl.durationDays} days
                        </span>
                      </div>
                      <p className="font-bold text-xs text-zinc-900 mt-1 group-hover:text-orange-600">
                        {tpl.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">
                        {tpl.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: HOST GROUP & BASIC DETAILS */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Who is hosting this challenge?
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Challenges exist within a group community. Select the host group and set your challenge identity.
                </p>
              </div>

              {/* Host Group Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Host Group
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allGroups.map((grp) => {
                    const isSelected = grp.id === selectedGroupId;
                    return (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => setSelectedGroupId(grp.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500/20'
                            : 'border-zinc-200 hover:bg-zinc-50'
                        }`}
                      >
                        <img
                          src={grp.image}
                          alt={grp.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-900 truncate">
                            {grp.name}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {grp.memberCount} members • {grp.location}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sunrise 500 KM Community Walk"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Inspiring Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain why we're doing this, what it means to our group, and how each person contributes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              {/* Cause Toggle */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">Is this for a community cause?</p>
                      <p className="text-[11px] text-emerald-700">Dedicate accumulated movement to awareness or charity</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isCause}
                    onChange={(e) => setIsCause(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {isCause && (
                  <input
                    type="text"
                    placeholder="Cause name, e.g., Karura Forest Conservation Initiative"
                    value={causeName}
                    onChange={(e) => setCauseName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-emerald-300 focus:outline-hidden"
                  />
                )}
              </div>
            </div>
          )}

          {/* STEP 3: WHAT ARE WE DOING? (CANONICAL ACTIVITIES) */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  What activities count toward this challenge?
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Select canonical activities from the governed catalogue. Streak challenges support multi-activity daily habits.
                </p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search canonical activities..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl shrink-0">
                  {(['All', 'Fitness', 'Wellness'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-white text-zinc-900 shadow-2xs font-bold'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto p-1">
                {filteredActivities.map((act) => {
                  const isSelected = selectedActivityIds.includes(act.id);
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleToggleActivity(act.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500/20'
                          : 'border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-zinc-900">{act.name}</span>
                          <span className="text-[10px] text-zinc-400">({act.subCategory})</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                          {act.description}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-orange-700 font-semibold">
                          <span>Metrics: {act.supportedMetrics.join(', ')}</span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-orange-600 text-white'
                            : 'border border-zinc-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: WHAT COUNTS & GOAL TARGETS */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Configure metrics and targets
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {challengeType === 'collective' &&
                    'Set the shared group target that all participants will contribute toward.'}
                  {challengeType === 'competitive' &&
                    'Set the target race milestone that participants will sprint toward.'}
                  {challengeType === 'streak' &&
                    'Set what must be accomplished every single day to keep the streak alive.'}
                </p>
              </div>

              <div className="space-y-3">
                {selectedActivityIds.map((actId) => {
                  const act = CANONICAL_ACTIVITIES.find((a) => a.id === actId);
                  const cfg = activityConfigs[actId] || {
                    metric: 'Distance',
                    unit: 'km',
                    targetValue: 100,
                  };
                  if (!act) return null;

                  return (
                    <div
                      key={actId}
                      className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900">
                          {act.name} ({act.category})
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500">
                          Canonical ID: {act.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Metric Type */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                            Governed Metric
                          </label>
                          <select
                            value={cfg.metric}
                            onChange={(e) =>
                              handleUpdateActivityConfig(actId, 'metric', e.target.value)
                            }
                            className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-zinc-200 focus:outline-hidden font-medium"
                          >
                            {act.supportedMetrics.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Unit */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                            Unit of Measurement
                          </label>
                          <select
                            value={cfg.unit}
                            onChange={(e) =>
                              handleUpdateActivityConfig(actId, 'unit', e.target.value)
                            }
                            className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-zinc-200 focus:outline-hidden font-medium"
                          >
                            {(act.supportedUnits[cfg.metric] || ['units']).map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Target Value */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                            {challengeType === 'streak' ? 'Daily Requirement' : 'Total Goal Target'}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={cfg.targetValue}
                            onChange={(e) =>
                              handleUpdateActivityConfig(
                                actId,
                                'targetValue',
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-zinc-200 focus:outline-hidden font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: WHEN DOES IT RUN? (SCHEDULE & TIMEZONE) */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  When does this challenge take place?
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Governed start date, duration, and time boundary.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[7, 14, 21, 30].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDurationDays(days)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          durationDays === days
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Governing Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden font-medium"
                >
                  <option value="Africa/Nairobi (EAT)">Africa/Nairobi (EAT, UTC+3)</option>
                  <option value="Europe/London (BST/GMT)">Europe/London (BST/GMT, UTC+1)</option>
                  <option value="America/New_York (EST/EDT)">America/New_York (EST, UTC-5)</option>
                  <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST, UTC+9)</option>
                </select>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Daily resets for streak challenges occur precisely at 23:59 in this timezone.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & LAUNCH */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Ready to launch your community challenge
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Review the governed challenge configuration before publishing to {currentHostGroup.name}.
                </p>
              </div>

              {/* Visual Card Preview */}
              <div className="p-5 rounded-2xl bg-zinc-900 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500 text-white">
                    {challengeType.toUpperCase()} CHALLENGE
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{durationDays} Days</span>
                  </span>
                </div>

                <h4 className="text-lg font-black tracking-tight text-white">
                  {title || `${currentHostGroup.name} Challenge`}
                </h4>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {generateSummary()}
                </p>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>Host: <strong className="text-white">{currentHostGroup.name}</strong></span>
                  <span>Timezone: <strong className="text-white">{timezone}</strong></span>
                </div>
              </div>

              {/* Governed Rules Checklist */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                <h5 className="font-bold text-zinc-900">Governed Rules Verified:</h5>
                <div className="flex items-center gap-2 text-zinc-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Only logs for selected canonical activities will count toward this goal.</span>
                </div>
                {challengeType === 'streak' && (
                  <div className="flex items-center gap-2 text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Daily requirements must be logged before 23:59 {timezone} each day.</span>
                  </div>
                )}
                {challengeType === 'collective' && (
                  <div className="flex items-center gap-2 text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Total target progress can exceed 100% until the scheduled end date.</span>
                  </div>
                )}
                {challengeType === 'competitive' && (
                  <div className="flex items-center gap-2 text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Podium ranking enforces strict tie-breakers (1, 2, 2, 4) upon hitting target.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wizard Navigation Footer */}
        <div className="p-5 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 rounded-xl border border-zinc-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Launch Challenge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

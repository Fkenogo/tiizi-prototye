import React, { useState, useEffect, useRef } from 'react';
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
  Edit3,
  AlertTriangle,
  UserCheck,
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
  // 1: Choose Archetype & Template (Together, Race, Streak)
  // 2: Host Group & Story
  // 3: What are we doing? (Canonical Activities)
  // 4: What counts? (Metrics, Targets, Daily Rules)
  // 5: When? (Schedule, Duration, Timezone)
  // 6: Review: "This is the Challenge you're creating" with section edit links & creator join decision
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

  // Explicit affirmative creator participation (Product Truth: Creator participation must NOT be assumed)
  const [creatorWillJoin, setCreatorWillJoin] = useState<boolean>(false);
  const appliedTemplate = useRef<string | null>(null);

  // Apply template helper (function declaration so the mount effect below can call it)
  function handleApplyTemplate(tplId: string) {
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
  }

  useEffect(() => {
    if (isOpen && initialTemplateId && appliedTemplate.current !== initialTemplateId) {
      appliedTemplate.current = initialTemplateId;
      handleApplyTemplate(initialTemplateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTemplateId]);

  if (!isOpen) return null;

  const currentHostGroup = allGroups.find((g) => g.id === selectedGroupId) || activeGroup;

  // Continuous Natural Language Preview Sentence
  const generateSummary = () => {
    const actNames = selectedActivityIds
      .map((id) => CANONICAL_ACTIVITIES.find((a) => a.id === id)?.name || id)
      .join(' & ');

    if (challengeType === 'collective') {
      const primary = activityConfigs[selectedActivityIds[0]] || { targetValue: 500, unit: 'km' };
      return `Everyone in ${currentHostGroup.name} contributes together toward a shared milestone of ${primary.targetValue} ${primary.unit} of ${actNames} over ${durationDays} days in ${timezone}.`;
    }
    if (challengeType === 'competitive') {
      const primary = activityConfigs[selectedActivityIds[0]] || { targetValue: 100, unit: 'km' };
      return `Participants in ${currentHostGroup.name} strive to complete ${primary.targetValue} ${primary.unit} of ${actNames} before the ${durationDays}-day window ends in ${timezone}. Qualifying finishers receive standard competition finishing positions.`;
    }
    // Streak
    const reqs = selectedActivityIds
      .map((id) => {
        const c = activityConfigs[id];
        const act = CANONICAL_ACTIVITIES.find((a) => a.id === id);
        return `${c?.targetValue || 15} ${c?.unit || 'min'} of ${act?.name || id}`;
      })
      .join(' and ');
    return `Complete ${reqs} before the Challenge day ends in ${timezone} to maintain your daily streak over ${durationDays} days.`;
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

    // Product Truth: Group Membership ≠ Challenge Participation. Creator is NOT silently enrolled.
    const initialParticipants = creatorWillJoin
      ? [
          {
            memberId: currentMember.id,
            name: currentMember.name,
            avatar: currentMember.avatar,
            accumulatedValue: 0,
            unit: primaryCfg.unit,
            lastContributionAt: 'Joined upon creation',
            rank: null,
            finished: false,
            daysCompleted: 0,
            currentStreak: 0,
            bestStreak: 0,
            todayCompleted: false,
            todayRequirementsDone: {},
          },
        ]
      : [];

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
      participants: initialParticipants,
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
    'How it works (Archetype)',
    'Who is hosting & story',
    'What are we doing?',
    'What counts & targets?',
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
          {/* STEP 1: CHOOSE ARCHETYPE & TEMPLATE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Choose the Challenge Archetype
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Governed rules determine how participation accumulates and how outcomes are recognized.
                </p>
              </div>

              {/* 3 Governed Archetypes with dual naming: Human Title + Canonical Label */}
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
                    <div className="mb-1">
                      <h4 className="font-extrabold text-sm text-zinc-900 leading-tight">Together</h4>
                      <span className="text-[10px] text-zinc-400 font-bold block">
                        Collective challenge
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                      Everyone contributes to one shared milestone. Celebrates team solidarity and can exceed 100%.
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md inline-block self-start">
                    Shared Outcome
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
                    <div className="mb-1">
                      <h4 className="font-extrabold text-sm text-zinc-900 leading-tight">Race</h4>
                      <span className="text-[10px] text-zinc-400 font-bold block">
                        Competitive challenge
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                      Participants strive to hit the qualifying milestone. Standard competition finishing positions (1, 2, 2, 4) with shared ties.
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] uppercase font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md inline-block self-start">
                    Finishing Positions
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
                    <div className="mb-1">
                      <h4 className="font-extrabold text-sm text-zinc-900 leading-tight">Streak</h4>
                      <span className="text-[10px] text-zinc-400 font-bold block">
                        Daily consistency challenge
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                      Build daily habit consistency. Complete requirements before the challenge day ends in the governing timezone.
                    </p>
                  </div>
                  <span className="mt-4 text-[10px] uppercase font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md inline-block self-start">
                    Habit Chain
                  </span>
                </button>
              </div>

              {/* Ready-to-go Community Templates (Pre-filled configuration shortcuts) */}
              <div className="pt-3 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span>Pre-filled Configuration Templates</span>
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    Editable shortcuts into this same creation flow
                  </span>
                </div>

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
                  Challenges are hosted inside a community group. Select the host circle and define its identity.
                </p>
              </div>

              {/* Host Group Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Host Community Group
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
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 focus:bg-white font-medium"
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

              {/* Community Cause Dedication (No monetary fundraising / financial custody) */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-950">Community Cause Dedication</p>
                      <p className="text-[11px] text-emerald-700">Dedicate movement to a cause or external sponsor pledge (self-reported)</p>
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
                  <div className="space-y-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Cause name, e.g., Karura Forest Conservation Initiative"
                      value={causeName}
                      onChange={(e) => setCauseName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-emerald-300 focus:outline-hidden font-medium"
                    />
                    <p className="text-[10px] text-emerald-800">
                      *Note: Tiizi tracks pledged movement dedication. Tiizi does not handle financial donations or payment escrow.
                    </p>
                  </div>
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
                  Select canonical activities from the catalogue. Streak challenges support multi-activity daily habits.
                </p>
              </div>

              {/* Governed Multiplicity Warning for Collective/Race */}
              {challengeType !== 'streak' && selectedActivityIds.length > 1 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Governed Configuration Note: </span>
                    Collective & Race challenges default to measuring a single canonical activity. Combining multiple activities requires governed metric equivalence engines.
                  </div>
                </div>
              )}

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search canonical activities..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 rounded-xl border border-zinc-200 focus:outline-hidden focus:border-orange-500 font-medium"
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
                    'Set the qualifying race milestone that participants strive to complete.'}
                  {challengeType === 'streak' &&
                    'Set what must be accomplished every single day before the day ends.'}
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
                  Daily resets for streak challenges occur strictly when the challenge day concludes in this governing timezone.
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & LAUNCH — "This is the Challenge you're creating" */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900">
                  This is the Challenge you're creating.
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Review the governed configuration before publishing to {currentHostGroup.name}. Use edit links to adjust any section.
                </p>
              </div>

              {/* Visual Card Preview */}
              <div className="p-5 rounded-2xl bg-zinc-900 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500 text-white">
                    {challengeType === 'collective' && 'Together (Collective)'}
                    {challengeType === 'competitive' && 'Race (Competitive)'}
                    {challengeType === 'streak' && 'Streak (Daily Consistency)'}
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
                  <span>Host Group: <strong className="text-white">{currentHostGroup.name}</strong></span>
                  <span>Timezone: <strong className="text-white">{timezone}</strong></span>
                </div>
              </div>

              {/* Structured Section Review with Direct Edit Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Host Group */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                      Host Community
                    </span>
                    <p className="text-xs font-bold text-zinc-900 mt-0.5">{currentHostGroup.name}</p>
                    <p className="text-[11px] text-zinc-500">{currentHostGroup.location}</p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 2. Challenge Archetype */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                      Archetype & Rules
                    </span>
                    <p className="text-xs font-bold text-zinc-900 mt-0.5 capitalize">{challengeType} Challenge</p>
                    <p className="text-[11px] text-zinc-500">
                      {challengeType === 'collective' && 'Shared milestone, over-100% permitted'}
                      {challengeType === 'competitive' && '1, 2, 2, 4 standard competition ties'}
                      {challengeType === 'streak' && 'Daily habits with timezone reset'}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 3. Activities */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                      Canonical Activities
                    </span>
                    <p className="text-xs font-bold text-zinc-900 mt-0.5">
                      {selectedActivityIds.map((id) => CANONICAL_ACTIVITIES.find((a) => a.id === id)?.name).join(', ')}
                    </p>
                    <p className="text-[11px] text-zinc-500">{selectedActivityIds.length} activity configured</p>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                {/* 4. Schedule & Timezone */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                      Schedule & Boundary
                    </span>
                    <p className="text-xs font-bold text-zinc-900 mt-0.5">{durationDays} Days • Starts {startDate}</p>
                    <p className="text-[11px] text-zinc-500">{timezone}</p>
                  </div>
                  <button
                    onClick={() => setStep(5)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Explicit Creator Participation Decision (Product Truth Alignment) */}
              <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">
                      Creator Participation Decision
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Group Membership ≠ Challenge Participation. Creating a challenge does not enroll you automatically.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCreatorWillJoin(true)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                      creatorWillJoin
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    ✓ Yes, Join this Challenge as a Participant
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreatorWillJoin(false)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                      !creatorWillJoin
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    Create Without Joining (Organizer / Steward Only)
                  </button>
                </div>
              </div>

              {/* Governed Rules Checklist */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                <h5 className="font-bold text-zinc-900">Governed Rules Verified:</h5>
                <div className="flex items-center gap-2 text-zinc-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Only logs for designated canonical activities count toward this challenge.</span>
                </div>
                {challengeType === 'streak' && (
                  <div className="flex items-center gap-2 text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Daily requirements must be logged before the day ends in {timezone}.</span>
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
                    <span>Qualifying finishers receive standard competition finishing positions (1, 2, 2, 4 ties).</span>
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

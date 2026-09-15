export type ChallengeType = 'collective' | 'competitive' | 'streak';

export type ActivityCategory = 'Fitness' | 'Wellness';

export type ActivitySubCategory = 'Cardio' | 'Strength' | 'Mobility' | 'Mindfulness' | 'Habit';

export type MetricType = 'Repetitions' | 'Duration' | 'Distance' | 'Completion' | 'Weight';

export interface CanonicalActivity {
  id: string;
  name: string;
  category: ActivityCategory;
  subCategory: ActivitySubCategory;
  description: string;
  howItWorks: string;
  safetyGuidance: string;
  supportedMetrics: MetricType[];
  supportedUnits: {
    [key in MetricType]?: string[];
  };
  components?: string[]; // e.g. ["Left Side", "Right Side"]
  iconName: string;
}

export interface Member {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  bio: string;
  role: 'member' | 'steward';
  joinedDate: string;
  stats: {
    challengesCompleted: number;
    currentActiveCount: number;
    kudosReceived: number;
  };
}

export interface Group {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  image: string;
  isPrivate: boolean;
  memberCount: number;
  stewardIds: string[];
  activeChallengeIds: string[];
  tags: string[];
  rules: string[];
}

export interface ChallengeActivityConfig {
  activityId: string;
  metric: MetricType;
  unit: string;
  targetValue: number; // e.g., 500 for collective km, or 100 for competitive race, or 15 (min) for daily streak
  componentsRequired?: string[];
  labelOverride?: string;
}

export interface ParticipantContribution {
  memberId: string;
  name: string;
  avatar: string;
  accumulatedValue: number;
  unit: string;
  lastContributionAt: string;
  // For Competitive
  rank: number | null; // 1, 2, 2, 4 (null if not finished)
  finished: boolean;
  finishedAt?: string;
  // For Streak
  daysCompleted: number;
  currentStreak: number;
  bestStreak: number;
  todayCompleted: boolean;
  todayRequirementsDone: { [activityId: string]: boolean };
  missedYesterday?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  groupId: string;
  groupName: string;
  creatorId: string;
  creatorName: string;
  coverImage: string;
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  timezone: string; // e.g. "Africa/Nairobi (EAT)"
  durationDays: number;
  activities: ChallengeActivityConfig[];
  targetValue: number;
  targetUnit: string;
  summarySentence: string;
  isCause?: boolean;
  causeName?: string;
  participants: ParticipantContribution[];
  // Collective Specific
  collectiveProgress?: {
    totalAccumulated: number;
    target: number;
    percent: number;
    completedEarly: boolean;
  };
  // Streak Specific
  streakMeta?: {
    totalDays: number;
    currentDayNumber: number;
  };
}

export interface ActivitySubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  activityId: string;
  activityName: string;
  metric: MetricType;
  value: number;
  unit: string;
  componentValues?: Record<string, boolean | number>;
  timestamp: string;
  verified: boolean;
  kudosCount: number;
  kudosGivenBy: string[]; // memberIds
  note?: string;
}

export interface CommunityMoment {
  id: string;
  type: 'milestone' | 'daily_done' | 'target_crossed' | 'race_finish' | 'streak_milestone' | 'activity_logged';
  actorName: string;
  actorAvatar: string;
  actorId: string;
  challengeId: string;
  challengeTitle: string;
  challengeType: ChallengeType;
  headline: string;
  detail: string;
  timestamp: string;
  kudos: number;
  hasKudoed: boolean;
}

export interface NotificationAlert {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'invitation' | 'streak_reminder' | 'target_nearing' | 'kudo' | 'milestone';
  targetChallengeId?: string;
}

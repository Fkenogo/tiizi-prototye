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

export interface SystemRecognition {
  id: string;
  title: string;
  badge?: string;
  tier?: 'Gold' | 'Silver' | 'Bronze' | 'Honorable' | 'podium' | 'consistency_master' | 'completed';
  awardedDate?: string;
  issuedAt?: string;
  challengeTitle?: string;
  reason?: string;
  summary?: string;
  governedProof?: string;
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
  recognitions?: SystemRecognition[];
  // Experience-reference account state (member directory variety)
  accountState?: 'active' | 'suspended' | 'invited' | 'inactive';
  languages?: string[];
  notificationPrefs?: NotificationPreference[];
  privacy?: { showProfileToNonMembers?: boolean; showActivityHistory?: boolean };
}

export type NotificationPreference =
  | 'group_invite'
  | 'challenge_invite'
  | 'challenge_start'
  | 'challenge_end'
  | 'streak_reminder'
  | 'collective_milestone'
  | 'kudo'
  | 'recognition'
  | 'moderation';

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
  allowMemberCreation?: boolean;
  // Experience-reference group health states
  healthState?: 'healthy' | 'restricted' | 'flagged';
  creationPermission?: 'open' | 'stewards_only';
  pendingRequests?: number;
  flaggedReason?: string;
}

export type AssumptionCategory =
  | 'EXPERIENCE HYPOTHESIS'
  | 'PRODUCT TRUTH'
  | 'NEEDS FOUNDER DECISION'
  | 'OUT OF SCOPE';

export interface AssumptionItem {
  id: string;
  title: string;
  category: AssumptionCategory;
  statement: string;
  rationale: string;
  prototypeBehavior: string;
}

export type NavigationVariant = 'variant_a' | 'variant_b';


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

export type ChallengeStatus = 'active' | 'upcoming' | 'completed' | 'closed';

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
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  // Experience-reference lifecycle extras (optional so existing mocks keep working)
  capacity?: number;
  isFull?: boolean;
  isFlagged?: boolean;
  flaggedReason?: string;
  finalized?: boolean;
  inviteState?: 'none' | 'invited' | 'requested' | 'expired';
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

export type NotificationCategory =
  | 'group_invite'
  | 'challenge_invite'
  | 'challenge_start'
  | 'challenge_end'
  | 'streak_reminder'
  | 'collective_milestone'
  | 'kudo'
  | 'recognition'
  | 'moderation'
  | 'system'
  // legacy aliases kept for existing mocks
  | 'invitation'
  | 'streak_reminder_legacy'
  | 'target_nearing'
  | 'kudo_legacy'
  | 'milestone';

export interface NotificationAlert {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: NotificationCategory | 'invitation' | 'streak_reminder' | 'target_nearing' | 'kudo' | 'milestone';
  targetChallengeId?: string;
  category?: NotificationCategory;
}

// ---- Operator experience-reference model (mock only, no production authority) ----

export type OperatorSection =
  | 'overview'
  | 'users'
  | 'groups'
  | 'activities'
  | 'challenges'
  | 'templates'
  | 'approvals'
  | 'donations'
  | 'content'
  | 'access'
  | 'health'
  | 'audit'
  | 'settings';

export type SurfaceMode = 'member' | 'operator';

export interface OperatorUserRow {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  state: 'active' | 'suspended' | 'invited' | 'inactive';
  role: string;
  groups: number;
  challenges: number;
  recognitions: number;
  lastActive: string;
  issue?: string;
}

export interface OperatorGroupRow {
  id: string;
  name: string;
  state: 'healthy' | 'restricted' | 'flagged';
  members: number;
  stewards: string;
  activeChallenges: number;
  completedChallenges: number;
  pendingRequests: number;
  creationPermission: 'open' | 'stewards_only';
  flag?: string;
}

export type ActivityLifecycle = 'draft' | 'published' | 'retired';
export type ActivityReadiness = 'ready' | 'needs_review' | 'missing_content' | 'missing_translation';

export interface OperatorActivityRow {
  id: string;
  code: string;
  displayName: string;
  domain: 'Fitness' | 'Wellness';
  category: string;
  lifecycle: ActivityLifecycle;
  readiness: ActivityReadiness;
  challengeEligible: boolean;
  metrics: string;
  locales: string;
  version: string;
  updated: string;
}

export interface OperatorChallengeRow {
  id: string;
  title: string;
  group: string;
  type: ChallengeType;
  status: ChallengeStatus;
  participants: number;
  start: string;
  end: string;
  flagged?: string;
  finalized: boolean;
  resultSummary: string;
}

export type TemplateStatus = 'draft' | 'published' | 'retired';

export interface OperatorTemplateRow {
  id: string;
  name: string;
  type: ChallengeType;
  status: TemplateStatus;
  uses: number;
  locales: string;
  updated: string;
  editableFields: string;
}

export interface ApprovalItem {
  id: string;
  kind: 'group_join' | 'challenge_creation' | 'content_publish' | 'template_publish' | 'moderation' | 'account_review' | 'donation_review' | 'localisation_gap';
  title: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
  age: string;
  status: 'pending' | 'approved' | 'dismissed' | 'escalated';
  mockLabel: string;
}

export interface DonationRecord {
  id: string;
  kind: 'tiizi_support' | 'cause_support';
  contributor: string;
  amount: string;
  date: string;
  status: 'recorded' | 'pending' | 'attention';
  channel: string;
  reconciliation: 'matched' | 'unmatched' | 'n/a';
  note: string;
}

export interface LocaleCoverage {
  locale: string;
  label: string;
  activities: string;
  templates: string;
  systemCopy: string;
  fallback: string;
  state: 'ready' | 'partial' | 'missing';
}

export interface AccessRoleRow {
  role: string;
  scope: string;
  holders: number;
  status: 'active' | 'review';
  summary: string;
  lastChange: string;
}

export interface HealthService {
  name: string;
  state: 'healthy' | 'degraded' | 'incident' | 'maintenance';
  detail: string;
  updated: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  where: string;
  when: string;
  summary: string;
}

export interface OnboardingPersonaState {
  id: 'brand_new' | 'no_group' | 'in_group_no_challenge' | 'invited_group' | 'invited_challenge' | 'active_commitments';
  title: string;
  description: string;
  nextSteps: string[];
}

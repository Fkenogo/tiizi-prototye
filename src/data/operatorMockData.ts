import {
  OperatorUserRow,
  OperatorGroupRow,
  OperatorActivityRow,
  OperatorChallengeRow,
  OperatorTemplateRow,
  ApprovalItem,
  DonationRecord,
  LocaleCoverage,
  AccessRoleRow,
  HealthService,
  AuditEntry,
} from '../types';

// Obviously non-production mock data for the Experience Reference operator console.

export const OPERATOR_USERS: OperatorUserRow[] = [
  { id: 'user-amina', name: 'Amina Odhiambo', handle: '@amina_o', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', state: 'active', role: 'Member', groups: 2, challenges: 3, recognitions: 2, lastActive: 'Today, 7:15 AM' },
  { id: 'user-wanjiku', name: 'Wanjiku Kimani', handle: '@wanjiku_k', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', state: 'active', role: 'Group Steward', groups: 3, challenges: 4, recognitions: 1, lastActive: 'Today, 8:00 AM' },
  { id: 'user-kipchoge', name: 'Kipchoge Ngetich', handle: '@kipchoge_n', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', state: 'active', role: 'Member', groups: 2, challenges: 3, recognitions: 1, lastActive: 'Yesterday' },
  { id: 'user-david', name: 'David Mwangi', handle: '@david_m', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', state: 'active', role: 'Member', groups: 1, challenges: 2, recognitions: 1, lastActive: '2 days ago' },
  { id: 'user-sarah', name: 'Sarah Chen', handle: '@sarah_c', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', state: 'active', role: 'Member', groups: 2, challenges: 2, recognitions: 0, lastActive: 'Today, 6:40 AM' },
  { id: 'user-eric', name: 'Eric Mutua', handle: '@eric_m', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', state: 'active', role: 'Member', groups: 1, challenges: 3, recognitions: 0, lastActive: 'Today, 6:15 AM' },
  { id: 'user-suspended-sample', name: 'Brian Otieno', handle: '@brian_o', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', state: 'suspended', role: 'Member', groups: 0, challenges: 0, recognitions: 0, lastActive: 'Aug 30, 2026', issue: 'Mock suspension: repeated inaccurate logs (prototype). Appeal pending.' },
  { id: 'user-invited-sample', name: 'Faith Njeri', handle: '@faith_n', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', state: 'invited', role: 'Member', groups: 0, challenges: 0, recognitions: 0, lastActive: 'Invite sent Sep 12' },
  { id: 'user-inactive-sample', name: 'Peter Kamau', handle: '@peter_k', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', state: 'inactive', role: 'Member', groups: 1, challenges: 0, recognitions: 0, lastActive: 'Jun 2026' },
];

export const OPERATOR_GROUPS: OperatorGroupRow[] = [
  { id: 'grp-nairobi-movers', name: 'Nairobi Morning Movers', state: 'healthy', members: 48, stewards: 'Wanjiku Kimani', activeChallenges: 3, completedChallenges: 4, pendingRequests: 2, creationPermission: 'open' },
  { id: 'grp-kilimani-endurance', name: 'Kilimani Endurance Club', state: 'restricted', members: 32, stewards: 'Kipchoge Ngetich', activeChallenges: 1, completedChallenges: 2, pendingRequests: 5, creationPermission: 'stewards_only' },
  { id: 'grp-zenith-mind', name: 'Zenith Mind & Motion', state: 'flagged', members: 65, stewards: 'Wanjiku Kimani', activeChallenges: 1, completedChallenges: 1, pendingRequests: 0, creationPermission: 'open', flag: 'Prototype flag: member-reported cover photo (mock).' },
];

export const OPERATOR_ACTIVITIES: OperatorActivityRow[] = [
  { id: 'act-walking', code: 'WALK', displayName: 'Walking', domain: 'Fitness', category: 'Cardio', lifecycle: 'published', readiness: 'ready', challengeEligible: true, metrics: 'Distance (km, m) · Duration (min, s)', locales: 'en ✓ · sw ✓', version: 'v4', updated: 'Aug 2026' },
  { id: 'act-running', code: 'RUN', displayName: 'Running', domain: 'Fitness', category: 'Cardio', lifecycle: 'published', readiness: 'ready', challengeEligible: true, metrics: 'Distance (km, m) · Duration (min)', locales: 'en ✓ · sw ✓', version: 'v4', updated: 'Aug 2026' },
  { id: 'act-pushup', code: 'PUSH', displayName: 'Push-Up', domain: 'Fitness', category: 'Strength', lifecycle: 'published', readiness: 'ready', challengeEligible: true, metrics: 'Repetitions (reps)', locales: 'en ✓ · sw partial', version: 'v3', updated: 'Jul 2026' },
  { id: 'act-plank', code: 'PLANK', displayName: 'Plank', domain: 'Fitness', category: 'Strength', lifecycle: 'published', readiness: 'needs_review', challengeEligible: true, metrics: 'Duration (s, min)', locales: 'en ✓ · sw missing', version: 'v3', updated: 'Jul 2026' },
  { id: 'act-side-plank', code: 'SIDE-PLK', displayName: 'Side Plank', domain: 'Fitness', category: 'Strength', lifecycle: 'published', readiness: 'missing_translation', challengeEligible: true, metrics: 'Duration (s, min) · bilateral', locales: 'en ✓ · sw missing', version: 'v2', updated: 'Jun 2026' },
  { id: 'act-breathing', code: 'BREATH', displayName: 'Breathing Practice', domain: 'Wellness', category: 'Mindfulness', lifecycle: 'published', readiness: 'ready', challengeEligible: true, metrics: 'Duration (min) · Completion (done)', locales: 'en ✓ · sw ✓', version: 'v3', updated: 'Aug 2026' },
  { id: 'act-meditation', code: 'MEDIT', displayName: 'Mindful Meditation', domain: 'Wellness', category: 'Mindfulness', lifecycle: 'published', readiness: 'missing_content', challengeEligible: false, metrics: 'Duration (min) · Completion (done)', locales: 'en partial · sw missing', version: 'v2', updated: 'May 2026' },
  { id: 'act-squat', code: 'SQUAT', displayName: 'Bodyweight Squat', domain: 'Fitness', category: 'Strength', lifecycle: 'draft', readiness: 'needs_review', challengeEligible: false, metrics: 'Repetitions (reps)', locales: 'en draft', version: 'v1-draft', updated: 'Sep 2026' },
  { id: 'act-hydration', code: 'HYDR', displayName: 'Daily Hydration Practice', domain: 'Wellness', category: 'Habit', lifecycle: 'draft', readiness: 'missing_content', challengeEligible: false, metrics: 'Completion (done)', locales: 'en draft', version: 'v1-draft', updated: 'Sep 2026' },
  { id: 'act-single-leg-balance', code: 'BAL-1L', displayName: 'Single-Leg Balance', domain: 'Fitness', category: 'Mobility', lifecycle: 'retired', readiness: 'ready', challengeEligible: false, metrics: 'Duration (s, min) · bilateral', locales: 'en ✓', version: 'v1-retired', updated: 'Apr 2026' },
];

export const METRIC_COMPATIBILITY = [
  { activity: 'Walking', metric: 'Distance', units: 'km, m', eligible: true, note: 'Collective + Race eligible' },
  { activity: 'Walking', metric: 'Duration', units: 'minutes, seconds', eligible: true, note: 'Streak eligible' },
  { activity: 'Running', metric: 'Distance', units: 'km, m', eligible: true, note: 'Collective + Race eligible' },
  { activity: 'Push-Up', metric: 'Repetitions', units: 'reps', eligible: true, note: 'Streak eligible; collective only via governed equivalence' },
  { activity: 'Plank', metric: 'Duration', units: 'seconds, minutes', eligible: true, note: 'Streak eligible' },
  { activity: 'Breathing Practice', metric: 'Duration', units: 'minutes', eligible: true, note: 'Streak eligible' },
  { activity: 'Breathing Practice', metric: 'Completion', units: 'done', eligible: false, note: 'Reference only — not challenge-counted in prototype' },
  { activity: 'Mindful Meditation', metric: 'Duration', units: 'minutes', eligible: false, note: 'Missing content — blocked until review' },
];

export const OPERATOR_CHALLENGES: OperatorChallengeRow[] = [
  { id: 'ch-walk-nairobi', title: 'Walk Nairobi Together', group: 'Nairobi Morning Movers', type: 'collective', status: 'active', participants: 6, start: 'Sep 10', end: 'Sep 24', finalized: false, resultSummary: '438.5 / 500 km (87.7%)' },
  { id: 'ch-race-100k', title: 'Race to 100 KM', group: 'Nairobi Morning Movers', type: 'competitive', status: 'active', participants: 6, start: 'Sep 1', end: 'Sep 30', finalized: false, resultSummary: '3 qualified finishers; ranks 1, 2, 2' },
  { id: 'ch-30day-movement', title: '30 Days of Morning Movement', group: 'Nairobi Morning Movers', type: 'streak', status: 'active', participants: 5, start: 'Aug 29', end: 'Sep 27', finalized: false, resultSummary: 'Day 18/30; 1 reset (mock)' },
  { id: 'ch-upcoming-sunrise', title: 'Sunrise 5K Prep Week', group: 'Nairobi Morning Movers', type: 'collective', status: 'upcoming', participants: 0, start: 'Oct 1', end: 'Oct 7', finalized: false, resultSummary: 'Not started; logging disabled' },
  { id: 'ch-karura-250k', title: 'Karura Forest 250k Sprint', group: 'Nairobi Morning Movers', type: 'collective', status: 'completed', participants: 5, start: 'Aug 1', end: 'Aug 15', finalized: true, resultSummary: '278 / 250 km (111.2%) — locked' },
  { id: 'ch-closed-full', title: 'Arboretum Interval Night (Full)', group: 'Kilimani Endurance Club', type: 'competitive', status: 'closed', participants: 24, start: 'Aug 10', end: 'Aug 10', finalized: true, resultSummary: 'Capacity 24/24 — locked' },
  { id: 'ch-flagged-sample', title: 'Flagged: Midnight Ultra', group: 'Nairobi Morning Movers', type: 'competitive', status: 'active', participants: 0, start: 'Sep 12', end: 'Sep 20', flagged: 'Unrealistic target pairing (mock report ×2)', finalized: false, resultSummary: 'Under mock review' },
];

export const OPERATOR_TEMPLATES: OperatorTemplateRow[] = [
  { id: 'tpl-walk-together', name: 'Community Distance Goal', type: 'collective', status: 'published', uses: 18, locales: 'en ✓ · sw ✓', updated: 'Aug 2026', editableFields: 'target, duration, group, cause' },
  { id: 'tpl-race-100', name: 'Century Sprint (Race to 100k)', type: 'competitive', status: 'published', uses: 11, locales: 'en ✓ · sw ✓', updated: 'Aug 2026', editableFields: 'target, duration, group' },
  { id: 'tpl-morning-streak', name: '30-Day Morning Movement', type: 'streak', status: 'published', uses: 24, locales: 'en ✓ · sw ✓', updated: 'Sep 2026', editableFields: 'daily requirements, duration, group' },
  { id: 'tpl-strength-streak', name: 'Push-Up & Plank Consistency', type: 'streak', status: 'draft', uses: 0, locales: 'en draft', updated: 'Sep 2026', editableFields: 'all (draft)' },
  { id: 'tpl-retired-sample', name: 'Evening Steps Relay (retired sample)', type: 'collective', status: 'retired', uses: 3, locales: 'en ✓', updated: 'May 2026', editableFields: 'none — retired, duplicate to reuse' },
];

export const APPROVALS_QUEUE: ApprovalItem[] = [
  { id: 'ap-1', kind: 'group_join', title: '5 join requests — Kilimani Endurance Club', detail: 'Restricted group (stewards_only rule). Oldest request 4 days ago.', severity: 'medium', age: '4d', status: 'pending', mockLabel: 'Mock approval' },
  { id: 'ap-2', kind: 'content_publish', title: 'Plank needs review', detail: 'Missing Swahili translation; safety guidance updated in draft.', severity: 'medium', age: '2d', status: 'pending', mockLabel: 'Mock approval' },
  { id: 'ap-3', kind: 'template_publish', title: 'Push-Up & Plank Consistency (draft → publish)', detail: 'Draft template awaiting content sign-off.', severity: 'low', age: '1d', status: 'pending', mockLabel: 'Mock approval' },
  { id: 'ap-4', kind: 'moderation', title: 'Reported challenge: Midnight Ultra', detail: '2 member reports: unrealistic target pairing (mock).', severity: 'high', age: '6h', status: 'pending', mockLabel: 'Mock review' },
  { id: 'ap-5', kind: 'account_review', title: 'Suspended account appeal: Brian O.', detail: 'Appeal message attached (mock). Review accuracy logs.', severity: 'high', age: '3h', status: 'pending', mockLabel: 'Mock review' },
  { id: 'ap-6', kind: 'localisation_gap', title: 'Swahili gaps: 3 activities', detail: 'Side Plank, Plank, Meditation missing sw copy.', severity: 'low', age: '5d', status: 'pending', mockLabel: 'Mock attention' },
  { id: 'ap-7', kind: 'donation_review', title: 'Unmatched cause record (mock)', detail: 'KES 1,000 self-reported external cause pledge without matched movement log. Tiizi holds no funds.', severity: 'medium', age: '1d', status: 'pending', mockLabel: 'Mock attention' },
];

export const DONATION_RECORDS: DonationRecord[] = [
  { id: 'don-1', kind: 'tiizi_support', contributor: 'Amina O.', amount: 'KES 500', date: 'Sep 2, 2026', status: 'recorded', channel: 'M-Pesa (mock)', reconciliation: 'n/a', note: 'Prototype record only. Tiizi support is not custodial charity processing.' },
  { id: 'don-2', kind: 'tiizi_support', contributor: 'Anonymous (mock)', amount: 'KES 1,000', date: 'Aug 28, 2026', status: 'recorded', channel: 'Card (mock)', reconciliation: 'n/a', note: 'Prototype record only.' },
  { id: 'don-3', kind: 'cause_support', contributor: 'Nairobi Morning Movers', amount: '438 km dedicated', date: 'Sep 15, 2026', status: 'recorded', channel: 'Movement pledge', reconciliation: 'matched', note: 'Dedication to City Parks awareness. No funds held by Tiizi.' },
  { id: 'don-4', kind: 'cause_support', contributor: 'Eric M. (mock)', amount: 'KES 1,000 self-reported pledge', date: 'Sep 13, 2026', status: 'attention', channel: 'External pledge (self-reported)', reconciliation: 'unmatched', note: 'Self/community-reported only; fulfilled outside Tiizi. Tiizi holds no funds and verifies no totals.' },
];

export const LOCALE_COVERAGE: LocaleCoverage[] = [
  { locale: 'en', label: 'English', activities: '8/10', templates: '3/4', systemCopy: '98%', fallback: '— (source)', state: 'ready' },
  { locale: 'sw', label: 'Kiswahili', activities: '4/10', templates: '3/4', systemCopy: '72%', fallback: 'en', state: 'partial' },
  { locale: 'fr', label: 'French (placeholder)', activities: '0/10', templates: '0/4', systemCopy: '0%', fallback: 'en', state: 'missing' },
];

export const ACCESS_ROLES: AccessRoleRow[] = [
  { role: 'Tiizi Admin', scope: 'Platform-wide', holders: 2, status: 'active', summary: 'Full operator console incl. roles + settings', lastChange: 'Aug 2026' },
  { role: 'Tiizi Operator', scope: 'Platform-wide (no role edits)', holders: 4, status: 'active', summary: 'Review queues, content ops, support actions', lastChange: 'Sep 2026' },
  { role: 'Content Manager', scope: 'Activities · Templates · Localisation', holders: 3, status: 'active', summary: 'Draft/publish/retire content (mock approvals)', lastChange: 'Sep 2026' },
  { role: 'Support Operator', scope: 'Users · Groups · Donations review', holders: 2, status: 'active', summary: 'Inspect + mock suspend/reactivate with audit trail', lastChange: 'Aug 2026' },
  { role: 'Group Steward', scope: 'Own group(s)', holders: 12, status: 'active', summary: 'Roster, rules, creation permissions, challenges', lastChange: '—' },
  { role: 'Member', scope: 'Own participation', holders: 141, status: 'active', summary: 'Join, log, kudos; no operator controls', lastChange: '—' },
];

export const PLATFORM_HEALTH: HealthService[] = [
  { name: 'API', state: 'healthy', detail: 'p99 mock latency 240ms (simulated)', updated: '2 min ago' },
  { name: 'Authentication', state: 'healthy', detail: 'Mock session success 99.9% (simulated)', updated: '2 min ago' },
  { name: 'Database', state: 'healthy', detail: 'Replica lag nominal (simulated)', updated: '5 min ago' },
  { name: 'Notification delivery', state: 'degraded', detail: 'Mock: SMS fallback queue depth 14 (simulated)', updated: '18 min ago' },
  { name: 'Scheduled finalization', state: 'healthy', detail: 'Last mock run completed on time', updated: '1h ago' },
  { name: 'Content publication', state: 'degraded', detail: 'Mock: 2 publishes awaiting review', updated: '2h ago' },
  { name: 'Background jobs', state: 'healthy', detail: 'Queue nominal (simulated)', updated: '10 min ago' },
  { name: 'Storage / media', state: 'healthy', detail: 'Quota 41% (simulated)', updated: '1h ago' },
  { name: 'Integrations (M-Pesa mock)', state: 'maintenance', detail: 'Mock maintenance window 02:00–03:00 EAT (simulated)', updated: 'Scheduled' },
];

export const HEALTH_EVENTS = [
  { id: 'ev-1', time: '18 min ago', text: 'Notification delivery DEGRADED (simulated): SMS fallback queue depth 14.' },
  { id: 'ev-2', time: '2h ago', text: 'Content publication DEGRADED (simulated): 2 publishes awaiting review.' },
  { id: 'ev-3', time: 'Yesterday', text: 'Scheduled finalization completed (simulated): Karura 250k locked.' },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id: 'au-1', action: 'User suspended (mock)', actor: 'Support Operator (mock)', where: 'Users › Brian O.', when: 'Sep 10, 2026', summary: 'active → suspended · reason: inaccurate logs (mock)' },
  { id: 'au-2', action: 'Template published (mock)', actor: 'Content Manager (mock)', where: 'Templates › 30-Day Morning Movement', when: 'Sep 8, 2026', summary: 'draft → published · v3' },
  { id: 'au-3', action: 'Activity retired (mock)', actor: 'Content Manager (mock)', where: 'Activities › Single-Leg Balance', when: 'Apr 2026', summary: 'published → retired · v1-retired' },
  { id: 'au-4', action: 'Group restriction changed (mock)', actor: 'Tiizi Operator (mock)', where: 'Groups › Kilimani Endurance Club', when: 'Aug 2026', summary: 'creation: open → stewards_only' },
  { id: 'au-5', action: 'Challenge finalized (mock)', actor: 'System schedule (mock)', where: 'Challenges › Karura Forest 250k Sprint', when: 'Aug 15, 2026', summary: 'active → completed · 278/250 km locked' },
  { id: 'au-6', action: 'Role changed (mock)', actor: 'Tiizi Admin (mock)', where: 'Access › Wanjiku K.', when: 'Jul 2026', summary: 'Member → Group Steward · scope: Nairobi Morning Movers' },
];

export const OPERATOR_ALERTS = [
  { id: 'al-1', severity: 'high' as const, title: 'Suspended account appeal pending', detail: 'Brian O. appealed 3h ago (mock).', owner: 'Support', age: '3h', category: 'Account' },
  { id: 'al-2', severity: 'high' as const, title: 'Flagged challenge under review', detail: 'Midnight Ultra — 2 reports (mock).', owner: 'Moderation', age: '6h', category: 'Safety' },
  { id: 'al-3', severity: 'medium' as const, title: 'Notification delivery degraded (simulated)', detail: 'SMS fallback queue depth 14.', owner: 'Platform', age: '18m', category: 'Health' },
  { id: 'al-4', severity: 'medium' as const, title: 'Unmatched cause record (mock)', detail: 'KES 1,000 pledge without movement log.', owner: 'Support', age: '1d', category: 'Donations' },
  { id: 'al-5', severity: 'low' as const, title: 'Swahili gaps: 3 activities', detail: 'Side Plank, Plank, Meditation.', owner: 'Content', age: '5d', category: 'Localisation' },
];

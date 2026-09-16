import { AssumptionItem } from '../types';

export const ASSUMPTIONS_REGISTER: AssumptionItem[] = [
  {
    id: 'asm-nav-model',
    title: 'Primary Navigation Architecture (Variant A vs Variant B)',
    category: 'EXPERIENCE HYPOTHESIS',
    statement:
      'Variant B (Today / Challenges / Groups with contextual Activity Guide) is the superior consumer model over Variant A (which elevated Activities to a primary navigation tab).',
    rationale:
      'Activities in Tiizi represent canonical reference knowledge, not an active human destination that users visit daily. Elevating it to primary navigation dilutes focus from core loops (Today actions, Challenges, and Community Groups). In Variant B, Activity knowledge is seamlessly surfaced contextually (during Challenge creation, logging, and challenge detail) and remains accessible in the Profile/More drawer.',
    prototypeBehavior:
      'Defaulted to Variant B (3 primary tabs + contextual Guide triggers). An interactive toggle in the Reference Mode drawer allows founders and engineers to compare Variant A and Variant B live.',
  },
  {
    id: 'asm-creator-participation',
    title: 'Creator Participation Must Not Be Assumed',
    category: 'PRODUCT TRUTH',
    statement:
      'Group Membership ≠ Challenge Participation. Organizing or creating a challenge in a group does not automatically enroll the creator as a participant.',
    rationale:
      'A group steward or community organizer may set up a challenge for their group (e.g. corporate coach, community leader) without personally competing or logging. Silently enrolling the creator violates affirmative consent and distorts baseline participation counts.',
    prototypeBehavior:
      'During challenge creation, the wizard explicitly asks "Join this challenge as an active participant too?" with clear [Yes, Join as Participant] or [Create Without Joining] actions. Zero automatic silent enrollment.',
  },
  {
    id: 'asm-competitive-ranking',
    title: 'Standard Competition Ranking (1, 2, 2, 4) & Closure',
    category: 'PRODUCT TRUTH',
    statement:
      'Competitive challenges follow standard competition ranking with shared ties. Non-completers receive no rank. A single finisher does not close the challenge.',
    rationale:
      'Unlike a simple race with a single winner where the event ends upon crossing the tape, Tiizi competitive challenges remain open for the full scheduled duration so all participants can achieve their personal qualifying milestone. Ties share finishing positions (e.g. two runners finishing at the same timestamp share 2nd, and the next finisher is 4th).',
    prototypeBehavior:
      'Removed all promotional "win podium ranks" or "winner takes all" copy. Displays governed "finishing position", "current standing", "tied positions", and keeps non-finishers categorized as active in-progress without arbitrary numerical ranks.',
  },
  {
    id: 'asm-streak-timezone',
    title: 'Governing Timezone for Daily Streak Boundaries',
    category: 'PRODUCT TRUTH',
    statement:
      'Daily streak resets occur strictly at the end of the day in the Challenge’s governing timezone, not the viewer’s local device time or an arbitrary hardcoded midnight.',
    rationale:
      'Because groups may have dispersed members or travel across time zones, the challenge’s designated home timezone (e.g. Africa/Nairobi EAT) anchors the authoritative start and end of each competition day.',
    prototypeBehavior:
      'Replaced "before 23:59 EAT" with timezone-anchored language: "Complete today’s requirements before the Challenge day ends in Africa/Nairobi (EAT)." Dynamic countdown clocks tie directly to this timezone boundary.',
  },
  {
    id: 'asm-streak-missed-recovery',
    title: 'Streak Missed-Day Non-Restoration & Compassionate Re-entry',
    category: 'PRODUCT TRUTH',
    statement:
      'A missed day permanently resets the Current Streak to 0. It cannot be retroactively repaired, repaired with grace days, or paid off. However, Days Completed and Best Streak are permanently preserved.',
    rationale:
      'Integrity of daily habit discipline requires uncompromising honesty about consecutive days. At the same time, wellness motivation requires non-punitive re-entry that honors all past effort.',
    prototypeBehavior:
      'Explicitly highlights: "Yesterday remains missed. Current Streak reset to 0. 14 Total Days Completed and 9-Day Best Record preserved. Today’s completion starts a new consecutive streak!" No grace restoration.',
  },
  {
    id: 'asm-activity-multiplicity',
    title: 'Activity Multiplicity in Challenge Definitions',
    category: 'PRODUCT TRUTH',
    statement:
      'Arbitrary combinations of multiple activities are not globally universal across all challenge types. Streak naturally supports multi-activity daily habits; Collective and Competitive combinations are strictly governed by domain rules.',
    rationale:
      'Summing different unit types (e.g. combining kilometers of running with minutes of meditation in a single collective race) requires governed metric equivalence engines or distinct sub-targets.',
    prototypeBehavior:
      'The wizard supports multiple daily habits for Streak challenges, while Collective and Competitive challenges default to a unified canonical activity and clearly tag multi-activity pairings as "Governed Configuration Dependent".',
  },
  {
    id: 'asm-cause-support',
    title: 'Community Cause & Pledged Support (No Custodial Fundraising)',
    category: 'NEEDS FOUNDER DECISION',
    statement:
      'Tiizi provides community movement dedication and pledged support indicators, but does NOT perform financial custody, verified donation processing, or escrow.',
    rationale:
      'Financial regulatory compliance for charitable fundraising varies by jurisdiction. Movement challenges can dedicate collective kilometers to awareness or external sponsor pledges without Tiizi handling monetary transactions.',
    prototypeBehavior:
      'Replaced all "Amount Raised" or "Verified Donations" text with "Community Cause Dedication" and "Pledged Movement Goal". Added a clear disclaimer that donations/sponsorships are externally fulfilled.',
  },
  {
    id: 'asm-group-stewardship',
    title: 'Group Stewardship & Challenge Creation Permissions',
    category: 'NEEDS FOUNDER DECISION',
    statement:
      'Challenge creation rights within a group should be configurable by group stewards (e.g. Open to all members vs. Stewards-only).',
    rationale:
      'In structured clubs (e.g. Rift Valley Trail Cadence), stewards curate official training regimens and do not want member spam. In casual circles (e.g. Nairobi Morning Movers), any member should feel empowered to start a quick challenge.',
    prototypeBehavior:
      'Supported permission checks: when viewing as a non-steward in a restricted group, the UI displays "Challenge creation restricted by Group rules (Contact Steward Wanjiku)" instead of an unrestricted creation button.',
  },
  {
    id: 'asm-recognition-vs-kudos',
    title: 'Distinction Between Platform Recognition & Peer Kudos',
    category: 'PRODUCT TRUTH',
    statement:
      'Platform Recognition represents system-verified credentials based on governed challenge outcomes. Kudos represent lightweight, unstructured peer encouragement.',
    rationale:
      'Mixing system-issued achievements (e.g. "Top 3 Podium Finisher", "30-Day Streak Completer") with social emoji reactions diminishes the authority and trust of platform milestones.',
    prototypeBehavior:
      'Kudos are presented as interactive micro-encouragements (+1 flame counter). System Recognitions are presented as gold/silver verified credential seals in the member Profile and Challenge Results recap.',
  },
  {
    id: 'asm-completed-challenge-immutability',
    title: 'Completed Challenge Immutability & "Run Again" Semantics',
    category: 'PRODUCT TRUTH',
    statement:
      'Completed/finalized challenges are immutable historical records. "Run Again" spawns a distinct new challenge cycle rather than reopening historical data.',
    rationale:
      'Reopening or mutating finished challenges compromises auditability and past leaderboard records.',
    prototypeBehavior:
      'Completed challenges display a stabilized final retrospective view with all logging controls completely disabled. "Run Again" launches a fresh clone (Cycle 2) with zeroed progress.',
  },
  {
    id: 'asm-profile-scope',
    title: 'Lightweight Social Profile vs Heavy Personal Analytics',
    category: 'EXPERIENCE HYPOTHESIS',
    statement:
      'Tiizi profiles should focus on community identity, group affiliations, challenge history, and verified recognitions, avoiding private sensor data, calorie summaries, or heavy biometric dashboards.',
    rationale:
      'Tiizi is a group fitness and wellness platform rooted in community accountability, not a generic isolated personal tracker. Deep biometric logs distract from collective participation.',
    prototypeBehavior:
      'Profile displays member bio, group memberships, active/completed challenge rosters, and system recognitions without calorie counters or biometric analytics.',
  },
  {
    id: 'asm-out-of-scope-auth',
    title: 'Authentication, Payment Gateways & External Wearable Sync',
    category: 'OUT OF SCOPE',
    statement:
      'Live backend authentication, merchant payment processing, and direct hardware BLE/GPS sync are intentionally excluded from the Experience Reference.',
    rationale:
      'The Experience Reference governs human-facing assembly, navigation, and interaction architecture. Infrastructure layers belong to backend engineering implementation.',
    prototypeBehavior:
      'Simulated via instant persona switching (Amina, Wanjiku, David, Kipchoge) and manual activity submission flows.',
  },
];

import { Challenge } from '../types';

/**
 * CORR-001: Run Again participation semantics.
 *
 * Product truth:
 * - Completed/finalized Challenge remains immutable.
 * - Run Again creates a NEW Challenge (configuration/content preserved).
 * - Group Membership ≠ Challenge Participation; participation is affirmative.
 * - Previous participants do NOT automatically become participants.
 *
 * Therefore the new cycle always starts with zero participants. Prior
 * members rejoin / are reinvited explicitly through the normal join path.
 */
export function buildRunAgainChallenge(
  oldChallenge: Challenge,
  newId: string = `ch-${Date.now()}`
): Challenge {
  return {
    ...oldChallenge,
    id: newId,
    title: `${oldChallenge.title.replace(/\s*\(Cycle \d+\)\s*$/, '')} (Cycle 2)`,
    status: 'active',
    startDate: 'Sep 15, 2026',
    endDate: 'Sep 29, 2026',
    isFlagged: false,
    flaggedReason: undefined,
    finalized: false,
    inviteState: 'none',
    // Never carry participants forward. New cycle starts empty.
    participants: [],
    collectiveProgress:
      oldChallenge.type === 'collective'
        ? {
            totalAccumulated: 0,
            target: oldChallenge.targetValue,
            percent: 0,
            completedEarly: false,
          }
        : undefined,
    streakMeta:
      oldChallenge.type === 'streak'
        ? {
            totalDays: oldChallenge.durationDays,
            currentDayNumber: 1,
          }
        : oldChallenge.streakMeta
          ? { ...oldChallenge.streakMeta, currentDayNumber: 1 }
          : undefined,
  };
}

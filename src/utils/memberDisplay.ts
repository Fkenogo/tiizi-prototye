import { ChallengeType } from '../types';

/**
 * Member-facing display helpers.
 *
 * Product rules (experience reference):
 * - The governing Challenge timezone stays part of Challenge truth and
 *   calculation (full IANA IDs remain in mock data).
 * - Ordinary Member UI must NOT repeat implementation identifiers such as
 *   "Africa/Nairobi (EAT)" next to everyday times.
 * - When timezone helps prevent confusion (creation/settings, Time settings,
 *   cross-region views), prefer friendly language: "Nairobi time".
 * - Challenge types read Together / Race / Streak for members; the internal
 *   collective | competitive | streak values are unchanged.
 */

/** "Africa/Nairobi (EAT)" -> "Nairobi time"; generic IANA fallback included. */
export function friendlyTimezone(timezone: string): string {
  const m = timezone.match(/\/([^()\s]+)/);
  if (m) return `${m[1].replace(/_/g, ' ')} time`;
  const city = timezone.split(' ')[0].split('/').pop();
  if (city) return `${city.replace(/_/g, ' ')} time`;
  return 'local challenge time';
}

/** Member-facing challenge family label. Internal `ChallengeType` unchanged. */
export function challengeTypeLabel(type: ChallengeType): 'Together' | 'Race' | 'Streak' {
  if (type === 'collective') return 'Together';
  if (type === 'competitive') return 'Race';
  return 'Streak';
}

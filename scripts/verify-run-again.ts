import { buildRunAgainChallenge } from '../src/utils/runAgain';
import { INITIAL_CHALLENGES } from '../src/data/mockData';

// Focused CORR-001 assertion: Run Again new cycle has zero participants.
const source = INITIAL_CHALLENGES.find((c) => c.id === 'ch-karura-250k')!;
if (source.participants.length === 0) throw new Error('fixture must have participants to prove non-carryover');
const next = buildRunAgainChallenge(source, 'ch-verify-run-again');

const checks: Array<[string, boolean]> = [
  ['new cycle has zero participants', next.participants.length === 0],
  ['new cycle has a new id', next.id !== source.id],
  ['source challenge untouched (immutable)', source.participants.length > 0 && source.status === 'completed'],
  ['configuration preserved (activities/target/type/group)', JSON.stringify(next.activities) === JSON.stringify(source.activities) && next.targetValue === source.targetValue && next.type === source.type && next.groupId === source.groupId],
  ['collective progress reset to zero', next.collectiveProgress ? next.collectiveProgress.totalAccumulated === 0 && next.collectiveProgress.percent === 0 : true],
  ['terminal flags cleared (not finalized/flagged)', next.finalized === false && next.isFlagged === false],
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
console.log(`OK: Run Again spawns ${next.id} with 0 participants from ${source.participants.length} prior (no carryover).`);

import { AuditEntry } from '../types';

/**
 * Prototype-only operator audit feed.
 *
 * Mock actions across the Operator console append entries here via
 * logOperatorAction(). The Audit Log section reads the static AUDIT_LOG plus
 * this session feed (newest first), so every mock action visibly creates an
 * audit trace without any backend. No persistence — in-memory only.
 */
const feed: AuditEntry[] = [];
let seq = 0;

export function logOperatorAction(
  action: string,
  where: string,
  summary: string,
  actor = 'Tiizi Operator (mock)'
): AuditEntry {
  const entry: AuditEntry = {
    id: `au-session-${Date.now()}-${seq++}`,
    action: `${action} (mock)`,
    actor,
    where,
    when: 'Just now (mock)',
    summary,
  };
  feed.unshift(entry);
  return entry;
}

export function getOperatorFeed(): AuditEntry[] {
  return feed;
}

export function getOperatorFeedFor(wherePart: string): AuditEntry[] {
  return feed.filter((e) => e.where.includes(wherePart));
}

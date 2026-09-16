# Tiizi Experience Reference

Adoption status: **CANDIDATE / NOT YET ADOPTED** — not final, not authoritative.
This is an experience reference, not a backend authority. Product Truth governs engines; this repo governs human-facing assembly.

## 1. Purpose

Design the strongest coherent Tiizi experience across two surfaces (Member + Operator) so founders can approve, amend docs, and implement substantially as designed. Existing docs must not silently constrain the experience; where docs would block the approved experience without a material security/integrity/privacy/scope reason, amend the docs instead.

Working source of truth for this pass: `tiizi-prototye` repo (independent). No main Tiizi implementation repo accessed. No production backend work. No deployment. No merge.

## 2. Member experience architecture

- **Today** = action home. Priority: (1) immediate required activity (streak requirements with timezone countdown), (2) active challenge progress needing attention, (3) invitations/join opportunities, (4) upcoming events, (5) community moments. No generic dashboards, no unrelated personal fitness goals.
- **Challenges** = discover → invite/request/join → joined → upcoming → active → completed → closed. Membership ≠ participation: logging UI appears only after joining; upcoming/closed/completed disable logging; full/closed show capacity; flagged shows mock-review notice.
- **Groups** = discover → create → join/request → invite → roster + steward(s) + active/upcoming/completed + rules + creation permissions. Creation default (product truth): any ordinary Group Member may create a Challenge; a valid Group rule may restrict creation (e.g. steward-only). Health states: healthy / restricted (rule-restricted creation + pending requests) / flagged (mock review). Empty + restricted states included.
- **Activity Guide** = contextual/secondary (Variant B default). Surfaced in creation, logging, challenge detail; full catalogue remains a secondary destination. Variant A toggle retained in Reference Mode for comparison.
- **Challenge Creation** = 6-step guided wizard, human language first: archetype+template → host group+story → activities → metrics/targets → schedule/timezone → review + explicit creator-participation decision (never auto-enrol). From scratch or from template; group + activity selection; valid measurement; target; scheduling; timezone; review.
- **Templates** = pre-filled configurations, not an authority. Browse → preview → use → edit allowed fields → create through same Wizard.
- **Recognition vs Kudos**: Kudos = lightweight peer/community acknowledgement (feed counters), never Platform Recognition and never governed-outcome authority. Recognition = policy-qualified record from Derived Truth: Challenge Engine → Derived Truth → Platform Policy decides qualification → Tiizi issues/records Recognition (a platform acknowledgement / achievement record / distinction). Not automatic for every governed outcome; never a verified credential in this reference. Visual distinction between Kudo and Recognition is preserved (feed vs Profile + results recap).
- **Donations/Support (mock)**: A. Support Tiizi vs B. Community Cause support — separated. No custody, verified totals, or escrow implied. History labelled prototype data.
- **Profile/Account/Settings**: identity, groups, active/completed challenges, recognition, notification prefs (9 purposeful categories), language (en + partial sw with fallback), privacy controls, account (mock export/deactivate), support/help. No biometric dashboards.
- **Notifications**: group_invite, challenge_invite, challenge_start, challenge_end, streak_reminder, collective_milestone, kudo, recognition, moderation/system. Purposeful only; empty state included.
- **Onboarding**: answers what Tiizi is, why groups, what challenges/participation are, how to join/create/discover, what next. States: brand new, no group, in-group-no-challenge, invited group, invited challenge, active commitments. No forced setup.
- **Responsive**: member mobile-first (bottom nav: Today/Challenges/Groups), tablet + desktop shells.

## 3. Operator experience architecture (dedicated console, dense — not a consumer feed)

Primary nav: Overview · Users · Groups · Activities & Knowledge · Challenges · Templates · Review & Attention · Donations/Support · Content & Localisation · Access & Roles · Platform Health · Audit Log · Settings (+ experimental subscription placeholder).

- **Overview**: active users/suspended/active groups/active challenges/pending approvals/flagged items/content readiness/failed alerts/recent actions. No vanity metrics.
- **Users**: search/filter active/suspended/invited/inactive; profile, memberships, participation, role/access, recognition, support history, state; mock suspend/reactivate. Impersonation not offered. Support view answers what happened / groups / challenges / errors / access / available actions, privacy-conscious.
- **Groups**: list/search, state, stewards, members, active/completed, rules, reports/flags, mock suspend/reactivate, creation permissions, history. No silent truth edits.
- **Activities & Knowledge**: code, display name, domain, category, description, metrics/units, components, readiness, lifecycle, publication status, eligibility, localisation, version/history. Filters: draft/published/retired/eligible/needs review/missing content/missing translation. No raw backend IDs (short codes). Metric/unit compatibility matrix included; no arbitrary combos.
- **Challenges**: search, status (upcoming/active/completed/closed), group, type, participant count, window, flagged/reported, finalized, result summary. Read-only inspect without participating. Terminal states explicit. Completed/finalized challenges are immutable; Run Again creates a NEW challenge with the same configuration/content and zero participants — prior members are never carried over and rejoin/reinvite affirmatively.
- **Templates**: draft/published/retired, preview/duplicate/edit/publish/retire (mock), built via same creation model; operator-only metadata exposed.
- **Review & Attention (operator queue)**: single queue holding approvals, reviews, moderation, support interventions, exceptions, reconciliation and attention items — not blanket approval authority. Page visibly separates formal approvals, moderation/account reviews, and operational attention/reconciliation. Mock-labelled, severity/owner/status/age/category. Moderation: reported group/challenge/content/user with review/dismiss/restrict/escalate as mock actions (intent + confirmation + audit consequence + permission-dependent, no new authority). Some operator controls are support/operational/content/review actions and some are future-authority hypotheses — no silent superuser mutation.
- **Donations**: A vs B ledgers with record/contributor/date/status/channel/reconciliation/notes/attention. No custodial implication.
- **Content & Localisation**: en (ready) / sw (partial) / fr placeholder (missing); activities/templates/system copy coverage + fallback.
- **Access & Roles**: Tiizi Operator/Admin, Content Manager, Support Operator, Group Steward, Member — experience model only, no production RBAC. Role/scope/status/summary/recent changes.
- **Platform Health**: API/auth/database/notifications/finalization/content/jobs/storage/integrations with healthy/degraded/incident/maintenance + recent events. Labelled UX simulation, not telemetry.
- **Audit Log**: what/who/when/where/prev-new summary, immutable-looking (mock).
- **Settings + Commercial placeholder**: operator prefs (mock) + clearly labelled EXPERIMENTAL subscription area (plan/status/billing/entitlement/trial/grace) — NEEDS FOUNDER DECISION, isolated from core UX.
- **Responsive**: operator desktop-first, usable at medium widths; member/operator feel like one system with different roles.

## 4. Navigation model

- Member primary: Today · Challenges · Groups (+ contextual Activity Guide). Profile/notifications secondary. No crowding.
- Member secondary (via Profile drawer, footer, journeys): Onboarding · Templates · Support · Full Profile · Activity Guide.
- Operator: sidebar console (13 sections above), desktop-first.
- Reference Mode switches Member ↔ Operator + persona/state toggles, journeys, nav variants, challenge states, health/incident + alert simulations. Reference tools never contaminate product UI.

## 5. Assumptions boundary

See in-app Assumptions Register (16 items: 8 PRODUCT TRUTH / 3 EXPERIENCE HYPOTHESIS / 4 NEEDS FOUNDER DECISION / 1 OUT OF SCOPE) + `src/data/assumptionsData.ts`. Allowed categories only: PRODUCT TRUTH / EXPERIENCE HYPOTHESIS / NEEDS FOUNDER DECISION / OUT OF SCOPE. Product truths include: creator participation, competitive ranking, streak timezone, streak missed-day reset, activity multiplicity, policy-qualified recognition, completed-challenge immutability with zero-participant Run Again, and group creation open-by-default (restrictable by valid rule). Founder decisions outstanding: cause-custody scope, commercial model, operator authority scope, localisation priority.

## 6. Prototype data & states

Members: active/suspended/invited/inactive. Groups: healthy/restricted/flagged. Challenges: upcoming/active/completed/closed/flagged. Activities: draft/published/retired/missing-localisation/eligible/ineligible. Templates: draft/published/retired. Attention: low/medium/high. Health: healthy/degraded (+ simulated incident/maintenance). All obviously non-production mock.

## 7. Quality & routes

- `npm run build` (vite) + `npm run lint` (tsc --noEmit) should pass; regressions fixed (e.g. missing Lock import).
- Preview routes (member tabs): Today, Challenges (+ detail incl. upcoming/closed/flagged), Groups (+ restricted/flagged detail), Activity Guide, Onboarding, Templates, Support, Profile & settings. Operator: /console sections via surface switch (no router — state-driven prototype).

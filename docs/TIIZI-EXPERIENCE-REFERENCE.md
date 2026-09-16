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

- **Overview**: control centre answering "can I run Tiizi from here?" — needs attention, pending review, group requests, suspended/flagged entities, content not ready, template drafts, donation issues, health, recent admin changes; every card links to its management area. No vanity metrics.
- **Users**: full management — Overview, Groups, Challenges, Roles & Access, Recognition, Support/Issues, Activity/Audit tabs. Mock suspend/reactivate, grant/revoke role, change platform role (Tiizi Admin / Tiizi Operator / Content Manager / Support Operator), remove elevated access, review account state. Group Steward stays a group-level role, distinct from platform roles. Impersonation not offered. Every action needs confirmation and writes to the Audit Log.
- **Groups**: full management — Overview (metadata edit), Members (roster snapshot), Stewards (add/remove + history, distinct from Admin/Operator), Council (optional: disabled/enabled, advisory/challenge-committee/moderation, purpose, named members, steward rep — no voting authority), Charter (suggested clauses multi-select + custom + publish/version/state), Challenges (read-only link + creation-rule control: open default vs steward-only rule), Rules, Join requests (approve/reject), Reports/Flags (dismiss/restrict), History. No silent truth edits.
- **Group Charter**: member-visible agreement (purpose, conduct, creation rules, stewardship, participation, community standards); versioned draft/active; no backend enforcement invented.
- **Group Council**: optional governance structure, disabled by default; labelled prototype configuration only.
- **Activities & Knowledge**: full lifecycle management — Create, Edit, Save Draft, Publish, Unpublish (future use returns to draft; history kept), Retire, Restore to draft, Duplicate, version history. Editable: code, display name, domain (Fitness/Wellness), category, description, metrics/units, components (labels + both/either requirement; values never silently summed), readiness, eligibility, localisation, version notes. Lifecycle is Draft → Published → Retired; nothing destructive.
- **Metric/unit compatibility**: editable per activity — enable metric, define units, mark eligible, disable invalid; incomplete combinations stay blocked. Weight rows record a load reporting basis (TOTAL_LOADED_IMPLEMENT / PER_IMPLEMENT / SINGLE_IMPLEMENT / PER_SIDE / MACHINE_DISPLAYED_LOAD); no conversions between unlike metrics.
- **Templates**: full content-management — Create (launches the same Challenge Creation Wizard in Template Authoring mode; host-neutral; ends as Draft Template), Edit draft, Preview, Duplicate, Save Draft, Publish (appears in member browse), Unpublish/withdraw, Retire, Restore, visibility control (members/hidden), history. Drafts/retired stay hidden from members.
- **Challenges**: select any row for full detail — group, creator, participants, type, setup, window, state, result, flags, finalized status, related audit events. Mock restrict/hide pending review, reopen, escalate. Active challenge truth is never rewritten.
- **Review & Attention (operator queue)**: every row opens a detail — subject, reason, requester, date, affected entity, context, prior actions, attention level, recommended next step — then only the actions that fit that item (approve/reject/request-changes/dismiss/escalate/assign/resolve). Still separated: formal approvals, moderation/account reviews, operational attention. Mock-labelled, confirmation + audit consequence + permission-dependent, no new authority.
- **Donations**: three distinct ledgers — A. general Support Tiizi, B. challenge-linked Support Tiizi (voluntary, never scored), C. Community Cause support (movement dedications + self-reported external pledges). Every record opens detail: contributor, amount, date, channel, status, reconciliation, linked challenge/cause, notes, issue history, audit trail; mock resolve/assign/escalate. No custodial implication.
- **Challenge-linked voluntary Support Tiizi**: a challenge may optionally enable "Support Tiizi while taking part" — Off/On, suggested amounts ($1/$2/$5…), custom allowed, offered on Join / during / both. Never mandatory ($0 always fine), never part of requirements, never affects eligibility/progress/recognition/results, never mixed with Cause. Member wording: "Support Tiizi — Optional, your challenge is not affected."
- **Community Cause**: kept separate — a challenge may be dedicated to a cause; support is recorded as movement dedication or self-reported external pledge. No verified Amount Raised, no custody, no escrow.
- **Content & Localisation**: inspect any item — English source, translations, missing items, readiness, fallback, updated, editor. Mock add/edit translation, mark ready, return for revision.
- **Access & Roles**: interactive catalogue — holders per role, grant/revoke, change scope, role history. Experience-only; not all operators have universal access.
- **Platform Health**: API/auth/database/notifications/finalization/content/jobs/storage/integrations with healthy/degraded/incident/maintenance + recent events. Labelled UX simulation, not telemetry.
- **Audit Log**: session mock actions (newest first) plus reference history — what/who/when/where/prev-new summary (mock, in-memory).
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

## 8. Member language & time display

- Member-facing UI is plain-language first: Together / Race / Streak; "Today's activities"; "Your streak restarted"; Recognition / Achievement wording. Internal governance/architecture vocabulary (governed, canonical, derived truth, policy-qualified, engine, lifecycle, configuration, immutable, reconciliation) stays behind the experience — in Reference Mode, the Assumptions Register, reference docs, and Operator technical views.
- The governing Challenge timezone remains part of Challenge truth and calculation, but ordinary Member UI does not routinely expose it: times read "9:00 AM", "Today", "Ends today", "8h 24m remaining". Timezone is surfaced only where it prevents confusion (creation/settings, challenge "Time settings", cross-region views), in friendly form ("Nairobi time"). Full technical IDs (e.g. `Africa/Nairobi (EAT)`) are internal/reference data kept in mock data.

## 9. Operator management model

- The console is a management experience, not a read-only catalogue: every domain answers what exists, what state it is in, what needs attention, what can be inspected, what can be changed (mock), and what changed (Audit Log).
- All actions are prototype/mock: each states intent, needs confirmation, writes to the Audit Log (in-memory session feed + reference history), and depends on role permission. No production backend behavior, no real RBAC, no silent superuser edits, no destructive deletes of published history.
- Member experience is untouched except four deliberate additions: optional challenge-linked Support Tiizi offer, Group Charter visibility, Council/Steward visibility, and published-template browse (drafts/retired hidden).

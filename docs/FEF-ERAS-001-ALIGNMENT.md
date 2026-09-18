# Tiizi — FEF-ERAS-001 Alignment

**Status:** Aligned  
**Date:** 18 September 2026  
**Framework reference:** FEF-ERAS-001 — Experience Reference & Assembly Standard

## Purpose

This repository is the Tiizi Experience Reference. It governs human-facing assembly for Member and Operator/Admin surfaces. The main Tiizi project repository remains authoritative for Product Truth, challenge/group semantics, recognition logic, permissions, governance and implementation.

## Product Truth Authority

The main Tiizi repository remains authoritative for:

- Group and Challenge domain semantics;
- participation and membership rules;
- activity and measurement truth;
- derived truth and Recognition qualification;
- role and permission authority;
- lifecycle and audit semantics;
- governance, architecture and implementation decisions.

The Experience Reference may expose better human-facing patterns, but it does not independently create backend or policy authority.

## Experience Reference Authority

This repository may govern the intended experience for:

- Member Today, Challenges, Groups and supporting flows;
- Challenge creation and template use;
- onboarding, profile, notifications and support presentation;
- Member mobile-first navigation;
- Operator/Admin console structure;
- review/attention queues;
- content/localisation and platform-management surfaces;
- interaction hierarchy, copy and cross-surface relationships.

The production implementation should bind governed Tiizi truth into these surfaces rather than reproducing internal engine structure directly in the UI.

## Assumptions Discipline

`docs/TIIZI-EXPERIENCE-REFERENCE.md` already separates Product Truth from human-facing assembly and identifies prototype-only or mock-labelled concepts. Under FEF-ERAS-001, material concepts should be treated as ADOPT / ADAPT / REFERENCE / REJECT / UNRESOLVED where needed.

Examples include:

- templates are experience conveniences and not a second authority layer;
- Kudos and governed Recognition remain distinct;
- Operator mock actions do not create permissions;
- Group Council and some support/commercial concepts remain prototype configuration unless separately authorised;
- review-only role switching is not production authority;
- mock donation/support data must not imply custody, reconciliation or verified totals.

## Implementation Expectation

As Tiizi implementation proceeds:

1. preserve the engine-first sequence for authoritative challenge/group/participation/derived-truth behaviour;
2. use this Experience Reference as the assembly target for Member and Operator surfaces;
3. map visible actions to real commands, reads, permissions and lifecycle state;
4. keep assumptions visible until authorised or rejected;
5. assemble coherent vertical flows rather than disconnected pages;
6. use Founder product preview to verify both Product Truth correctness and experience fidelity.

## Non-Effects

This alignment does not authorise new Tiizi policy, governance, permissions, commercial behaviour, Product Truth or implementation packages. It records how the existing Experience Reference should be used under FEF-ERAS-001.

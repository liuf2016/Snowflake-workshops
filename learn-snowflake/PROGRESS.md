# Progress Tracker

The instructor updates this after every session. It's the single source of truth for where you are, when each session happened, what you've scored, and what's weak. All times are Pacific (PDT/PST), taken from the system clock.

## Status

| | |
|---|---|
| **Score** | **0 / 100** |
| **Level** | Trial user (0 – 10) |
| **Next session** | **Replanning talk (10 min), then D01-S3 (continued): lab.sql fixes + E6** |
| Earliest start for next session | any time; **T5: must start by 2026-09-30 22:33** |
| Course start | Sun 2026-09-27 (student's date; orientation sessions ran the evening of 09-26) |
| Trial signed up / expires | 2026-09-26 / 2026-10-25 (as recorded in work/day-01/account.md) |
| Hard deadline (Day 20 finished) | **Sat 2026-10-24** (trial expiry − 1 day) |
| Sessions done / remaining | 2 / 78 |
| **Required pace** | 78 sessions ÷ 27 days (09-28 → 10-24) = **2.9 sessions/day** 🟢 (edge of 🟡) |
| Last session ended | 2026-09-28 22:33 (D01-S3 cont., paused) |
| Stalled flags (T5, gap > 48 h) | 0 |

Pace colors: 🟢 ≤ 3 sessions/day needed · 🟡 3 – 4 · 🔴 > 4. See [SYLLABUS §3](SYLLABUS.md#pace).

## Score by course day

A course day = S1 → S4, whenever they happen. 5 points each: Labs 0–2 · Homework 0–2 · Recall 0–1 (taken at the next day's S1). See [SYLLABUS §7](SYLLABUS.md#7-grading--how-the-0--100-score-works).

| Day | Topic | Started | Finished | Labs | HW | Recall | Day pts | Total | Status |
|---|---|---|---|---|---|---|---|---|---|
| 01 | Orientation, trial and first login | 09-26 19:36 | | | | | | | 🟨 |
| 02 | Tooling: CLI, key-pair auth, Python | | | | | | | | ⬜ |
| 03 | Warehouses and caching | | | | | | | | ⬜ |
| 04 | Access control (RBAC) | | | | | | | | ⬜ |
| 05 | SQL dialect + ✅ Stage Test 1 | | | | | | | | ⬜ |
| 06 | Loading I: stages, COPY | | | | | | | | ⬜ |
| 07 | Loading II: JSON, VARIANT, FLATTEN | | | | | | | | ⬜ |
| 08 | Loading III: external stages, Snowpipe | | | | | | | | ⬜ |
| 09 | Analytical SQL I: windows, QUALIFY | | | | | | | | ⬜ |
| 10 | Analytical SQL II + ✅ Stage Test 2 | | | | | | | | ⬜ |
| 11 | Time Travel and cloning | | | | | | | | ⬜ |
| 12 | Modeling: views, MVs, dynamic tables | | | | | | | | ⬜ |
| 13 | Streams and tasks | | | | | | | | ⬜ |
| 14 | Performance and Query Profile | | | | | | | | ⬜ |
| 15 | Cost and governance + ✅ Stage Test 3 | | | | | | | | ⬜ |
| 16 | Snowpark Python | | | | | | | | ⬜ |
| 17 | dbt with Snowflake | | | | | | | | ⬜ |
| 18 | Streamlit, Cortex, sharing | | | | | | | | ⬜ |
| 19 | Capstone build | | | | | | | | ⬜ |
| 20 | Final Exam, presentation, mock interview | | | | | | | | ⬜ |

Status key: ⬜ not started · 🟨 in progress · ✅ complete · 🔁 remediation · ⚠️ stalled

## Session log

Every session, one row, in order. Session IDs: `D01-S1` … `D20-S4`. Remediation sessions are `D05-R1` and so on. Gap = time since the previous session ended (checked against T2: ≥ 10 min between sessions, and T3: ≥ 4 h before a new day's S1).

| # | Session | Type | Start | End | Min | Gap | Result / notes |
|---|---|---|---|---|---|---|---|
| 1 | D01-S1 | Concept | 2026-09-26 19:36 | 20:15 | 39 | — | Architecture concept; interview Q thin (v1 a list, v2 copied from the lesson) → model answer given, weak spot logged. Trial signed up (exp 10-25), account.md is missing the region. MFA not enrolled yet (Google signup, no prompt), to check in S2. |
| 2 | D01-S2 | Guided lab | 2026-09-26 20:36 | 22:24 | 108 | 21 min ✓ | ⚠️ **Incomplete, ran long** (student stopped, tired). Done: Workspaces found (UI renamed), login confirmed as Google OIDC (no password, so MFA goes through Google 2-Step), SNOWFLAKE_LEARNING_WH auto_suspend 60, LEARN_WH created, user defaults set. **Open:** `SHOW RESOURCE MONITORS` returned 0 rows (maybe run as SYSADMIN, maybe 2a never ran), so the account is not confirmed protected. Warehouse size/auto_suspend columns not yet shown. Tour, sample data check and check-in outstanding. To resume as D01-S2 (cont.). |
| 3 | D01-S2 (cont.) | Guided lab | 2026-09-27 12:00 | 12:27 | 27 | 13 h 36 min ✓ | ✅ S2 complete. LEARN_RM verified (60 cr, level ACCOUNT, freq NEVER). 3 warehouses all XS / 60 s / suspended. Sample data present. Found Cost Mgmt is role-gated in the UI. Query-history detour: a table function needs a warehouse; a stale result pane misled. Pattern noted: reports "verified" without values, needed prompting twice. |
| 4 | D01-S3 | Challenge lab | 2026-09-27 12:49 | 14:24 | 95 (clock) | 22 min ✓ | ⏸ **Paused, incomplete** (errand). Adjourned at 14:24, so the clock time includes idle time. lab.sql: E1 done; E2 has syntax gaps; E3 only (a); E4 mixed with E5, no explanation; E5–E6 not started. Resume as D01-S3 (cont.). |
| 5 | D01-S3 (cont.) | Challenge lab | 2026-09-28 22:24 | 22:33 | 9 | 32 h 0 min ✓ (T5 ok, just under 48 h) | ⏸ Paused at 22:33 (bedtime, 9 min). lab.sql extended offline (E2–E5 drafted, with Google). Review given: fix E2 (USE SCHEMA step), E3(a) answer, E3(d) exact types, E4 explanation wrong (quoted identifier, not a string), E5 recorded results inaccurate, E6 not done. **Student says 2 sessions/day max, so the schedule needs replanning (see notes).** |

## Stage tests (gate ≥ 70%)

| Test | Day | Taken (start → end) | Score | Passed? | Retake | Missed topics |
|---|---|---|---|---|---|---|
| Stage Test 1: Foundations | 05 · S3 | | | | | |
| Stage Test 2: Loading and SQL | 10 · S3 | | | | | |
| Stage Test 3: Platform mastery | 15 · S3 | | | | | |
| Final Exam | 20 · S1 | | | | | |

## Recall quizzes

| Taken at | Covers day | Score (/5) | Missed |
|---|---|---|---|
| | | | |

## Competency domains

Ratings: Not started → Learning → Solid → Interview-ready.

| # | Domain | Taught on | Rating | Evidence |
|---|---|---|---|---|
| 1 | Architecture and concepts | D1, D3, D11 | Not started | |
| 2 | Tooling and access (Snowsight, CLI, Python) | D1, D2 | Not started | |
| 3 | Warehouses, compute and caching | D3 | Not started | |
| 4 | Security and RBAC | D4, D15 | Not started | |
| 5 | Data loading (structured and semi-structured) | D6 – D8 | Not started | |
| 6 | Analytical SQL | D5, D9, D10 | Not started | |
| 7 | Snowflake-native features | D11 – D13 | Not started | |
| 8 | Performance tuning | D14 | Not started | |
| 9 | Cost and governance | D3, D15 | Not started | |
| 10 | Beyond SQL (Snowpark, dbt, Streamlit, Cortex, sharing) | D16 – D18 | Not started | |

## Weak spots / instructor notes

Things to revisit in recall quizzes (as the spaced question) and stage tests. Added as they show up, crossed out once fixed.

- **Business framing (D01-S1):** the architecture answer listed the layers (v2 was copied from the lesson table) but never said *why it matters*: isolation, elasticity, one copy, cost. Drill: every concept answer must include a "so what" for the business.
- **SQL fundamentals (self-reported, D01-S3):** SQL is the student's weakest area; `DB.SCHEMA.OBJECT` naming was new. Needs more guided SQL reps before the D5 stage test.
- **Capacity (D01-S3):** the student estimates at most 2 sessions/day. 2 × 27 days = 54 < 78 remaining, so the 80-session plan can't finish by trial expiry 10-24. Decision pending: cut scope, or pay on-demand after the trial.
- **Verification discipline (D01-S2):** says "successful"/"verified" without pasting values; once missed that `SHOW RESOURCE MONITORS` returned 0 rows. Always paste the evidence.

## Credit usage

Checked at `end day` from Admin → Cost Management or `ACCOUNT_USAGE.WAREHOUSE_METERING_HISTORY`. Budget: under 50% of trial credits by Day 20.

| Checked at | Credits used (cumulative) | Notes |
|---|---|---|
| | | |

---

## Class log

A short summary per course day. The detailed log for each day is at the bottom of `lessons/day-NN.md`.

_(No classes yet.)_

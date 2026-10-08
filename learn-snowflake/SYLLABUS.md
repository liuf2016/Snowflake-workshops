# Syllabus — Snowflake for Data Analysts

A 20-day, 80-session hands-on course, taken at your own hours. It takes a student with working SQL, Python and ETL knowledge to someone who can do the Snowflake work, and talk about it, like a data analyst with about two years in the field.

---

## 1. Course goal

By Day 20 you will be able to:

1. **Operate** a Snowflake account: warehouses, roles, databases, cost guardrails, and CLI and Python access.
2. **Load** data of any shape (CSV, JSON, Parquet, from internal and external stages), repeatably and idempotently.
3. **Analyze** with production-grade Snowflake SQL: window functions, `QUALIFY`, semi-structured data, pivots, date logic.
4. **Use the features that make Snowflake different**: Time Travel, zero-copy cloning, dynamic tables, streams and tasks, secure sharing.
5. **Diagnose and tune**: read a Query Profile, explain pruning and spilling, and size warehouses on evidence.
6. **Govern and control cost**: RBAC design, masking and row-access policies, and credit analysis from `ACCOUNT_USAGE`.
7. **Build beyond SQL**: Snowpark Python, dbt, Streamlit in Snowflake, Cortex AI functions.
8. **Show it**: a capstone project on real Bay Area MLS data, a 10-minute presentation, and a mock interview.

### An honest note on "two years of experience"

Four weeks can't replace two years of on-call incidents, stakeholder politics and messy legacy schemas. What this course *can* give you is:

- Hands-on familiarity with **every Snowflake topic a two-year analyst is expected to know**.
- **Stories**: concrete things you built, broke and fixed, which you can tell in STAR format.
- A **portfolio** (the `work/` folder and the capstone) to point interviewers to.

The 0→100 scale below measures interview-readiness against that bar.

---

## 2. Prerequisites and setup

| You have | You'll need by Day 1 |
|---|---|
| Basic SQL, Python and ETL concepts | A Mac with Homebrew and Python 3.10+ |
| This folder, with Claude Code as your instructor | An email address for the **Snowflake 30-day free trial** (signed up *in* Day 1, Session 1) |
| | About 80 sessions × 45 minutes, spread over at most 29 calendar days |

**Trial choices (made in class, Day 1):**
- **Edition:** Enterprise. You need it for multi-cluster warehouses, 90-day Time Travel, materialized views, and masking and row-access policies.
- **Cloud and region:** AWS, US West (Oregon). It's close to the Bay Area and has Cortex AI support.
- **Credits:** about $400 over 30 days. The course is designed to use **less than half** of that.

⚠️ **The trial clock is the one hard deadline.** The course started on Thu 2026-09-24. If you sign up that day, the trial ends around **Sat 2026-10-24**, so **Day 20 must be finished by Fri 2026-10-23.** Everything else about timing is flexible (see §3).

---

## 3. What a "day" is, and when you take sessions

### A course day = S1 + S2 + S3 + S4, whenever they happen

"Day 07" means the 7th block of four sessions, **not** a calendar date. A course day can start at 2 PM and finish at 3 AM. Two course days can fall on one calendar date, or one course day can stretch across two.

| Session | Type | What happens |
|---|---|---|
| **S1** | **Recall + Concept** | Recall quiz first (5 questions, about 10 minutes, from Day 2 on), then about 35 minutes of concept teaching with the lesson file. |
| **S2** | **Guided Lab** | Step-by-step hands-on work. I give the steps; **you type every command.** |
| **S3** | **Challenge Lab** | Problems with less guidance; you solve them and I review. On Days 5, 10 and 15 this is a **Stage Test** instead. |
| **S4** | **Homework** | Independent work in `work/day-NN/`, graded at the start of the next day's S1. |

Sessions always run in order (S1 → S4, Day 1 → Day 20). There's no skipping and no reordering.

### Flexible start times, with 5 timing rules

Take a session whenever you can focus: 2 AM on a sleepless night and again at 8 AM is fine. What's fixed is **how** sessions are spaced, because learning research is clear that spacing and sleep are what make things stick.

| # | Rule | Why |
|---|---|---|
| T1 | **A session is 45 focused minutes.** I record the start and end times (Pacific) from the system clock when you say `start class` / `next session` / `end session`. If you stop early or run over, it's logged, not punished. | Tracking, and honest data |
| T2 | **At least a 10-minute break between sessions.** Away from the screen. | Attention resets |
| T3 | **At least 4 hours between a day's S4 and the next day's S1.** Ideally with sleep in between. The recall quiz only means something if some forgetting has happened. | Spaced retrieval |
| T4 | **At most 8 sessions (2 course days) in any 24 hours.** | Cramming doesn't last |
| T5 | **No gap longer than 48 hours without a session.** After 48 hours, the day is flagged *stalled* in PROGRESS and the next S1 starts with an extra-long recall. | Momentum and discipline |

If you try to break T2–T4, I'll tell you and won't start the session. If you break T5, I'll log it.

### Pace

**80 sessions in about 29 calendar days is about 2.8 sessions a day on average.** Four sessions every calendar day finishes in 20 days, which leaves about 9 days of slack. `PROGRESS.md` shows your **required pace** (remaining sessions ÷ calendar days until 10-23) after every session:

- 🟢 **3 or fewer sessions/day needed**: on track
- 🟡 **3–4 sessions/day**: take a full 4-session day soon
- 🔴 **more than 4 sessions/day**: only reachable using T4's 2-days-in-24h allowance. We'll cut optional material and talk.

---

## 4. How to talk to your instructor

Open Claude Code in this folder and use these phrases:

| You say | I do |
|---|---|
| `start class` | Check the timing rules, read `PROGRESS.md`, stamp the start time, and begin the next session (recall quiz first if it's an S1). |
| `next session` | Stamp the end of the current session, log it, check the break rule, and start the next one. |
| `end session` | Stamp the end, log it, and stop. Use this when you're taking a break longer than a few minutes. |
| `hint` | Give one hint, escalating each time: concept → function name → partial skeleton. |
| `I'm stuck` | Walk through your error with you. I still won't write the answer for you. |
| `submit homework` | Read your `work/day-NN/` files and grade them against the rubric (§7). |
| `status` | Report your score, level, pace color, trial days left and weak spots. |
| `end day` | After S4: update `PROGRESS.md` and the lesson's class log, check nothing is left running in Snowflake, and tell you the earliest time the next S1 can start (T3). |

---

## 5. Rules (the "external force")

1. **You type everything.** I explain, demo in prose, review and hint. I don't write your lab or homework SQL. If you ask for a full solution before you've made a real attempt, you'll get hints instead. After you submit, I'll show a model answer.
2. **Hints cost nothing; solutions cost points.** Past the third hint on a problem, that problem is marked *assisted* and the lab score for the day is capped at 1/2.
3. **Homework is due at the start of the next S1.** Late homework scores at most 1/2.
4. **Stage tests are gates.** You need **≥ 70%** to move on (§6).
5. **Guardrails before experiments.** Warehouses auto-suspend at 60 seconds, the resource monitor stays on, and every task you create is suspended before `end day`. I'll check.
6. **Write it down.** Every day, add at least 3 bullets to `NOTES.md`, written as *interview answers in your own words*, not copied from the docs.
7. **Protect the data.** The MLS export is licensed. It lives in `data/`, which is gitignored, and in your private trial account. Never commit it, share it or publish it.
8. **Honesty over score.** If you didn't do it, say so. I log it and we adjust. A padded score is useless in an interview.
9. **Don't open sealed quizzes.** Files in `quizzes/` are hidden in the viewer until you've taken them. Don't open them in an editor either. Peeking wastes the most useful study tool you have.
10. **Follow the timing rules** (§3, T1–T5).

---

## 6. Quizzes and stage tests

| Assessment | When | Format | Counts for |
|---|---|---|---|
| **Recall quiz** | The first ~10 minutes of every S1 from Day 2 on | 5 questions, one at a time, in chat: **4 on the previous day + 1 spaced question** from any earlier day. Closed book. | Previous day's recall point (0.2 per question) |
| **Stage Test 1: Foundations** | Day 5 · S3 | 45 minutes. 15 concept questions + 5 hands-on tasks in your account. | Day 5 lab points; **gate** |
| **Stage Test 2: Loading and SQL** | Day 10 · S3 | 45 minutes. 10 concept questions + 6 timed SQL problems. | Day 10 lab points; **gate** |
| **Stage Test 3: Platform mastery** | Day 15 · S3 | 45 minutes. 10 concept questions + a Query Profile diagnosis + a design question. | Day 15 lab points; **gate** |
| **Final Exam** | Day 20 · S1 | 45 minutes (replaces the normal S1). Cumulative: 20 questions + 2 SQL problems + 1 design question. | Day 20 recall point; **gate for "Interview-ready"** |

**How tests run:**
- **Closed book.** No docs, no web search, no asking me for hints. For hands-on parts you *can* run SQL in your own Snowflake account, since that's how a work-sample test goes.
- **Timed.** I stamp start and end. At 45 minutes, unanswered questions score 0.
- **I administer them in chat,** one section at a time, and grade each answer with a short explanation.
- **Gate: ≥ 70%.** Below that, the next session is a **remediation session (R)**: we go over the missed topics, and then you take a **retake** built from different questions. The day's points use the *first* attempt. The retake only unlocks progress.

**Sealed until taken.** Question banks live in `quizzes/`. Each file starts sealed and is hidden from the doc viewer. After you take it, I mark it released, and it appears under **Quizzes (taken)** with the answer key and your results. The banks are bigger than any one sitting, and I may rephrase questions or add new ones, so memorizing leaked answers wouldn't help anyway.

---

## 7. Grading — how the 0 → 100 score works

Each of the 20 days is worth **5 points**:

| Component | Points | How it's scored |
|---|---|---|
| **Labs (S2 + S3)** | 0 – 2 | 2 = all exercises done unassisted. 1 = done but assisted, or partially done. 0 = not done. |
| **Homework (S4)** | 0 – 2 | 2 = correct, idempotent/re-runnable, and explained. 1 = works but has gaps. 0 = missing or wrong. |
| **Recall quiz (next day's S1)** | 0 – 1 | 5 questions, 0.2 each. Day 20's recall point comes from the Final Exam (score % × 1). |

On stage-test days (5, 10, 15), Labs = S2 (0–1) + stage test % × 1.

### Levels

| Score | Level | What it means in an interview |
|---|---|---|
| 0 – 10 | **Trial user** | Can log in and run a query. |
| 10 – 25 | **Operator** | Can explain the architecture and set up warehouses, roles and tooling safely. |
| 25 – 50 | **Junior analyst (0–6 months)** | Can load messy data and write solid analytical SQL. |
| 50 – 75 | **Analyst (about 1 year)** | Knows the Snowflake-native features and can reason about performance and cost. |
| 75 – 90 | **Analyst (about 2 years)** | Can model, govern, automate and build beyond SQL, and defend design decisions. |
| 90 – 100 | **Interview-ready** | Has a capstone to present, has survived a mock interview, and has no red-flag gaps. |

**Milestone targets:** 25 after Week 1, 50 after Week 2, 75 after Week 3, and 100 as the ceiling after Week 4.

### Competency domains

`PROGRESS.md` also tracks 10 domains, each rated *Not started → Learning → Solid → Interview-ready*. The score says how much work you've done; the domain ratings say where you're weak.

1. Architecture and concepts
2. Tooling and access (Snowsight, CLI, Python)
3. Warehouses, compute and caching
4. Security and RBAC
5. Data loading (structured and semi-structured)
6. Analytical SQL
7. Snowflake-native features (Time Travel, cloning, dynamic tables, streams and tasks)
8. Performance tuning
9. Cost and governance
10. Beyond SQL (Snowpark, dbt, Streamlit, Cortex, sharing)

---

## 8. Datasets used

| Dataset | Where | Used for |
|---|---|---|
| `SNOWFLAKE_SAMPLE_DATA.TPCH_SF*` | Built into every account | SQL warm-ups; warehouse sizing experiments (SF1 → SF100) |
| **Bay Area MLS export** (424k listings, 296 MB JSON) | `../claw-re/web/data/mls-permanent.json`, copied into `data/` | The main dataset: loading, cleaning, marts, dashboards, capstone |
| Citibike trips (public S3 bucket from Snowflake's own labs) | External stage | External stages; performance and pruning at larger scale |
| A Snowflake Marketplace dataset (for example, public economic or mortgage-rate data) | Marketplace | Data sharing; joining rates to MLS trends |

The MLS data is **real and messy**: `"$2,995,000"` strings, `"4|1"` for bathrooms, `MM/DD/YYYY` dates and empty strings. That's deliberate. Cleaning data like this is most of an analyst's job, and it makes good interview stories.

---

## 9. Course documents

| Doc | Purpose | Who writes it |
|---|---|---|
| [README](README.md) | Front page: how to start | Instructor |
| [SYLLABUS](SYLLABUS.md) | This file: the contract | Instructor |
| [SCHEDULE](SCHEDULE.md) | All 20 days × 4 sessions, with readings, homework and interview questions | Instructor |
| [PROGRESS](PROGRESS.md) | Score, level, pace, per-day scores, **timestamped session log**, stage test results, weak spots | Instructor (updated every session) |
| `quizzes/` | Recall quiz banks (one per stage) and the stage tests, sealed until taken | Instructor |
| [NOTES](NOTES.md) | Your interview cheat sheet | **You** |
| `lessons/day-NN.md` | Each day's lesson: concepts, lab steps and the homework spec. Written just before the day, then a class log is added. | Instructor |
| `work/day-NN/` | Your lab SQL, homework and written answers, graded in place | **You** |

After the course, `work/` and the capstone are your portfolio. They're worth pushing to a public GitHub repo. The `data/` folder is not.

---

## 10. After the course (optional)

- **SnowPro Core certification** (check snowflake.com for the current exam version). Weeks 1–3 of this course cover most of its syllabus. Book it within about 3 weeks of Day 20, while the material is fresh.
- **Snowflake's free badges** (learn.snowflake.com, "Hands-On Essentials"). Good reinforcement on slack days, and they look good on LinkedIn.
- **Keep the skills warm.** Your trial will have expired. A small pay-as-you-go account kept to X-Small warehouses costs a few dollars a month.

# Learn Snowflake — a 20-Day Course for Data Analysts

A hands-on, instructor-led Snowflake course: 20 course days of 4 × 45-minute sessions, taken at your own hours, all on the free trial. It goes from install and setup to data loading, analytical SQL, performance, governance, Snowpark, dbt and Cortex, and ends with a capstone on real Bay Area MLS data and a mock interview.

## How to use this course

1. **Read the contract:** [SYLLABUS](SYLLABUS.md). It covers the goals, the daily rhythm, the rules and how the 0 → 100 score works.
2. **See the plan:** [SCHEDULE](SCHEDULE.md). All 80 sessions, day by day.
3. **Check where you are:** [PROGRESS](PROGRESS.md). Score, level, next session and class log.
4. **Start a class:** open Claude Code in this folder and type **`start class`**.

Other things to say during class: `next session` · `end session` · `hint` · `I'm stuck` · `submit homework` · `status` · `end day`.

## How a course day works

A **course day** is four 45-minute sessions in order, taken whenever you can focus (2 AM and 8 AM is fine). Every session is timestamped in [PROGRESS](PROGRESS.md#session-log).

| Session | What |
|---|---|
| S1 | Recall quiz on the previous day + new concept |
| S2 | Guided lab: you type every command |
| S3 | Challenge lab (a **Stage Test** on Days 5, 10, 15) |
| S4 | Homework, graded at the next day's S1 |

Timing rules: at least a 10-minute break between sessions · at least 4 hours between a day's S4 and the next S1 · at most 8 sessions in 24 hours · no gap over 48 hours. **Hard deadline: Day 20 done by Fri 2026-10-23** (the trial expires). Details: [SYLLABUS §3](SYLLABUS.md#3-what-a-day-is-and-when-you-take-sessions).

## Where things live

- `lessons/day-NN.md`: each day's lesson, written just before the day, with a class log appended afterwards.
- `work/day-NN/`: **your** SQL, Python and write-ups. This becomes your portfolio.
- [NOTES](NOTES.md): **your** interview cheat sheet, 3+ bullets a day.
- `quizzes/`: recall quiz banks and stage tests. **Sealed until you take them**; don't open them. See the [quiz index](quizzes/README.md).
- `data/`: local dataset copies (gitignored; the MLS data is licensed).

## Viewing these docs

```
./start.sh      # → http://localhost:3070
```

The viewer lists every doc in the left panel (Course manual · Lessons · Quizzes (taken) · My work) and shows the selected one in the main panel. New lessons and homework files show up automatically.

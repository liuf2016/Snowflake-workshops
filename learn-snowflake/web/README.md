# learn-snowflake web

A small Next.js app that serves this course's markdown and code as a two-pane manual.

- Left nav — **Course manual** (README, syllabus, schedule, progress, notes), **Lessons**
  (`lessons/day-NN.md`), **My work** (`work/**` — `.md`, `.sql`, `.py`), **System files**
  (`CLAUDE.md`, shown as raw source).
- Main panel — the selected doc. Markdown renders as prose; `.sql`/`.py` and system files show
  as-authored. Relative links between docs (`[schedule](SCHEDULE.md#day-03)`) stay in the viewer.
- Upper right — **Print** (markdown → PDF) or **Download** (source files).

## Run

```
../start.sh        # or: npm install && npm run dev
```

Then open http://localhost:3070.

## Adding a doc

Just write the file — no registration step. `lib/docs.ts` rescans on every request:
the repo root and `lessons/` for `*.md`, and `work/` recursively for `*.md`, `*.sql`, `*.py`.
Title comes from the first `# ` heading (or the path, for code files). Empty files are skipped.
To pull in a new directory, add it to `SCAN`.

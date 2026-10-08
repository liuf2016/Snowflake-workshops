# Day 01 — Orientation, Trial and First Login

Today: sign up for the trial, put cost guardrails in place before anything else, learn Snowflake's three-layer architecture, and build the database skeleton the rest of the course uses. By the end of the day you have a working, cost-guarded account and your first graded homework.

**Schedule reference:** [SCHEDULE · Day 01](../SCHEDULE.md#day-01--orientation-trial-and-first-login) · **Reading:** [Key concepts and architecture](https://docs.snowflake.com/en/user-guide/intro-key-concepts), [Snowsight quick tour](https://docs.snowflake.com/en/user-guide/ui-snowsight-quick-tour)

---

## S1 — Concept: what Snowflake is (45 min)

### 1.1 Kickoff (5 min)

Read [SYLLABUS §5 Rules](../SYLLABUS.md#5-rules-the-external-force) out loud to yourself. The short version: you type everything, homework is due at the next S1, stage tests are gates, guardrails come before experiments, and the timing rules (T1–T5) hold: sessions can be at any hour, but they're spaced and logged.

### 1.2 The problem Snowflake solves (10 min)

Before cloud data warehouses, a company's analytics database was **one box** (or one cluster). Storage and compute were welded together:

- The nightly ETL load and the 9am CEO dashboard **fought over the same CPUs**.
- Need more disk? Buy more of the whole thing, CPUs included.
- Need to handle a quarter-end spike? Too bad. You sized for the peak and paid for it all year.

Snowflake's core idea is to **separate storage from compute** and run both as a managed cloud service.

### 1.3 The three layers (15 min)

```
┌──────────────────────────────────────────────────────────────┐
│  CLOUD SERVICES  — the "brain"                               │
│  auth · RBAC · SQL parsing & optimization · metadata ·       │
│  transactions · result cache · Time Travel bookkeeping       │
├──────────────────────────────────────────────────────────────┤
│  COMPUTE  — virtual warehouses (independent clusters)        │
│   [ ELT_WH  (M) ]   [ BI_WH  (S, multi-cluster) ]   [ LEARN_WH (XS) ]
│   each has its own CPU/RAM/local SSD cache; start/stop/resize│
│   in seconds; billed per second while running                │
├──────────────────────────────────────────────────────────────┤
│  STORAGE  — cloud object storage (S3 in your case)           │
│  tables stored as compressed, columnar, immutable            │
│  MICRO-PARTITIONS (~50–500 MB uncompressed each)             │
│  shared by ALL warehouses; billed per TB per month           │
└──────────────────────────────────────────────────────────────┘
```

| Layer | What it does | How you pay |
|---|---|---|
| **Storage** | Holds all table data as micro-partitions in the cloud provider's object storage. You never see the files. | Per TB per month (compressed), roughly $23/TB/month on AWS US. |
| **Compute** | **Virtual warehouses** run queries. Any number of them can read the same data at once without interfering. | **Credits** per second while running (60-second minimum each time it starts). X-Small = 1 credit/hour, and each size up doubles it. |
| **Cloud services** | Login, security, query compilation, metadata, the result cache. | Free unless it exceeds 10% of your daily compute (rare). |

**The consequences, which interviewers want you to say:**
1. **Workload isolation.** ELT and BI get separate warehouses and never slow each other down.
2. **Elasticity.** Resize a warehouse in seconds, and suspend it when idle so you pay nothing.
3. **One copy of the data.** Every team queries the same tables, so there's no copying data into team-specific marts to get performance.
4. **Near-zero administration.** No indexes, no vacuuming, no storage tuning. The platform manages micro-partitions.

### 1.4 Editions and credits (5 min)

| Edition | Adds | Roughly $ per credit (AWS US, on-demand) |
|---|---|---|
| Standard | Core platform, 1-day Time Travel | ~$2 |
| **Enterprise** ← your trial | Multi-cluster warehouses, up to 90-day Time Travel, materialized views, masking and row-access policies | ~$3 |
| Business Critical | Stronger compliance (HIPAA/PCI), private connectivity, failover | ~$4 |

Your trial gives about **$400 in credits**, which is about 130 X-Small warehouse-hours at Enterprise pricing. That's plenty, as long as warehouses suspend when idle. (Prices vary by region and contract; check the current pricing page.)

### 1.5 Sign up — do it now (10 min)

1. Go to **signup.snowflake.com**. Use the email you'll keep for 30+ days.
2. Choose **Enterprise**, **AWS**, **US West (Oregon)**.
3. Activate from the email, and choose a username and a strong password.
4. **Enroll in MFA** when prompted (an authenticator app or passkey). Snowflake is enforcing MFA for human password logins; do it now rather than be locked out later.
5. Write these into `work/day-01/account.md` (identifiers only, **never a password**):
   - Account identifier (`ORGNAME-ACCOUNTNAME`) and account URL. Find them in Snowsight under the account menu at the bottom left → your account → "View account details" / "Connect a tool to Snowflake". (Menus move around; look for *account details*.)
   - The account locator and region
   - The date you signed up, and **the expiry date (signup + 30 days)**. Tell me both so I can log them in PROGRESS.md.

✋ **Interview question — answer it in chat before moving on:** *"Explain Snowflake's architecture to a business stakeholder in under a minute."*

---

## S2 — Guided lab: Snowsight tour and cost guardrails (45 min)

Type every statement yourself in a **Snowsight Workspace SQL file** (Projects → Workspaces → `+ Add new` → SQL File). Newer accounts have Workspaces instead of the older Worksheets; both work the same way for this course. Run them one at a time (Cmd+Enter runs the statement under the cursor).

### 2.1 Tour (10 min)

Click through and find each of these. Say out loud what each is for:
- **Workspaces** (formerly Worksheets): where you write SQL, as saved files. Notice the role and warehouse pickers at the top right.
- **Catalog / Data → Databases**: the object browser. Find `SNOWFLAKE` (the shared account-usage database) and `SNOWFLAKE_SAMPLE_DATA`.
- **Monitoring → Query History**: every query run, with its duration and a Query Profile.
- **Admin → Warehouses**: you'll see `COMPUTE_WH`, created with the trial.
- **Admin → Cost Management**: credits consumed. Check it at every `end day`.

### 2.2 Guardrails first (20 min)

```sql
-- Everything guardrail-related needs the top role. This is one of the few times we use it.
USE ROLE ACCOUNTADMIN;

-- 1) A resource monitor on the WHOLE ACCOUNT. FREQUENCY = NEVER means the quota never
--    resets, which is exactly what we want for a one-off 30-day trial.
CREATE OR REPLACE RESOURCE MONITOR learn_rm
  WITH CREDIT_QUOTA = 60
       FREQUENCY = NEVER
       START_TIMESTAMP = IMMEDIATELY
  TRIGGERS ON 50  PERCENT DO NOTIFY
           ON 75  PERCENT DO NOTIFY
           ON 90  PERCENT DO NOTIFY
           ON 100 PERCENT DO SUSPEND
           ON 110 PERCENT DO SUSPEND_IMMEDIATE;

ALTER ACCOUNT SET RESOURCE_MONITOR = learn_rm;

-- 2) The trial's default warehouse suspends after 10 minutes idle. Tighten it.
--    Older trials name it COMPUTE_WH; newer ones ship SNOWFLAKE_LEARNING_WH. Run SHOW WAREHOUSES to see yours.
ALTER WAREHOUSE IF EXISTS compute_wh            SET AUTO_SUSPEND = 60;
ALTER WAREHOUSE IF EXISTS snowflake_learning_wh SET AUTO_SUSPEND = 60;
```

> **Why 60 credits?** About $180, roughly 45% of the trial. If we ever hit it, something is wrong: a runaway task or a warehouse left at size L. `SUSPEND` lets running queries finish; `SUSPEND_IMMEDIATE` kills them.
>
> **Notifications:** resource-monitor emails go only to account admins who have a **verified email** and have **enabled notifications** (user menu → Settings / Profile → Notifications). Turn that on now.

Now switch to the role you'll use for building things:

```sql
USE ROLE SYSADMIN;

-- 3) Your own course warehouse. XS, suspends after 60s, wakes when a query arrives.
CREATE WAREHOUSE IF NOT EXISTS learn_wh
  WAREHOUSE_SIZE      = XSMALL
  AUTO_SUSPEND        = 60
  AUTO_RESUME         = TRUE
  INITIALLY_SUSPENDED = TRUE
  COMMENT             = 'Course warehouse — keep XS unless an experiment says otherwise';

USE WAREHOUSE learn_wh;
```

```sql
-- 4) Make your user default to it, and use Pacific time so timestamps make sense.
--    (Replace MY_USER with the username you chose; SELECT CURRENT_USER(); shows it.)
USE ROLE ACCOUNTADMIN;
ALTER USER my_user SET
  DEFAULT_WAREHOUSE = learn_wh
  DEFAULT_ROLE      = SYSADMIN
  TIMEZONE          = 'America/Los_Angeles';
USE ROLE SYSADMIN;
```

### 2.3 Verify (10 min)

```sql
SHOW RESOURCE MONITORS;              -- does learn_rm exist? credit_quota? (needs ACCOUNTADMIN to see all)
SHOW WAREHOUSES;                     -- auto_suspend should be 60 for both
SELECT CURRENT_ROLE(), CURRENT_WAREHOUSE(), CURRENT_USER(), CURRENT_REGION();
```

Then look up your two warehouses in **Admin → Warehouses** and confirm what you see matches the `SHOW WAREHOUSES` output.

### 2.4 Sample data check (5 min)

```sql
SHOW DATABASES LIKE 'SNOWFLAKE_SAMPLE_DATA';
```

If it's **missing** (some newer trials don't include it), recreate it from Snowflake's share:

```sql
USE ROLE ACCOUNTADMIN;
CREATE DATABASE IF NOT EXISTS snowflake_sample_data FROM SHARE sfc_samples.sample_data;
GRANT IMPORTED PRIVILEGES ON DATABASE snowflake_sample_data TO ROLE PUBLIC;
USE ROLE SYSADMIN;
```

✋ **Check in:** paste the output of `SHOW WAREHOUSES` (just the name, size, auto_suspend and state columns) into chat.

---

## S3 — Challenge lab: the object hierarchy (45 min)

**Concept (5 min).** Everything in Snowflake lives in a tree:

```
ORGANIZATION
 └─ ACCOUNT                       (your trial)
     ├─ WAREHOUSES, USERS, ROLES  (account-level objects)
     └─ DATABASE
         └─ SCHEMA
             └─ TABLE · VIEW · STAGE · FILE FORMAT · SEQUENCE · FUNCTION · PROCEDURE · STREAM · TASK · …
```

A fully qualified name is `DATABASE.SCHEMA.OBJECT`. Unqualified names resolve against your **current context** (`USE DATABASE` / `USE SCHEMA`). Unquoted identifiers are stored in **UPPERCASE**.

**Exercises.** No solutions are given here. Use `hint` if you need one. Save everything you run in `work/day-01/lab.sql`, with a comment above each exercise.

| # | Exercise | You should end up knowing |
|---|---|---|
| E1 | As `SYSADMIN`, create database `LEARN_DB` with three schemas, `RAW`, `STAGING` and `MARTS`, each with a `COMMENT` describing its purpose. | `CREATE DATABASE/SCHEMA`, `COMMENT` |
| E2 | Create `LEARN_DB.STAGING.BAY_AREA_CITIES (city VARCHAR, county VARCHAR, sample_zip VARCHAR(5))` and insert 5 Bay Area cities. Then `USE SCHEMA LEARN_DB.RAW;` and query the table *without* changing context. | Fully qualified names |
| E3 | Answer using only `SHOW` / `DESCRIBE` / `INFORMATION_SCHEMA`: (a) Which role owns `LEARN_DB`? (b) What is its Time Travel retention (days)? (c) How many tables exist in `LEARN_DB` right now? (d) What columns and types does your table have? | Three ways to inspect metadata |
| E4 | Run `CREATE TABLE learn_db.staging.MixedCase (id INT);`, then try `SELECT * FROM learn_db.staging."MixedCase";`. Explain what happened. | Identifier case rules (a classic trap) |
| E5 | In `SNOWFLAKE_SAMPLE_DATA`: list its schemas, and count rows in `TPCH_SF1.ORDERS` and `TPCH_SF1.CUSTOMER`. Try to `INSERT` a row into `CUSTOMER`. Why does it fail? | Shared databases are read-only |
| E6 ★ | Suspend `LEARN_WH` (`ALTER WAREHOUSE learn_wh SUSPEND;`), then run `SELECT COUNT(*) FROM snowflake_sample_data.tpch_sf1.orders;`. Check Query History: did a warehouse start? Why or why not? | Metadata answers (a preview of Day 3) |

✋ **Interview question:** *"What's the difference between a database, a schema and a warehouse in Snowflake?"* (Hint: one of these is not like the others.)

---

## S4 — Homework (45 min, due at the start of Day 02 · S1, which is at least 4 hours after this session ends)

Put all files in `work/day-01/`. Then say `submit homework`.

| # | File | Task | Points toward the 2 |
|---|---|---|---|
| H1 | `setup.sql` | **One idempotent script** that recreates *everything* from today: resource monitor, warehouse settings, `LEARN_WH`, user defaults, `LEARN_DB` + schemas + the cities table with its 5 rows. Running it **twice in a row must succeed and leave the same state** (think `IF NOT EXISTS`, `OR REPLACE`, and what to do about the `INSERT`). Put a `USE ROLE` at each point where the needed role changes. | Idempotency is the main thing graded |
| H2 | `tpch.sql` | Five business questions on `SNOWFLAKE_SAMPLE_DATA.TPCH_SF1`. Each query needs a comment stating the question and a one-line answer: (1) orders and total revenue (`O_TOTALPRICE`) per order year; (2) the top 10 customers by total spend, with their nation name; (3) customer count per market segment × region; (4) the average number of days from order date to ship date, per ship mode; (5) the % of line items returned (`L_RETURNFLAG = 'R'`) per ship year. | Correct joins, readable SQL |
| H3 | `architecture.md` | Snowflake's 3-layer architecture in **≤ 150 words, your own words**, aimed at a non-technical hiring manager. End with one sentence on why it matters for cost. | Clarity, no copy-paste |
| H4 | `../../NOTES.md` | At least 3 interview-answer bullets under *Week 1 → Architecture* and *Warehouses*. | Required, not graded separately |

**Rubric:** **2** = everything runs, `setup.sql` is truly re-runnable, and the answers are right and explained · **1** = works but isn't idempotent, or has a wrong query or thin write-up · **0** = missing.

**Before you close the laptop:** `SHOW WAREHOUSES;` → both should be `SUSPENDED` (or will be within 60 seconds). Say `end day`. I'll log the day and tell you the earliest time Day 02 · S1 can start.

---

## Interview questions for today

1. Explain Snowflake's architecture. Why does separating storage and compute matter to a business?
2. What is a credit, and what consumes them?
3. Database vs. schema vs. warehouse?
4. How would you stop a trial or a team from overspending? (Resource monitors, auto-suspend, right-sizing.)

---

## Class log

_(Filled in by the instructor as the day runs: what was covered, stuck points, hints used, time taken.)_

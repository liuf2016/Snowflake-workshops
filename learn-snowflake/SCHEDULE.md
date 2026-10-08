# Class Schedule — 20 days × 4 sessions

The full course plan: 4 stages, 20 course days, 4 sessions of 45 minutes per course day, taken at whatever hours suit you. Every day lists its goal, its readings, what happens in each session, the homework, and the interview questions you should be able to answer by the end of it.

**Session key:** S1 = Recall + Concept · S2 = Guided Lab · S3 = Challenge Lab (or Stage Test) · S4 = Homework. A **course day** is those four sessions in order, whatever the clock says. See [SYLLABUS §3](SYLLABUS.md#3-what-a-day-is-and-when-you-take-sessions) for the timing rules and [§6](SYLLABUS.md#6-quizzes-and-stage-tests) for the tests.

**The course started Thu 2026-09-24.** The only hard date is the trial: **Day 20 must be done by Fri 2026-10-23.** When each session actually happened is logged with timestamps in [PROGRESS](PROGRESS.md#session-log).

| Stage | Days | Theme | Stage test | Score target | Deadline to stay 🟢 |
|---|---|---|---|---|---|
| 1 | 1 – 5 | Foundations: account, tools, compute, access | Stage Test 1 (Day 5 · S3) | 0 → 25 | Day 5 done by Thu 10-01 |
| 2 | 6 – 10 | Loading data and analytical SQL | Stage Test 2 (Day 10 · S3) | 25 → 50 | Day 10 done by Fri 10-09 |
| 3 | 11 – 15 | Snowflake-native features, performance, governance | Stage Test 3 (Day 15 · S3) | 50 → 75 | Day 15 done by Fri 10-16 |
| 4 | 16 – 20 | Beyond SQL, capstone, interview | Final Exam (Day 20 · S1) | 75 → 100 | Day 20 done by Fri 10-23 |

The "stay green" dates assume about 2.8 sessions per calendar day. Finish earlier if you can: slack is what absorbs a stage-test retake or a bad week.

Each day's detailed lesson (concept notes, exact lab steps, the full homework spec) is written to `lessons/day-NN.md` just before that day. That way it can adapt to how the previous days went.

**Reading links** point at docs.snowflake.com. If a page has moved, search the docs site for the topic name.

---

# Stage 1 — Foundations (Days 1–5)

## Day 01 — Orientation, trial and first login

**Goal:** a working, cost-guarded Snowflake account, and a clear mental model of its architecture.
**Reading (S1):** [Key concepts and architecture](https://docs.snowflake.com/en/user-guide/intro-key-concepts) · [Snowsight quick tour](https://docs.snowflake.com/en/user-guide/ui-snowsight-quick-tour)

| # | Session | Content |
|---|---|---|
| S1 | Concept | Course kickoff and rules. What Snowflake is: SaaS, the **three layers** (storage, compute, cloud services), separation of storage and compute, micro-partitions (a preview), editions, the credit pricing model. **Sign up for the trial** (Enterprise, AWS US West Oregon) and verify your email. |
| S2 | Guided Lab | Tour of Snowsight: worksheets, the Catalog/Databases, Query History, Monitoring, Admin → Cost. **Guardrails:** an account-level resource monitor, `COMPUTE_WH` → auto-suspend 60s, your own `LEARN_WH` (X-Small), user timezone `America/Los_Angeles`. |
| S3 | Challenge Lab | The object hierarchy: organization → account → database → schema → objects. Build `LEARN_DB` with `RAW`, `STAGING`, `MARTS`. `SHOW` / `DESCRIBE` / `INFORMATION_SCHEMA`, fully qualified names, `USE` context, context functions. First queries on `SNOWFLAKE_SAMPLE_DATA.TPCH_SF1`. |
| S4 | Homework | (1) `work/day-01/setup.sql`: an **idempotent** script that recreates everything from today. (2) `work/day-01/tpch.sql`: 5 business questions on TPCH_SF1. (3) `work/day-01/architecture.md`: the 3-layer architecture in 150 words, your own words. (4) 3 bullets in NOTES.md. |

**Interview questions:** *Explain Snowflake's architecture. Why does separating storage and compute matter to a business? What is a credit?*

## Day 02 — Tooling: CLI, key-pair auth, Python

**Goal:** reach Snowflake from your terminal and from Python, the way you would at work.
**Reading:** [Snowflake CLI](https://docs.snowflake.com/en/developer-guide/snowflake-cli/index) · [Key-pair authentication](https://docs.snowflake.com/en/user-guide/key-pair-auth) · [Python connector](https://docs.snowflake.com/en/developer-guide/python-connector/python-connector)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | The client landscape: Snowsight, **Snowflake CLI (`snow`)**, legacy SnowSQL, JDBC/ODBC for BI tools, the Python connector, Snowpark. Authentication: password + MFA for humans; key-pair or OAuth for programs (and why single-factor passwords are being phased out). The account identifier format `orgname-accountname`. |
| S2 | Guided Lab | Install `snow`. Generate an RSA key pair, `ALTER USER … SET RSA_PUBLIC_KEY`, `snow connection add`, `snow connection test`, `snow sql -q` / `-f`. Where `~/.snowflake/config.toml` lives, and why it never goes into git. |
| S3 | Challenge Lab | Python: a `.venv`, `snowflake-connector-python[pandas]`, connect using the same named connection, run queries, `fetch_pandas_all()`, `write_pandas()`. **Bind parameters** instead of f-strings. Query tags. |
| S4 | Homework | `work/day-02/report.py`: a CLI script that takes a region name, runs a parameterized TPCH revenue query, and writes a CSV. `work/day-02/run.sh`: runs `setup.sql` via `snow sql -f`. Notes. |

**Interview questions:** *How would you connect a scheduled Python job to Snowflake securely? Why not store a password in the script? What's a query tag for?*

## Day 03 — Virtual warehouses and caching

**Goal:** understand what costs money, and prove it with your own measurements.
**Reading:** [Warehouses overview](https://docs.snowflake.com/en/user-guide/warehouses-overview) · [Multi-cluster warehouses](https://docs.snowflake.com/en/user-guide/warehouses-multicluster) · [Persisted query results](https://docs.snowflake.com/en/user-guide/querying-persisted-results)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Sizes XS → 6XL (credits double at each step), per-second billing with a 60-second minimum, auto-suspend and auto-resume. **Scale up** (a bigger warehouse for complex queries) vs. **scale out** (multi-cluster for concurrency; standard vs. economy policy). The **three caches**: result cache (24 hours, free), warehouse local-disk cache (lost on suspend), metadata (`COUNT(*)`, `MIN`/`MAX`). |
| S2 | Guided Lab | Experiment log: the same heavy TPCH_SF100 query on XS vs. S vs. M. Record elapsed time, bytes scanned and credits. Re-run it and watch the result cache hit (0 ms, no warehouse). Turn off `USE_CACHED_RESULT` and see the warm local-disk cache. |
| S3 | Challenge Lab | Measure the cost of today's experiments: `INFORMATION_SCHEMA.WAREHOUSE_METERING_HISTORY()`, `QUERY_HISTORY()`, and `SNOWFLAKE.ACCOUNT_USAGE` (and its latency). Set `STATEMENT_TIMEOUT_IN_SECONDS` on `LEARN_WH`. Make a query fail on the timeout on purpose. |
| S4 | Homework | `work/day-03/sizing-memo.md`: a 1-page recommendation for a 40-person analytics org (ELT, BI dashboards, ad hoc), with warehouse sizes, clusters, policies, auto-suspend values and a monthly credit estimate. `work/day-03/warehouses.sql` implements it (all created suspended). |

**Interview questions:** *A dashboard is slow at 9am but fine at 2pm. What do you check and change? Scale up vs. scale out? Why can a re-run of a query be free?*

## Day 04 — Access control (RBAC)

**Goal:** design and debug permissions like the analyst the platform team trusts.
**Reading:** [Access control overview](https://docs.snowflake.com/en/user-guide/security-access-control-overview) · [Access control best practices](https://docs.snowflake.com/en/user-guide/security-access-control-considerations)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Securable objects, privileges, roles, users. System roles: `ORGADMIN`, `ACCOUNTADMIN`, `SECURITYADMIN`, `USERADMIN`, `SYSADMIN`, `PUBLIC`. The role hierarchy and inheritance. Ownership. **Access roles vs. functional roles.** Future grants. Secondary roles. Why you never do daily work as `ACCOUNTADMIN`. |
| S2 | Guided Lab | Build `LEARN_DB_RO` / `LEARN_DB_RW` access roles and `ANALYST` / `ENGINEER` functional roles, roll them up to `SYSADMIN`, create a user `TEST_ANALYST`, and verify with `USE ROLE` + `SHOW GRANTS`. |
| S3 | Challenge Lab | **Break and fix:** 5 "insufficient privileges" scenarios (missing `USAGE` on the database or schema, missing future grants, no warehouse `USAGE`, ownership transfer, a role not granted up the hierarchy). Diagnose each one from the error and the `SHOW GRANTS` output. |
| S4 | Homework | `work/day-04/rbac-design.md`: an RBAC design for a company with Finance, Marketing and Data Engineering teams, with a Mermaid role diagram. `work/day-04/rbac.sql` implements it idempotently. |

**Interview questions:** *A new analyst can see the database but gets "object does not exist" on a table. Walk me through it. What are future grants? Why separate access roles from functional roles?*

## Day 05 — The Snowflake SQL dialect + ✅ Stage Test 1

**Goal:** be fluent in the Snowflake-specific parts of SQL, and prove Stage 1.
**Reading:** [Data types](https://docs.snowflake.com/en/sql-reference-data-types) · [Identifier requirements](https://docs.snowflake.com/en/sql-reference/identifiers-syntax) · [Conversion functions](https://docs.snowflake.com/en/sql-reference/functions-conversion)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Unquoted identifiers are upper-cased (and quoted ones are a trap). `NUMBER`, `VARCHAR`, the three `TIMESTAMP` flavors (NTZ/LTZ/TZ), `VARIANT`. `TRY_TO_NUMBER` / `TRY_TO_DATE` / `TRY_CAST`, `IFF`, `ZEROIFNULL`, `ILIKE`, `SPLIT_PART`, `REGEXP_*`, `SELECT * EXCLUDE / RENAME`, `SAMPLE`, CTAS, permanent vs. **transient** vs. **temporary** tables. |
| S2 | Guided Lab | 10 TPCH business questions: revenue by nation and year, top customers per market segment, late shipments, order-size buckets. |
| S3 | **Stage Test 1** | 45 minutes, closed book, graded: 15 concept questions (architecture, warehouses, caching, RBAC, tooling) + 5 hands-on tasks in your account. **Gate: ≥ 70%.** Bank: `quizzes/stage-test-1.md` (sealed). |
| S4 | Review | Redo every stage-test miss until you get it right. Consolidate NOTES.md for Stage 1. |

**Optional extra (on slack time):** the Snowflake "Hands-On Essentials: Data Warehousing Workshop" badge at learn.snowflake.com. **Required before Day 6:** copy the MLS file into `data/` (instructions in lesson 05).

---

# Stage 2 — Loading data and analytical SQL (Days 6–10)

## Day 06 — Loading I: stages, file formats, `COPY INTO`

**Goal:** load CSV reliably and repeatably, and handle bad rows the way you would in production.
**Reading:** [Data loading overview](https://docs.snowflake.com/en/user-guide/data-load-overview) · [COPY INTO table](https://docs.snowflake.com/en/sql-reference/sql/copy-into-table) · [Troubleshooting loads](https://docs.snowflake.com/en/user-guide/data-load-considerations-load)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | The ingestion menu: UI upload, `COPY`, Snowpipe, Snowpipe Streaming, connectors/partners. **Stages:** user `@~`, table `@%t`, named internal, external. File formats. `COPY` options: `ON_ERROR`, `VALIDATION_MODE`, `PURGE`, `FORCE`, `PATTERN`. **Load metadata** (64 days) and why a re-run loads 0 files. File sizing (100–250 MB compressed). |
| S2 | Guided Lab | A Python script converts a 50k-row slice of the MLS JSON to CSV, with a few bad rows planted on purpose. Create a file format and a named stage; `PUT`, `LIST`, `COPY INTO RAW.MLS_CSV`, first with `VALIDATION_MODE = RETURN_ERRORS`. |
| S3 | Challenge Lab | Error handling: `ON_ERROR = CONTINUE` vs. `ABORT_STATEMENT`, `VALIDATE()`, `COPY_HISTORY()`. Re-run the `COPY` and explain the 0 files loaded. When to use `FORCE`, and why it's dangerous. Load the *full* file into a table. |
| S4 | Homework | `work/day-06/`: load a second public CSV dataset of your choice end to end (format, stage, validate, copy, verify row counts), with a `README.md` explaining how the script stays idempotent. |

**Interview questions:** *You re-ran a COPY and nothing loaded. Why? How do you find which rows failed and why? How big should load files be?*

## Day 07 — Loading II: semi-structured data (JSON, VARIANT, FLATTEN)

**Goal:** load the raw MLS JSON and turn messy strings into a clean, typed table.
**Reading:** [Semi-structured data](https://docs.snowflake.com/en/user-guide/semistructured-intro) · [Querying semi-structured data](https://docs.snowflake.com/en/user-guide/querying-semistructured) · [FLATTEN](https://docs.snowflake.com/en/sql-reference/functions/flatten)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | `VARIANT` / `OBJECT` / `ARRAY`, path notation (`v:field`, `v:"Key With Spaces"`, `[0]`), `::` casts, `PARSE_JSON`, `STRIP_OUTER_ARRAY`, **`LATERAL FLATTEN`**, `INFER_SCHEMA` + `USING TEMPLATE`, Parquet. Schema-on-read vs. schema-on-write, and when each makes sense. |
| S2 | Guided Lab | Load the full 424k-row `mls-permanent.json` into `RAW.MLS_JSON (v VARIANT, loaded_at, file_name)`. Query it. Use `FLATTEN` over each record's keys to **profile every column automatically** (key, non-empty %, distinct count, sample values). |
| S3 | Challenge Lab | Build `STAGING.MLS_LISTINGS` with typed columns: `"$2,995,000"` → `NUMBER`, `"3,608"` → `NUMBER`, `"4\|1"` → full and half baths, `MM/DD/YYYY` → `DATE`, `''` → `NULL`. Use only `TRY_` functions, and count the values that failed to parse. |
| S4 | Homework | `work/day-07/dq-report.sql`: a data quality report covering null or empty rate per column, invalid values per typed column, duplicate MLS numbers, and impossible values (sale before listing, $0 sales, a 1850 year built in a 2020 subdivision…). Write up findings in `dq-findings.md`. |

**Interview questions:** *How do you query a JSON field whose key has spaces? When would you keep data as VARIANT instead of typed columns? What does FLATTEN return?*

## Day 08 — Loading III: external stages, Snowpipe, incremental loads

**Goal:** load from cloud storage and design the layered raw → staging → marts pipeline.
**Reading:** [External stages](https://docs.snowflake.com/en/user-guide/data-load-s3-create-stage) · [Snowpipe intro](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-intro) · [Storage integrations](https://docs.snowflake.com/en/user-guide/data-load-s3-config-storage-integration)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Storage integrations (why keys don't go in stage definitions), external stages, external tables, directory tables. **Snowpipe** (auto-ingest via event notifications; serverless billing) vs. Snowpipe Streaming vs. scheduled `COPY`. ELT vs. ETL. The **medallion / layered** pattern. |
| S2 | Guided Lab | An external stage on Snowflake's public Citibike trips S3 bucket: `LIST`, a file format, `COPY` about 60M rows. Watch it on XS, then resize mid-course and compare. (This table is reused on Day 14.) |
| S3 | Challenge Lab | **Incremental file drops:** split the MLS data into monthly files, `PUT` them one month at a time, and `COPY` with `PATTERN`. Show that only new files load. Then write out how a Snowpipe would automate this (`CREATE PIPE … AUTO_INGEST`, `SYSTEM$PIPE_STATUS`). |
| S4 | Homework | `work/day-08/ingestion-runbook.md`: a runbook for "vendor drops daily CSVs to S3" covering storage integration, stage, pipe, monitoring, failure handling, backfills and cost, plus the SQL for the incremental load you did in S3. |

**Interview questions:** *Design ingestion for daily S3 file drops. Snowpipe vs. a scheduled COPY: cost and latency? Why use a storage integration?*

## Day 09 — Analytical SQL I: windows, `QUALIFY`, dates

**Goal:** answer real market questions on the MLS data with window functions, and put them on a dashboard.
**Reading:** [Window functions](https://docs.snowflake.com/en/sql-reference/functions-analytic) · [QUALIFY](https://docs.snowflake.com/en/sql-reference/constructs/qualify) · [Date and time functions](https://docs.snowflake.com/en/sql-reference/functions-date-time)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | `ROW_NUMBER` / `RANK` / `DENSE_RANK`, `LAG` / `LEAD`, running totals, **window frames** (`ROWS` vs. `RANGE`), moving averages, `NTILE`, `MEDIAN`, `PERCENTILE_CONT`. **`QUALIFY`** for top-N per group and deduplication. `DATE_TRUNC`, `DATEADD`, `DATEDIFF`, `LAST_DAY`, fiscal calendars, timezone traps. |
| S2 | Guided Lab | Bay Area market metrics: monthly median sale price by city, MoM and YoY change with `LAG`, sale-to-list ratio, days-on-market distribution, rolling 3-month median, top 5 cities by appreciation (`QUALIFY`). |
| S3 | Challenge Lab | Build a **Snowsight dashboard** from those queries: tiles, charts, and a city filter. Deduplicate relisted properties (the same address with several MLS numbers) with `QUALIFY ROW_NUMBER()`. |
| S4 | Homework | **Timed:** 10 interview-style SQL problems (MLS + TPCH) in 45 minutes, in `work/day-09/timed.sql`. Record how long each took. |

**Interview questions:** *Top 3 per group without a subquery? ROWS vs. RANGE? How do you dedupe keeping the latest record?*

## Day 10 — Analytical SQL II + ✅ Stage Test 2

**Goal:** the harder patterns interviewers like, then prove Stage 2.
**Reading:** [GROUP BY ROLLUP/CUBE/GROUPING SETS](https://docs.snowflake.com/en/sql-reference/constructs/group-by-rollup) · [PIVOT](https://docs.snowflake.com/en/sql-reference/constructs/pivot) · [Estimating distinct values](https://docs.snowflake.com/en/user-guide/querying-approximate-cardinality)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | `ROLLUP` / `CUBE` / `GROUPING SETS` + `GROUPING()`, `PIVOT` / `UNPIVOT` (including dynamic `PIVOT … ANY`), `LISTAGG`, `ARRAY_AGG`, `APPROX_COUNT_DISTINCT`, `APPROX_PERCENTILE`. Patterns: **gaps and islands**, **sessionization**, cohort retention. `MATCH_RECOGNIZE` (a preview). |
| S2 | Guided Lab | A city × quarter pivot of median prices with subtotals. Citibike: sessionize rides per bike and find gaps and islands in station activity. |
| S3 | **Stage Test 2** | 45 minutes, closed book, graded: 10 concept questions (loading, semi-structured data, SQL) + 6 timed SQL problems. **Gate: ≥ 70%.** Bank: `quizzes/stage-test-2.md` (sealed). |
| S4 | Review | Redo the misses. Consolidate NOTES.md for Stage 2. |

**Optional extra (on slack time):** re-do Day 9's timed set cold and aim for under 30 minutes.

---

# Stage 3 — Snowflake-native features, performance, governance (Days 11–15)

## Day 11 — Time Travel, Fail-safe, zero-copy cloning

**Goal:** recover from mistakes in minutes, and spin up dev environments at no storage cost.
**Reading:** [Time Travel](https://docs.snowflake.com/en/user-guide/data-time-travel) · [Fail-safe](https://docs.snowflake.com/en/user-guide/data-failsafe) · [Cloning](https://docs.snowflake.com/en/user-guide/object-clone) · [Micro-partitions](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | **Micro-partitions** and immutable storage, the idea everything else here builds on. Time Travel (`DATA_RETENTION_TIME_IN_DAYS`, 0–90 days on Enterprise), `AT` / `BEFORE` (`TIMESTAMP`, `OFFSET`, `STATEMENT`), `UNDROP`, Fail-safe (7 days, support-only). Transient and temporary tables and their cost. Zero-copy cloning and what happens to storage when the clone diverges. |
| S2 | Guided Lab | **"Oops" drills:** a `DELETE` without `WHERE` (recover with `BEFORE(STATEMENT => …)`), a bad `UPDATE`, `DROP TABLE` then `UNDROP`, a dropped schema. Every recovery is timed. |
| S3 | Challenge Lab | Dev environments: `CREATE DATABASE LEARN_DB_DEV CLONE LEARN_DB`, change the clone, diff it against prod, then promote with `ALTER TABLE … SWAP WITH`. Inspect `TABLE_STORAGE_METRICS` (active, time-travel and failsafe bytes). |
| S4 | Homework | `work/day-11/postmortem.md`: an incident post-mortem for a scenario I give you (timeline, detection, recovery SQL, prevention), plus `recovery.sql`. |

**Interview questions:** *Someone ran a bad UPDATE an hour ago. How do you fix it? How can cloning a 10 TB table be instant? Time Travel vs. Fail-safe?*

## Day 12 — Data modeling: views, materialized views, dynamic tables

**Goal:** build an analytics mart on MLS data, and choose the right object type for each layer.
**Reading:** [Views overview](https://docs.snowflake.com/en/user-guide/views-introduction) · [Materialized views](https://docs.snowflake.com/en/user-guide/views-materialized) · [Dynamic tables](https://docs.snowflake.com/en/user-guide/dynamic-tables-about)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Dimensional modeling: facts vs. dimensions, **grain**, star schema, surrogate keys, SCD types 1 and 2. Views vs. secure views vs. materialized views (a single table, Enterprise, maintenance cost) vs. **dynamic tables** (`TARGET_LAG`, incremental vs. full refresh) vs. plain CTAS. A decision table for choosing between them. |
| S2 | Guided Lab | Build `MARTS`: `DIM_DATE`, `DIM_LOCATION` (city, zip, county), `DIM_PROPERTY_TYPE`, `FCT_LISTING` (grain: one row per MLS listing). |
| S3 | Challenge Lab | Rebuild the staging → marts chain as **dynamic tables** with `TARGET_LAG`. Insert new raw rows and watch them flow through. Inspect `DYNAMIC_TABLE_REFRESH_HISTORY` and the refresh mode. Suspend the chain at the end. |
| S4 | Homework | `work/day-12/model.md`: an ERD (Mermaid), a grain statement per table, and design decisions. `work/day-12/questions.sql`: 5 business questions answered from the mart only. |

**Interview questions:** *What's the grain of your fact table? View vs. materialized view vs. dynamic table: when do you use each? What's a secure view?*

## Day 13 — Streams and tasks (CDC and orchestration)

**Goal:** build an incremental pipeline that runs itself, and know when *not* to.
**Reading:** [Streams intro](https://docs.snowflake.com/en/user-guide/streams-intro) · [Tasks intro](https://docs.snowflake.com/en/user-guide/tasks-intro) · [MERGE](https://docs.snowflake.com/en/sql-reference/sql/merge)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Streams (standard vs. append-only, `METADATA$ACTION` / `$ISUPDATE`, offsets, staleness). Tasks (CRON schedules, serverless vs. warehouse-backed, DAGs with `AFTER`, `WHEN SYSTEM$STREAM_HAS_DATA`). `MERGE` for upserts. Streams + tasks vs. dynamic tables. Alerts. |
| S2 | Guided Lab | A stream on `RAW.MLS_JSON`, and a task every minute that `MERGE`s changes into staging. Insert new and changed listings; watch the stream empty after it's consumed. |
| S3 | Challenge Lab | A 3-task DAG (ingest → transform → refresh a summary), monitored with `TASK_HISTORY()`. Make a task fail on purpose and debug it. **Suspend everything.** |
| S4 | Homework | `work/day-13/scd2.sql`: an SCD Type 2 `DIM_LISTING_PRICE` that tracks list-price changes with `valid_from` / `valid_to` / `is_current`, driven by a stream + task. Include a test script. |

**Interview questions:** *How would you implement SCD Type 2 in Snowflake? What makes a stream go stale? Streams+tasks or dynamic tables: how do you choose?*

## Day 14 — Performance tuning and Query Profile

**Goal:** diagnose slow queries from evidence, not guesses.
**Reading:** [Query Profile](https://docs.snowflake.com/en/user-guide/ui-query-profile) · [Clustering keys](https://docs.snowflake.com/en/user-guide/tables-clustering-keys) · [Search optimization](https://docs.snowflake.com/en/user-guide/search-optimization-service) · [Query acceleration](https://docs.snowflake.com/en/user-guide/query-acceleration-service)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | **Pruning**: partitions scanned vs. total. Clustering depth and `SYSTEM$CLUSTERING_INFORMATION`, clustering keys and the cost of automatic clustering. **Spilling** (local vs. remote) and what it says about warehouse size. Exploding joins, `ORDER BY` without `LIMIT`, functions on filter columns, `SELECT *`. Search optimization and the query acceleration service. |
| S2 | Guided Lab | Query Profile forensics on Citibike: 5 "bad" queries. For each, find the costly operator and fix it. Measure partitions scanned and bytes spilled before and after. |
| S3 | Challenge Lab | A clustered copy (`CTAS … ORDER BY starttime`) vs. the original: compare pruning on date filters. Force a spill on XS, then resize and compare. Build a findings table. |
| S4 | Homework | `work/day-14/perf-report.md`: 3 slow queries of your own (on MLS or Citibike), each with diagnosis → fix → before/after metrics and profile screenshots. |

**Interview questions:** *A query got slow last week. Walk me through your investigation. What is spilling and how do you fix it? When would you add a clustering key, and what does it cost?*

## Day 15 — Cost management and governance + ✅ Stage Test 3

**Goal:** answer "why did our bill double?" and "who can see this column?"
**Reading:** [Understanding cost](https://docs.snowflake.com/en/user-guide/cost-understanding-overall) · [Account Usage](https://docs.snowflake.com/en/sql-reference/account-usage) · [Masking policies](https://docs.snowflake.com/en/user-guide/security-column-ddm-intro) · [Row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | The cost model: compute, storage, **cloud services (the 10% adjustment)**, serverless features, data transfer. `ACCOUNT_USAGE` vs. `ORGANIZATION_USAGE`, budgets, resource monitors. Governance: object **tags**, **dynamic data masking**, **row access policies**, `ACCESS_HISTORY`. |
| S2 | Guided Lab | A cost dashboard (credits by warehouse per day, the 10 most expensive queries, storage by database). Mask street addresses for everyone but `ENGINEER`. A row access policy so an "East Bay analyst" role sees only Alameda and Contra Costa counties. |
| S3 | **Stage Test 3** | 45 minutes, closed book, graded: 10 concept questions (Time Travel, modeling, streams and tasks, performance, cost, governance) + a Query Profile diagnosis + a design question. **Gate: ≥ 70%.** Bank: `quizzes/stage-test-3.md` (sealed). |
| S4 | Review | Redo the misses. Consolidate NOTES.md for Stage 3. **Audit:** no running tasks, dynamic tables suspended, warehouses suspended. |

**Interview questions:** *The Snowflake bill doubled this month. How do you investigate? How do you hide PII from some users but not others? What does ACCESS_HISTORY tell you?*

---

# Stage 4 — Beyond SQL, capstone, interview (Days 16–20)

## Day 16 — Snowpark Python

**Goal:** do the work in Python while the compute stays inside Snowflake.
**Reading:** [Snowpark Python developer guide](https://docs.snowflake.com/en/developer-guide/snowpark/python/index) · [Python UDFs](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-introduction) · [Snowflake Notebooks](https://docs.snowflake.com/en/user-guide/ui-snowsight/notebooks)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Snowpark concepts: a `Session`, **lazy DataFrames compiled to SQL (pushdown)**, actions vs. transformations. UDFs, UDTFs, vectorized UDFs, stored procedures. Anaconda packages. Snowflake Notebooks. Snowpark vs. pulling data into pandas: cost, scale, security. |
| S2 | Guided Lab | Re-implement Day 9's monthly median-price metric in Snowpark (local Jupyter or a Snowflake Notebook). Inspect the generated SQL with `df.queries` / `explain()`. |
| S3 | Challenge Lab | A Python UDF that parses `"4\|1"` bathroom strings. A stored procedure that rebuilds a monthly market report table, called from a task. |
| S4 | Homework | `work/day-16/`: a vectorized UDF, plus `pandas-vs-snowpark.md` (when you'd use each, backed by your measured run times). |

**Interview questions:** *What does "lazy evaluation" mean in Snowpark? When would you write a UDF instead of SQL? Stored procedure vs. UDF?*

## Day 17 — dbt with Snowflake

**Goal:** the analytics-engineering workflow many analyst job postings now ask for.
**Reading:** dbt docs, "What is dbt?" and the Snowflake setup guide (docs.getdbt.com) · [dbt Projects on Snowflake](https://docs.snowflake.com/en/user-guide/data-engineering/dbt-projects-on-snowflake)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Why dbt exists: version-controlled, tested, documented SQL. Project layout, `sources`, `ref()`, materializations (view, table, incremental, ephemeral), tests, seeds, snapshots, docs. Running dbt locally vs. natively in Snowflake. |
| S2 | Guided Lab | `dbt-snowflake` in the venv, `dbt init`, a profile using key-pair auth, sources over `RAW.MLS_JSON`, and staging models that reuse your Day 7 cleaning logic. |
| S3 | Challenge Lab | Mart models (from Day 12) as dbt models. Tests: `unique`, `not_null`, `accepted_values`, `relationships`. One incremental model. `dbt docs generate` and the lineage graph. |
| S4 | Homework | `work/day-17/dbt_mls/`: finish the project so `dbt build` passes cleanly, with a README explaining the layers and tests. |

**Interview questions:** *What does ref() give you? How does an incremental model work? How do you test data quality in a pipeline?*

## Day 18 — Apps and AI: Streamlit, Cortex, data sharing, Marketplace

**Goal:** the newest parts of the platform, which interviewers like to probe.
**Reading:** [Streamlit in Snowflake](https://docs.snowflake.com/en/developer-guide/streamlit/about-streamlit) · [Cortex AI SQL functions](https://docs.snowflake.com/en/user-guide/snowflake-cortex/aisql) · [Secure data sharing](https://docs.snowflake.com/en/user-guide/data-sharing-intro) · [Marketplace](https://docs.snowflake.com/en/user-guide/data-marketplace)

| # | Session | Content |
|---|---|---|
| S1 | Recall + Concept | Streamlit in Snowflake. **Cortex AI SQL functions** (complete, classify, summarize, sentiment, extract), plus Cortex Analyst and semantic views at a high level. Secure data sharing (provider/consumer, no data copied, reader accounts), listings and the **Marketplace**. |
| S2 | Guided Lab | A Streamlit in Snowflake app, "Bay Area Market Explorer": a city picker, a price-trend chart, a DOM histogram and a sale-to-list gauge. |
| S3 | Challenge Lab | Get a free Marketplace dataset (for example, mortgage rates or other economic indicators) and **join it to monthly MLS trends**. Use a Cortex function to write a one-paragraph market summary per city from the aggregated metrics. |
| S4 | Homework | Finish the app. `work/day-18/insight.md`: one data-backed insight from the rates-vs-prices join, written the way you'd post it in a team Slack channel. |

**Interview questions:** *How does data sharing work without copying data? Where would you use an LLM function in an analytics pipeline, and where wouldn't you?*

## Day 19 — Capstone build day

**Goal:** a portfolio-grade, end-to-end project you can present.

**Capstone: "Bay Area Housing Market Analytics on Snowflake."** Requirements checklist:
- [ ] Raw → staging → marts pipeline (dbt or dynamic tables) over the MLS data, incremental
- [ ] Data quality tests, with known issues documented
- [ ] RBAC: analyst and engineer roles; masking on addresses
- [ ] At least 5 business questions answered, including one with an external (Marketplace) dataset
- [ ] A dashboard or Streamlit app
- [ ] Cost report: total credits used by the project, by component
- [ ] `README.md`: an architecture diagram, design decisions, trade-offs, what you'd do next

| # | Session | Content |
|---|---|---|
| S1 | Recall + Plan | Review the brief and write a plan: map existing pieces from Days 7–18 to the requirements and list the gaps. |
| S2 | Build Sprint 1 | Pipeline and marts hardening, tests. |
| S3 | Build Sprint 2 | Governance, app or dashboard polish, cost report. |
| S4 | Homework | `work/capstone/README.md` and a 10-minute presentation outline (problem → architecture → 3 insights → decisions → what's next). |

## Day 20 — Final: presentation, mock interviews, graduation

| # | Session | Content |
|---|---|---|
| S1 | **Final Exam** | 45 minutes, closed book, cumulative: 20 questions + 2 SQL problems + 1 design question. **Gate for "Interview-ready": ≥ 70%.** Bank: `quizzes/final-exam.md` (sealed). |
| S2 | Capstone presentation | 10-minute presentation to me as a hiring manager, then 30 minutes of probing Q&A. |
| S3 | Mock interview | Live SQL (2 problems on an unseen schema, talking through your approach), then conceptual and scenario questions and 2 STAR stories from your capstone and labs. |
| S4 | Retrospective | Final score and level, gap list, resume bullets drafted from `work/`, a 2-week maintenance plan, and a SnowPro Core decision. **Shutdown:** export or commit everything, and suspend all warehouses and tasks before the trial ends. |

---

## Session count check

20 days × 4 sessions = **80 sessions × 45 minutes = 60 hours** of guided study, plus about 5 hours of optional extras. Assessments: a recall quiz at every S1 from Day 2 on, Stage Tests on Days 5, 10 and 15, and the Final Exam on Day 20.

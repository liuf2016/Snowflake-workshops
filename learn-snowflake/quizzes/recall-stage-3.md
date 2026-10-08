<!-- status: sealed -->
# Recall Bank — Stage 3 (Days 11–15)

Recall questions for Days 11–15, asked at the next day's S1: 4 from the previous day and 1 spaced question from earlier. Each answer is worth 0.2.

---

## Day 11 — Time Travel, Fail-safe, cloning

| # | Question | Key points (answer) |
|---|---|---|
| 11.1 | Maximum Time Travel retention on Enterprise vs. Standard edition. | Enterprise: up to 90 days for permanent objects. Standard: 1 day. |
| 11.2 | Fail-safe: how long, who can use it, and can you configure it? | 7 days (permanent tables), recovery **only through Snowflake Support**, not configurable. |
| 11.3 | Query table `t` as it was one hour ago. | `SELECT … FROM t AT(OFFSET => -3600)` (or `AT(TIMESTAMP => …)`). |
| 11.4 | Undo a bad `UPDATE` whose query ID you know. | `CREATE TABLE t_fix CLONE t BEFORE(STATEMENT => '<query_id>')`, then `ALTER TABLE t SWAP WITH t_fix` (or `INSERT OVERWRITE`). |
| 11.5 | `UNDROP TABLE t` fails because a new `t` already exists. What do you do? | Rename the new `t` first, then `UNDROP`. |
| 11.6 | Why is cloning a 10 TB table instant and nearly free? | A zero-copy clone copies metadata pointing to the same micro-partitions. Storage is only paid for partitions that change afterwards. |
| 11.7 | Time Travel and Fail-safe for transient tables. | Time Travel 0–1 day, **no** Fail-safe. |
| 11.8 | What is a micro-partition? | An immutable, columnar, compressed storage unit of about 50–500 MB uncompressed, with per-column min/max metadata used for pruning. |

## Day 12 — Modeling: views, materialized views, dynamic tables

| # | Question | Key points |
|---|---|---|
| 12.1 | What does "grain" mean for a fact table? Give the grain of your MLS fact. | What one row represents. Here: one row per MLS listing. |
| 12.2 | Fact vs. dimension. | Facts hold measurable events (price, DOM) with foreign keys. Dimensions hold descriptive context (location, property type, date). |
| 12.3 | Two restrictions of materialized views. | A single table (no joins), a limited set of functions, Enterprise only, and serverless maintenance cost. Any two. |
| 12.4 | What does `TARGET_LAG` mean on a dynamic table, and what does `DOWNSTREAM` mean? | The maximum staleness allowed versus its sources. DOWNSTREAM means refresh only when a downstream table needs it. |
| 12.5 | What does a secure view add? | It hides the view definition and blocks optimizations that could leak filtered data. Required for sharing views. |
| 12.6 | SCD Type 1 vs. Type 2. | Type 1 overwrites (no history). Type 2 adds a new row version with valid_from, valid_to and is_current. |
| 12.7 | When do you choose a dynamic table over streams + tasks? | Transformations that are declarative SELECTs: less code, automatic incremental refresh and dependency handling. Streams + tasks are for procedural logic or custom MERGE and side effects. |
| 12.8 | View vs. CTAS table for a dashboard used by 200 people hourly. | A table (or a dynamic table or MV): compute once and read many times. A view recomputes on every query. |

## Day 13 — Streams and tasks

| # | Question | Key points |
|---|---|---|
| 13.1 | The three metadata columns a stream adds. | `METADATA$ACTION`, `METADATA$ISUPDATE`, `METADATA$ROW_ID`. |
| 13.2 | When does a stream's offset advance? | When the stream is consumed in a DML statement that **commits** (a plain SELECT doesn't advance it). |
| 13.3 | When do you use an append-only stream? | Insert-only sources such as logs or raw landing tables. It's cheaper and ignores updates and deletes. |
| 13.4 | What makes a stream stale? | Its offset falls outside the source table's data retention (extended up to `MAX_DATA_EXTENSION_TIME_IN_DAYS`, 14 by default) because it wasn't consumed. |
| 13.5 | Why add `WHEN SYSTEM$STREAM_HAS_DATA('s')` to a task? | The task skips runs when there's nothing new, so no warehouse starts and no credits are spent. |
| 13.6 | Serverless vs. warehouse-backed tasks. | Serverless: Snowflake sizes the compute and bills per use, which suits short, frequent tasks. Warehouse-backed: uses your warehouse, which suits big jobs or shared warm warehouses. |
| 13.7 | A new task never runs. What's the usual reason? | Tasks are created **suspended**; run `ALTER TASK … RESUME` (in a DAG, resume the children before the root). |
| 13.8 | The clauses of `MERGE`. | `USING … ON …`, `WHEN MATCHED [AND …] THEN UPDATE / DELETE`, `WHEN NOT MATCHED THEN INSERT`. |

## Day 14 — Performance and Query Profile

| # | Question | Key points |
|---|---|---|
| 14.1 | Which two numbers in the Query Profile show pruning? | Partitions scanned vs. partitions total. |
| 14.2 | Local vs. remote spilling, and the fix. | Memory overflows to local SSD, then to remote storage (much slower). Fix: a bigger warehouse, or process less data (filter early, aggregate before joining). |
| 14.3 | What does clustering depth measure? | How much micro-partitions overlap for the clustering columns. Lower is better, and it predicts pruning. |
| 14.4 | When is a clustering key worth it? | A very large table (multi-TB), queries that filter on the same columns a lot, and pruning currently poor. Weigh it against automatic clustering credits (worse with high churn). |
| 14.5 | The Query Profile symptom of an exploding join. | A join whose output rows are much larger than its input rows: a missing or wrong join key, or a many-to-many relationship. |
| 14.6 | What is search optimization for? | Selective point lookups (equality or IN), substring and geo searches on large tables. It's a serverless-maintained access structure. |
| 14.7 | How do you rewrite `WHERE TO_CHAR(close_date, 'YYYY') = '2025'` to prune better? | `WHERE close_date >= '2025-01-01' AND close_date < '2026-01-01'`. |
| 14.8 | What does the query acceleration service do? | Offloads parts of eligible large scans to serverless compute, which helps outlier queries without resizing the warehouse. |

## Day 15 — Cost and governance

| # | Question | Key points |
|---|---|---|
| 15.1 | When are cloud services billed? | Only the part of daily cloud-services usage above 10% of daily warehouse compute. |
| 15.2 | Which ACCOUNT_USAGE view gives credits per warehouse over time? | `WAREHOUSE_METERING_HISTORY`. |
| 15.3 | How does a masking policy decide what to show? | It's evaluated at query time. The policy body usually checks `CURRENT_ROLE()` / `IS_ROLE_IN_SESSION()` and returns the real or masked value. |
| 15.4 | What does a row access policy return? | A BOOLEAN per row, often based on a mapping table of role → allowed values. |
| 15.5 | Two uses of object tags. | Classification (for example, PII), cost attribution, and tag-based masking policies. Any two. |
| 15.6 | What does `ACCESS_HISTORY` record? What would you use it for? | Which objects and columns each query read or wrote. Use it for audits, lineage, and finding unused tables. |
| 15.7 | Resource monitor vs. budget. | A resource monitor caps or suspends **warehouses** by credit quota. A budget tracks spend, including serverless, and notifies. |
| 15.8 | The three parts of table storage cost. | Active bytes, Time Travel bytes, and Fail-safe bytes. |

---

## Results

_(Filled in when released.)_

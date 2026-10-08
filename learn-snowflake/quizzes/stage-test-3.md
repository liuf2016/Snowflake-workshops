<!-- status: sealed -->
# Stage Test 3 — Platform Mastery

Day 15 · S3. 45 minutes, closed book, **100 points, pass ≥ 70.** Part A is 10 concept questions (5 points each, 50 total). Part B is a Query Profile diagnosis (25 points). Part C is a design question (25 points). Everything is answered in chat or in `work/day-15/stage-test.md`. Suggested split: 15 / 15 / 15 minutes.

---

## Part A — Concepts (50 points)

| # | Question | Key points (answer) | Pts |
|---|---|---|---|
| A1 | At 10:05 someone ran `DELETE FROM fct_listing` (no WHERE). It's now 11:30. Write the recovery, and say how you'd find the query. | Find the query ID in `QUERY_HISTORY` (filter on the query text). `CREATE TABLE fct_restore CLONE fct_listing BEFORE(STATEMENT => '<id>')`, then `ALTER TABLE fct_listing SWAP WITH fct_restore`. Verify the counts. | 5 |
| A2 | A clone of a 2 TB table was taken 30 days ago, and since then both sides have rewritten 40% of their partitions. What are you paying for? | The shared partitions once, plus each side's changed partitions (about 0.8 TB × 2), plus Time Travel and Fail-safe on the replaced partitions. | 5 |
| A3 | A materialized view, a dynamic table, or a scheduled CTAS for "daily median price by city, joined to a location dimension"? | A dynamic table (a join rules out the MV). TARGET_LAG = 1 day or DOWNSTREAM. A CTAS task is also acceptable if it's justified. | 5 |
| A4 | Your stream-driven task hasn't run for 3 weeks. What might have happened to the stream, and how do you recover? | The stream may be **stale**. Recreate it and reconcile with a full-refresh MERGE from the source (use Time Travel if it's within retention). | 5 |
| A5 | How do you build SCD2 with a stream + MERGE, in outline? | Changed rows: close the current version (set `valid_to`, `is_current = FALSE`), then insert the new version. Usually a MERGE on a union of "update" and "insert" rows, or two statements in one transaction. | 5 |
| A6 | Partitions scanned 9,800 of 10,000 on a query filtering `WHERE listing_date = '2026-06-01'`. Name two likely causes and two fixes. | Data isn't clustered by date, or there's a function or cast on the column. Fixes: a clustering key or rewriting the table sorted by date, and a sargable predicate. | 5 |
| A7 | Bytes spilled to remote storage = 40 GB on XS. What's the first change, and why? | Size up (for example, to M or L) so the sort or join fits in memory, and/or reduce the data before the heavy operator. Remote spills are an order of magnitude slower. | 5 |
| A8 | The bill doubled this month. List the first 4 queries or views you'd look at. | `WAREHOUSE_METERING_HISTORY` by warehouse and day, `QUERY_HISTORY` / `QUERY_ATTRIBUTION_HISTORY` for the top queries, serverless views (`AUTOMATIC_CLUSTERING_HISTORY`, `PIPE_USAGE_HISTORY`, `SERVERLESS_TASK_HISTORY`…), `METERING_DAILY_HISTORY` for cloud services, and storage (`DATABASE_STORAGE_USAGE_HISTORY`). | 5 |
| A9 | Write a masking policy so only `ENGINEER` sees `street_address`; everyone else sees `'***'`. | `CREATE MASKING POLICY addr_mask AS (v STRING) RETURNS STRING -> CASE WHEN IS_ROLE_IN_SESSION('ENGINEER') THEN v ELSE '***' END;` then `ALTER TABLE … MODIFY COLUMN street_address SET MASKING POLICY addr_mask;` | 5 |
| A10 | Masking policy vs. secure view vs. row access policy: which for (a) hiding a column value, (b) hiding rows, (c) sharing a filtered dataset externally? | (a) masking, (b) row access policy, (c) secure view (in a share). | 5 |

## Part B — Query Profile diagnosis (25 points)

A colleague's query takes 14 minutes on an **X-Small** warehouse:

```sql
SELECT *
FROM citibike.trips t
JOIN citibike.stations s ON s.name ILIKE t.start_station_name
WHERE TO_CHAR(t.starttime, 'YYYY-MM') = '2018-06'
ORDER BY t.tripduration DESC;
```

Profile summary:

| Operator | Stat |
|---|---|
| TableScan `TRIPS` | Partitions scanned **2,418 of 2,450** · 4.1 GB |
| TableScan `STATIONS` | 1 of 1 |
| Join (nested loop, ILIKE condition) | Input 61.5M × 1,100 rows → output **68.2M** rows |
| Sort | Bytes spilled to local storage **22 GB**, to remote **9 GB** |
| Result | 68.2M rows returned to the client |

**Task:** identify at least **4 distinct problems** and give a specific fix for each, then give the rewritten query. (5 points per problem and fix, up to 20, plus 5 for the rewrite.)

**Key:**
1. `TO_CHAR` on the filter column → no pruning. **Fix:** `t.starttime >= '2018-06-01' AND t.starttime < '2018-07-01'`.
2. A join on `ILIKE` → a nested loop and fan-out (output > input, so duplicate station matches). **Fix:** join on a key (a station id) or an exact normalized equality, and dedupe the dimension.
3. `SELECT *` → wide scan and a wide sort. **Fix:** project only the needed columns.
4. `ORDER BY` over 68M rows without a `LIMIT` → spills. **Fix:** add `LIMIT` if the goal is a top-N, and/or size up for this job.
5. 68M rows returned to the client → pointless transfer. **Fix:** aggregate or limit, or write to a table.
6. (Bonus) An XS warehouse for a heavy sort. **Fix:** a temporary resize, once the query itself is fixed.

## Part C — Design (25 points)

> Our brokerage gets a **daily MLS delta file** (new listings and price changes) in S3 at about 2 AM. Build a pipeline that: keeps **full price history** per listing; gives **East Bay analysts** access to only Alameda and Contra Costa rows; hides seller phone numbers from everyone but compliance; refreshes the "market pulse" dashboard by 7 AM; and never spends more than 5 credits a day. Describe the objects and the flow.

**Rubric (25):**
- **Ingestion (5):** storage integration + external stage + Snowpipe (auto-ingest) or a COPY task at 2:30 AM, into a RAW VARIANT table, with a file-format and error strategy.
- **Transformation (6):** a stream on RAW + a task MERGE into staging, plus an **SCD2** price-history dimension, *or* dynamic tables for the stateless parts. Justify the choice.
- **Serving (3):** marts / a dynamic table with the right TARGET_LAG, or a scheduled refresh before 7 AM; the dashboard reads a table, not a heavy view.
- **Security (5):** functional roles (analyst_east_bay, compliance) + a **row access policy** on county + a **masking policy** on phone + future grants.
- **Cost (4):** a dedicated XS/S warehouse, auto-suspend 60, a **resource monitor** at 5 credits/day on it, `WHEN SYSTEM$STREAM_HAS_DATA`, and a **budget** for serverless.
- **Operations (2):** monitoring (`TASK_HISTORY`, `COPY_HISTORY`, alerts) and backfill or replay from RAW.

---

## Results

_(Filled in when released.)_

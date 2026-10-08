<!-- status: sealed -->
# Final Exam — Cumulative

Day 20 · S1. 45 minutes, closed book, **100 points; ≥ 70 is required for the "Interview-ready" level.** Part A is 20 rapid-fire questions in chat (2 points each, 40 total). Part B is 2 SQL problems in your account (15 points each, 30 total), saved to `work/day-20/final.sql`. Part C is a design question (30 points). Suggested split: 12 / 18 / 15 minutes. Part A also includes the 3 Day 19 recall questions from `recall-stage-4.md` (ungraded here; they count as Day 19's recall).

---

## Part A — Rapid fire (40 points)

| # | Question | Key points (answer) |
|---|---|---|
| 1 | Snowflake's three layers in one breath. | Storage (micro-partitions), compute (warehouses), cloud services (brain: metadata, optimizer, security). |
| 2 | An M warehouse runs 90 minutes. How many credits? | 4 × 1.5 = 6. |
| 3 | Which cache survives a warehouse suspend? | The result cache. |
| 4 | Scale up or scale out when queries **queue**? | Out (multi-cluster). |
| 5 | Minimum grants to query a table. | USAGE on the database and schema, SELECT on the table, USAGE on a warehouse. |
| 6 | Which system role should own most databases? | SYSADMIN (or custom roles rolled up to it). |
| 7 | `TRY_TO_DATE('13/45/2026', 'MM/DD/YYYY')` returns? | NULL. |
| 8 | Why did a re-run `COPY` load nothing? | 64-day load metadata. |
| 9 | Stage reference for a table stage. | `@%table_name`. |
| 10 | Keep JSON array elements as separate rows on load. | `STRIP_OUTER_ARRAY = TRUE`. |
| 11 | Explode an array but keep parents with empty arrays. | `FLATTEN(…, OUTER => TRUE)`. |
| 12 | Filter on a window function result. | `QUALIFY`. |
| 13 | Grouping sets produced by `ROLLUP(a, b)`. | (a, b), (a), (). |
| 14 | Recover a table dropped yesterday. | `UNDROP TABLE t` (within Time Travel retention). |
| 15 | Why is a clone instant? | It shares micro-partitions through metadata (zero-copy). |
| 16 | MV vs. dynamic table: which one supports joins? | Dynamic table. |
| 17 | What advances a stream's offset? | Consuming it in a committed DML statement. |
| 18 | The Query Profile sign of bad pruning. | Partitions scanned ≈ partitions total. |
| 19 | Show a column's real value only to role X. | A masking policy that checks `IS_ROLE_IN_SESSION('X')`. |
| 20 | Where does Snowpark DataFrame logic execute? | In the warehouse, as generated SQL (pushdown). |

## Part B — SQL (30 points)

### Setup (untimed)

```sql
USE SCHEMA learn_db.staging;
CREATE OR REPLACE TEMPORARY TABLE fx_events AS
SELECT PARSE_JSON(column1) AS doc FROM VALUES
  ('{"mls":"A1","events":[{"ts":"2026-01-02","price":1000000},{"ts":"2026-02-01","price":950000},{"ts":"2026-03-01","price":900000}]}'),
  ('{"mls":"B2","events":[{"ts":"2026-01-10","price":800000},{"ts":"2026-01-25","price":820000}]}'),
  ('{"mls":"C3","events":[{"ts":"2026-02-05","price":1200000}]}');
```

**B1 (15). Top 2 cities per county.** On your MLS data, over the most recent 12 months of sales: cities with ≥ 50 sales, their median sale price and median days on market, and their price rank within the county. Return the top 2 per county. Include one sentence of insight you'd put on a slide.

**B2 (15). Price-change history.** On `fx_events`: for each listing, the first price, the latest price, the number of price changes, and the % change from first to latest (rounded to 1 decimal).
*Expected:* A1 → 1,000,000 → 900,000, 2 changes, −10.0% · B2 → 800,000 → 820,000, 1 change, +2.5% · C3 → 1,200,000 → 1,200,000, 0 changes, 0.0%.

```sql
-- Key B2
WITH e AS (
  SELECT doc:mls::STRING AS mls, f.value:ts::DATE AS ts, f.value:price::NUMBER AS price
  FROM fx_events, LATERAL FLATTEN(input => doc:events) f
)
SELECT mls,
       MIN_BY(price, ts) AS first_price,
       MAX_BY(price, ts) AS latest_price,
       COUNT(*) - 1      AS price_changes,
       ROUND(100 * (MAX_BY(price, ts) - MIN_BY(price, ts)) / MIN_BY(price, ts), 1) AS pct_change
FROM e GROUP BY mls ORDER BY mls;
-- FIRST_VALUE/LAST_VALUE windows + QUALIFY are equally acceptable.
```

**B1 grading:** a correct 12-month anchor on the data's max date (3), the ≥ 50 filter via HAVING (3), MEDIAN not AVG (3), RANK/ROW_NUMBER partitioned by county with QUALIFY ≤ 2 (4), a sensible insight sentence (2).

## Part C — Design (30 points)

> You join a 60-person company as its second data analyst. They have a Snowflake account that one engineer set up 2 years ago: everyone uses `ACCOUNTADMIN`, one Large warehouse runs 24/7 for everything, dashboards query raw JSON through views, and the bill is $38k/month. Your manager asks for a **30/60/90-day plan** to cut cost, reduce risk and make analytics trustworthy. What do you do, in what order, and how do you measure success?

**Rubric (30):**
- **Days 1–30, stop the bleeding (10):** measure first (`WAREHOUSE_METERING_HISTORY`, `QUERY_HISTORY`, top queries, idle time). Auto-suspend 60 s, split workloads into right-sized warehouses (ELT / BI / ad hoc), resource monitors and budgets. Move people off ACCOUNTADMIN: functional and access roles, MFA, and ACCOUNTADMIN kept for 2 named admins.
- **Days 31–60, structure (10):** a layered RAW → STAGING → MARTS design, typed tables or dynamic tables instead of JSON views for the dashboards, dbt with tests, and query tags for attribution.
- **Days 61–90, trust and governance (6):** data quality tests and alerts, masking and row access for PII, documentation and lineage, and a dashboard SLA.
- **Metrics (4):** $/month (target: a specific %), dashboard p95 latency, number of ACCOUNTADMIN users, test coverage and failures, and stakeholder adoption.

---

## Results

_(Filled in when released: score, time, gaps. This file closes the course's assessment record.)_

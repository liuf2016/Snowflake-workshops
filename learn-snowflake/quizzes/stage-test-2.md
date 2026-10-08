<!-- status: sealed -->
# Stage Test 2 — Loading and Analytical SQL

Day 10 · S3. 45 minutes, closed book, **100 points, pass ≥ 70.** Part A is 10 concept questions in chat (4 points each, 40 total). Part B is 6 SQL problems in your account (10 points each, 60 total), saved to `work/day-10/stage-test.sql`. Suggested split: 10 minutes for A, 35 for B.

Part B uses **your own** `STAGING.MLS_LISTINGS` from Day 7 (use your column names) plus two small tables created by the setup script. Run the setup first; it doesn't count against your time.

---

## Part A — Concepts (40 points)

| # | Question | Key points (answer) |
|---|---|---|
| A1 | A vendor re-sends yesterday's file under the **same name** with corrected rows. Your nightly `COPY` loads 0 rows. Explain, and give a safe fix. | Load metadata skips already-loaded file names. Safe fix: delete or replace the affected rows (a MERGE on the key) and then `COPY … FORCE = TRUE` for that file only, or ask the vendor to use a new file name. Blindly FORCE-ing everything gives duplicates. |
| A2 | `ON_ERROR = CONTINUE` vs. `SKIP_FILE` in a financial load. Which do you choose, and why? | Usually `SKIP_FILE` or `ABORT`: a partial file silently loses rows. CONTINUE is fine for exploratory or raw loads *if* you monitor rejects. |
| A3 | Why does `v:price` compare wrongly with `> 1000000` when it holds `"1,200,000"`? | It's a VARIANT **string**. Clean and cast first: `TRY_TO_NUMBER(REPLACE(v:price::STRING, ',', ''))`. |
| A4 | Write the `FLATTEN` call that explodes `doc:items` and keeps orders whose items array is **empty**. | `LATERAL FLATTEN(input => doc:items, OUTER => TRUE)`. |
| A5 | Snowpipe vs. a scheduled COPY task, for 2,000 small files a day arriving all day long. | Snowpipe: event-driven, serverless, low latency, no warehouse kept awake. |
| A6 | Why keep a RAW layer at all, rather than loading straight into clean tables? | Replayability and auditability: you can reprocess after a logic fix, and the source schema changes don't break the load. |
| A7 | `ROW_NUMBER` vs. `RANK` for "top 1 per group": when does the choice matter? | With ties: ROW_NUMBER picks exactly one row (arbitrary unless you add a tie-breaker); RANK returns all the tied rows. |
| A8 | What's the default window frame of `SUM(x) OVER (ORDER BY d)`, and how can it surprise you? | Cumulative: `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Rows with the same `d` are added together, so the running total jumps. Use `ROWS` to go row by row. |
| A9 | `MEDIAN` vs. `APPROX_PERCENTILE(x, 0.5)`. | Exact vs. an approximate estimate. The approximate one is cheaper at huge scale. |
| A10 | Two ways to pivot a city × quarter table, and the drawback of static `PIVOT`. | `PIVOT (… FOR q IN (…))` / `IN (ANY ORDER BY …)`, or conditional aggregation `SUM(IFF(q = 'Q1', x, 0))`. A static IN list must be edited when new values appear. |

## Part B — SQL (60 points)

### Setup (run first; untimed)

```sql
USE SCHEMA learn_db.staging;

CREATE OR REPLACE TEMPORARY TABLE st2_events AS
SELECT column1 AS user_id, column2::TIMESTAMP_NTZ AS ts FROM VALUES
  ('u1','2026-01-01 09:00'), ('u1','2026-01-01 09:10'), ('u1','2026-01-01 10:05'), ('u1','2026-01-01 10:20'),
  ('u2','2026-01-01 08:00'), ('u2','2026-01-01 08:45'), ('u2','2026-01-01 08:50');

CREATE OR REPLACE TEMPORARY TABLE st2_orders AS
SELECT PARSE_JSON(column1) AS doc FROM VALUES
  ('{"order_id":1,"customer":"A","items":[{"sku":"X1","qty":2},{"sku":"Y9","qty":1}]}'),
  ('{"order_id":2,"customer":"B","items":[{"sku":"X1","qty":5}]}'),
  ('{"order_id":3,"customer":"A","items":[]}');
```

### Problems

**B1 (10). Top city per county.** For each county, the city with the highest **median sale price** over the most recent 12 months in your data (anchor on `MAX(close_date)`, not today). Only cities with at least 20 sales. One row per county.

**B2 (10). Monthly market pulse.** For each close month in 2025–2026: the number of sales, the median sale-to-list ratio, and the month-over-month change in that median ratio (in percentage points).

**B3 (10). Deduplicate relists.** The same `street_address + zip` can appear under several MLS numbers. Keep only the most recent listing per address (by listing date; break ties by MLS number) and report how many rows were removed.

**B4 (10). Sessionize.** On `st2_events`, a new session starts after a gap of **more than 30 minutes**. Per user: the number of sessions and the average session length in minutes (last event − first event).
*Expected:* u1 → 2 sessions, avg 12.5 · u2 → 2 sessions, avg 2.5.

**B5 (10). Subtotals.** TPCH_SF1: revenue by region and nation with nation subtotals, region subtotals and a grand total. Label the subtotal rows (`'ALL NATIONS'`, `'ALL REGIONS'`) using `GROUPING()`, not `COALESCE`.

**B6 (10). Semi-structured.** On `st2_orders`: total quantity per SKU, and separately the number of orders with no items. *Expected:* X1 = 7, Y9 = 1; 1 empty order.

### Answer key — Part B

```sql
-- B1 (column names are illustrative; the student's own staging names apply)
WITH recent AS (
  SELECT * FROM staging.mls_listings
  WHERE status = 'Sold'
    AND close_date > (SELECT DATEADD('month', -12, MAX(close_date)) FROM staging.mls_listings)
)
SELECT county, city, MEDIAN(sale_price) AS median_price, COUNT(*) AS sales
FROM recent
GROUP BY county, city
HAVING COUNT(*) >= 20
QUALIFY ROW_NUMBER() OVER (PARTITION BY county ORDER BY MEDIAN(sale_price) DESC) = 1;

-- B2
WITH m AS (
  SELECT DATE_TRUNC('month', close_date) AS mon,
         COUNT(*) AS sales,
         MEDIAN(sale_price / NULLIF(list_price, 0)) AS med_ratio
  FROM staging.mls_listings
  WHERE status = 'Sold' AND close_date >= '2025-01-01' AND close_date < '2027-01-01'
  GROUP BY 1
)
SELECT mon, sales, med_ratio,
       (med_ratio - LAG(med_ratio) OVER (ORDER BY mon)) * 100 AS mom_change_pp
FROM m ORDER BY mon;

-- B3
CREATE OR REPLACE TEMPORARY TABLE mls_dedup AS
SELECT * FROM staging.mls_listings
QUALIFY ROW_NUMBER() OVER (PARTITION BY street_address, zip ORDER BY listing_date DESC, mls_num DESC) = 1;
SELECT (SELECT COUNT(*) FROM staging.mls_listings) - (SELECT COUNT(*) FROM mls_dedup) AS rows_removed;

-- B4
WITH f AS (
  SELECT user_id, ts,
         IFF(COALESCE(DATEDIFF('minute', LAG(ts) OVER (PARTITION BY user_id ORDER BY ts), ts), 999) > 30, 1, 0) AS new_session
  FROM st2_events
), s AS (
  SELECT *, SUM(new_session) OVER (PARTITION BY user_id ORDER BY ts ROWS UNBOUNDED PRECEDING) AS session_id FROM f
), per_session AS (
  SELECT user_id, session_id, DATEDIFF('minute', MIN(ts), MAX(ts)) AS len_min FROM s GROUP BY 1, 2
)
SELECT user_id, COUNT(*) AS sessions, AVG(len_min) AS avg_len_min FROM per_session GROUP BY 1 ORDER BY 1;

-- B5
SELECT IFF(GROUPING(r.r_name) = 1, 'ALL REGIONS', r.r_name) AS region,
       IFF(GROUPING(n.n_name) = 1, 'ALL NATIONS', n.n_name) AS nation,
       SUM(l.l_extendedprice * (1 - l.l_discount)) AS revenue
FROM snowflake_sample_data.tpch_sf1.lineitem l
JOIN snowflake_sample_data.tpch_sf1.orders   o ON o.o_orderkey  = l.l_orderkey
JOIN snowflake_sample_data.tpch_sf1.customer c ON c.c_custkey   = o.o_custkey
JOIN snowflake_sample_data.tpch_sf1.nation   n ON n.n_nationkey = c.c_nationkey
JOIN snowflake_sample_data.tpch_sf1.region   r ON r.r_regionkey = n.n_regionkey
GROUP BY ROLLUP (r.r_name, n.n_name)
ORDER BY GROUPING(r.r_name), region, GROUPING(n.n_name), nation;

-- B6
SELECT i.value:sku::STRING AS sku, SUM(i.value:qty::INT) AS total_qty
FROM st2_orders o, LATERAL FLATTEN(input => o.doc:items) i
GROUP BY 1 ORDER BY 1;
SELECT COUNT_IF(ARRAY_SIZE(doc:items) = 0) AS empty_orders FROM st2_orders;
```

**Grading notes:** B1 anchored on `CURRENT_DATE` instead of the data's max date: −3. B2 using AVG instead of MEDIAN: −3. B3 without a deterministic tie-breaker: −2. B4 with the wrong threshold (`>=` vs `>`) or no running sum: −5. B5 using COALESCE labels: −4 (they break if a real NULL exists).

---

## Results

_(Filled in when released.)_

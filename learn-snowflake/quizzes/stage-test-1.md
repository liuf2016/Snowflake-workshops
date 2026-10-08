<!-- status: sealed -->
# Stage Test 1 — Foundations

Day 5 · S3. 45 minutes, closed book, **100 points, pass ≥ 70.** Part A is 15 concept questions answered in chat (4 points each, 60 total). Part B is 5 hands-on tasks in your account (8 points each, 40 total), saved to `work/day-05/stage-test.sql`. Suggested split: 20 minutes for A, 25 for B.

---

## Part A — Concepts (60 points)

| # | Question | Key points (answer) | Pts |
|---|---|---|---|
| A1 | Name the three layers and say how each one is billed. | Storage: per TB per month. Compute (warehouses): credits per second while running, 60-second minimum. Cloud services: free up to 10% of daily compute. | 4 |
| A2 | In a legacy warehouse the nightly ELT slows the 9am dashboards. Why, and how does Snowflake fix it? | The legacy system shares one compute pool between workloads. In Snowflake, separate warehouses for ELT and BI read the same storage without contention. | 4 |
| A3 | List credits per hour from XS to 2XL. | 1, 2, 4, 8, 16, 32. | 4 |
| A4 | An XS warehouse has `AUTO_SUSPEND = 60`. It runs three 10-second queries 5 minutes apart. About how much compute time is billed, and roughly how many credits? | Each resume: 10 s of work + 60 s idle before suspend = 70 s (above the 60-second minimum). × 3 = 210 s ≈ **0.058 credits**. | 4 |
| A5 | Give three conditions for a result-cache hit. | Same query text, data unchanged, deterministic functions only, same role privileges, cache enabled. Any three. | 4 |
| A6 | A single month-end report takes 40 minutes on S and **spills to remote storage**. Nobody else is querying. Scale up or out? | **Scale up**. The problem is memory for one complex query, not concurrency. | 4 |
| A7 | Which of these need a running warehouse: (a) `SELECT COUNT(*) FROM t`, (b) `SELECT MIN(order_date) FROM t`, (c) `SELECT AVG(price) FROM t`, (d) `SHOW TABLES`? | Only **(c)**. (a), (b) and (d) are answered from metadata or cloud services. | 4 |
| A8 | Can a resource monitor stop serverless features (Snowpipe, automatic clustering) from spending? | **No.** Resource monitors control warehouse credits only. Serverless spend is watched with **budgets**. | 4 |
| A9 | Draw the default system-role hierarchy (which role inherits which). | ACCOUNTADMIN ⊃ SECURITYADMIN ⊃ USERADMIN; ACCOUNTADMIN ⊃ SYSADMIN ⊃ custom roles; PUBLIC granted to all. | 4 |
| A10 | Give two reasons not to work as ACCOUNTADMIN day to day. | Blast radius, objects owned by the top role, bypassing least privilege, and it breaks the auditability of normal roles. Any two. | 4 |
| A11 | What problem do future grants solve, and which wins, a schema-level or a database-level future grant? | New tables automatically get grants, so a new table doesn't break analysts' access. **Schema-level** takes precedence. | 4 |
| A12 | The key-pair setup steps, from key generation to a working CLI connection. | `openssl` generates a private key (PKCS#8) and a public key → `ALTER USER SET RSA_PUBLIC_KEY` → the connection config points to the private-key file with the authenticator set for key-pair (`SNOWFLAKE_JWT`) → `snow connection test`. | 4 |
| A13 | The CLI command to run a SQL file against connection `learn`. | `snow sql -f file.sql -c learn`. | 4 |
| A14 | What's stored for `CREATE TABLE sales_2026 (Amount NUMBER)`? The table and column names, exactly. | `SALES_2026`, `AMOUNT` (upper-cased because they're unquoted). | 4 |
| A15 | Give a good use for a transient table, and its cost trade-off. | Staging or intermediate data you can rebuild. It saves storage because there's no Fail-safe and at most 1 day of Time Travel, but you lose recoverability. | 4 |

## Part B — Hands-on (40 points)

Do these in your account. Save all SQL with comments in `work/day-05/stage-test.sql`. Say "done B1" and so on as you finish each one, so I can check.

**B1 (8).** Create warehouse `ST1_WH`: X-Small, auto-suspend 60, auto-resume, initially suspended, statement timeout 300 seconds. Show evidence (`SHOW WAREHOUSES LIKE 'ST1_WH'` plus the parameter).

**B2 (8).** Create role `ST1_ANALYST` with **read-only** access to every current *and future* table in `LEARN_DB.STAGING`, and usage on `ST1_WH`. Grant it to yourself and to `SYSADMIN`. Prove it works: a `SELECT` succeeds and an `INSERT` fails.

**B3 (8).** From `SNOWFLAKE_SAMPLE_DATA.TPCH_SF1`: the **top 3 nations** by revenue in order year 1995, where revenue = `SUM(l_extendedprice * (1 - l_discount))` and the nation is the customer's nation.

**B4 (8).** List **your 5 longest-running queries of the last hour** with their query ID, warehouse and elapsed seconds, using the `INFORMATION_SCHEMA.QUERY_HISTORY` table function.

**B5 (8).** Run this as-is, then write **one query** that returns each raw value, its cleaned `NUMBER`, and a total count of values that failed to convert. No query errors are allowed.

```sql
CREATE OR REPLACE TEMPORARY TABLE st1_raw AS
SELECT column1 AS raw_amount FROM VALUES ('1,234'), ('$56'), ('n/a'), (''), ('7890'), (NULL);
```

**Cleanup (required, 0 points):** `DROP WAREHOUSE st1_wh; DROP ROLE st1_analyst;`

### Answer key — Part B

```sql
-- B1
USE ROLE SYSADMIN;
CREATE OR REPLACE WAREHOUSE st1_wh WAREHOUSE_SIZE = XSMALL AUTO_SUSPEND = 60 AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = TRUE STATEMENT_TIMEOUT_IN_SECONDS = 300;
SHOW WAREHOUSES LIKE 'ST1_WH';
SHOW PARAMETERS LIKE 'STATEMENT_TIMEOUT_IN_SECONDS' IN WAREHOUSE st1_wh;

-- B2
USE ROLE SECURITYADMIN;
CREATE ROLE IF NOT EXISTS st1_analyst;
GRANT USAGE ON DATABASE learn_db TO ROLE st1_analyst;
GRANT USAGE ON SCHEMA learn_db.staging TO ROLE st1_analyst;
GRANT SELECT ON ALL TABLES IN SCHEMA learn_db.staging TO ROLE st1_analyst;
GRANT SELECT ON FUTURE TABLES IN SCHEMA learn_db.staging TO ROLE st1_analyst;
GRANT USAGE ON WAREHOUSE st1_wh TO ROLE st1_analyst;
GRANT ROLE st1_analyst TO ROLE sysadmin;
GRANT ROLE st1_analyst TO USER <me>;
USE ROLE st1_analyst; USE WAREHOUSE st1_wh;
SELECT * FROM learn_db.staging.bay_area_cities;            -- works
INSERT INTO learn_db.staging.bay_area_cities VALUES ('x','y','0');  -- fails: insufficient privileges

-- B3
SELECT n.n_name, SUM(l.l_extendedprice * (1 - l.l_discount)) AS revenue
FROM snowflake_sample_data.tpch_sf1.orders   o
JOIN snowflake_sample_data.tpch_sf1.lineitem l ON l.l_orderkey = o.o_orderkey
JOIN snowflake_sample_data.tpch_sf1.customer c ON c.c_custkey  = o.o_custkey
JOIN snowflake_sample_data.tpch_sf1.nation   n ON n.n_nationkey = c.c_nationkey
WHERE YEAR(o.o_orderdate) = 1995            -- better for pruning: o_orderdate >= '1995-01-01' AND < '1996-01-01'
GROUP BY n.n_name
ORDER BY revenue DESC
LIMIT 3;

-- B4 (needs a current database for INFORMATION_SCHEMA to resolve)
USE DATABASE learn_db;
SELECT query_id, warehouse_name, total_elapsed_time / 1000 AS elapsed_s, LEFT(query_text, 80) AS q
FROM TABLE(information_schema.query_history(
       end_time_range_start => DATEADD('hour', -1, CURRENT_TIMESTAMP()),
       result_limit => 1000))
ORDER BY total_elapsed_time DESC
LIMIT 5;

-- B5
SELECT raw_amount,
       TRY_TO_NUMBER(REGEXP_REPLACE(raw_amount, '[$,]', '')) AS amount,
       COUNT_IF(NULLIF(raw_amount, '') IS NOT NULL
                AND TRY_TO_NUMBER(REGEXP_REPLACE(raw_amount, '[$,]', '')) IS NULL) OVER () AS failed_conversions
FROM st1_raw;
-- failed_conversions = 1 ('n/a'); '' and NULL are "missing", not "failed". Say so to earn full marks.
```

**Grading notes:** in B2, missing the future grant costs 3 points and missing the grant to SYSADMIN costs 2. In B3, `YEAR()` on the column is accepted; mentioning the range predicate earns a +1 bonus (capped at 8). In B5, treating `''`/NULL as failures costs 2.

---

## Results

_(Filled in when released: score, time taken, missed topics, retake if any.)_

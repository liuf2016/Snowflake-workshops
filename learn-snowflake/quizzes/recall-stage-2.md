<!-- status: sealed -->
# Recall Bank — Stage 2 (Days 6–10)

Recall questions for Days 6–10, asked at the next day's S1: 4 from the previous day and 1 spaced question from earlier. Each answer is worth 0.2.

---

## Day 06 — Loading I: stages, file formats, COPY

| # | Question | Key points (answer) |
|---|---|---|
| 6.1 | Name the four kinds of stage and how you reference each. | User `@~`, table `@%tablename`, named internal `@name`, external `@name` (backed by an S3, GCS or Azure URL). |
| 6.2 | What does `VALIDATION_MODE = RETURN_ERRORS` do? | Checks the files and returns the errors **without loading anything**. |
| 6.3 | You re-ran a `COPY` and 0 files loaded. Why? How would you force a reload, and what's the risk? | Load metadata remembers loaded files for 64 days. `FORCE = TRUE` reloads them, and the risk is **duplicate rows**. |
| 6.4 | `ON_ERROR` options, and the default for `COPY`. | `ABORT_STATEMENT` (the COPY default), `CONTINUE`, `SKIP_FILE`, `SKIP_FILE_<n>` / `<n>%`. |
| 6.5 | Recommended file size for loading. | About 100–250 MB **compressed**. Many small files add overhead; one huge file can't be split across threads. |
| 6.6 | What does `PUT` do besides uploading? | Compresses (gzip, `AUTO_COMPRESS = TRUE`) and encrypts the file. |
| 6.7 | How do you see the rejected rows of the last `COPY`? | `SELECT * FROM TABLE(VALIDATE(<table>, JOB_ID => '_last'))`. `COPY_HISTORY` also works for file-level status. |
| 6.8 | What does `PURGE = TRUE` do? | Deletes the staged files after a successful load. |

## Day 07 — Loading II: semi-structured data

| # | Question | Key points |
|---|---|---|
| 7.1 | How do you select the `Sale Price` key from VARIANT column `v`? | `v:"Sale Price"`. Double quotes are needed because of the space, and keys are case-sensitive. |
| 7.2 | `v:city` shows `"Piedmont"` with quotes. How do you get a plain string? | Cast it: `v:city::STRING` (or `::VARCHAR`). |
| 7.3 | What does `STRIP_OUTER_ARRAY = TRUE` do? | Loads each element of a top-level JSON array as its own row, instead of the whole array as one value. |
| 7.4 | Name three output columns of `FLATTEN`. | `SEQ`, `KEY`, `PATH`, `INDEX`, `VALUE`, `THIS`. Any three. |
| 7.5 | What do `INFER_SCHEMA` and `USING TEMPLATE` do together? | Detect column names and types from staged files (Parquet/Avro/ORC/CSV/JSON) and create a table with those columns. |
| 7.6 | Clean `'$2,995,000'` into a number safely. | `TRY_TO_NUMBER(REGEXP_REPLACE(x, '[$,]', ''))`, or `TRY_TO_NUMBER(x, '$9,999,999,999')`. |
| 7.7 | Parse `'06/05/2026'` as a date safely. | `TRY_TO_DATE(x, 'MM/DD/YYYY')`. |
| 7.8 | Split `'4\|1'` into full and half baths. | `SPLIT_PART(x, '\|', 1)::INT`, `SPLIT_PART(x, '\|', 2)::INT` (use TRY_ versions for safety). |
| 7.9 | One advantage and one cost of keeping data as VARIANT (schema-on-read). | Advantage: absorbs source schema changes and loads fast. Cost: types aren't enforced, every query needs casts, and errors surface later. |

## Day 08 — Loading III: external stages, Snowpipe, incremental loads

| # | Question | Key points |
|---|---|---|
| 8.1 | Why use a storage integration instead of putting keys in the stage? | No secrets in SQL, an IAM role is delegated to Snowflake, admins control the allowed locations, and rotation is easy. |
| 8.2 | How is Snowpipe triggered with `AUTO_INGEST = TRUE`? | Cloud event notifications (for example, S3 → SQS) tell the pipe about new files. |
| 8.3 | Does Snowpipe use your warehouse? | No. It runs on **serverless**, Snowflake-managed compute, billed separately. |
| 8.4 | Snowpipe vs. a scheduled `COPY` task: when do you pick each? | Snowpipe: continuous, low-latency, many small files. Scheduled COPY: batch windows, predictable large loads, and the warehouse is already running. |
| 8.5 | What does `SYSTEM$PIPE_STATUS` tell you? | The pipe's execution state, the pending file count, and the last ingested file and time. |
| 8.6 | How long is load history kept for Snowpipe vs. bulk `COPY`? | Snowpipe: 14 days. COPY: 64 days. |
| 8.7 | External table vs. loaded table. | An external table queries files where they are (read-only, slower, no storage cost). A loaded table has micro-partitions, is fast, and supports full DML. |
| 8.8 | What does the `PATTERN` option of `COPY` take? | A **regular expression** matched against the file paths. |

## Day 09 — Analytical SQL I: windows, QUALIFY, dates

| # | Question | Key points |
|---|---|---|
| 9.1 | What does `QUALIFY` do? | Filters rows on the result of a window function, the way `HAVING` does for aggregates. |
| 9.2 | Top 3 homes by price per city, without a subquery. | `… QUALIFY ROW_NUMBER() OVER (PARTITION BY city ORDER BY price DESC) <= 3`. |
| 9.3 | Values 100, 100, 90 ordered descending. What's the RANK and the DENSE_RANK of 90? | RANK = 3, DENSE_RANK = 2. |
| 9.4 | `ROWS` vs. `RANGE` frames. | ROWS counts physical rows. RANGE groups rows with equal ORDER BY values (peers are included together). |
| 9.5 | Monthly series: which function and argument give year-over-year? | `LAG(metric, 12) OVER (PARTITION BY … ORDER BY month)`. |
| 9.6 | Why a median instead of an average for home prices? | Prices are right-skewed, so a few mansions distort the average. |
| 9.7 | Days from listing to close; first day of the month. | `DATEDIFF('day', listing_date, close_date)`; `DATE_TRUNC('month', d)`. |
| 9.8 | Deduplicate, keeping the latest row per MLS number. | `QUALIFY ROW_NUMBER() OVER (PARTITION BY mls_num ORDER BY status_change_ts DESC) = 1`. |

## Day 10 — Analytical SQL II

| # | Question | Key points |
|---|---|---|
| 10.1 | Which grouping sets does `ROLLUP(a, b)` produce? | `(a, b)`, `(a)`, `()`. |
| 10.2 | What does `GROUPING(col)` return? | 1 when the row is a subtotal over `col` (col rolled up), otherwise 0. It separates subtotal NULLs from real NULLs. |
| 10.3 | How does `CUBE(a, b)` differ from `ROLLUP(a, b)`? | CUBE adds `(b)` too: every combination. |
| 10.4 | The gaps-and-islands trick. | `value − ROW_NUMBER()` (or date − row_number) is constant within a consecutive run, so group by it. |
| 10.5 | Sessionization steps. | `LAG` the timestamp → flag a new session when the gap exceeds the threshold → a running `SUM` of the flags gives the session id. |
| 10.6 | `APPROX_COUNT_DISTINCT`: the algorithm, and when to use it. | HyperLogLog, with an error of about 1–2%. Use it for huge cardinalities where exactness isn't needed (dashboards). |
| 10.7 | `LISTAGG` vs. `ARRAY_AGG`. | LISTAGG returns a delimited string; ARRAY_AGG returns an ARRAY (VARIANT). Both accept `WITHIN GROUP (ORDER BY …)`. |
| 10.8 | `UNION` vs. `UNION ALL`. | UNION removes duplicates (an extra sort or hash); UNION ALL keeps every row and is faster. |

---

## Results

_(Filled in when released.)_

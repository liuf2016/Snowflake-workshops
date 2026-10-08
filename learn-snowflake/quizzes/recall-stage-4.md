<!-- status: sealed -->
# Recall Bank — Stage 4 (Days 16–19)

Recall questions for Days 16–19, asked at the next day's S1: 4 from the previous day and 1 spaced question from earlier. Each answer is worth 0.2. Day 19's recall happens in Day 20 · S1, inside the Final Exam.

---

## Day 16 — Snowpark Python

| # | Question | Key points (answer) |
|---|---|---|
| 16.1 | What does "lazy evaluation" mean in Snowpark? | Transformations only build a query plan. Nothing runs until an **action** (`collect`, `show`, `count`, `to_pandas`, `save_as_table`) is called. |
| 16.2 | Where does the heavy work in a Snowpark DataFrame pipeline run? | In a Snowflake **warehouse**: the DataFrame compiles to SQL (pushdown). The client only sends plans and receives results. |
| 16.3 | How do you see the SQL Snowpark generates? | `df.queries` or `df.explain()`. |
| 16.4 | UDF vs. stored procedure. | A UDF returns a value per row (or a table, for a UDTF) inside a query. A stored procedure runs procedural logic, can execute SQL and DDL, and is `CALL`ed. |
| 16.5 | What's a vectorized UDF, and why is it faster? | It receives batches as pandas Series/DataFrames instead of single rows, so there's less per-row overhead and it can use vectorized libraries. |
| 16.6 | Where do third-party Python packages for UDFs come from? | The Snowflake Anaconda channel (`packages=[…]`), or staged files/wheels as imports. |
| 16.7 | When is `to_pandas()` a bad idea? | On large results: it pulls everything to client memory and loses the pushdown, governance and scale. |

## Day 17 — dbt with Snowflake

| # | Question | Key points |
|---|---|---|
| 17.1 | What does `ref()` give you? | Resolves the model's relation per environment and builds the **dependency graph** (DAG) that sets run order and lineage. |
| 17.2 | `source()` vs. `ref()`. | `source()` points to raw tables that dbt doesn't build (with freshness checks). `ref()` points to other dbt models. |
| 17.3 | Name dbt's four materializations. | view, table, incremental, ephemeral (plus materialized_view / dynamic_table on some adapters). |
| 17.4 | How does an incremental model avoid reprocessing everything? | `{% if is_incremental() %} WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }}) {% endif %}`, with a `unique_key` to merge. |
| 17.5 | The four built-in generic tests. | unique, not_null, accepted_values, relationships. |
| 17.6 | `dbt run` vs. `dbt build`. | `run` only builds models. `build` runs models, tests, seeds and snapshots in DAG order and stops downstream work when a test fails. |
| 17.7 | What does a dbt snapshot implement? | SCD Type 2 history of a source table (the timestamp or check strategy). |

## Day 18 — Streamlit, Cortex, data sharing, Marketplace

| # | Question | Key points |
|---|---|---|
| 18.1 | Where does a Streamlit-in-Snowflake app run, and whose permissions does it use? | Inside Snowflake, on a warehouse, with the app owner's role (owner's rights). The data doesn't leave Snowflake. |
| 18.2 | How does secure data sharing work without copying data? | The provider grants a share of its objects; the consumer mounts it as a read-only database over the **same storage**. |
| 18.3 | Who pays for compute when a consumer queries a share? | The **consumer**, with their own warehouse. For reader accounts, the provider pays. |
| 18.4 | What's a reader account? | A provider-managed account for a consumer who isn't a Snowflake customer. |
| 18.5 | How are Cortex AI functions billed? | Serverless, by **tokens** processed (input and output), which varies by model. |
| 18.6 | Name one good and one bad use of an LLM function in an analytics pipeline. | Good: classifying or extracting from free text, summarizing. Bad: computing numbers or aggregations that SQL does deterministically and more cheaply. |
| 18.7 | What does the Marketplace give an analyst? | Ready-to-query third-party datasets (for example, economic or demographic data) available as shares: no ETL, always current. |

## Day 19 — Capstone build (asked in the Final Exam's S1)

| # | Question | Key points |
|---|---|---|
| 19.1 | State the grain of your capstone's main fact table. | The student's own answer; it must be precise ("one row per …"). |
| 19.2 | How many credits did your capstone use, and what was the biggest component? | From the cost report; the student has to know their own number. |
| 19.3 | Name one design decision you'd change with more time, and why. | Any reasoned answer, which shows they can reflect on trade-offs. |

---

## Results

_(Filled in when released.)_

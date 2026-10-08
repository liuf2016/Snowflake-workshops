<!-- status: sealed -->
# Recall Bank — Stage 1 (Days 1–5)

Recall questions for Days 1–5, asked at the next day's S1: 4 from the previous day and 1 spaced question from earlier. Each answer is worth 0.2. An answer earns the full 0.2 if it has the **key points** listed, in any wording.

---

## Day 01 — Orientation, trial and first login

| # | Question | Key points (answer) |
|---|---|---|
| 1.1 | Name Snowflake's three architectural layers and one responsibility of each. | **Storage**: micro-partitions in cloud object storage. **Compute**: virtual warehouses run queries. **Cloud services**: auth, metadata, optimizer, result cache, transactions. |
| 1.2 | Credits per hour for an X-Small warehouse? For a Medium? | XS = 1, M = 4 (it doubles at each size: XS 1, S 2, M 4, L 8…). |
| 1.3 | A warehouse resumes, runs a 5-second query and suspends. How much is billed? | 60 seconds. There's a 60-second minimum each time it resumes, then per-second billing. |
| 1.4 | A resource monitor has `ON 100 PERCENT DO SUSPEND` and `ON 110 PERCENT DO SUSPEND_IMMEDIATE`. What's the difference? | SUSPEND lets running queries finish and then suspends; SUSPEND_IMMEDIATE cancels running queries at once. |
| 1.5 | `CREATE TABLE MyTable (id INT);` then `SELECT * FROM "MyTable";`. What happens and why? | Error: object does not exist. Unquoted identifiers are stored in uppercase (`MYTABLE`); quoted identifiers are case-sensitive. |
| 1.6 | Why did `SELECT COUNT(*) FROM orders` return without starting a warehouse? | Cloud services answered it from **metadata**. Row counts are stored per micro-partition. |
| 1.7 | Why can't you `INSERT` into `SNOWFLAKE_SAMPLE_DATA`? | It's a **shared** (imported) database, so it's read-only for the consumer. |
| 1.8 | Database vs. warehouse, in one sentence each. | A database is a logical container of stored data (storage). A warehouse is a compute cluster that runs queries. The two are independent. |
| 1.9 | Which role creates resource monitors by default? | `ACCOUNTADMIN`. |

## Day 02 — Tooling: CLI, key-pair auth, Python

| # | Question | Key points |
|---|---|---|
| 2.1 | Which Snowflake CLI command checks that a named connection works? | `snow connection test -c <name>` (or `--connection`). |
| 2.2 | Where does the Snowflake CLI keep connection definitions on a Mac by default? | `~/.snowflake/config.toml` (or `connections.toml`). Either answer is accepted. It's outside the repo and never committed. |
| 2.3 | In key-pair auth, which key goes to Snowflake, and how? | The **public** key: `ALTER USER … SET RSA_PUBLIC_KEY = '…'` (with the PEM header and footer removed). The private key stays on the client. |
| 2.4 | Two reasons to use bind parameters instead of building SQL with f-strings. | SQL-injection safety, correct quoting and typing, and (bonus) statement reuse. |
| 2.5 | What does `fetch_pandas_all()` need installed? | The `pandas` extra: `snowflake-connector-python[pandas]` (brings in pyarrow). |
| 2.6 | What's a `QUERY_TAG` for? | A session parameter that labels queries, so they can be found or attributed in `QUERY_HISTORY` (cost, debugging). |
| 2.7 | The two forms of account identifier. | `ORGNAME-ACCOUNTNAME` (preferred) and the legacy **account locator** (often with a region suffix). |
| 2.8 | Why shouldn't a nightly job log in with a password? | No human is there for MFA, the secret would sit in scripts or config, and it's hard to rotate. Use key-pair or OAuth / workload identity. |

## Day 03 — Warehouses and caching

| # | Question | Key points |
|---|---|---|
| 3.1 | 50 people open dashboards at 9am and queries **queue**. Scale up or scale out? | **Scale out**: a multi-cluster warehouse. The problem is concurrency, not query complexity. |
| 3.2 | Name the three caches. Which one survives a warehouse suspend? | Result cache (survives: it lives in cloud services), local-disk cache (lost on suspend), metadata cache. |
| 3.3 | How long is a result reused? | 24 hours, and each reuse resets the clock, up to 31 days. |
| 3.4 | Two conditions for a result-cache hit. | Identical query text, underlying data unchanged, no non-deterministic functions (`CURRENT_TIMESTAMP`, `RANDOM`), same privileges, `USE_CACHED_RESULT = TRUE`. Any two. |
| 3.5 | A Large warehouse runs for 30 minutes. How many credits? | 8/hour × 0.5 = **4 credits**. |
| 3.6 | `ACCOUNT_USAGE` vs. `INFORMATION_SCHEMA`: latency and retention. | ACCOUNT_USAGE: latency from about 45 minutes to 3 hours, 365 days of history, includes dropped objects. INFORMATION_SCHEMA: near real time, shorter history (7 days to 6 months depending on the function), scoped to one database. |
| 3.7 | Multi-cluster scaling policies: Standard vs. Economy. | Standard adds clusters promptly to prevent queuing. Economy adds one only when there's enough load to keep it busy (about 6 minutes), which saves credits at the cost of some queuing. |
| 3.8 | What does `STATEMENT_TIMEOUT_IN_SECONDS` do, and where can you set it? | Cancels statements that run longer than the limit. It can be set at account, user, session or warehouse level. |

## Day 04 — Access control (RBAC)

| # | Question | Key points |
|---|---|---|
| 4.1 | Which system role manages grants account-wide? Which one creates users and roles? | `SECURITYADMIN` (it has MANAGE GRANTS); `USERADMIN`. |
| 4.2 | The minimum privileges to `SELECT` from `db.sch.t` using warehouse `wh`. | USAGE on `db`, USAGE on `sch`, SELECT on `t`, USAGE on `wh`. |
| 4.3 | What's a future grant? | `GRANT … ON FUTURE TABLES IN SCHEMA …`: applies automatically to objects created later. A schema-level future grant takes precedence over a database-level one. |
| 4.4 | Access role vs. functional role. | Access roles hold object privileges (for example, `DB_RO`). Functional roles match job functions (for example, `ANALYST`) and are granted access roles. Users receive functional roles. |
| 4.5 | Why grant custom roles up to `SYSADMIN`? | So admins inherit them and can manage the objects those roles own. Otherwise objects end up orphaned outside the hierarchy. |
| 4.6 | Why does the error say "does not exist **or not authorized**"? | Snowflake won't reveal whether an object exists to a role that lacks privileges on it. |
| 4.7 | What are secondary roles? | `USE SECONDARY ROLES ALL`: queries can use the privileges of all your granted roles. Creating objects still uses the primary role. |
| 4.8 | Who owns a new object, and how do you transfer ownership? | The creating session's primary role. `GRANT OWNERSHIP ON … TO ROLE … COPY CURRENT GRANTS` (or `REVOKE CURRENT GRANTS`). |
| 4.9 | Why not do daily work as `ACCOUNTADMIN`? | Least privilege: mistakes become account-wide, objects get owned by the top role, and it bypasses the audit trail of normal roles. |

## Day 05 — The Snowflake SQL dialect

| # | Question | Key points |
|---|---|---|
| 5.1 | `TIMESTAMP_NTZ` vs. `_LTZ` vs. `_TZ`. | NTZ: wall-clock time, no zone. LTZ: stored as UTC and shown in the session time zone. TZ: stores the offset with the value. |
| 5.2 | `TRY_TO_NUMBER('abc')` vs. `TO_NUMBER('abc')`. | NULL vs. an error. |
| 5.3 | What does `SELECT * EXCLUDE (col)` do? | Returns all columns except `col`. `RENAME` works the same way for renaming. |
| 5.4 | Transient vs. temporary table. | Transient: persists across sessions, Time Travel 0–1 day, no Fail-safe. Temporary: exists only for the session, no Fail-safe. |
| 5.5 | Write `IFF(a > 0, 'pos', 'non-pos')` as standard SQL. | `CASE WHEN a > 0 THEN 'pos' ELSE 'non-pos' END`. |
| 5.6 | `ILIKE` vs. `LIKE`. | `ILIKE` is case-insensitive. |
| 5.7 | What precision does a bare `NUMBER` get? | `NUMBER(38,0)`. |
| 5.8 | `SAMPLE (10)` vs. `LIMIT 10`. | `SAMPLE (10)` returns about 10% of rows at random. `LIMIT 10` returns 10 arbitrary rows (not random, not ordered unless you ORDER BY). |

---

## Results

_(Filled in when released.)_

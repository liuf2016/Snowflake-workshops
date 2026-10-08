# My Snowflake Interview Notes

**Written by the student, not the instructor.** At least 3 bullets a day, phrased as answers you'd say out loud in an interview, in your own words. Before any interview, this is the one page you reread.

A good bullet: *"Snowflake separates storage and compute, so the BI team and the ELT jobs run on different warehouses and never slow each other down. At my last project I…"*
A bad bullet: *"Storage and compute are separated."* (That's a fact, not an answer.)

## Week 1 — Foundations

### Architecture

### Tooling and access
FIRST_AUTHENTICATION_FACTOR is OIDC_ID_TOKEN (login through Google. Google handles the MFA, not Snowflake.
Humans log through SSO (Okta, Azure AD or Google via SAML/OIDC), MFA is enforced by the identify provider, and services key-pair auth.

### Warehouses and caching

### RBAC

### SQL dialect

## Week 2 — Loading and SQL

## Week 3 — Native features, performance, governance

## Week 4 — Beyond SQL

## My STAR stories

Build these from things that actually happened in the labs (a failed load, a recovered delete, a slow query you fixed).

| Situation | Task | Action | Result |
|---|---|---|---|
| | | | |

-- E1

-- The following commands all run on warehouse LEARN_WH
USE WAREHOUSE LEARN_WH;

-- Switch role to SYSADMIN for work with databse, schema, tables
USE ROLE SYSADMIN;

-- Create the main database as SYSADMIN
CREATE DATABASE IF NOT EXISTS LEARN_DB
COMMENT = 'Create database LEARN_DB as SYSADMIN';

-- Create the RAW schema inside database LEARN_DB
CREATE SCHEMA IF NOT EXISTS LEARN_DB.RAW
COMMENT = 'Create schema RAW inside database LEARN_DB';

-- Create the STAGING schema inside database LEARN_DB
CREATE SCHEMA IF NOT EXISTS LEARN_DB.STAGING
COMMENT = 'Create schema STAGING inside database LEARN_DB';

-- Create the MARTS schema inside database LEARN_DB
CREATE SCHEMA IF NOT EXISTS LEARN_DB.MARTS
COMMENT = 'Create schema MARTS inside database LEARN_DB';

-- E2

-- Create database BAY_AREA_CITIES inside LEARN_DB.STAGING to store cities
CREATE TABLE IF NOT EXISTS LEARN_DB.STAGING.BAY_AREA_CITIES (
  city VARCHAR,
  county VARCHAR,
  sample_zip VARCHAR(5)
)
COMMENT = 'Create table LEARN_DB.STAGING.BAY_AREA_CITIES to store cities';

-- Insert five cities into table LEARN_DB.STAGING.BAY_AREA_CITIES to store them
INSERT INTO LEARN_DB.STAGING.BAY_AREA_CITIES ( city, county, sample_zip )
VALUES ( 'Palo Alto', 'Santa Clara', '94306' );
INSERT INTO LEARN_DB.STAGING.BAY_AREA_CITIES ( city, county, sample_zip )
VALUES ( 'Cupertino', 'Santa Clara', '95014' );
INSERT INTO LEARN_DB.STAGING.BAY_AREA_CITIES ( city, county, sample_zip )
VALUES ( 'Mountain View', 'Santa Clara', '94041' );
INSERT INTO LEARN_DB.STAGING.BAY_AREA_CITIES ( city, county, sample_zip )
VALUES ( 'San Jose', 'Santa Clara', '95131' );
INSERT INTO LEARN_DB.STAGING.BAY_AREA_CITIES ( city, county, sample_zip )
VALUES ( 'Sunnyvale', 'Santa Clara', '94087' );

USE SCHEMA LEARN_DB.RAW;

SELECT * FROM LEARN_DB.STAGING.BAY_AREA_CITIES;

-- E3 (a)
SHOW DATABASES LIKE 'LEARN_DB';

DESCRIBE DATABASE LEARN_DB;
DESCRIBE SCHEMA LEARN_DB.STAGING;

SELECT database_owner FROM INFORMATION_SCHEMA.DATABASES
WHERE database_name = 'LEARN_DB';
-- Answer: SYSADMIN

-- E3 (b)
SHOW PARAMETERS LIKE 'DATA_RETENTION_TIME_IN_DAYS' IN DATABASE LEARN_DB;
-- Answer: value = 1

-- E3 (c)
SELECT COUNT(*) AS total_tables
FROM LEARN_DB.INFORMATION_SCHEMA.TABLES            
WHERE TABLE_TYPE = 'BASE TABLE';
-- Answer: 1

-- E3 (d)
Describe table LEARN_DB.STAGING.BAY_AREA_CITIES;
-- column name: CITY, type: VARCHAR
-- column name: COUNTY, type: VARCHAR
-- column name: SAMPLE_ZIP, type: VARCHAR

-- E4
CREATE TABLE learn_db.staging.MixedCase (id INT);
SELECT * FROM learn_db.staging."MixedCase";
-- SQL compilation error: Object 'LEARN_DB.STAGING."MixedCase"' does not exist or not authorized. Your primary role SYSADMIN or one of your secondary roles must have at least one privilege granted on TABLE LEARN_DB.STAGING."MixedCase".
-- Result: SQL compilation error: Object 'LEARN_DB.STAGING."MixedCase"' does not exist or not authorized. Your primary role SYSADMIN or one of your secondary roles must have at least one privilege granted on TABLE LEARN_DB.STAGING."MixedCase".
-- Explanation: "MixedCase" is for preserving case and escaping any special characters, whereas MixedCase is the tableidentifier itself 

-- The following works (returns 0)
CREATE TABLE IF NOT EXISTS learn_db.staging.MixedCase (id INT);
SELECT COUNT(*) FROM learn_db.staging.MixedCase;

-- E5
USE DATABASE SNOWFLAKE_SAMPLE_DATA; -- Set the context first
SHOW SCHEMAS;
-- Result: 7 rows (tables). Table names are: INFORMATION_SCHEMA, TPCDS_SF100TCL, TPCDS_SF10TCL, TPCH_SF1, TPCH_SF10, TPCH_SF10, TPCH_SF100, TPCH_SF1000

-- count rows in TPCH_SF1.ORDERS and TPCH_SF1.CUSTOMER
SELECT COUNT(*) FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.ORDERS;
-- Result: 1500000
SELECT COUNT(*) FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.CUSTOMER;
-- Result: 1500000
DESCRIBE TABLE SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.CUSTOMER;
-- Result: 7 columns
INSERT INTO SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.CUSTOMER (C_CUSTKEY, C_NAME, C_ADDRESS, C_NATIONKEY, C_PHONE, C_ACCTBAL, C_MKTSEGMENT, C_COMMENT) 
VALUES (1, 'John Doe', '1234 Flying St, Miami, FL', 3, '888-8880888', 15.24, "Meat")
-- Run into error: SQL access control error: Insufficient privileges to operate on table 'CUSTOMER'. Provider share does not have sufficient privileges.

-- E6
ALTER WAREHOUSE learn_wh SUSPEND;
-- Got error: Invalid state. Warehouse 'LEARN_WH' cannot be suspended
-- Cause: the warehouse is already suspended. At first I thought it's ROLE issue
SHOW WAREHOUSE LEARN_WH;
SELECT COUNT(*) FROM snowflake_sample_data.tpch_sf1.orders;
-- Answer: 1500000
SHOW WAREHOUSES LIKE LEARN_WH; 
-- Answer: one row result, column state is 'SUSPENDED'
-- or CLUSTER_NUMBER

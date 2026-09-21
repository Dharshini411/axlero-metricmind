-- ============================================================
-- MetricMind Project - schema.sql
-- Real team dataset (5 tables) ka schema
-- Schema: raw (source/original data, bina kisi cleaning ke)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS raw;

-- ------------------------------------------------------------
-- CUSTOMERS DIMENSION (500 rows)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS raw.customers (
    customer_id     TEXT PRIMARY KEY,
    customer_name   TEXT,
    country         TEXT,
    region          TEXT,
    segment         TEXT
);

-- ------------------------------------------------------------
-- PRODUCTS DIMENSION (12 rows)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS raw.products (
    product_id      TEXT PRIMARY KEY,
    product_name    TEXT,
    category        TEXT,
    unit_price      NUMERIC,
    unit_cost       NUMERIC
);

-- ------------------------------------------------------------
-- DATE DIMENSION (365 rows - poora 2025)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS raw.date_dimension (
    date            DATE PRIMARY KEY,
    year            INT,
    quarter         TEXT,
    month           INT,
    month_name      TEXT,
    week            INT,
    day             INT
);

-- ------------------------------------------------------------
-- ORDERS FACT TABLE (10,000 rows)
-- Main transactional table - revenue/profit/margin already
-- calculated hain source se; Semantic Layer inhe governed
-- formula se verify/recalculate karega.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS raw.orders (
    order_id            TEXT PRIMARY KEY,
    order_date          DATE,
    customer_id         TEXT,
    product_id          TEXT,
    country             TEXT,
    region              TEXT,
    quantity            INT,
    sales_channel       TEXT,
    order_status        TEXT,
    discount_pct        NUMERIC,
    gross_revenue       NUMERIC,
    discount_amount     NUMERIC,
    revenue             NUMERIC,
    product_cost        NUMERIC,
    shipping_cost       NUMERIC,
    total_cost          NUMERIC,
    profit              NUMERIC,
    margin_pct          NUMERIC
);

-- ------------------------------------------------------------
-- COSTS TABLE (10,000 rows) - detailed cost breakdown per order
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS raw.costs (
    order_id                TEXT,
    order_date              DATE,
    region                  TEXT,
    product_id              TEXT,
    material_cost           NUMERIC,
    shipping_cost           NUMERIC,
    other_operational_cost  NUMERIC,
    total_cost              NUMERIC
);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
SELECT 'customers' AS table_name, COUNT(*) AS total_rows FROM raw.customers
UNION ALL
SELECT 'products', COUNT(*) FROM raw.products
UNION ALL
SELECT 'date_dimension', COUNT(*) FROM raw.date_dimension
UNION ALL
SELECT 'orders', COUNT(*) FROM raw.orders
UNION ALL
SELECT 'costs', COUNT(*) FROM raw.costs;

-- Expected: customers=500, products=12, date_dimension=365,
--           orders=10000, costs=10000

-- ------------------------------------------------------------
-- Relationship sanity checks (foreign key match validation)
-- ------------------------------------------------------------
SELECT COUNT(*) AS orphan_orders_customers
FROM raw.orders o
LEFT JOIN raw.customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
-- Expected: 0

SELECT COUNT(*) AS orphan_orders_products
FROM raw.orders o
LEFT JOIN raw.products p ON o.product_id = p.product_id
WHERE p.product_id IS NULL;
-- Expected: 0
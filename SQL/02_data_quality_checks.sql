-- MetricMind
-- 02_data_quality_checks.sql

-- 1. NULL CHECK
SELECT
    (SELECT COUNT(*) FROM customers_raw WHERE customer_id IS NULL) AS customer_nulls,
    (SELECT COUNT(*) FROM products_raw WHERE product_id IS NULL) AS product_nulls,
    (SELECT COUNT(*) FROM orders_raw WHERE order_id IS NULL) AS order_nulls,
    (SELECT COUNT(*) FROM costs_raw WHERE order_id IS NULL) AS cost_order_nulls,
    (SELECT COUNT(*) FROM date_dimension_raw WHERE date IS NULL) AS date_nulls;

-- 2. DUPLICATE CHECK
SELECT
    (SELECT COUNT(*) - COUNT(DISTINCT customer_id) FROM customers_raw) AS duplicate_customers,
    (SELECT COUNT(*) - COUNT(DISTINCT product_id) FROM products_raw) AS duplicate_products,
    (SELECT COUNT(*) - COUNT(DISTINCT order_id) FROM orders_raw) AS duplicate_orders,
    (SELECT COUNT(*) - COUNT(DISTINCT date) FROM date_dimension_raw) AS duplicate_dates;

-- 3. ORDERS -> CUSTOMERS
SELECT COUNT(*) AS orphan_customers
FROM orders_raw o
LEFT JOIN customers_raw c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;

-- 4. ORDERS -> PRODUCTS
SELECT COUNT(*) AS orphan_products
FROM orders_raw o
LEFT JOIN products_raw p ON o.product_id = p.product_id
WHERE p.product_id IS NULL;

-- 5. COSTS -> ORDERS
SELECT COUNT(*) AS orphan_cost_orders
FROM costs_raw c
LEFT JOIN orders_raw o ON c.order_id = o.order_id
WHERE o.order_id IS NULL;

-- 6. VALUE CHECK
SELECT
    COUNT(*) FILTER (WHERE quantity <= 0) AS invalid_quantity,
    COUNT(*) FILTER (WHERE revenue < 0) AS negative_revenue,
    COUNT(*) FILTER (WHERE total_cost < 0) AS negative_cost,
    COUNT(*) FILTER (WHERE gross_revenue < 0) AS negative_gross_revenue
FROM orders_raw;

-- 7. ORDER STATUS
SELECT order_status, COUNT(*) AS total_orders
FROM orders_raw
GROUP BY order_status
ORDER BY order_status;

-- 8. ORDER DATE
SELECT
    MIN(order_date) AS first_order_date,
    MAX(order_date) AS last_order_date,
    COUNT(*) FILTER (WHERE order_date IS NULL) AS null_order_dates
FROM orders_raw;

-- 9. PROFIT / MARGIN CONSISTENCY
SELECT
    COUNT(*) AS total_orders,
    COUNT(*) FILTER (WHERE ABS(profit - (revenue - total_cost)) > 0.01) AS profit_mismatch,
    COUNT(*) FILTER (
        WHERE ABS(margin_pct - (profit / NULLIF(revenue, 0) * 100)) > 0.01
    ) AS margin_mismatch
FROM orders_raw;

-- 10. COST RECONCILIATION
SELECT
    COUNT(*) AS total_orders,
    COUNT(*) FILTER (WHERE ABS(o.total_cost - c.total_cost) > 0.01) AS cost_mismatch,
    ROUND(SUM(ABS(o.total_cost - c.total_cost)), 2) AS total_cost_difference
FROM orders_raw o
JOIN costs_raw c ON o.order_id = c.order_id;

-- 11. INVESTIGATE COST DIFFERENCE
SELECT
    ROUND(AVG(o.total_cost), 2) AS avg_order_cost,
    ROUND(AVG(c.total_cost), 2) AS avg_cost_table_cost,
    ROUND(AVG(c.other_operational_cost), 2) AS avg_other_operational_cost
FROM orders_raw o
JOIN costs_raw c ON o.order_id = c.order_id;

-- 12. COST TABLE UNIQUENESS
SELECT
    COUNT(*) AS total_cost_rows,
    COUNT(DISTINCT order_id) AS unique_orders
FROM costs_raw;

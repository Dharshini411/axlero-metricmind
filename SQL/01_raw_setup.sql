-- MetricMind
-- 01_raw_setup.sql

DROP TABLE IF EXISTS customers_raw;
DROP TABLE IF EXISTS products_raw;
DROP TABLE IF EXISTS orders_raw;
DROP TABLE IF EXISTS costs_raw;
DROP TABLE IF EXISTS date_dimension_raw;

CREATE TABLE customers_raw (
    customer_id VARCHAR(20),
    customer_name VARCHAR(100),
    country VARCHAR(100),
    region VARCHAR(100),
    segment VARCHAR(50)
);

CREATE TABLE products_raw (
    product_id VARCHAR(20),
    product_name VARCHAR(100),
    category VARCHAR(100),
    unit_price NUMERIC(15,2),
    unit_cost NUMERIC(15,2)
);

CREATE TABLE orders_raw (
    order_id VARCHAR(20),
    order_date DATE,
    customer_id VARCHAR(20),
    product_id VARCHAR(20),
    country VARCHAR(100),
    region VARCHAR(100),
    quantity INTEGER,
    sales_channel VARCHAR(50),
    order_status VARCHAR(50),
    discount_pct NUMERIC(10,4),
    gross_revenue NUMERIC(15,2),
    discount_amount NUMERIC(15,2),
    revenue NUMERIC(15,2),
    product_cost NUMERIC(15,2),
    shipping_cost NUMERIC(15,2),
    total_cost NUMERIC(15,2),
    profit NUMERIC(15,2),
    margin_pct NUMERIC(10,2)
);

CREATE TABLE costs_raw (
    order_id VARCHAR(20),
    order_date DATE,
    region VARCHAR(100),
    product_id VARCHAR(20),
    material_cost NUMERIC(15,2),
    shipping_cost NUMERIC(15,2),
    other_operational_cost NUMERIC(15,2),
    total_cost NUMERIC(15,2)
);

CREATE TABLE date_dimension_raw (
    date DATE,
    year INTEGER,
    quarter VARCHAR(10),
    month INTEGER,
    month_name VARCHAR(20),
    week INTEGER,
    day INTEGER
);

-- psql / SQL Shell imports
\copy customers_raw FROM 'C:/Users/ani98/Desktop/Desktop/Axlero_matric_mind/MetricMind_Raw_Dataset/customers_raw.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
\copy products_raw FROM 'C:/Users/ani98/Desktop/Desktop/Axlero_matric_mind/MetricMind_Raw_Dataset/products_raw.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
\copy orders_raw FROM 'C:/Users/ani98/Desktop/Desktop/Axlero_matric_mind/MetricMind_Raw_Dataset/orders_raw.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
\copy costs_raw FROM 'C:/Users/ani98/Desktop/Desktop/Axlero_matric_mind/MetricMind_Raw_Dataset/costs_raw.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
\copy date_dimension_raw FROM 'C:/Users/ani98/Desktop/Desktop/Axlero_matric_mind/MetricMind_Raw_Dataset/date_dimension_raw.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');

SELECT
    (SELECT COUNT(*) FROM customers_raw) AS customers,
    (SELECT COUNT(*) FROM products_raw) AS products,
    (SELECT COUNT(*) FROM orders_raw) AS orders,
    (SELECT COUNT(*) FROM costs_raw) AS costs,
    (SELECT COUNT(*) FROM date_dimension_raw) AS dates;

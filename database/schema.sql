-- MetricMind Project — Raw Schema
-- Creates the PostgreSQL schema and 5 raw tables used to hold the source CSV data.
-- Run this once against a fresh "metricmind" database before loading data.

CREATE SCHEMA IF NOT EXISTS raw;

CREATE TABLE raw.customers (
    customer_id TEXT PRIMARY KEY,
    customer_name TEXT,
    country TEXT,
    region TEXT,
    segment TEXT
);

CREATE TABLE raw.products (
    product_id TEXT PRIMARY KEY,
    product_name TEXT,
    category TEXT,
    unit_price NUMERIC,
    unit_cost NUMERIC
);

CREATE TABLE raw.date_dimension (
    date DATE PRIMARY KEY,
    year INT,
    quarter TEXT,
    month INT,
    month_name TEXT,
    week INT,
    day INT
);

CREATE TABLE raw.orders (
    order_id TEXT PRIMARY KEY,
    order_date DATE,
    customer_id TEXT,
    product_id TEXT,
    country TEXT,
    region TEXT,
    quantity INT,
    sales_channel TEXT,
    order_status TEXT,
    discount_pct NUMERIC,
    gross_revenue NUMERIC,
    discount_amount NUMERIC,
    revenue NUMERIC,
    product_cost NUMERIC,
    shipping_cost NUMERIC,
    total_cost NUMERIC,
    profit NUMERIC,
    margin_pct NUMERIC
);

CREATE TABLE raw.costs (
    order_id TEXT,
    order_date DATE,
    region TEXT,
    product_id TEXT,
    material_cost NUMERIC,
    shipping_cost NUMERIC,
    other_operational_cost NUMERIC,
    total_cost NUMERIC
);
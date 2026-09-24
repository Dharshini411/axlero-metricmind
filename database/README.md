# MetricMind — Database & Schema Documentation

**Owner:** Ansh Verma (Team A — Raw Data + Database)
**Branch:** ansh-verma

## 1. Overview

This document covers the structure, data source, and data quality of the
`metricmind` PostgreSQL database. It is the final deliverable for this
branch's scope (understand raw CSVs, check quality, load data, verify,
and document).

## 2. Database Setup

| Item | Value |
|---|---|
| Database engine | PostgreSQL |
| Database name | `metricmind` |
| Schema | `raw` |
| Access tool | pgAdmin 4 |
| Load method | pgAdmin GUI Import/Export + `load_data.py` (Python script) |

## 3. Raw Data Source

Per the data team's README (`MetricMind Raw Dataset`), this is a
**synthetic corporate sales dataset** created specifically for the
MetricMind project — it is not real company data.

There are 5 CSV files, stored in the `database/data/raw/` folder:

| File | Rows | Contents |
|---|---|---|
| `customers_raw.csv` | 500 | Customer master data |
| `products_raw.csv` | 12 | Product catalogue |
| `orders_raw.csv` | 10,000 | Order-level sales transactions |
| `costs_raw.csv` | 10,000 | Order-level cost breakdown |
| `date_dimension_raw.csv` | 365 | Calendar dimension for 2025 |

## 4. Schema Structure (`raw` schema)

### 4.1 `raw.customers`
| Column | Type | Description |
|---|---|---|
| customer_id | TEXT (PK) | Unique customer identifier |
| customer_name | TEXT | Customer's full name |
| country | TEXT | Customer's country |
| region | TEXT | Customer's region (North America, Europe, Asia, Middle East) |
| segment | TEXT | Customer segment |

### 4.2 `raw.products`
| Column | Type | Description |
|---|---|---|
| product_id | TEXT (PK) | Unique product identifier |
| product_name | TEXT | Product name |
| category | TEXT | Product category |
| unit_price | NUMERIC | Selling price per unit |
| unit_cost | NUMERIC | Cost per unit |

### 4.3 `raw.date_dimension`
| Column | Type | Description |
|---|---|---|
| date | DATE (PK) | Calendar date (for 2025) |
| year | INT | Year |
| quarter | TEXT | Quarter (Q1-Q4) |
| month | INT | Month number |
| month_name | TEXT | Month name |
| week | INT | Week number |
| day | INT | Day of month |

### 4.4 `raw.orders` (Main Fact Table)
| Column | Type | Description |
|---|---|---|
| order_id | TEXT (PK) | Unique order identifier |
| order_date | DATE | Date of order |
| customer_id | TEXT | FK -> raw.customers |
| product_id | TEXT | FK -> raw.products |
| country, region | TEXT | Order geography |
| quantity | INT | Units ordered |
| sales_channel | TEXT | Online / Offline / Partner |
| order_status | TEXT | Completed / Returned / Cancelled |
| discount_pct | NUMERIC | Discount percentage applied |
| gross_revenue | NUMERIC | Revenue before discount |
| discount_amount | NUMERIC | Discount value |
| revenue | NUMERIC | Revenue after discount (source-calculated) |
| product_cost | NUMERIC | Product cost (source-calculated) |
| shipping_cost | NUMERIC | Shipping cost |
| total_cost | NUMERIC | Total cost (source-calculated) |
| profit | NUMERIC | Profit (source-calculated) |
| margin_pct | NUMERIC | Margin % (source-calculated) |

> **Note:** revenue/cost/profit/margin_pct are already calculated in
> this table from the source data. The Semantic Layer team will
> verify/recalculate these using a governed formula.

### 4.5 `raw.costs`
| Column | Type | Description |
|---|---|---|
| order_id | TEXT | FK -> raw.orders |
| order_date | DATE | Date of order |
| region | TEXT | Order region |
| product_id | TEXT | FK -> raw.products |
| material_cost | NUMERIC | Material cost component |
| shipping_cost | NUMERIC | Shipping cost component |
| other_operational_cost | NUMERIC | Other operational costs |
| total_cost | NUMERIC | Total cost (should match raw.orders.total_cost) |

## 5. Relationships

```
raw.customers (1) ----< (many) raw.orders
raw.products  (1) ----< (many) raw.orders
raw.orders    (1) ----< (1)    raw.costs   [via order_id]
raw.date_dimension (1) --< (many) raw.orders [via date = order_date]
```

## 6. Data Quality Findings

The following results were found after running verification queries:

| Check | Result |
|---|---|
| Total rows loaded (customers/products/date_dimension/orders/costs) | 500 / 12 / 365 / 10,000 / 10,000 ✅ |
| Null values in any table | 0 (dataset is clean) |
| Duplicate order_id | 0 |
| Orphan orders (customer_id not in customers) | 0 |
| Orphan orders (product_id not in products) | 0 |
| `orders.total_cost` vs `costs.total_cost` mismatch | 0 |
| `order_status` values | Completed (5,996), Returned (2,052), Cancelled (1,952) |

**Conclusion:** The dataset is completely clean; no cleaning
transformation was needed for the raw load. A business rule needs to
be decided on whether the Revenue metric should count only
"Completed" orders or all orders — this decision should be made
together with the Semantic Layer team.

## 7. How to Reload Data

```powershell
cd database
python load_data.py
```

The script first **truncates** each table, then loads fresh CSV
data — so rerunning it does not create duplicate data.

The password comes from a `.env` file (not committed, listed in
`.gitignore`). Setup instructions:
1. Create a `.env` file inside the `database` folder
2. Add: `DB_USER=postgres`, `DB_PASSWORD=your_password`,
   `DB_HOST=localhost`, `DB_PORT=5432`, `DB_NAME=metricmind`

## 8. Files Reference

| File | Purpose |
|---|---|
| `database/schema.sql` | Table creation + verification SQL |
| `database/load_data.py` | CSV → PostgreSQL loader script |
| `database/.env` | DB credentials (not committed) |
| `database/data/raw/*.csv` | Source CSV files |
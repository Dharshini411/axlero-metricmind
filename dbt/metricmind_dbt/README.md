# MetricMind dbt Project

## Role
Adhyayan Pandey – dbt Engineer

## Completed Work

- PostgreSQL database connection configured
- dbt PostgreSQL adapter configured
- MetricMind raw source tables configured
- 5 staging models created
- 5 fact/dimension models created
- Primary-key and foreign-key tests added
- Relationship tests added
- Accepted-value test added for order status
- dbt model documentation added
- dbt documentation generated
- Full dbt build successfully verified

## Project Structure

### Sources
- orders_raw
- customers_raw
- products_raw
- costs_raw
- date_dimension_raw

### Staging Models
- stg_orders
- stg_customers
- stg_products
- stg_costs
- stg_date_dimension

### Mart Models
- dim_customers
- dim_products
- dim_date
- fct_orders
- fct_costs

## Validation

The final dbt build completed successfully:

- 5 table models
- 5 view models
- 19 data tests
- PASS = 29
- WARN = 0
- ERROR = 0

## How to Run

Configure the PostgreSQL connection in the local dbt profile, then run:

```bash
dbt debug
dbt build
dbt docs generate
dbt docs serve

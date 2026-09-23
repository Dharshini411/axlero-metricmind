-- models/staging/stg_orders.sql
--
-- Staging model: raw.orders ko halka sa clean/standardize karta hai.
-- Yaha koi business logic (jaise margin recalculate karna) nahi daalte -
-- wo kaam "mart" layer mein hoga. Yahan sirf:
--   1. source() function se raw table ko reference karte hain (hardcoded
--      table name nahi likhte, taaki agar raw schema/table naam badle
--      to sirf sources.yml update karna padega, poore models nahi)
--   2. Column names ko consistent/readable banate hain
--   3. Data types clean karte hain

with source as (

    select * from {{ source('raw', 'orders') }}

),

staged as (

    select
        order_id,
        order_date,
        customer_id,
        product_id,
        country,
        region,
        quantity,
        sales_channel,
        order_status,
        discount_pct,
        gross_revenue,
        discount_amount,
        revenue,
        product_cost,
        shipping_cost,
        total_cost,
        profit,
        margin_pct

    from source

)

select * from staged
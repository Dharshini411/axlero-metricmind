-- models/marts/fct_sales.sql
--
-- Mart layer: Final business-ready sales table.
-- Ye orders ko customer, product aur date dimensions ke saath
-- JOIN karta hai taaki Semantic Layer (Cube.dev) se seedha
-- connect ho sake aur governed metrics (Revenue, Cost, Profit,
-- Margin %) yahan se calculate ho sakein.
--
-- Note: Yaha hum orders_raw ke pre-calculated revenue/profit/margin
-- ko as-is le rahe hain for now. Semantic Layer step mein hum
-- inhe verify/recalculate karenge apne governed formula se.

with orders as (

    select * from {{ ref('stg_orders') }}

),

customers as (

    select * from {{ ref('stg_customers') }}

),

products as (

    select * from {{ ref('stg_products') }}

),

date_dim as (

    select * from {{ ref('stg_date_dimension') }}

),

final as (

    select
        -- Order level info
        orders.order_id,
        orders.order_date,
        orders.order_status,
        orders.sales_channel,
        orders.quantity,

        -- Customer dimension
        customers.customer_id,
        customers.customer_name,
        customers.segment as customer_segment,

        -- Product dimension
        products.product_id,
        products.product_name,
        products.category as product_category,

        -- Geography dimension (order table se, customer se bhi verify kar sakte hain baad mein)
        orders.country,
        orders.region,

        -- Time dimension
        date_dim.year,
        date_dim.quarter,
        date_dim.month,
        date_dim.month_name,

        -- Metrics (source se, abhi recalculate nahi kiya)
        orders.gross_revenue,
        orders.discount_amount,
        orders.revenue,
        orders.product_cost,
        orders.shipping_cost,
        orders.total_cost,
        orders.profit,
        orders.margin_pct

    from orders
    left join customers on orders.customer_id = customers.customer_id
    left join products on orders.product_id = products.product_id
    left join date_dim on orders.order_date = date_dim.date

)

select * from final
with source_data as (

    select *
    from "metricmind"."raw"."orders_raw"

),

staged as (

    select
        trim(order_id) as order_id,
        order_date,
        trim(customer_id) as customer_id,
        trim(product_id) as product_id,
        trim(country) as country,
        trim(region) as region,
        quantity,
        trim(sales_channel) as sales_channel,
        trim(order_status) as order_status,
        discount_pct,
        gross_revenue,
        discount_amount,
        revenue,
        product_cost,
        shipping_cost,
        total_cost,
        profit,
        margin_pct

    from source_data

)

select *
from staged
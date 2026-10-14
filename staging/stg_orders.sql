with source as (

    select *
    from {{ source('raw', 'orders_raw') }}

),

cleaned as (

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
        shipping_cost
    from source

)

select *
from cleaned
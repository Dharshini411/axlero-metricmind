with source as (

    select *
    from {{ source('raw', 'products_raw') }}

),

cleaned as (

    select
        product_id,
        product_name,
        category,
        unit_price,
        unit_cost
    from source

)

select *
from cleaned
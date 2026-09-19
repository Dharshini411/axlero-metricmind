with source_data as (

    select *
    from {{ source('metricmind_raw', 'products_raw') }}

),

staged as (

    select
        trim(product_id) as product_id,
        trim(product_name) as product_name,
        trim(category) as category,
        unit_price,
        unit_cost

    from source_data

)

select *
from staged
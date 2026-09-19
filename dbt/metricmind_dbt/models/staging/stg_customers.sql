with source_data as (

    select *
    from {{ source('metricmind_raw', 'customers_raw') }}

),

staged as (

    select
        trim(customer_id) as customer_id,
        trim(customer_name) as customer_name,
        trim(country) as country,
        trim(region) as region,
        trim(segment) as segment

    from source_data

)

select *
from staged
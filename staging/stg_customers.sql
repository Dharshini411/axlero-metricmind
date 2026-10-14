with source as (

    select *
    from {{ source('raw', 'customers_raw') }}

),

cleaned as (

    select
        customer_id,
        customer_name,
        country,
        region,
        segment
    from source

)

select *
from cleaned
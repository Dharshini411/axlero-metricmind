with source as (

    select *
    from {{ source('raw', 'date_dimension_raw') }}

),

cleaned as (

    select
        date,
        year,
        quarter,
        month,
        month_name,
        week,
        day
    from source

)

select *
from cleaned
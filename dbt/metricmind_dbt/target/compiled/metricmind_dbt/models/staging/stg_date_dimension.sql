with source_data as (

    select *
    from "metricmind"."raw"."date_dimension_raw"

),

staged as (

    select
        date,
        year,
        trim(quarter) as quarter,
        month,
        trim(month_name) as month_name,
        week,
        day

    from source_data

)

select *
from staged
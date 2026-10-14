select
    date,
    year,
    quarter,
    month,
    month_name,
    week,
    day
from {{ ref('stg_date_dimension') }}
select
    order_date as date,
    year,
    quarter,
    month,
    month_name,
    week
from {{ ref('fct_sales') }}
group by
    order_date,
    year,
    quarter,
    month,
    month_name,
    week
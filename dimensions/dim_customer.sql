select distinct
    customer_id,
    customer_name,
    segment
from {{ ref('fct_sales') }}
where customer_id is not null
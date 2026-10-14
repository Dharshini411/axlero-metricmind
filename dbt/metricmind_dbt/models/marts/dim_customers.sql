select
    customer_id,
    customer_name,
    country,
    region,
    segment
from {{ ref('stg_customers') }}
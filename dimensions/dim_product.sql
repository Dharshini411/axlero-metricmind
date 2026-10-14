select distinct
    product_id,
    product_name,
    category
from {{ ref('fct_sales') }}
where product_id is not null
select distinct
    sales_channel
from {{ ref('fct_sales') }}
where sales_channel is not null
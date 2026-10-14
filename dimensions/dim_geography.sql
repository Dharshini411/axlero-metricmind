select distinct
    country,
    region
from {{ ref('fct_sales') }}
where country is not null
  and region is not null
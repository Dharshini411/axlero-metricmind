
  create view "metricmind"."analytics"."stg_products__dbt_tmp"
    
    
  as (
    with source_data as (

    select *
    from "metricmind"."raw"."products_raw"

),

staged as (

    select
        trim(product_id) as product_id,
        trim(product_name) as product_name,
        trim(category) as category,
        unit_price,
        unit_cost

    from source_data

)

select *
from staged
  );
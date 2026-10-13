
  create view "metricmind"."analytics"."stg_costs__dbt_tmp"
    
    
  as (
    with source_data as (

    select *
    from "metricmind"."raw"."costs_raw"

),

staged as (

    select
        trim(order_id) as order_id,
        order_date,
        trim(region) as region,
        trim(product_id) as product_id,
        material_cost,
        shipping_cost,
        other_operational_cost,
        total_cost

    from source_data

)

select *
from staged
  );
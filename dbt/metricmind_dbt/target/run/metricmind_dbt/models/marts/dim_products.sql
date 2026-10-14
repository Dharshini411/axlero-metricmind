
  
    

  create  table "metricmind"."analytics"."dim_products__dbt_tmp"
  
  
    as
  
  (
    select
    product_id,
    product_name,
    category,
    unit_price,
    unit_cost
from "metricmind"."analytics"."stg_products"
  );
  

  
    

  create  table "metricmind"."analytics"."dim_customers__dbt_tmp"
  
  
    as
  
  (
    select
    customer_id,
    customer_name,
    country,
    region,
    segment
from "metricmind"."analytics"."stg_customers"
  );
  
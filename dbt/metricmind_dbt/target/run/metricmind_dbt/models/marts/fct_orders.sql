
  
    

  create  table "metricmind"."analytics"."fct_orders__dbt_tmp"
  
  
    as
  
  (
    select
    order_id,
    order_date,
    customer_id,
    product_id,
    country,
    region,
    quantity,
    sales_channel,
    order_status,
    discount_pct,
    gross_revenue,
    discount_amount,
    revenue,
    product_cost,
    shipping_cost,
    total_cost,
    profit,
    margin_pct
from "metricmind"."analytics"."stg_orders"
  );
  
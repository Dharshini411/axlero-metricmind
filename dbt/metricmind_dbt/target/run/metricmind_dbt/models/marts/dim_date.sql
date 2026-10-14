
  
    

  create  table "metricmind"."analytics"."dim_date__dbt_tmp"
  
  
    as
  
  (
    select
    date,
    year,
    quarter,
    month,
    month_name,
    week,
    day
from "metricmind"."analytics"."stg_date_dimension"
  );
  
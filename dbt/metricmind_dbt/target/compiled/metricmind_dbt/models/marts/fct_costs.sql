select
    order_id,
    order_date,
    region,
    product_id,
    material_cost,
    shipping_cost,
    other_operational_cost,
    total_cost
from "metricmind"."analytics"."stg_costs"
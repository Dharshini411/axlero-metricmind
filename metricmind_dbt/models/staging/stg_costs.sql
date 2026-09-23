-- models/staging/stg_costs.sql
--
-- Staging model: raw.costs ko clean/standardize karta hai.

with source as (

    select * from {{ source('raw', 'costs') }}

),

staged as (

    select
        order_id,
        order_date,
        region,
        product_id,
        material_cost,
        shipping_cost,
        other_operational_cost,
        total_cost

    from source

)

select * from staged
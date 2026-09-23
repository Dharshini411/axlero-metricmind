-- models/staging/stg_products.sql
--
-- Staging model: raw.products ko clean/standardize karta hai.

with source as (

    select * from {{ source('raw', 'products') }}

),

staged as (

    select
        product_id,
        product_name,
        category,
        unit_price,
        unit_cost

    from source

)

select * from staged
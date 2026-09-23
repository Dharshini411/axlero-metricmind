-- models/staging/stg_customers.sql
--
-- Staging model: raw.customers ko clean/standardize karta hai.

with source as (

    select * from {{ source('raw', 'customers') }}

),

staged as (

    select
        customer_id,
        customer_name,
        country,
        region,
        segment

    from source

)

select * from staged
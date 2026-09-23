-- models/staging/stg_date_dimension.sql
--
-- Staging model: raw.date_dimension ko clean/standardize karta hai.

with source as (

    select * from {{ source('raw', 'date_dimension') }}

),

staged as (

    select
        date,
        year,
        quarter,
        month,
        month_name,
        week,
        day

    from source

)

select * from staged
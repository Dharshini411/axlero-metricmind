
    
    

select
    date as unique_field,
    count(*) as n_records

from "metricmind"."analytics"."dim_date"
where date is not null
group by date
having count(*) > 1



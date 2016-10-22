create or replace view agencyv as
SELECT agency.*,
sum(case when activity.number_in_party is null then 0 else activity.number_in_party end) reservation_count,
agency.total_beds_available - sum(case when activity.number_in_party is null then 0 else activity.number_in_party end) beds_available
FROM agency
left outer join activity on (activity.agency_id = agency.id)
where (activity.happened_on is null or activity.happened_on >= now()::date)
group by agency.id;

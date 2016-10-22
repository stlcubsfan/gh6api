create or replace view agency_v as
SELECT agency.*,
sum(case when activity.id is null then 0 else 1 end) reservation_count
FROM agency
left outer join activity on (activity.agency_id = agency.id)
group by agency.id;

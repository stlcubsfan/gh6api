create or replace view programv as
select program.*,
	sum(case when enrollment.status = 'Lead' then 1 else 0 end) lead_count,
    sum(case when enrollment.status = 'Active' then 1 else 0 end) active_count,
    sum(case when enrollment.status = 'Success' then 1 else 0 end) success_count
from program
left outer join enrollment on (program.id = enrollment.program_id)
group by program.id;

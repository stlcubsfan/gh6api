create or replace view opportunityv as
select opportunity.*,
	sum(case when opportunity_xref.status = 'Lead' then 1 else 0 end) lead_count,
    sum(case when opportunity_xref.status = 'Active' then 1 else 0 end) enrolled_count,
    opportunity.total_spots_available - sum(case when opportunity_xref.status = 'Lead' then 1 else 0 end) - sum(case when opportunity_xref.status = 'Active' then 1 else 0 end) spots_open
from opportunity
left outer join opportunity_xref on (opportunity.id = opportunity_xref.opportunity_id)
group by opportunity.id;

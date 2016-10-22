create view client_engagement_v as
select opportunity_xref.agency_id, client.id client_id, opportunity_xref.id opportunity_id, opportunity_xref.partner_id,
	   null enrollment_id, null program_id
from client
join opportunity_xref on (opportunity_xref.client_id = client.id)
union
select enrollment.agency_id, client.id client_id, null opportunity_id, null partner_id,
	   enrollment.id enrollment_id, enrollment.program_id
from client
join enrollment on (enrollment.client_id = client.id);

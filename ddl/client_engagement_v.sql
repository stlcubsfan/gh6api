create view client_engagement_v as
select client.id client_id, opportunity_xref.id opportunity_id, opportunity_xref.partner_id,
	   null enrollment_id, null program_id, null agency_id
from client
join opportunity_xref on (opportunity_xref.client_id = client.id)
union
select client.id client_id, null opportunity_id, null partner_id,
	   enrollment.id enrollment_id, enrollment.program_id, enrollment.agency_id
from client
join enrollment on (enrollment.client_id = client.id);

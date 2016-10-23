create or replace view client_v as
select client.*, ch.status housing_status, ch.date_noted housing_start_date
from client
left outer join client_housing ch on (client.id = ch.client_id)
where (ch.date_noted is null
	or ch.date_noted = (select max(date_noted) from client_housing where client_id = client.id));

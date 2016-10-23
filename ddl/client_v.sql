create or replace view client_v as
select client.*, ch.status housing_status, ch.date_noted housing_start_date, emp.creation_date employment_start_date, COALESCE(emp.name, emp.name, 'None') employment_status
from client
left outer join client_housing ch on (client.id = ch.client_id)
left outer join (select cee.clientid client_id, et.name, cee.creation_date
				from clienteducationemployment cee
				join employmenttype et on (cee.employmenttypeid = et.id)) emp on (client.id = emp.client_id)
where (ch.date_noted is null
	or ch.date_noted = (select max(date_noted) from client_housing where client_id = client.id))
    and
    (emp.creation_date is null
     or emp.creation_date = (select max(creation_date) from clienteducationemployment where clientid = client.id))
    ;

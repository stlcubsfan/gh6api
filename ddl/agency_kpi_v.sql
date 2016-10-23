create or replace view agency_kpi_v as
select agency.id agency_id,
	count(distinct enrollmentv.client_id) clients_enrolled_in_programs,
    count(distinct activity.client_id) clients_emergency_housing,
    count(distinct cvh.id) clients_housed,
    count(distinct cve.id) clients_employed
from agency
left join enrollmentv on (enrollmentv.agency_id = agency.id)
left join activity on (activity.agency_id = agency.id)
left join client_v cvh on (cvh.housing_agency_id = agency.id)
left join client_v cve on (cve.employment_agency_id = agency.id)
where (activity.id is null or activity.type = 'RESERVATION')
and (cvh.id is null or cvh.housing_status = 'Permanent Housing')
and (cve.id is null or cve.employment_status <> 'None')
group by agency.id;

const original_query = `#legacySQL 
SELECT t1.email, MAX(t1.max_created_time), SUBSTR(GROUP_CONCAT(UNIQUE(t1.id)),0,1000)
FROM (
  SELECT LOWER(LTRIM(RTRIM(id_map.email))) as email, MAX(event.created) as max_created_time, event.id
  FROM (
    SELECT distinct_id, created, id
    FROM TABLE_QUERY([triggeredmail.reebok], 'table_id in ("aggregate_viewed_product_202207", "aggregate_viewed_product_202208")')
    WHERE created >= "2022-07-29 00:00:00" AND id != "null" AND LOWER(category) IN ("shoes")
  ) event
  JOIN [triggeredmail.reebok.identifier_mapping] AS id_map
    ON id_map.distinct_id = event.distinct_id
  GROUP BY email, event.id
) t1
JOIN (
  SELECT LOWER(LTRIM(RTRIM(email))) as email
  FROM [triggeredmail.reebok.consolidated_optins]
  GROUP BY email
) t2
ON t2.email = t1.email
LEFT OUTER JOIN (
  SELECT LOWER(LTRIM(RTRIM(email))) as email
  FROM [triggeredmail.reebok.unsubscribe]
  WHERE (LOWER(LOWER(reason)) LIKE "%gdpr%" OR LOWER(LOWER(source)) LIKE "%gdpr%")
  GROUP BY email
) t3
ON t3.email = t1.email
WHERE t3.email IS NULL
GROUP EACH BY t1.email`;
​
const customers = `
SELECT t1.email, MAX(t1.max_created_time)
FROM (
  SELECT LOWER(LTRIM(RTRIM(email))) as email, MAX(created) as max_created_time
  FROM (
    SELECT LOWER(LTRIM(RTRIM(email))) as email, created, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created DESC) as row_num
    FROM [triggeredmail.reebok.customers]
    
  )
  WHERE row_num = 1
  GROUP BY email
)`;
​
const gdpr = `LEFT OUTER JOIN (
    SELECT LOWER(LTRIM(RTRIM(email))) as email
    FROM [triggeredmail.reebok.unsubscribe]
    WHERE (LOWER(LOWER(reason)) LIKE "%gdpr%" OR LOWER(LOWER(source)) LIKE "%gdpr%")
    GROUP BY email`;
​
const consolidated_optins = `
JOIN (
    SELECT LOWER(LTRIM(RTRIM(email))) as email
    FROM [triggeredmail.reebok.consolidated_optins]
    GROUP BY email
  `;
​
const viewed_product = `JOIN (
    SELECT LOWER(LTRIM(RTRIM(id_map.email))) as email, MAX(event.created) as max_created_time, event.id
    FROM (
      SELECT distinct_id, created, id
      FROM TABLE_QUERY([triggeredmail.reebok], 'table_id in ("aggregate_viewed_product_202207", "aggregate_viewed_product_202208")')
      WHERE created >= "2022-07-29 00:00:00" AND id != "null"
    ) event
    JOIN [triggeredmail.reebok.identifier_mapping] AS id_map
      ON id_map.distinct_id = event.distinct_id
    GROUP BY email, event.id`;
​
const legacy_sql = `#legacySQL `;
const t1_parenthesis = `) t1 `;
const t1 = `t1 `;
const t2_join = `) t2
ON t2.email = t1.email `;
const t2_group_t1 = `) t2
ON t2.email = t1.email
WHERE t2.email IS NULL
GROUP EACH BY t1.email`;
const t3_join = `) t3
ON t3.email = t1.email `;
const t3_group_t1 = `) t3
ON t3.email = t1.email
WHERE t3.email IS NULL
GROUP EACH BY t1.email`;
​
const all_customers = (legacy_sql + customers + t1 + gdpr + t2_group_t1);
const optin_customers = (legacy_sql + customers + t1 + consolidated_optins + t2_join + gdpr + t3_group_t1);
const viewed_product_all = (legacy_sql + customers + t1 + viewed_product + t2_join + gdpr + t3_group_t1);
//console.log(original_query);
//console.log(all_customers);
//console.log(optin_customers);
//console.log(viewed_product_all);
​
const filters = [original_query, all_customers, optin_customers, viewed_product_all];
​
function all_filters(names){
    names.forEach(function(x){
      console.log(x)
    });
  }
  all_filters(filters)
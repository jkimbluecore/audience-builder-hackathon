# Half SaaS

## Description

Have you ever wondered what caused your audience count to dwindle down so much?

What if we had a way to break down your audience preview, filter by filter?

Half SaaS generates a string of SQL and we can show the user what conditionals are limiting their audience, instead of hitting 'Preview' and guessing whats the limiter.

In summary, Half SaaS is a more detailed tool to present an audience count.

## Example Breakdown

Pulling a query that will filter for:
- Users who are opted in (100K users)
- who viewed a product within the past 30 days (50K products)
- where the product attribute on_sale is True (25K products)

### Usage

The function below will provide a filter to display all customers who viewed a product in the past 7 days.
```javascript
const viewed_product = `JOIN (
    SELECT LOWER(LTRIM(RTRIM(id_map.email))) as email, MAX(event.created) as max_created_time, event.id
    FROM (
      SELECT distinct_id, created, id
      FROM TABLE_QUERY([triggeredmail.reebok], 'table_id in ("aggregate_viewed_product_202207", "aggregate_viewed_product_202208")')
      WHERE created >= "2022-07-29 00:00:00" AND id != "null"
    ) event
    JOIN [triggeredmail.reebok.identifier_mapping] AS id_map
      ON id_map.distinct_id = event.distinct_id
    GROUP BY email, event.id`
;
const viewed_product_all = (legacy_sql + customers + t1 + viewed_product + t2_join + gdpr + t3_group_t1);

const filters = [original_query, all_customers, optin_customers, viewed_product_all];

function all_filters(names){
    names.forEach(function(x){
      console.log(x)
    });
}
all_filters(filters)

```

## Impact

Support receives many audience builder questions revolving around the why an audience count is the number that it is which leads to questions if the audience builder is broken.

More often it is not broken rather, there is a lack of knowledge/access of data that the partner/CSMs posess that Product Support has.

## Visuals

- Demo TBD

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
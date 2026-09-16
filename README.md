# MetricMind Raw Dataset

Synthetic corporate sales dataset created specifically for the Axlero Solutions MetricMind project.

Files:
- customers_raw.csv: customer and geography information (500 rows)
- products_raw.csv: product catalogue and unit economics (12 rows)
- orders_raw.csv: order-level sales transactions (10,000 rows)
- costs_raw.csv: cost components associated with orders (10,000 rows)
- date_dimension_raw.csv: date/quarter/month attributes for 2025 (365 rows)

Suggested governed metrics:
- Revenue = SUM(revenue) for completed orders
- Cost = SUM(total_cost)
- Profit = Revenue - Cost
- Margin % = Profit / Revenue * 100

Suggested dimensions:
- Time: year, quarter, month
- Geography: country, region
- Product: product_name, category
- Customer: segment
- Channel: sales_channel

Important:
This is synthetic/mock data, not real company data. Before building the Semantic Layer, the team should agree on the exact metric definitions and business rules.

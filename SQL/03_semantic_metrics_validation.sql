SELECT
    SUM(governed_revenue) AS revenue,
    SUM(governed_cost) AS cost,
    SUM(governed_profit) AS profit,
    CASE
        WHEN SUM(governed_revenue) <> 0
        THEN SUM(governed_profit) / SUM(governed_revenue) * 100
        ELSE 0
    END AS margin_pct
FROM public.sales_metrics;
SELECT
    COUNT(*) AS total_orders,
    SUM(CASE WHEN order_status = 'Completed' THEN 1 ELSE 0 END) AS completed_orders,
    SUM(CASE WHEN order_status = 'Completed' THEN governed_revenue ELSE 0 END) AS revenue,
    SUM(CASE WHEN order_status = 'Completed' THEN governed_cost ELSE 0 END) AS cost,
    SUM(CASE WHEN order_status = 'Completed' THEN governed_profit ELSE 0 END) AS profit
FROM public.sales_metrics;
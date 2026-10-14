cube(`Sales`, {
  sql_table: `public.sales_metrics`,

  measures: {
    revenue: {
      type: `sum`,
      sql: `governed_revenue`,
      format: `currency`
    },

    cost: {
      type: `sum`,
      sql: `governed_cost`,
      format: `currency`
    },

    profit: {
      type: `sum`,
      sql: `governed_profit`,
      format: `currency`
    },

    marginPercent: {
      type: `number`,
      sql: `CASE
        WHEN SUM(${CUBE}.governed_revenue) = 0 THEN 0
        ELSE SUM(${CUBE}.governed_profit)
             / SUM(${CUBE}.governed_revenue)
      END`,
      format: `percent`
    }
  },

  dimensions: {
    orderId: {
      sql: `order_id`,
      type: `string`,
      primaryKey: true
    },

    orderDate: {
      sql: `order_date`,
      type: `time`
    },

    country: {
      sql: `country`,
      type: `string`
    },

    region: {
      sql: `region`,
      type: `string`
    },

    productName: {
      sql: `product_name`,
      type: `string`
    },

    category: {
      sql: `category`,
      type: `string`
    },

    customerName: {
      sql: `customer_name`,
      type: `string`
    },

    segment: {
      sql: `segment`,
      type: `string`
    },

    salesChannel: {
      sql: `sales_channel`,
      type: `string`
    }
  }
});
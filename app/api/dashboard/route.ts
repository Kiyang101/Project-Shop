import database from "@/service/database";
import { NextResponse } from "next/server";
// Import your database client here (e.g., pg, postgres, Prisma raw queries)
import { query } from "@/lib/db";

export async function GET() {
  try {
    // ---------------------------------------------------------
    // 1. REVENUE & FINANCIAL BREAKDOWN
    // ---------------------------------------------------------
    const revenueQuery = `
      WITH Completed AS (
        SELECT COALESCE(SUM("totalPrice"), 0) as completed_total 
        FROM sales_history
      ),
      OrderStats AS (
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'pending' THEN "totalPrice" ELSE 0 END), 0) as pending_total,
          COALESCE(SUM(CASE WHEN status = 'cancelled' THEN "totalPrice" ELSE 0 END), 0) as cancelled_total
        FROM orders
      )
      SELECT * FROM Completed, OrderStats;
    `;
    const revenueRes = await database.query(revenueQuery);
    const revenueData = revenueRes.rows[0];

    // ---------------------------------------------------------
    // 2. ORDERS GROWTH (This Month vs Last Month)
    // ---------------------------------------------------------
    const ordersQuery = `
      SELECT
        COUNT(*) as total_orders,
        COUNT(CASE WHEN DATE_TRUNC('month', sold_at) = DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as this_month,
        COUNT(CASE WHEN DATE_TRUNC('month', sold_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') THEN 1 END) as last_month
      FROM sales_history;
    `;
    const ordersRes = await database.query(ordersQuery);
    const ordersData = ordersRes.rows[0];

    // ---------------------------------------------------------
    // 3. CUSTOMER INSIGHTS
    // ---------------------------------------------------------
    const customerQuery = `
      WITH UserCounts AS (
        SELECT 
          COUNT(*) as total_customers,
          COUNT(CASE WHEN DATE_TRUNC('month', "createDate") = DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as new_this_month
        FROM "users" 
        WHERE role = 'user' -- Adjust if you don't use roles
      ),
      RepeatPurchases AS (
        SELECT CAST(SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END) AS FLOAT) / NULLIF(COUNT(*), 0) * 100 as repeat_rate
        FROM (
          SELECT "userId", COUNT(*) as order_count 
          FROM orders 
          GROUP BY "userId"
        ) as UserOrderCounts
      )
      SELECT * FROM UserCounts, RepeatPurchases;
    `;
    const customerRes = await database.query(customerQuery);
    const customerData = customerRes.rows[0];

    // ---------------------------------------------------------
    // 4. PRODUCT PERFORMANCE (Unnesting the JSON array)
    // ---------------------------------------------------------
    // We use jsonb_array_elements to break out the [{}] array into rows
    const productQuery = `
      WITH ProductSales AS (
        SELECT 
          p.product->>'productName' as name,
          SUM((p.product->>'quantity')::int) as total_sold
        FROM sales_history sh,
        jsonb_array_elements(sh.products) as p(product)
        GROUP BY name
      )
      SELECT * FROM ProductSales ORDER BY total_sold DESC;
    `;
    const productRes = await database.query(productQuery);
    const allProducts = productRes.rows;

    // console.log(allProducts);

    const bestSeller =
      allProducts.length > 0 ? allProducts[0] : { name: "N/A", total_sold: 0 };
    const lowPerformer =
      allProducts.length > 0
        ? allProducts[allProducts.length - 1]
        : { name: "N/A", total_sold: 0 };

    // ---------------------------------------------------------
    // 5. FORMAT RESPONSE
    // ---------------------------------------------------------
    return NextResponse.json({
      revenue: {
        total: Number(revenueData.completed_total),
        completed: Number(revenueData.completed_total),
        pending: Number(revenueData.pending_total),
        cancelled: Number(revenueData.cancelled_total),
        // Simplistic cancel rate calculation
        cancelRate:
          Math.round(
            (Number(revenueData.cancelled_total) /
              (Number(revenueData.completed_total) +
                Number(revenueData.cancelled_total))) *
              100,
          ) || 0,
      },
      orders: {
        total: Number(ordersData.total_orders),
        thisMonth: Number(ordersData.this_month),
        lastMonth: Number(ordersData.last_month),
        change: Number(ordersData.this_month) - Number(ordersData.last_month),
        // Protect against division by zero
        growthRate:
          Number(ordersData.last_month) > 0
            ? Math.round(
                ((Number(ordersData.this_month) -
                  Number(ordersData.last_month)) /
                  Number(ordersData.last_month)) *
                  100,
              )
            : 100,
        avgDaily: Math.round(
          Number(ordersData.this_month) / new Date().getDate(),
        ), // Avg for current days passed in month
      },
      customers: {
        total: Number(customerData.total_customers),
        newThisMonth: Number(customerData.new_this_month),
        repeatRate: Math.round(Number(customerData.repeat_rate) || 0),
      },
      products: {
        bestSeller: {
          name: bestSeller.name,
          sold: Number(bestSeller.total_sold),
          growth: 0, // Would require a complex historical comparison query
        },
        lowPerformer: {
          name: lowPerformer.name,
          sold: Number(lowPerformer.total_sold),
          growth: 0,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}

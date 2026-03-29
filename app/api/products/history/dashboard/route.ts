import { NextResponse } from "next/server";
import database from "@/service/database";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/products/history/dashboard:
 *   get:
 *     summary: Get sales dashboard data
 *     description: Returns summary statistics and detailed order history for admin only.
 *     tags:
 *       - History
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sales data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: integer
 *                       example: 120
 *                     totalCustomers:
 *                       type: integer
 *                       example: 80
 *                     completedTotalTHB:
 *                       type: number
 *                       example: 15000
 *                     cancelledTotalTHB:
 *                       type: number
 *                       example: 2000
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: integer
 *                         example: 1
 *                       sold_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-03-29T10:00:00Z"
 *                       customerName:
 *                         type: string
 *                         example: "John Doe"
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                         example:
 *                           - productName: "Nike Air"
 *                             quantity: 2
 *                       totalPrice:
 *                         type: number
 *                         example: 999.99
 *                       status:
 *                         type: string
 *                         example: "complete"
 *       401:
 *         description: Unauthorized (not logged in or not admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *                 login:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 */

export async function GET(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user || _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    // Fetch all orders and join with User table to get customer names
    const ordersQuery = `
      SELECT 
        sh."orderId", 
        sh."sold_at", 
        o."userId", 
        u."name", 
        u."surName", 
        sh."products",         
        sh."totalPrice",
        o."status"
      FROM sales_history sh
      LEFT JOIN "orders" o ON sh."orderId" = o."orderId"
      LEFT JOIN "users" u ON o."userId" = u."userId"
      ORDER BY sh."sold_at" DESC;
    `;

    const order = await database.query(ordersQuery);
    const orders = order.rows;

    // console.log(orders);

    // Calculate summary statistics for the dashboard cards
    const totalSalesOrders = orders.length;

    // Unique customers count
    const uniqueCustomers = new Set(orders.map((o) => o.userId)).size;

    // Calculate Completed vs Cancelled totals
    let completedTotal = 0;
    let cancelledTotal = 0;

    orders.forEach((order) => {
      if (order.status.toLowerCase() === "complete") {
        completedTotal += Number(order.totalPrice);
      } else if (order.status.toLowerCase() === "cancelled") {
        cancelledTotal += Number(order.totalPrice);
      }
    });

    //  Return structured JSON
    return NextResponse.json(
      {
        summary: {
          totalOrders: totalSalesOrders,
          totalCustomers: uniqueCustomers,
          completedTotalTHB: completedTotal,
          cancelledTotalTHB: cancelledTotal,
        },
        orders: orders.map((order) => ({
          orderId: order.orderId,
          sold_at: order.sold_at,
          customerName:
            `${order.name || "Unknown"} ${order.surName || ""}`.trim(),
          products: order.products, // Assuming products is stored as JSON/JSONB array
          totalPrice: order.totalPrice,
          status: order.status,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 },
    );
  }
}

import database from "@/service/database";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/products/orders/all:
 *   get:
 *     summary: Get all orders
 *     description: Admin-only endpoint to retrieve all orders with product details.
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   orderId:
 *                     type: integer
 *                     example: 101
 *                   userId:
 *                     type: integer
 *                     example: 5
 *                   totalPrice:
 *                     type: number
 *                     example: 1999.99
 *                   status:
 *                     type: string
 *                     example: pending
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-29T10:00:00Z"
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: integer
 *                           example: 1
 *                         productName:
 *                           type: string
 *                           example: "Nike Air"
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                         price:
 *                           type: number
 *                           example: 999.99
 *                         size:
 *                           type: string
 *                           example: "M"
 *       401:
 *         description: Unauthorized (not admin or no token)
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
  const token = request.cookies.get("token")?.value;
  try {
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

    const q = `SELECT * FROM orders`;

    const result = await database.query(q);

    return Response.json(result.rows);
  } catch (error: any) {
    console.log("error", error);
    return Response.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 },
    );
  }
}

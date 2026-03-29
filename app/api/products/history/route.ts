import database from "@/service/database";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/products/history:
 *   post:
 *     summary: Insert sales history record
 *     description: Admin-only endpoint to store completed order data into sales history.
 *     tags:
 *       - History
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - products
 *               - totalPrice
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 101
 *               products:
 *                 type: array
 *                 description: List of purchased products
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 1
 *                     productName:
 *                       type: string
 *                       example: "Nike Air"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               totalPrice:
 *                 type: number
 *                 example: 1999.99
 *     responses:
 *       201:
 *         description: Insert successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insert Success
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
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
 *       409:
 *         description: Order already recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order already recorded
 *       500:
 *         description: Insert failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insert Fail
 *                 error:
 *                   type: string
 *                   example: Database error message
 */

export async function POST(request: Request) {
  const bodyData = await request.json();
  const { orderId, products, totalPrice } = bodyData;

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

    if (!orderId || !products || !totalPrice) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const exist = await database.query(
      `SELECT 1 FROM sales_history WHERE "orderId" = $1`,
      [orderId],
    );

    if (exist.rowCount > 0) {
      return Response.json(
        { message: "Order already recorded" },
        { status: 409 },
      );
    }

    const q = `INSERT INTO sales_history ("orderId", "products", "totalPrice") 
                VALUES ($1, $2, $3)`;

    const result = await database.query(q, [
      orderId,
      JSON.stringify(products),
      totalPrice,
    ]);
    return Response.json({ message: "Insert Success" }, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
  }
}

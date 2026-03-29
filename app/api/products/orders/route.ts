import database from "@/service/database";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/products/orders:
 *   get:
 *     summary: Get current user's orders
 *     description: Returns orders for the logged-in user.
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
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
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create new order
 *     description: Create a new order for the logged-in user.
 *     tags:
 *       - Orders
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - userId
 *               - totalPrice
 *               - status
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 5
 *               totalPrice:
 *                 type: number
 *                 example: 1999.99
 *               status:
 *                 type: string
 *                 example: pending
 *               products:
 *                 type: array
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
 *                     price:
 *                       type: number
 *                       example: 999.99
 *                     size:
 *                       type: string
 *                       example: "M"
 *     responses:
 *       200:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update order status
 *     description: Admin-only endpoint to update order status.
 *     tags:
 *       - Orders
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
 *               - status
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 101
 *               status:
 *                 type: string
 *                 example: complete
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *       401:
 *         description: Unauthorized
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

    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT * FROM orders WHERE "userId" = $1`;

    const result = await database.query(q, [_user.userId]);

    return Response.json(result.rows);
  } catch (error: any) {
    console.log("error", error);
    return Response.json(
      { message: "Failed to fetch orders", error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const bodyData = await request.json();
  const token = request.cookies.get("token")?.value;

  const { orderId, status } = bodyData;

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

    const q = `UPDATE orders SET "status" = $1 WHERE "orderId" = $2`;
    const result = await database.query(q, [status, orderId]);

    return Response.json({ message: "Success" });
  } catch (error) {
    console.log("error", error);
    return Response.json({ message: "Fail" });
  }
}

export async function POST(request: Request) {
  const bodyData = await request.json();
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

    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const { products, totalPrice, status } = bodyData;
    const userId = _user.userId;

    const q = `INSERT INTO orders ("products", "userId", "totalPrice", "status") 
              VALUES ($1, $2, $3, $4)`;
    const result = await database.query(q, [
      JSON.stringify(products),
      userId,
      totalPrice,
      status,
    ]);

    return Response.json({ message: "Success" });
  } catch (error) {
    console.log("error", error);
    return Response.json({ message: "Fail" });
  }
}

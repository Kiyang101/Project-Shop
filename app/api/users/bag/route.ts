import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/users/bag:
 *   get:
 *     summary: Get current user's bag
 *     description: Returns the shopping bag of the logged-in user.
 *     tags:
 *       - Bag
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User bag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bagId:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 5
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       productName:
 *                         type: string
 *                         example: "Nike Air"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         example: 999.99
 *                       size:
 *                         type: string
 *                         example: "M"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bag not found
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create new bag
 *     description: Create a shopping bag for the logged-in user.
 *     tags:
 *       - Bag
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
 *             properties:
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
 *         description: Bag created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insert Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update bag products
 *     description: Update products inside the user's bag.
 *     tags:
 *       - Bag
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bagId
 *               - products
 *             properties:
 *               bagId:
 *                 type: integer
 *                 example: 1
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
 *         description: Bag updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insert Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }

  try {
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;
    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT * FROM bag WHERE "userId" = $1`;
    const result = await database.query(q, [_user.userId]);

    if (result.rowCount === 0) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Fetch Fail", error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }

  try {
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user || !_user.userId) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const bodyData = await request.json();
    const { products } = bodyData;
    const userId = _user.userId;

    const q = `INSERT INTO bag ("products", "userId") 
                VALUES ($1, $2)`;

    const result = await database.query(q, [
      JSON.stringify(products) || [{}],
      userId,
    ]);
    return Response.json({ message: "Insert Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }

  try {
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const bodyData = await request.json();
    const { products, bagId } = bodyData;

    const q = `UPDATE bag SET "products" = $1 WHERE "bagId" = $2`;

    const result = await database.query(q, [JSON.stringify(products), bagId]);
    return Response.json({ message: "Update Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Update Fail", error: error.message },
      { status: 500 },
    );
  }
}

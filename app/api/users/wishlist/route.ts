import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/users/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     description: Returns all wishlist items of the logged-in user.
 *     tags:
 *       - Wishlist
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of wishlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   productId:
 *                     type: integer
 *                     example: 10
 *                   userId:
 *                     type: integer
 *                     example: 5
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Add product to wishlist
 *     description: Add a product to the logged-in user's wishlist.
 *     tags:
 *       - Wishlist
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Wishlist item added
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

    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const bodyData = await request.json();
    const { productId } = bodyData;

    const check = await database.query(
      `SELECT * FROM wishlist WHERE "userId"=$1 AND "productId"=$2`,
      [_user.userId, productId],
    );

    if (check.rowCount > 0) {
      return Response.json({ message: "Already in wishlist" }, { status: 400 });
    }

    const q = `INSERT INTO wishlist ("productId", "userId") 
                VALUES ($1, $2)`;

    const result = await database.query(q, [productId, _user.userId]);
    return Response.json({ message: "Insert Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
  }
}

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

    const q = `SELECT * FROM wishlist WHERE "userId" = $1`;

    const result = await database.query(q, [_user.userId]);
    return Response.json(result.rows);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Fetch Fail", error: error.message },
      { status: 500 },
    );
  }
}

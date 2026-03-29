import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/user/wishlist/all:
 *   get:
 *     summary: Get all wishlist items (Admin only)
 *     description: Returns all wishlist records in the system. Requires admin role.
 *     tags:
 *       - Wishlist
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all wishlist items
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
 *         description: Unauthorized (not admin)
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

    if (!_user || _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT * FROM wishlist`;

    const result = await database.query(q);
    return Response.json(result.rows);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Fetch Fail", error: error.message },
      { status: 500 },
    );
  }
}

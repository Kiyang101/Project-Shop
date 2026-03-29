import database from "@/service/database";
import jwt from "jsonwebtoken";
import { isNumberObject } from "util/types";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/products/season:
 *   get:
 *     summary: Get season products
 *     description: Retrieve all products marked as seasonal/featured.
 *     tags:
 *       - Season Products
 *     responses:
 *       200:
 *         description: List of season product IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Add product to season
 *     description: Admin-only endpoint to add a product to season_products.
 *     tags:
 *       - Season Products
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
 *                 example: 1
 *     responses:
 *       200:
 *         description: Insert success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Product already exists in season
 *       500:
 *         description: Server error
 */

export async function GET(request: NextRequest) {
  try {
    const q = `SELECT * FROM season_products`;
    const result = await database.query(q);
    return Response.json(result.rows);
  } catch (error) {
    console.log("error", error);
    return Response.json(error);
  }
}

export async function POST(request: NextRequest) {
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

    if (!_user || _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const exist = await database.query(
      `SELECT 1 FROM season_products WHERE "productId" = $1`,
      [values],
    );

    if (exist.rowCount > 0) {
      return Response.json({ message: "Already exists" }, { status: 409 });
    }

    const q = `INSERT INTO season_products ("productId") VALUES ($1)`;

    if (!bodyData.productId) {
      return Response.json(
        { message: "productId is required" },
        { status: 400 },
      );
    }
    const values = bodyData.productId;

    const result = await database.query(q, [values]);
    return Response.json({ message: "success" });
  } catch (error) {
    console.log("error", error);
    return Response.json(
      { message: "Failed", error: error.message },
      { status: 500 },
    );
  }
}

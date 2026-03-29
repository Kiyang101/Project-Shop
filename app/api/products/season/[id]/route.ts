import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/products/season/{id}:
 *   delete:
 *     summary: Remove product from season
 *     description: Admin-only endpoint to delete a product from the season_products table.
 *     tags:
 *       - Season Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID to remove from season
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Delete successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
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
 *       404:
 *         description: Product not found in season
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not Found
 *       500:
 *         description: Server error
 */

export async function DELETE(request: NextRequest, { params }) {
  try {
    const { id } = await params;
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

    const q = `DELETE FROM season_products WHERE "productId" = $1`;

    const result = await database.query(q, [id]);

    if (result.rowCount === 0) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }

    return Response.json({ message: "success" });
  } catch (error) {
    console.log("error", error);
    return Response.json(
      { message: "Delete failed", error: error.message },
      { status: 500 },
    );
  }
}

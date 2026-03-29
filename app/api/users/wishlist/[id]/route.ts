import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/users/wishlist/{id}:
 *   delete:
 *     summary: Remove item from wishlist
 *     description: Delete a wishlist item by ID for the logged-in user.
 *     tags:
 *       - Wishlist
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Wishlist item ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Wishlist item deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delete Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */

export async function DELETE(request: NextRequest, { params }) {
  const token = request.cookies.get("token")?.value;
  const { id } = await params;

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

    if (!id || isNaN(Number(id))) {
      return Response.json({ message: "Invalid ID" }, { status: 400 });
    }

    const q = `DELETE FROM wishlist WHERE "userId" = $1 AND "id" = $2`;

    const result = await database.query(q, [_user.userId, id]);

    if (result.rowCount === 0) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }

    return Response.json({ message: "Delete Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Delete Fail", error: error.message },
      { status: 500 },
    );
  }
}

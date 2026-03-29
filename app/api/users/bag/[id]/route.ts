import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/users/bag/{id}:
 *   delete:
 *     summary: Delete bag by ID
 *     description: Delete a specific bag using bagId.
 *     tags:
 *       - Bag
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bag ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Bag deleted successfully
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
 *       404:
 *         description: Bag not found
 *       500:
 *         description: Server error
 */

export async function DELETE(request: NextRequest, { params }) {
  const { id } = await params;
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

    const q = `DELETE FROM bag WHERE "bagId" = $1`;

    const result = await database.query(q, [id]);
    return Response.json({ message: "success" });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "fail" });
  }
}

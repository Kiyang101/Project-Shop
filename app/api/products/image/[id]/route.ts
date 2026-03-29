import database from "@/service/database";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/products/image/{id}:
 *   delete:
 *     summary: Delete image by ID
 *     description: Admin-only endpoint to delete an image from the database.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Image ID
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delete Success
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
 *         description: Image not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not Found
 *       500:
 *         description: Delete failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delete Fail
 *                 error:
 *                   type: string
 *                   example: Database error message
 */

export async function DELETE(request: Request, { params }) {
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
    const q = `DELETE FROM images WHERE "imageId" = $1`;
    const result = await database.query(q, [id]);

    if (result.rowCount === 0) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }

    return Response.json({ message: "Delete Success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Delete Fail", error: error.message },
      { status: 500 },
    );
  }
}

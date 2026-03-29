import { NextResponse } from "next/server";
import database from "@/service/database";

/**
 * @swagger
 * /api/products/image/view/{id}:
 *   get:
 *     summary: Get image by ID
 *     description: Returns the raw image file (binary) for the given image ID.
 *     tags:
 *       - Products
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
 *         description: Image file
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
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
 *         description: Server error
 */

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const q = `SELECT "imageId", "productId", "mimetype", "data", "orientation" FROM images WHERE "imageId" = $1`;
    const r = await database.query(q, [id]);
    if (r.rowCount == 0) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
    const row = r.rows[0];
    return new NextResponse(row.data, {
      status: 200,
      headers: {
        "Content-Type": row.mimetype,
        "Content-Disposition": `inline; filename="${row.productId}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}

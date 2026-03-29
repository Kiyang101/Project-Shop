import database from "@/service/database";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/users/detail/image/view/{id}:
 *   get:
 *     summary: Get user profile image
 *     description: Returns the profile image of a user by userId.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *           example: 1
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
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: Image not found
 *       500:
 *         description: Server error
 */

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { message: "Invalid user ID provided" },
      { status: 400 },
    );
  }

  if (isNaN(Number(id))) {
    return NextResponse.json(
      { message: "User ID must be a number" },
      { status: 400 },
    );
  }

  try {
    const q = `SELECT "imageData", "mimetype" FROM users WHERE "userId" = $1`;
    const result = await database.query(q, [id]);

    if (result.rowCount == 0) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    const row = result.rows[0];

    if (!row.imageData) {
      return NextResponse.json({ message: "No image" }, { status: 404 });
    }

    return new NextResponse(row.imageData, {
      status: 200,
      headers: {
        "Content-Type": row.mimetype,
        "Content-Disposition": `inline; filename="${id}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}

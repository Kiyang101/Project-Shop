import database from "@/service/database";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/users/detail/image:
 *   put:
 *     summary: Upload user profile image
 *     description: Upload and update profile image for the logged-in user.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update Success
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

export async function PUT(request: Request) {
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

    const formData = await request.formData();

    const file = formData.get("file") as File;
    const userId = formData.get("userId");

    if (!file || !userId) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ message: "Invalid file type" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const q = `UPDATE users SET "imageData" = $1, "mimetype" = $2 WHERE "userId" = $3 RETURNING *;`;
    const result = await database.query(q, [buffer, file.type, userId]);

    return Response.json(
      {
        message: "Update Success",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Update Fail", error: error.message },
      { status: 500 },
    );
  }
}

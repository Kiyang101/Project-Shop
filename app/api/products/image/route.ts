import database from "@/service/database";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/products/image:
 *   post:
 *     summary: Upload image for a product
 *     description: Admin-only endpoint to upload an image and attach it to a product.
 *     tags:
 *       - Products
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
 *               - productId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *               productId:
 *                 type: integer
 *                 example: 1
 *               orientation:
 *                 type: string
 *                 enum: [horizontal, vertical]
 *                 example: horizontal
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
 *                   example: Insert Success
 *                 id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Invalid request (missing fields or wrong content type)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
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
 *       500:
 *         description: Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insert Fail
 *                 error:
 *                   type: string
 *                   example: Database error message
 */

export async function POST(request: Request) {
  try {
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

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return Response.json(
        { message: "Invalid Content-Type. Expected multipart/form-data." },
        { status: 400 },
      );
    }

    // Parse as FormData instead of .json() or .file
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const productId = formData.get("productId");
    const orientation = formData.get("orientation");

    // Validation
    if (!file || !productId) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { message: "Only image files are allowed" },
        { status: 400 },
      );
    }

    // Convert File to Buffer for database storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const q = `
      INSERT INTO images ("productId", "data", "mimetype", "orientation")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await database.query(q, [
      productId,
      buffer,
      file.type, // mimetype
      orientation || "horizontal",
    ]);

    return Response.json(
      {
        message: "Insert Success",
        id: result.rows[0].id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
  }
}

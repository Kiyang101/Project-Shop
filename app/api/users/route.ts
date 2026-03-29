import jwt from "jsonwebtoken";
import database from "@/service/database";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Returns a list of all users. Requires admin role.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: string
 *                     example: user@email.com
 *                   name:
 *                     type: string
 *                     example: John
 *                   surName:
 *                     type: string
 *                     example: Doe
 *                   role:
 *                     type: string
 *                     example: user
 *                   country:
 *                     type: string
 *                     example: Thailand
 *                   createDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-29T10:00:00Z"
 *       401:
 *         description: Unauthorized (not logged in or not admin)
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update user role (Admin only)
 *     description: Update the role of a user. Requires admin privileges.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update Success
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
    const secret_key = process.env.SECRET_KEY;
    const _user = jwt.verify(token, secret_key);

    if (!_user || _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT "userId", "email", "name", "surName", "role", "country", "createDate" FROM users`;
    const result = await database.query(q);
    return Response.json(result.rows);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }

  try {
    const secret_key = process.env.SECRET_KEY;
    const _user = jwt.verify(token, secret_key);

    if (!_user || _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const bodyData = await request.json();
    const { userId, role } = bodyData;

    if (!userId || !role) {
      return Response.json({ message: "Invalid input" }, { status: 400 });
    }

    const q = `UPDATE users SET "role" = $1 WHERE "userId" = $2`;
    const result = await database.query(q, [role, userId]);
    return Response.json({ message: "Update Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }
}

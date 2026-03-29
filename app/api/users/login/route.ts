import database from "@/service/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password and set JWT cookie.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login success
 *         headers:
 *           Set-Cookie:
 *             description: JWT token stored in cookie
 *             schema:
 *               type: string
 *               example: token=abc123; HttpOnly; Secure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login Success
 *                 login:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login Fail
 *                 login:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 */

export async function POST(request: Request) {
  const bodyData = await request.json();
  const cookieStore = await cookies();
  try {
    if (!bodyData.email || !bodyData.password) {
      return Response.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const result = await database.query({
      text: `SELECT * FROM users WHERE "email" = $1`,
      values: [bodyData.email],
    });

    if (result.rowCount == 0) {
      return Response.json(
        { message: "Login Fail", login: false },
        { status: 400 },
      );
    }

    const login = await bcrypt.compare(
      bodyData.password,
      result.rows[0].password,
    );

    if (login) {
      const user = {
        userId: result.rows[0].userId,
        email: result.rows[0].email,
        name: result.rows[0].name,
        surName: result.rows[0].surName,
        role: result.rows[0].role,
      };
      const secret_key = process.env.SECRET_KEY;
      const token = jwt.sign(user, secret_key, { expiresIn: "72h" });

      cookieStore.set("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "strict",
      });

      return Response.json(
        { message: "Login Success", login: true },
        { status: 200 },
      );
    } else {
      return Response.json(
        { message: "Login Fail", login: false },
        { status: 400 },
      );
    }
  } catch (error) {
    console.log(error);
    cookieStore.delete("token");
    return Response.json(
      { message: "Login Fail", login: false },
      { status: 400 },
    );
  }
}

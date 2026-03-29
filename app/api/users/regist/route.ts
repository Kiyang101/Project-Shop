import database from "@/service/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user account with email, password, and personal information.
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
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John
 *               surName:
 *                 type: string
 *                 example: Doe
 *               country:
 *                 type: string
 *                 example: Thailand
 *     responses:
 *       200:
 *         description: Register success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register Success
 *                 regist:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Register failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *                 regist:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 */

export async function POST(request: Request) {
  const bodyData = await request.json();
  try {
    if (!bodyData.email || !bodyData.password || !bodyData.name) {
      return Response.json(
        { message: "Email, password and name are required" },
        { status: 400 },
      );
    }

    const Qchk = "SELECT * FROM users WHERE email = $1";
    const chk = await database.query({
      text: Qchk,
      values: [bodyData.email],
    });

    if (chk.rowCount > 0) {
      return Response.json(
        { message: "Register Fail", regist: false },
        { status: 400 },
      );
    }

    const hash = await bcrypt.hash(bodyData.password, 12);
    const q = `INSERT INTO users ("email", "name", "surName", "password", "country") VALUES ($1, $2, $3, $4, $5)`;
    const result = await database.query(q, [
      bodyData.email,
      bodyData.name,
      bodyData.surName,
      hash,
      bodyData.country,
    ]);

    return Response.json(
      {
        message: "Register Success",
        regist: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Register Fail", regist: false },
      { status: 400 },
    );
  }
}

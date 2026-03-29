import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/users/address:
 *   get:
 *     summary: Get current user's address
 *     description: Returns the address of the logged-in user.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: John
 *                 surName:
 *                   type: string
 *                   example: Doe
 *                 address:
 *                   type: string
 *                   example: 123 ถนนสุขุมวิท
 *                 town:
 *                   type: string
 *                   example: Pattaya
 *                 state:
 *                   type: string
 *                   example: Chonburi
 *                 zipcode:
 *                   type: string
 *                   example: "20150"
 *                 telephone:
 *                   type: string
 *                   example: "0812345678"
 *                 country:
 *                   type: string
 *                   example: Thailand
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create new address
 *     description: Create address for the logged-in user.
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
 *               - name
 *               - surName
 *               - address
 *               - town
 *               - state
 *               - zipcode
 *               - telephone
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               surName:
 *                 type: string
 *                 example: Doe
 *               address:
 *                 type: string
 *                 example: 123 ถนนสุขุมวิท
 *               town:
 *                 type: string
 *                 example: Pattaya
 *               state:
 *                 type: string
 *                 example: Chonburi
 *               zipcode:
 *                 type: string
 *                 example: "20150"
 *               telephone:
 *                 type: string
 *                 example: "0812345678"
 *               country:
 *                 type: string
 *                 example: Thailand
 *     responses:
 *       200:
 *         description: Address created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     surName:
 *                       type: string
 *                     address:
 *                       type: string
 *                     town:
 *                       type: string
 *                     state:
 *                       type: string
 *                     zipcode:
 *                       type: string
 *                     telephone:
 *                       type: string
 *                     country:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update address
 *     description: Update address for the logged-in user.
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
 *               - name
 *               - surName
 *               - address
 *               - town
 *               - state
 *               - zipcode
 *               - telephone
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *                 example: John
 *               surName:
 *                 type: string
 *                 example: Doe
 *               address:
 *                 type: string
 *                 example: 123 ถนนสุขุมวิท
 *               town:
 *                 type: string
 *                 example: Pattaya
 *               state:
 *                 type: string
 *                 example: Chonburi
 *               zipcode:
 *                 type: string
 *                 example: "20150"
 *               telephone:
 *                 type: string
 *                 example: "0812345678"
 *               country:
 *                 type: string
 *                 example: Thailand
 *     responses:
 *       200:
 *         description: Address updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     surName:
 *                       type: string
 *                     address:
 *                       type: string
 *                     town:
 *                       type: string
 *                     state:
 *                       type: string
 *                     zipcode:
 *                       type: string
 *                     telephone:
 *                       type: string
 *                     country:
 *                       type: string
 *       401:
 *         description: Unauthorized
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
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT * FROM address WHERE "userId" = $1`;
    const result = await database.query(q, [_user.userId]);

    if (result.rowCount === 0) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error("GET Address Error:", error);
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }
  try {
    const bodyData = await request.json();
    const {
      userId,
      name,
      surName,
      address,
      town,
      state,
      zipcode,
      telephone,
      country,
    } = bodyData;

    const q = `
      INSERT INTO address ("userId", "name", "surName", "address", "town", "state", "zipcode", "telephone", "country") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await database.query(q, [
      userId,
      name,
      surName,
      address,
      town,
      state,
      zipcode,
      telephone,
      country,
    ]);

    return Response.json({ message: "Insert Success" });
  } catch (error) {
    console.error("POST Address Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
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
    const bodyData = await request.json();
    const {
      userId,
      name,
      surName,
      address,
      town,
      state,
      zipcode,
      telephone,
      country,
    } = bodyData;

    const q = `
      UPDATE address 
      SET "name" = $1, "surName" = $2, "address" = $3, "town" = $4, "state" = $5, "zipcode" = $6, "telephone" = $7, "country" = $8
      WHERE "userId" = $9
    `;
    await database.query(q, [
      name,
      surName,
      address,
      town,
      state,
      zipcode,
      telephone,
      country,
      userId,
    ]);

    return Response.json({ message: "Update Success" });
  } catch (error) {
    console.error("PUT Address Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

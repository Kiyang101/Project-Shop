import { cookies } from "next/headers";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Clear authentication cookie and log out the user.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout success
 *         headers:
 *           Set-Cookie:
 *             description: Clears the JWT cookie
 *             schema:
 *               type: string
 *               example: token=; HttpOnly; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout Success
 *                 logout:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Server error
 */

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return Response.json(
      { message: "Logout Success", logout: true },
      { status: 200 },
    );
  } catch (error) {
    console.error(error.message);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

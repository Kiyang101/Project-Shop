import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

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

    if (!_user && _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT * FROM wishlist`;

    const result = await database.query(q);
    return Response.json(result.rows);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Fetch Fail", error: error.message },
      { status: 500 },
    );
  }
}

import jwt from "jsonwebtoken";
import database from "@/service/database";
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
    const secret_key = process.env.SECRET_KEY;
    const user = jwt.verify(token, secret_key);

    if (!user) {
      return NextRequest.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    if (user.role !== "admin") {
      return NextRequest.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT "email", "name", "surName", "role", "country" FROM users WHERE "role" = 'user'`;
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

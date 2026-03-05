import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
export async function POST(request: NextRequest) {
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

    if (!_user || !_user.userId) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const bodyData = await request.json();
    const { productId, userId } = bodyData;

    const q = `INSERT INTO wishlist ("productId", "userId") 
                VALUES ($1, $2)`;

    const result = await database.query(q, [productId, _user.userId]);
    return Response.json({ message: "Insert Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
  }
}

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

    if (!_user || !_user.userId) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT * FROM wishlist WHERE "userId" = $1`;

    const result = await database.query(q, [_user.userId]);
    return Response.json(result.rows);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Fetch Fail", error: error.message },
      { status: 500 },
    );
  }
}

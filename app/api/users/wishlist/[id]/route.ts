import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, { params }) {
  const token = request.cookies.get("token")?.value;
  const { id } = await params;

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

    const q = `DELETE FROM wishlist WHERE "userId" = $1 AND "id" = $2`;

    const result = await database.query(q, [_user.userId, id]);
    return Response.json({ message: "Delete Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Delete Fail", error: error.message },
      { status: 500 },
    );
  }
}

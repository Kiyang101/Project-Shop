import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user && _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }
    const q = `DELETE FROM season_products WHERE "productId" = $1`;

    const result = await database.query(q, [id]);
    return Response.json({ message: "success" });
  } catch (error) {
    console.log("error", error);
    return Response.json(error);
  }
}

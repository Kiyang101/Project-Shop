import database from "@/service/database";
import jwt from "jsonwebtoken";
import { isNumberObject } from "util/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const q = `SELECT * FROM season_products`;
    const result = await database.query(q);
    return Response.json(result.rows);
  } catch (error) {
    console.log("error", error);
    return Response.json(error);
  }
}

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  const token = request.cookies.get("token")?.value;

  try {
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;
    if (!_user && _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }
    const q = `INSERT INTO season_products ("productId") VALUES ($1)`;
    const values = bodyData.productId;
    // console.log("bodyData :", bodyData);
    // console.log("is int:", typeof bodyData);
    const result = await database.query(q, [values]);
    return Response.json({ message: "success" });
  } catch (error) {
    console.log("error", error);
    return Response.json(error);
  }
}

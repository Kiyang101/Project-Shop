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
    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT * FROM bag WHERE "userId" = $1`;
    const result = await database.query(q, [_user.userId]);

    if (result.rowCount === 0) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Fetch Fail", error: error.message },
      { status: 500 },
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
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user || !_user.userId) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const bodyData = await request.json();
    const { products, userId } = bodyData;

    const q = `INSERT INTO bag ("products", "userId") 
                VALUES ($1, $2)`;

    const result = await database.query(q, [
      JSON.stringify(products) || [{}],
      userId,
    ]);
    return Response.json({ message: "Insert Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
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
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user || !_user.userId) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const bodyData = await request.json();
    const { products, bagId } = bodyData;

    const q = `UPDATE bag SET "products" = $1 WHERE "bagId" = $2`;

    const result = await database.query(q, [JSON.stringify(products), bagId]);
    return Response.json({ message: "Insert Success" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {}

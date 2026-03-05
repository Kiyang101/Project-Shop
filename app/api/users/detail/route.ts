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
    const _user = jwt.verify(token, secret_key);

    // console.log(user);

    const chk = await database.query({
      text: `SELECT * FROM users WHERE "email" = $1`,
      values: [_user.email],
    });

    if (chk.rowCount == 0) {
      return Response.json(
        { message: "Login Fail", login: false },
        { status: 400 },
      );
    } else {
      if (_user.role != chk.rows[0].role) {
        return Response.json(
          { message: "Unauthorized", login: false },
          { status: 401 },
        );
      }
    }

    const q = `SELECT "userId", "email", "name", "surName", "role", "country", "imageData", "mimetype" FROM users WHERE "email" = $1`;
    const result = await database.query(q, [_user.email]);
    const user = result.rows[0];
    return Response.json(
      {
        userId: user.userId,
        email: user.email,
        name: user.name,
        surName: user.surName,
        role: user.role,
        country: user.country,
        login: true,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }
}

export async function PUT(request: Request) {
  const token = request.cookies.get("token")?.value;
  const bodyData = await request.json();

  if (!token) {
    return Response.json(
      { message: "Unauthorized", login: false },
      { status: 401 },
    );
  }

  try {
    const secret_key = process.env.SECRET_KEY;
    const _user = jwt.verify(token, secret_key);
    const email = _user.email;

    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }
    const q = `UPDATE users SET "name" = $1, "surName" = $2 WHERE "email" = $3`;
    const result = await database.query(q, [
      bodyData.name,
      bodyData.surName,
      email,
    ]);
    return Response.json(
      {
        message: "Update Success",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
  }
}

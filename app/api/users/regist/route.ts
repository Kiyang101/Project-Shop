import login from "@/components/Login";
import database from "@/service/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const bodyData = await request.json();
  //   console.log(bodyData);
  try {
    if (!bodyData.email || !bodyData.password || !bodyData.name) {
      return Response.json(
        { message: "Email, password and name are required" },
        { status: 400 },
      );
    }

    const Qchk = "SELECT * FROM users WHERE email = $1";
    const chk = await database.query({
      text: Qchk,
      values: [bodyData.email],
    });

    if (chk.rowCount > 0) {
      return Response.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }

    const hash = await bcrypt.hash(bodyData.password, 12);
    const q = `INSERT INTO users ("email", "name", "surName", "password", "country") VALUES ($1, $2, $3, $4, $5)`;
    const result = await database.query(q, [
      bodyData.email,
      bodyData.name,
      bodyData.surName,
      hash,
      bodyData.country,
    ]);

    return Response.json(
      {
        message: "Register Success",
        regist: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Register Fail", regist: false },
      { status: 400 },
    );
  }
}

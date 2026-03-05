import database from "@/service/database";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  // เช่น api/products/orders?orderId=1
  const token = request.cookies.get("token")?.value;
  //   const { searchParams } = new URL(request.url);
  //   const orderId = searchParams.get("orderId");
  try {
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

    const q = `SELECT * FROM orders`;

    const result = await database.query(q);

    return Response.json(result.rows);
  } catch (error) {
    console.log("error", error);
  }
}

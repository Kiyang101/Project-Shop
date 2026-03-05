import database from "@/service/database";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  // เช่น api/products/orders?orderId=1
  const token = request.cookies.get("token")?.value;
  // const { searchParams } = new URL(request.url);
  // const orderId = searchParams.get("orderId");
  try {
    if (!token) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user || !_user.userId) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `SELECT * FROM orders WHERE "userId" = $1`;

    const result = await database.query(q, [_user.userId]);

    return Response.json(result.rows);
  } catch (error) {
    console.log("error", error);
  }
}

export async function PUT(request: Request) {
  const bodyData = await request.json();
  const token = request.cookies.get("token")?.value;

  const { orderId, status } = bodyData;

  try {
    if (!token) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user || _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `UPDATE orders SET "status" = $1 WHERE "orderId" = $2`;
    const result = await database.query(q, [status, orderId]);

    return Response.json({ message: "Success" });
  } catch (error) {
    console.log("error", error);
    return Response.json({ message: "Fail" });
  }
}

export async function POST(request: Request) {
  const bodyData = await request.json();
  const token = request.cookies.get("token")?.value;
  try {
    if (!token) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const { products, userId, totalPrice, status } = bodyData;

    const q = `INSERT INTO orders ("products", "userId", "totalPrice", "status") 
              VALUES ($1, $2, $3, $4)`;
    const result = await database.query(q, [
      JSON.stringify(products),
      userId,
      totalPrice,
      status,
    ]);

    return Response.json({ message: "Success" });
  } catch (error) {
    console.log("error", error);
    return Response.json({ message: "Fail" });
  }
}

export async function DELETE(request: Request) {}

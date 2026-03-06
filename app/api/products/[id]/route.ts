import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }) {
  const { id } = await params;
  // console.log(id);
  try {
    const result = await database.query({
      text: `
        SELECT 
        p."productId",
        p."productName",
        p."description",
        p."price",
        p."sold",
        p."rating",
        p."active",
        p."quantity",
        p."size",
        p."category",
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'imageId', i."imageId",
                'orientation', i."orientation"
            )
        ) AS "images"
        FROM products p
        INNER JOIN images i ON p."productId" = i."productId"
        WHERE p."productId" = $1
        GROUP BY 
        p."productId", 
        p."productName", 
        p."description", 
        p."price", 
        p."sold", 
        p."rating", 
        p."active", 
        p."quantity", 
        p."size", 
        p."category"
        ORDER BY p."productId" ASC;
      `,
      values: [id],
    });
    const q = ``;
    // res.status(200).json(result.rows);
    return Response.json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
}

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
    const q = `DELETE FROM products WHERE "productId" = $1`;

    const result = await database.query(q, [id]);
    return Response.json({ message: "success" });
  } catch (error) {
    console.log(error.message);
    return Response.json({ message: "fail", error: error.message });
  }
}

export async function PUT(request: NextRequest, { params }) {
  try {
    const { id } = await params;
    const bodyData = await request.json();
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

    const quantity = bodyData.quantity;
    if (!quantity) {
      return Response.json({ message: "quantity is required" });
    }
    const q = `UPDATE products SET "quantity" = $1 WHERE "productId" = $2`;
    const result = await database.query(q, [quantity, id]);
    return Response.json({ message: "success" });
  } catch (error) {
    return Response.json({ message: "fail", error: error.message });
  }
}

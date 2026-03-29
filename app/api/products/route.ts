import database from "@/service/database";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieves a list of all products including their associated image IDs.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                   productName:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   sold:
 *                     type: integer
 *                   rating:
 *                     type: number
 *                   active:
 *                     type: boolean
 *                   quantity:
 *                     type: integer
 *                   size:
 *                     type: string
 *                   category:
 *                     type: string
 *                   imageIds:
 *                     type: array
 *                     items:
 *                       type: integer
 */

export async function GET() {
  try {
    const q = `SELECT
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
    COALESCE(ARRAY_AGG(i."imageId" ORDER BY i."imageId" ASC) FILTER (WHERE i."imageId" IS NOT NULL), '{}') AS "imageIds"
    FROM products p
    LEFT JOIN images i ON p."productId" = i."productId"
    GROUP BY
    p."productId", p."productName", p."description", p."price",
    p."sold", p."rating", p."active", p."quantity", p."size", p."category"
    ORDER BY p."productId" ASC;
     `;
    // const q = `SELECT * FROM products`;
    const result = await database.query(q);
    return Response.json(result.rows);
  } catch (error) {
    console.log("error", error);
  }
}

export async function POST(request: Request) {
  const bodyData = await request.json();
  // console.log(bodyData);
  const productName = bodyData.productName;
  const description = bodyData.description || "";
  const price = bodyData.price;
  const sold = bodyData.sold || 0;
  const rating = bodyData.rating || 0.0;
  const active = bodyData.active || true;
  const quantity = bodyData.quantity || 0;
  const size = bodyData.size || "";
  const category = bodyData.category || "";

  try {
    const token = request.cookies.get("token")?.value;

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

    if (!productName || !price || !quantity) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    const qc = `SELECT "productId", "productName" FROM products WHERE "productName" = $1`;
    const chk = await database.query(qc, [productName]);
    if (chk.rowCount > 0) {
      return;
    }
    const q = `INSERT INTO products ("productName", "description", "price", "sold", "rating", 
            "active", "quantity", "size", "category") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const result = await database.query(q, [
      productName,
      description,
      price,
      sold,
      rating,
      active,
      quantity,
      size,
      category,
    ]);
    return Response.json({ message: "Insert Success" });
  } catch (error) {
    console.log("error", error);
    return Response.json({ message: "Insert Fail" });
  }
}

export async function PUT(request: Request) {
  const bodyData = await request.json();
  try {
    const token = request.cookies.get("token")?.value;

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

    const {
      productId,
      productName,
      category,
      description,
      price,
      sold,
      rating,
      active,
      quantity,
    } = bodyData;

    if (!productId) {
      return Response.json({ message: "productId is required" });
    }
    const q = `UPDATE products SET "productName" = $1, "category" = $2, "description" = $3, "price" = $4, "sold" = $5, "rating" = $6, "active" = $7, "quantity" = $8 WHERE "productId" = $9`;
    const result = await database.query(q, [
      productName,
      category,
      description,
      price,
      sold,
      rating,
      active,
      quantity,
      productId,
    ]);
    return Response.json({ message: "Update Success" });
  } catch (error) {
    console.log("error", error);
    return Response.json({ message: "Update Fail" });
  }
}

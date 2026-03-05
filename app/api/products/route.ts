import database from "@/service/database";

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
    if (!productName || !price || !quantity) {
      return;
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

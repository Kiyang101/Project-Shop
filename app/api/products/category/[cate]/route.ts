import database from "@/service/database";

export async function GET(request, { params }) {
  const { cate } = await params;
  try {
    // const q = `SELECT * FROM products WHERE category = $1`;
    const q = `
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
    ARRAY_AGG(i."imageId") AS "imageIds"
    FROM products p 
    INNER JOIN images i ON p."productId" = i."productId"
    WHERE p.category = $1
    GROUP BY 
    p."productId", p."productName", p."description", p."price", 
    p."sold", p."rating", p."active", p."quantity", p."size", p."category"
    ORDER BY p."productId" ASC;
    `;
    const result = await database.query(q, [cate]);
    return Response.json(result.rows);
  } catch (error) {
    console.log(error.message);
    return Response.json(error.message);
  }
}

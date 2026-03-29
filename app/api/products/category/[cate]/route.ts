import database from "@/service/database";

/**
 * @swagger
 * /api/products/category/{cate}:
 *   get:
 *     summary: Get products by category
 *     description: Returns a list of products filtered by category including their image IDs.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: cate
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *         example: "coat"
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 1
 *                   productName:
 *                     type: string
 *                     example: "Fluffy coat"
 *                   description:
 *                     type: string
 *                     example: "Short, loose-fit coat in fluffy fabric with a collar and trims in coated fabric. Buttons down the front, long raglan sleeves and jetted side pockets."
 *                   price:
 *                     type: number
 *                     example: 99.99
 *                   sold:
 *                     type: integer
 *                     example: 120
 *                   rating:
 *                     type: number
 *                     format: float
 *                     example: 4.5
 *                   active:
 *                     type: boolean
 *                     example: true
 *                   quantity:
 *                     type: integer
 *                     example: 50
 *                   size:
 *                     type: string
 *                     example: "M"
 *                   category:
 *                     type: string
 *                     example: "coat"
 *                   imageIds:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     example: [1, 2, 3]
 *       500:
 *         description: Server error
 */

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

import database from "@/service/database";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/products/search/{query}:
 *   get:
 *     summary: Search products by name
 *     description: Returns products that match the search query (case-insensitive).
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: Search keyword for product name
 *         schema:
 *           type: string
 *         example: "coat"
 *     responses:
 *       200:
 *         description: List of matching products
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
 *                     example: "Nike Air"
 *                   description:
 *                     type: string
 *                     example: "Comfortable running shoes"
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
 *                     example: "shoes"
 *                   images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         imageId:
 *                           type: integer
 *                           example: 10
 *                         orientation:
 *                           type: string
 *                           example: "horizontal"
 *       500:
 *         description: Server error
 */

export async function GET(request: NextRequest, { params }) {
  const { query } = await params;
  try {
    if (!query) {
      return Response.json({ message: "Query is required" }, { status: 400 });
    }

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
        WHERE p."productName" ILIKE $1
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
      values: [`%${query}%`],
    });
    return Response.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 },
    );
  }
}

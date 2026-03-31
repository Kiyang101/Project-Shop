import database from "@/service/database";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Returns detailed product information including images.
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Product detail
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
 *                     example: Nike Air
 *                   description:
 *                     type: string
 *                     example: Running shoes
 *                   price:
 *                     type: number
 *                     example: 1999.99
 *                   sold:
 *                     type: integer
 *                     example: 10
 *                   rating:
 *                     type: number
 *                     example: 4.5
 *                   active:
 *                     type: boolean
 *                     example: true
 *                   quantity:
 *                     type: integer
 *                     example: 50
 *                   size:
 *                     type: string
 *                     example: M
 *                   category:
 *                     type: string
 *                     example: shoes
 *                   images:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         imageId:
 *                           type: integer
 *                           example: 1
 *                         orientation:
 *                           type: string
 *                           example: vertical
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete product (Admin only)
 *     description: Delete a product by ID. Requires admin role.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Product deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update product stock (Admin only)
 *     description: Update product quantity and sold count.
 *     tags:
 *       - Products
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - sold
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               sold:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

export async function GET(request: NextRequest, { params }) {
  const { id } = await params;
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

    if (result.rowCount === 0) {
      return Response.json({ message: "Not found" }, { status: 404 });
    }

    return Response.json(result.rows);
  } catch (error: any) {
    console.log(error.message);
    return Response.json({ error: error.message }, { status: 500 });
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

    if (!id || isNaN(Number(id))) {
      return Response.json({ message: "Invalid ID" }, { status: 400 });
    }

    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user || _user.role !== "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const q = `DELETE FROM products WHERE "productId" = $1`;

    const result = await database.query(q, [id]);

    if (result.rowCount === 0) {
      return Response.json({ message: "Not found" }, { status: 404 });
    }

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

    if (!id || isNaN(Number(id))) {
      return Response.json({ message: "Invalid ID" }, { status: 400 });
    }

    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;

    if (!_user) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }

    const { quantity, sold } = bodyData;
    if (!quantity) {
      return Response.json({ message: "quantity is required" });
    }
    const q = `UPDATE products SET "quantity" = $2, "sold" = $3 WHERE "productId" = $1`;
    const result = await database.query(q, [id, quantity, sold]);

    if (result.rowCount === 0) {
      return Response.json({ message: "Not found" }, { status: 404 });
    }

    return Response.json({ message: "success" });
  } catch (error) {
    return Response.json({ message: "fail", error: error.message });
  }
}

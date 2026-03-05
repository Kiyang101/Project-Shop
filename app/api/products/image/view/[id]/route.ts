import { NextResponse } from "next/server";
import database from "@/service/database";
export async function GET(request, { params }) {
  const { id } = await params;
  // console.log(id);
  try {
    const q = `SELECT "imageId", "productId", "mimetype", "data", "orientation" FROM images WHERE "imageId" = $1`;
    const r = await database.query(q, [id]);
    if (r.rowCount == 0) {
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
    const row = r.rows[0];
    return new NextResponse(row.data, {
      status: 200,
      headers: {
        "Content-Type": row.mimetype,
        "Content-Disposition": `inline; filename="${row.productId}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}

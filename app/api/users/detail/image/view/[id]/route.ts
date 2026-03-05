import database from "@/service/database";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;

  // 1. Check if id is missing or literally the string "undefined"
  if (!id || id === "undefined") {
    return NextResponse.json(
      { message: "Invalid user ID provided" },
      { status: 400 },
    );
  }

  // 2. (Optional but recommended) Ensure id is a valid number
  if (isNaN(Number(id))) {
    return NextResponse.json(
      { message: "User ID must be a number" },
      { status: 400 },
    );
  }

  try {
    const q = `SELECT "imageData", "mimetype" FROM users WHERE "userId" = $1`;
    // We can safely pass the id now
    const r = await database.query(q, [id]);

    if (r.rowCount == 0) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    const row = r.rows[0];
    return new NextResponse(row.imageData, {
      status: 200,
      headers: {
        "Content-Type": row.mimetype,
        "Content-Disposition": `inline; filename="${id}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Server error", { status: 500 });
  }
}

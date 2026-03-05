import database from "@/service/database";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return Response.json(
        { message: "Invalid Content-Type. Expected multipart/form-data." },
        { status: 400 },
      );
    }

    // 1. Parse as FormData instead of .json() or .file
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const productId = formData.get("productId");
    const orientation = formData.get("orientation");

    // Validation
    if (!file || !productId) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // 2. Convert File to Buffer for database storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Complete the SQL query
    const q = `
      INSERT INTO images ("productId", "data", "mimetype", "orientation")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const result = await database.query(q, [
      productId,
      buffer,
      file.type, // mimetype
      orientation || "horizontal",
    ]);

    return Response.json(
      {
        message: "Insert Success",
        id: result.rows[0].id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return Response.json(
      { message: "Insert Fail", error: error.message },
      { status: 500 },
    );
  }
}

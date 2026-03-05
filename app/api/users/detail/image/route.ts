import database from "@/service/database";

export async function PUT(request: Request) {
  try {
    // const contentType = request.headers.get("content-type") || "";
    // if (!contentType.includes("multipart/form-data")) {
    //   return Response.json(
    //     { message: "Invalid Content-Type. Expected multipart/form-data." },
    //     { status: 400 },
    //   );
    // }

    // 1. Parse as FormData instead of .json() or .file
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const userId = formData.get("userId");

    if (!file || !userId) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const q = `UPDATE users SET "imageData" = $1, "mimetype" = $2 WHERE "userId" = $3 RETURNING *;`;
    const result = await database.query(q, [buffer, file.type, userId]);

    return Response.json(
      {
        message: "Update Success",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Update Fail", error: error.message },
      { status: 500 },
    );
  }
}

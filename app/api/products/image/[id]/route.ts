import database from "@/service/database";
import jwt from "jsonwebtoken";

export async function DELETE(request: Request, { params }) {
  try {
    const { id } = await params;

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }
    const secret_key = process.env.SECRET_KEY as string;
    const _user = jwt.verify(token, secret_key) as any;
    if (!_user || !_user.userId || _user.role != "admin") {
      return Response.json(
        { message: "Unauthorized", login: false },
        { status: 401 },
      );
    }
    const q = `DELETE FROM images WHERE "imageId" = $1`;
    const result = await database.query(q, [id]);
    return Response.json({ message: "Delete Success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Delete Fail", error: error.message },
      { status: 500 },
    );
  }
}

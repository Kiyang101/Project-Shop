import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Deleting the cookie by setting its expiry to the past
    cookieStore.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Instantly expires the cookie
      path: "/", // Ensure the path matches where it was set
    });

    return Response.json(
      { message: "Logout Success", logout: true },
      { status: 200 },
    );
  } catch (error) {
    console.error(error.message);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

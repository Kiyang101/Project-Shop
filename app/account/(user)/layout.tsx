import SideBar from "@/components/SideBar";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const verifyAuth = async (token: string | undefined) => {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("JWT Verification Failed:", error.code, error.message);
    return null;
  }
};

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = await verifyAuth(token);

  return (
    <>
      <div className="">
        <div className="h-[10dvh] flex justify-center items-center bg-[rgba(0,0,0,0.15)]">
          <h1 className="text-3xl">MY ACCOUNT</h1>
        </div>
        <div className="flex justify-between mt-7">
          <SideBar />
          <div className="flex justify-center w-3/4">
            <div className="w-full">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

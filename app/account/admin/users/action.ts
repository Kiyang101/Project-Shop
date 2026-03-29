import useAuth from "@/service/auth";
import { redirect } from "next/navigation";
import useUser from "@/service/user";
import useProduct from "@/service/product";
import useImage from "@/service/image";

export async function updateUser_role(prevState, formdata) {
  const _user = useUser();
  const user = await _user.getUser();

  const userId = formdata.get("userId");
  const role = formdata.get("role");

  // console.log(userId, role);

  try {
    if (!user.login) {
      redirect("/login");
    }
    if (user.role != "admin") {
      redirect("/home");
    }
    if (!userId) {
      return { message: "userId is required" };
    }
    const res = await _user.updateUserRole({
      userId,
      role,
    });
    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "fail" };
  }
}

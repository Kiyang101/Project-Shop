import useAuth from "@/service/auth";
import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";

export async function login_handler(prevState, formData) {
  const auth = useAuth();
  const email = formData.get("email");
  const password = formData.get("password");
  if (!email || !password) {
    return { message: "Email and password are required" };
  }
  const res = await auth.login({ email, password });
  // console.log(res);

  if (res.login) {
    // redirect("/home");
    window.location.href = "/";
  } else {
    return { message: res.message };
  }
}

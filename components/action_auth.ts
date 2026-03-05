import axios from "axios";
import useAuth from "@/service/auth";
import { redirect } from "next/navigation";

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
    redirect("/home");
  } else {
    return { message: res.message };
  }
}

export async function regist_handler(prevState, formData) {
  const auth = useAuth();
  const email = formData.get("email");
  const password = formData.get("password");
  const passwordConfirm = formData.get("confirm_password");
  const name = formData.get("name");
  const country = formData.get("country") || "Thailand";
  try {
    if (!email || !password || !passwordConfirm || !name) {
      return { message: "Email, password and name are required" };
    }
    if (passwordConfirm !== password) {
      return { message: "Password and confirm password do not match" };
    }

    const res = await auth.regist({ email, password, name, country });
    // console.log(res);

    if (res.regist) {
      // redirect("/login");
    } else {
      return { message: res.message };
    }
  } catch (error) {
    console.log(error);
    return { message: "Register Fail" };
  }
}

import axios from "axios";
import useAuth from "@/service/auth";
import { redirect } from "next/navigation";

export async function regist_handler(prevState, formData) {
  const auth = useAuth();
  const email = formData.get("email");
  const password = formData.get("password");
  const passwordConfirm = formData.get("confirm_password");
  const name = formData.get("name");
  const surName = formData.get("surName") || "";
  const country = formData.get("country") || "";
  // console.log("formData", formData.get("email"));
  try {
    if (!email || !password || !passwordConfirm || !name) {
      return { message: "Email, password and name are required" };
    }
    if (passwordConfirm !== password) {
      return { message: "Password and confirm password do not match" };
    }

    const res = await auth.regist({ name, surName, email, password, country });
    // console.log(res);

    if (res.regist) {
      window.location.href = "/login";
      return { message: "Register Success" };
    } else {
      return { message: "Register Fail" };
    }
  } catch (error) {
    console.log(error);
    return { message: "Register Fail" };
  }
}

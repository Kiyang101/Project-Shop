import axios from "axios";
import useAuth from "@/service/auth";
import { redirect } from "next/navigation";
import useUser from "@/service/user";
import useProduct from "@/service/product";
import useImage from "@/service/image";

export async function postProduct_handler(prevState, formData) {
  const _user = useUser();
  const _product = useProduct();
  const user = await _user.getUser();
  const productName = formData.get("productName");
  const description = formData.get("description");
  const price = formData.get("price");
  const sold = formData.get("sold");
  const rating = formData.get("rating");
  const active = formData.get("active") || true;
  const quantity = formData.get("quantity");
  const size = formData.get("size") || "";
  const category = formData.get("category");

  try {
    if (!user.login) {
      redirect("/login");
    }
    if (user.role != "admin") {
      redirect("/home");
    }
    if (!productName || !price || !quantity || !category) {
      return { message: "productName, price and quantity are required" };
    }
    const res = await _product.postProduct({
      productName,
      description,
      price,
      sold,
      rating,
      active,
      quantity,
      size,
      category,
    });
    // console.log(res);
    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: res.message };
  }
}

export async function postProductImage_handler(prevState, formData) {
  const _user = useUser();
  const _iamge = useImage();
  const user = await _user.getUser();
  const productId = formData.get("productId");
  const file = formData.get("file");
  const orientation = formData.get("orientation");

  try {
    if (!user.login) {
      redirect("/home");
    }
    if (user.role != "admin") {
      redirect("/home");
    }
    if (!productId || !file) {
      return { message: "productId and file are required" };
    }
    const res = await _iamge.UploadImage({
      productId,
      file,
      orientation,
    });
    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "fail" };
  }
}

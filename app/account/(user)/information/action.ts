import useUser from "@/service/user";

export async function updateImage_handler(prevState, formData) {
  const _user = useUser();
  const user = await _user.getUser();
  const file = formData.get("file");
  const userId = user.userId;

  try {
    if (!user.login) {
      redirect("/home");
    }
    if (!userId || !file) {
      //   console.log(productId, file);
      return { message: "userId and file are required" };
    }
    const res = await _user.updateImage({
      userId,
      file,
    });
    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "fail" };
  }
}

export async function updateData_handler(prevState, formData) {
  const _user = useUser();
  const user = await _user.getUser();
  const name = formData.get("name");
  const surName = formData.get("surName");

  try {
    if (!user.login) {
      redirect("/home");
    }
    if (!name || !surName) {
      return { message: "name and surName are required" };
    }
    const res = await _user.updateData({
      name,
      surName,
    });
    return { message: "success" };
  } catch (error) {
    console.log(error);
    return { message: "fail" };
  }
}

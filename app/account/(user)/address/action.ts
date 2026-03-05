import useUser from "@/service/user";

export async function address_handler(prevState: any, formData: FormData) {
  const _user = useUser();
  const user = await _user.getUser();

  try {
    if (!user || !user.userId) {
      console.log("user not found");
      return { success: false, message: "Unauthorized" };
    }

    // 2. Data Extraction
    const userId = user.userId;
    const name = formData.get("name") as string;
    const surName = formData.get("surName") as string;
    const address = formData.get("address") as string;
    const town = formData.get("town") as string;
    const state = formData.get("state") as string;
    const zipcode = formData.get("zipcode") as string;
    const telephone = formData.get("telephone") as string;
    const country = formData.get("country") as string;

    // 3. Validation
    if (
      !name ||
      !surName ||
      !address ||
      !town ||
      !state ||
      !zipcode ||
      !telephone ||
      !country
    ) {
      return {
        success: false,
        message: "All fields (name, surname, address, etc.) are required.",
      };
    }

    // 4. Logic: Upsert (Update or Create)
    // const checkQuery = `SELECT * FROM address WHERE "userId" = $1`;
    // const existingAddress = await database.query(checkQuery, [userId]);
    const existingAddress = await _user.getAddress();
    // console.log(existingAddress);

    if (existingAddress.status === 404 || !existingAddress.data) {
      const res_post = await _user.postAddress({
        userId,
        name,
        surName,
        address,
        town,
        state,
        zipcode,
        telephone,
        country,
      });
      // console.log(res_post);
    } else {
      const res_put = await _user.updateAddress({
        userId,
        name,
        surName,
        address,
        town,
        state,
        zipcode,
        telephone,
        country,
      });
      // console.log(res_put);
    }

    return { success: true, message: "success" };
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Address Handler Error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

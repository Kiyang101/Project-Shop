import axios from "axios";

export default function image() {
  // Change the type to 'any' or an object interface if you aren't passing FormData directly
  const UploadImage = async (payload: {
    productId: any;
    file: any;
    orientation: String;
  }) => {
    try {
      // 1. Create a new FormData instance
      const data = new FormData();
      data.append("productId", payload.productId);
      data.append("file", payload.file);
      data.append("orientation", payload.orientation || "horizontal");

      // 2. Send the FormData instance.
      // Axios will automatically set the correct headers now.
      const res = await axios.post("/api/products/image", data);

      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {
        message: "An unexpected error occurred during upload",
        error: err.response?.data?.message || err.message,
      };
    }
  };

  const DeleteImage = async (id) => {
    try {
      const res = await axios.delete(`/api/products/image/${id}`);
      return res.data;
    } catch (err) {
      console.error("Delete failed:", err);
      return {
        message: "An unexpected error occurred during delete",
        error: err.response?.data?.message || err.message,
      };
    }
  };

  return { UploadImage, DeleteImage };
}

import axios from "axios";

export default function user() {
  const getUser = async () => {
    try {
      const res = await axios.get("/api/users/detail");
      return res.data;
    } catch (err) {
      return { login: false };
    }
  };
  const getAllUser = async (user) => {
    try {
      if (user.role !== "admin") {
        return;
      }

      const res = await axios.get("/api/users");
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateData = async (payload) => {
    try {
      const res = await axios.put("/api/users/detail", payload);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {};
    }
  };

  const updateImage = async (payload) => {
    try {
      const data = new FormData();
      data.append("userId", payload.userId);
      data.append("file", payload.file);

      const res = await axios.put("/api/users/detail/image", data);

      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {
        message: "An unexpected error occurred during upload",
        error: err.response?.data?.message || err.message,
      };
    }
  };

  const getAddress = async () => {
    try {
      const res = await axios.get("/api/users/address");
      return { data: res.data, status: res.status };
    } catch (err: any) {
      return {
        data: null,
        status: err.response?.status || 500,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  const updateAddress = async (payload) => {
    try {
      const res = await axios.put("/api/users/address", payload);
      return res.data;
    } catch (err) {
      console.error("Update failed:", err);
      return {};
    }
  };

  const postAddress = async (payload) => {
    try {
      const res = await axios.post("/api/users/address", payload);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {};
    }
  };

  const func = {
    getUser,
    getAllUser,
    updateImage,
    updateData,
    getAddress,
    updateAddress,
    postAddress,
  };
  return func;
}

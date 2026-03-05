import axios from "axios";

export default function bag() {
  const getBag = async () => {
    try {
      const res = await axios.get(`/api/users/bag`);
      return { data: res.data, status: res.status };
    } catch (err) {
      return {
        data: null,
        status: err.response?.status || 500,
        message: err.response?.data?.message || err.message,
      };
    }
  };
  const postBag = async (data) => {
    try {
      const res = await axios.post("/api/users/bag", data);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {
        message: "An unexpected error occurred during upload",
        error: err.message,
      };
    }
  };
  const putBag = async (data) => {
    try {
      const res = await axios.put("/api/users/bag", data);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {
        message: "An unexpected error occurred during upload",
        error: err.message,
      };
    }
  };

  const deleteBag = async (id) => {
    try {
      const res = await axios.delete(`/api/users/bag/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const func = { getBag, postBag, putBag, deleteBag };
  return func;
}

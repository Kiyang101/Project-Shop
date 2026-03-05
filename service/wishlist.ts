import axios from "axios";

export default function wishlist() {
  const getWishlist = async () => {
    try {
      const res = await axios.get("/api/users/wishlist");
      return res.data;
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };
  const postWishlist = async (data) => {
    try {
      const res = await axios.post("/api/users/wishlist", data);
      return res.data;
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };
  const deleteWishlist = async (id) => {
    try {
      const res = await axios.delete(`/api/users/wishlist/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const getAllWishlist = async () => {
    try {
      const res = await axios.get("/api/users/wishlist/all");
      return res.data;
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const func = { getWishlist, postWishlist, deleteWishlist, getAllWishlist };
  return func;
}

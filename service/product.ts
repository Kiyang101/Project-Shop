import axios from "axios";
import { get } from "http";

export default function product() {
  const getAllProduct = async () => {
    try {
      const res = await axios.get("/api/products");
      return res.data;
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  const postProduct = async (data) => {
    try {
      const res = await axios.post("/api/products", data);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {
        message: "An unexpected error occurred during upload",
        error: err.message,
      };
    }
  };

  const updateProduct = async (data) => {
    try {
      const res = await axios.put("/api/products", data);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {};
    }
  };

  const getProductByCategory = async (category) => {
    try {
      const res = await axios.get(`/api/products/category/${category}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching products by category:", err);
    }
  };

  const getProductById = async (id) => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching products by id:", err);
    }
  };

  const getSeasonProduct = async () => {
    try {
      const res = await axios.get("/api/products/season");
      return res.data;
    } catch (err) {
      console.error("Error fetching products by id:", err);
    }
  };

  const postSeasonProduct = async (data: { productId: Number }) => {
    try {
      const res = await axios.post("/api/products/season", data);
      return res.data;
    } catch (err) {
      console.error("Error fetching products by id:", err);
    }
  };

  const deleteSeasonProduct = async (id: Number) => {
    try {
      const res = await axios.delete(`/api/products/season/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error delete products by id:", err);
    }
  };

  const deleteProduct = async (id: Number) => {
    try {
      const res = await axios.delete(`/api/products/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error delete products by id:", err);
    }
  };

  const updateStock = async (id: Number, data: { quantity: Number }) => {
    try {
      const res = await axios.put(`/api/products/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("Upload failed:", err);
      return {};
    }
  };

  const func = {
    postProduct,
    getProductByCategory,
    getAllProduct,
    getProductById,
    updateProduct,
    getSeasonProduct,
    postSeasonProduct,
    deleteSeasonProduct,
    deleteProduct,
    updateStock,
  };
  return func;
}

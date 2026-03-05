import axios from "axios";

export default function order() {
  const getAllOrder = async () => {
    try {
      const res = await axios.get("/api/products/orders/all");
      return res.data;
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };
  // };
  // const getOrderById = async (id) => {
  //   try {
  //     const res = await axios.get(`/api/products/orders?orderId=${id}`);
  //     return res.data;
  //   } catch (err) {
  //     console.error("Error fetching orders:", err);
  //   }
  // };

  const getOrder = async () => {
    try {
      const res = await axios.get("/api/products/orders");
      return res.data;
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateStatus = async (data) => {
    try {
      const res = await axios.put("/api/products/orders", data);
      return res.data;
    } catch (err) {
      console.error("Error updating orders:", err);
    }
  };

  const func = {
    getAllOrder,
    getOrder,
    updateStatus,
  };
  return func;
}

import axios from "axios";

export default function history() {
  const postHistory = async (data) => {
    try {
      const res = await axios.post("/api/products/history", data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const getDashboard = async () => {
    try {
      const res = await axios.get("/api/products/history/dashboard");
      //   console.log(res);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  return { postHistory, getDashboard };
}

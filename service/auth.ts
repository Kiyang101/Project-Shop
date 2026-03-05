import axios from "axios";

export default function useAuth() {
  const login = async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post("/api/users/login", data);
      // console.log(res);
      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      if (axios.isAxiosError(err) && err.response) {
        return err.response.data;
      }
      // For non-axios errors or network issues where there's no response
      return {
        message: "An unexpected error occurred during login.",
        login: false,
      };
    }
  };

  const regist = async (data: {
    name: string;
    surName: string;
    email: string;
    password: string;
    country: string;
  }) => {
    try {
      const res = await axios.post("/api/users/regist", data);
      // console.log(res);
      return res.data;
    } catch (err) {
      console.error("Regist failed:", err);
      return {
        message: "An unexpected error occurred during regist.",
        regist: false,
      };
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post("/api/users/logout");
      return res.data;
    } catch (err) {
      console.error("Logout failed:", err);
      return {
        message: "An unexpected error occurred during logout.",
        logout: false,
      };
    }
  };

  const func = { login, regist, logout };
  return func;
}

import { jwtDecode } from "jwt-decode";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

 
// פונקציה להתחברות


interface LoginResponse {
  success: boolean;
  error?: string;
}

export const LoginService = {
  login: async (data: any): Promise<LoginResponse> => {
    try {
      const res = await axiosInstance.post("/Auth", data);

      const token = res.data.token;
      const decoded: any = jwtDecode(token);
      const role = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "Admin") {
        localStorage.setItem("token", token);
        const profile={email:"maof5728@gmail.com",name:"Riki Kraus",picture:'/images/profil-manager.jpg'}
        localStorage.setItem("profile", JSON.stringify(profile));
        return { success: true };
      } else {
        return { success: false, error: "Unauthorized: Admin access required." };
      }

    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.data) {
        return { success: false, error: e.response.data };
      }
      return { success: false, error: "Login failed, please try again." };
    }
  }
};


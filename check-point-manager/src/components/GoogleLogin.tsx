
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
declare global {
  interface Window {
    google: any;
  }
}
interface Profile{
  email: string;
  name: string;
  picture: string;  
}
interface GoogleLoginProps {
  onSuccessLogin: (email: string, messageType: string, message: string) => void;
}

const GoogleLogin = ({ onSuccessLogin }: GoogleLoginProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      const token = response.credential;
      const decodedGoogle: any = jwtDecode(token);
      const profile:Profile={email:decodedGoogle.email,name:decodedGoogle.name,picture:decodedGoogle.picture}
      localStorage.setItem("profile", JSON.stringify(profile));
      try {
        const res = await axiosInstance.post(
          `/auth/google-login`,
          { idToken: token },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const decoded: any = jwtDecode(res.data.token);
        const role = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (role === "Admin") {
          localStorage.setItem("token", res.data.token);
          onSuccessLogin(profile.email, "success", "התחברות עם גוגל הצליחה");
        } else {
          onSuccessLogin(profile.email, "error", "אין הרשאה: רק אדמין יכול להתחבר");
        }
      } catch (error) {
        console.error("שגיאה בהתחברות עם גוגל", error);
        onSuccessLogin(profile.email, "error", "שגיאה בהתחברות עם גוגל");
      }
      finally{
        navigate("/");

      }
    };

    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          { theme: "outline", size: "large" }
        );
      }
    };

    if (!window.google) {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initializeGoogle();
        }
      }, 100);
    } else {
      initializeGoogle();
    }
  }, []);

  return <div id="google-login-button"></div>;
};


export default GoogleLogin;

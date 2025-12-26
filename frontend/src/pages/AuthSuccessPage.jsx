import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth, authUser, socket } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      console.log("AuthSuccessPage - token:", token, "error:", error);

      if (error) {
        toast.error("Google sign-in failed");
        navigate("/login");
        return;
      }

      if (token) {
        try {
          // Store the token in localStorage
          localStorage.setItem("token", token);
          console.log("Token stored in localStorage:", token);
          
          // Set the token in axios default headers
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          console.log("Authorization header set");
          
          // Wait for auth check to complete
          console.log("Calling checkAuth...");
          await checkAuth();
          console.log("checkAuth completed, authUser:", authUser);
          
          // Wait a bit for socket to connect
          setTimeout(() => {
            console.log("Socket status:", socket?.connected);
            navigate("/");
          }, 500);
        } catch (err) {
          console.error("Auth failed:", err);
          toast.error("Authentication failed");
          navigate("/login");
        }
      } else {
        toast.error("No token received");
        navigate("/login");
      }
    };

    handleAuth();
  }, [searchParams, navigate, checkAuth, authUser, socket]);

  return <PageLoader />;
};

export default AuthSuccessPage;

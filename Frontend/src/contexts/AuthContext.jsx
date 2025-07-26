import { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import axios from "axios";
import { axiosPrivate } from "../api/axios.js";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  const sendVerifyLink = async () => {
    try {
      const response = await axiosPrivate.post(
        "/api/v1/users/sendEmail-verify"
      );
      console.log(response);
      if (response.data.success) {
        console.log("link is send to email");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signup = async (credentials, navigate) => {
    console.log("signup -> ", credentials);
    try {
      const response = await axios.post(
        "/api/v1/users/register",
        JSON.stringify(credentials),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data.success) {
        console.log("sign in successfully");
        navigate("/login");
      } else {
        console.log("error while signin", data.message);
      }
    } catch (error) {
      console.log("error --> ", error);
    }
  };

  const login = async ({ credentials }, navigate) => {
    console.log("logging ->", credentials);
    setError("");
    try {
      const response = await axios.post("/api/v1/users/login", credentials);
      const data = response.data;
      if (data.success) {
        const { accessToken, user } = data.data;

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        setUser(user);
        setIsVerified(user?.isVerified);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        console.log("error while logging", data);
        setError(data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Login failed. Please check your credentials and try again.";
        setError(message);
      } else {
        console.log("Unexpected error:", error);
        setError("Unexpected error:");
      }
    }
  };

  const logout = async () => {
    console.log("logout -> ", user?.username);
    try {
      const response = await axios.post("/api/v1/users/logout", {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        setUser(null);
        setIsVerified(false);
        setIsAuthenticated(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log("error while logout", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/users/current-user", {
          signal: controller.signal,
        });
        const data = response.data;
        if (isMounted && data.success) {
          setIsAuthenticated(true);
          setUser(data.data);
          setIsVerified(data.data?.isVerified);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        isVerified,
        setIsVerified,
        isAuthenticated,
        logout,
        login,
        signup,
        sendVerifyLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };

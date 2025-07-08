import { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import axios from "axios";
import { axiosPrivate } from "../api/axios.js";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const login = async ({ credentials }) => {
    console.log("logging ->", credentials);
    try {
      const response = await axios.post("/api/v1/users/login", credentials);
      const data = response.data;
      if (data.success) {
        const { accessToken, user } = data.data;

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        setUser(user);
        setIsAuthenticated(true);
      } else {
        console.log("error while logging", data.message);
      }
    } catch (error) {
      console.log("error --> ", error);
    }
  };

  const logout = async () => {
    console.log("logout -> ", user?.username);
    try {
      const response = await axios.post("api/v1/users/logout", {
        withCredentials: true,
      });
      const data = response.data;
      if (data.success) {
        setUser(null);
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
        const response = await axiosPrivate.get("api/v1/users/current-user", {
          signal: controller.signal,
        });
        const data = response.data;
        if (isMounted && data.success) {
          console.log("logged in when component mount");
          setIsAuthenticated(true);
          setUser(data.data);
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
        isAuthenticated,
        logout,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthProvider };

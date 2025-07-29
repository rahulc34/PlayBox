import axios from "axios";
const API = import.meta.env.VITE_API_URL;

const axiosPrivate = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If 401 error and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        if (originalRequest.url.includes("/refreshToken")) {
          return Promise.reject(error);
        }
        const refreshResponse = await axiosPrivate.post(
          "/api/v1/users/refreshToken"
        );
        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosPrivate };

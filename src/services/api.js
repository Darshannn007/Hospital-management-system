import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // ✅ FIXED
});

// 🔥 AUTO TOKEN ATTACH (VERY IMPORTANT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
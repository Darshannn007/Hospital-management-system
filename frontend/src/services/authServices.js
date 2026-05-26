import axios from "axios";

const BASE_ORIGIN = "https://hospital-management-system-production-ee9f.up.railway.app";
const API = `${BASE_ORIGIN}/auth`;


export const register = (data) => {
  return axios.post(`${API}/register`, data);
};

export const login = (data) => {
  return axios.post(`${API}/login`, data);
};

export const warmupBackend = () => {
  return fetch(BASE_ORIGIN, { mode: "no-cors", cache: "no-store" });
};

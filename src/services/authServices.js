import axios from "axios";

const API = "https://hms-deployement.onrender.com/auth";

export const register = (data) => {
  return axios.post(`${API}/register`, data);
};

export const login = (data) => {
  return axios.post(`${API}/login`, data);
};
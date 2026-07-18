import api from "./api";



export const register = (data) => {
  return api.post("/auth/register", data);
};

export const login = (data) => {
  return api.post(`/auth/login`, data);
};

export const warmupBackend = () => {
  return fetch(api, { mode: "no-cors", cache: "no-store" });
};

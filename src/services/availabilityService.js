import api from "./api";

// 🔥 GET SLOTS
export const getSlots = (doctorId, date) => {
  return api.get(`/availability?doctorId=${doctorId}&date=${date}`);
};

// 🔥 CREATE SLOT (ADMIN)
export const createSlot = (data) => {
  return api.post("/availability", data);
};

// 🔥 BOOK SLOT
export const bookSlot = (id) => {
  return api.put(`/availability/${id}/book`);
};
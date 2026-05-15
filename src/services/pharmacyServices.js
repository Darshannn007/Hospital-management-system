import api from "./api";

export const getMedicines = () => {
  return api.get("/pharmacy");
};

export const addMedicine = (payload) => {
  return api.post("/pharmacy", payload);
};

export const updateMedicineStock = (medicineId, stock) => {
  return api.put(`/pharmacy/${medicineId}/stock`, { stock });
};

export const markMedicineOrdered = (medicineId) => {
  return api.put(`/pharmacy/${medicineId}/mark-ordered`, {});
};
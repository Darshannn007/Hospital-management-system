import api from "./api";

// 🔥 GET all patients
export const getPatients = () => {
  return api.get("/api/patients");
};

// 🔥 ADD patient
export const addPatient = (data) => {
  return api.post("/api/patients", data);
};

// 🔥 DELETE patient
export const deletePatient = (id) => {
  return api.delete(`/api/patients/${id}`);
};

export const updatePatient = (id, data) => {
  return api.put(`api/patients/${id}`, data);
};
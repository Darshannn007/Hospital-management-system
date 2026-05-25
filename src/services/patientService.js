import api from "./api";

// 🔥 GET all patients
export const getPatients = () => {
  return api.get("/patients");
};

// 🔥 ADD patient
export const addPatient = (data) => {
  return api.post("/patients", data);
};

// 🔥 DELETE patient
export const deletePatient = (id) => {
  return api.delete(`/patients/${id}`);
};

export const updatePatient = (id, data) => {
  return api.put(`/patients/${id}`, data);
};
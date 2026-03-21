import api from "./api";

// Get all patients
export const getPatients = async () => {
  try {
    const response = await api.get("/patients");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch patients";
  }
};

export const addPatient = async (data) => {
  const response = await api.post("/patients", data);
  return response.data;
};

export const deletePatient = async (id) => {
  await api.delete(`/patients/${id}`);
};
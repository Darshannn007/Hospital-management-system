import api from "./api";

export const getAppointments = () => 
    api.get("/appointments");

export const addAppointment = (data) =>{
 return api.post("/appointments", data);}

export const deleteAppointment = (id) => {
    return api.delete(`/appointments/${id}`);
};

 export const updateAppointmentStatus = (id, status) =>{
    const token = localStorage.getItem("token");

    return api.put(`/appointments/${id}/status?status=${status}`,{},
        {headers:{Authorization : `Bearer ${token}`,}});
 }
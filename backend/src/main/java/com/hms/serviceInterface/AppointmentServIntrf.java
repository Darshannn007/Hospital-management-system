package com.hms.serviceInterface;

import com.hms.DTO.AppointmentDTO;

import java.util.List;

public interface AppointmentServIntrf {
    public List<AppointmentDTO> getAppointment();
   public AppointmentDTO appointmentCreate(AppointmentDTO appointmentDTO);
   public void updateStatus(Long id, String status);
   public void deleteAppoitment(Long id);
}

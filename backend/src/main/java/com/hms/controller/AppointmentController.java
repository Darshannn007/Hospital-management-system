package com.hms.controller;

import com.hms.DTO.AppointmentDTO;
import com.hms.serviceIMPL.AppointmentServImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentServImpl appointmentServImpl;

    public AppointmentController(AppointmentServImpl appointmentServImpl){
        this.appointmentServImpl = appointmentServImpl;
    }
    @GetMapping
    public List<AppointmentDTO> getApoointment(){
      return appointmentServImpl.getAppointment();
    }

    // ✅ CREATE
    @PostMapping
    public AppointmentDTO createAppointment(@RequestBody AppointmentDTO appointmentDTO){
        return appointmentServImpl.appointmentCreate(appointmentDTO);
    }

    // 🔥 NEW → STATUS UPDATE
    @PutMapping("/{id}/status")
    public String updateStatus(@PathVariable Long id, @RequestParam String status){
        appointmentServImpl.updateStatus(id, status);
        return "Status Updated";
    }

    @DeleteMapping("/{id}")
    public void deleteAppoitment(@PathVariable Long id){
        appointmentServImpl.deleteAppoitment(id);
    }
}
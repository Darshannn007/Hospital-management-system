package com.hms.controller;


import com.hms.DTO.DoctorAvailDTO;
import com.hms.serviceIMPL.DoctorAvailServImpl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin
public class DoctAvailController {

    private final DoctorAvailServImpl doctorAvailServ;
    public DoctAvailController(DoctorAvailServImpl doctorAvailServ){
        this.doctorAvailServ = doctorAvailServ;
    }


    @PostMapping
    public DoctorAvailDTO createSlot(@RequestBody DoctorAvailDTO doctorAvailDTO){
        return doctorAvailServ.createSlot(doctorAvailDTO);
    }

    @GetMapping
    public List<DoctorAvailDTO> getSlot(@RequestParam Long doctorId,@RequestParam String date){
        return doctorAvailServ.getSlots(doctorId,date);
    }

    @PutMapping({"/{id}/book"})
    public String bookSlot(@PathVariable Long id){
        doctorAvailServ.bookSlot(id);
        return "Booked";
    }

}

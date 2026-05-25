package com.hms.controller;

import com.hms.DTO.DoctorDTO;
import com.hms.serviceIMPL.DoctorServImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173") // 🔥 FIXED (remove /api)
public class DoctorController {

    private final DoctorServImpl doctorServ;

    public DoctorController(DoctorServImpl doctorServ){
        this.doctorServ = doctorServ;
    }

    // 🔥 GET ALL
    @GetMapping
    public List<DoctorDTO> getDoctors(){
        return doctorServ.getDoctor();
    }

    // 🔥 ADD
    @PostMapping
    public DoctorDTO addDoctor(@RequestBody DoctorDTO doctorDTO){
        return doctorServ.addDoctor(doctorDTO);
    }

    // 🔥 DELETE
    @DeleteMapping("/{id}")
    public void deleteDoctor(@PathVariable Long id){
        doctorServ.deleteDoctor(id);
    }

    // 🔥 UPDATE
    @PutMapping("/{id}")
    public DoctorDTO updateDoctor(@RequestBody DoctorDTO doctorDTO, @PathVariable Long id){
        return doctorServ.updateDoctor(doctorDTO, id);
    }
}
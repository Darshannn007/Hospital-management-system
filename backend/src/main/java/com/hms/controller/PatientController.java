package com.hms.controller;


import com.hms.DTO.PatientDTO;
import com.hms.entity.PatientEntity;
import com.hms.serviceIMPL.PatientServiceIMPL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientServiceIMPL patientServiceIMPL;

    public PatientController(PatientServiceIMPL patientServiceIMPL){
        this.patientServiceIMPL = patientServiceIMPL;
    }

    @GetMapping
    public List<PatientDTO> getAllPatient(){
    return patientServiceIMPL.getAllPatients();
    }

    @PostMapping
    public PatientDTO addPatient(@RequestBody PatientDTO patientDTO){
        return patientServiceIMPL.addPatient(patientDTO);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id){
        patientServiceIMPL.deletePatient(id);
    }

    @PutMapping("/{id}")
    public PatientDTO updatePatient(@PathVariable Long id,@RequestBody PatientDTO patientDTO){
        return patientServiceIMPL.updatePatient(id,patientDTO);
    }
}

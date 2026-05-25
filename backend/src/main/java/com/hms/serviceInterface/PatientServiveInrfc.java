package com.hms.serviceInterface;

import com.hms.DTO.PatientDTO;
import com.hms.entity.PatientEntity;

import java.util.List;

public interface PatientServiveInrfc {
    public List<PatientDTO> getAllPatients();
    public PatientDTO addPatient(PatientDTO patientDTO);
    public void deletePatient(Long id);
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO);
}

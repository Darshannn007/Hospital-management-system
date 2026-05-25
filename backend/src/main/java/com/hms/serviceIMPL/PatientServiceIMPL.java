package com.hms.serviceIMPL;

import com.hms.DTO.PatientDTO;
import com.hms.entity.PatientEntity;
import com.hms.repository.PatientRepository;
import com.hms.serviceInterface.PatientServiveInrfc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class PatientServiceIMPL implements PatientServiveInrfc {
    @Autowired
    PatientRepository patientRepository;

//    public PatientServiceIMPL(PatientRepository patientRepository){
//        this.patientRepository = patientRepository;
//    }

    public PatientEntity toEntity(PatientDTO DTO){
        PatientEntity p = new PatientEntity();
        p.setId(DTO.getId());
        p.setName(DTO.getName());
        p.setAge(DTO.getAge());
        p.setGender(DTO.getGender());
        p.setPhone(DTO.getPhone());
        return p;
    }
    public PatientDTO ToDto(PatientEntity entity){
        PatientDTO D = new PatientDTO();
        D.setId(entity.getId());
        D.setName(entity.getName());
        D.setAge(entity.getAge());
        D.setGender(entity.getGender());
        D.setPhone(entity.getPhone());
        return D;
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        List<PatientEntity> ent = patientRepository.findAll();
        List<PatientDTO> dto = new ArrayList<>();
        for(PatientEntity p : ent){
            PatientDTO dt = ToDto(p);
            dto.add(dt);
        }
        return dto;
    }

    @Override
    public PatientDTO addPatient(PatientDTO patientDTO) {
        PatientEntity saved = patientRepository.save(toEntity(patientDTO));
        return ToDto(saved);
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
     PatientEntity pat = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
     pat.setName(patientDTO.getName());
     pat.setAge(patientDTO.getAge());
     pat.setGender(patientDTO.getGender());
     pat.setId(patientDTO.getId());
     pat.setPhone(patientDTO.getPhone());
     return ToDto(patientRepository.save(pat));
    }
}

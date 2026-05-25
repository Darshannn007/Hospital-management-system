package com.hms.serviceIMPL;

import com.hms.DTO.DoctorDTO;
import com.hms.entity.DoctorEntity;
import com.hms.entity.PatientEntity;
import com.hms.repository.DoctorAvailRepository;
import com.hms.repository.DoctorRepository;
import com.hms.serviceInterface.DoctorServIntrf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorServImpl implements DoctorServIntrf {

    private final DoctorRepository doctorRepository;
    private final DoctorAvailRepository doctorAvailRepository;

    public DoctorServImpl(DoctorRepository doctorRepository,DoctorAvailRepository doctorAvailRepository) {
        this.doctorRepository = doctorRepository;
        this.doctorAvailRepository = doctorAvailRepository;
    }

    private DoctorEntity toEntity(DoctorDTO doctorDTO){
        DoctorEntity de = new DoctorEntity();
        de.setId(doctorDTO.getId());
        de.setName(doctorDTO.getName());
        de.setEducation(doctorDTO.getEducation());
        de.setSpecialization(doctorDTO.getSpecialization());
        de.setExperience(doctorDTO.getExperience());
        return de;
    }

    private DoctorDTO toDto(DoctorEntity doctorEntity){
        DoctorDTO dt = new DoctorDTO();
        dt.setId(doctorEntity.getId());
        dt.setName(doctorEntity.getName());
        dt.setEducation(doctorEntity.getEducation());
        dt.setSpecialization(doctorEntity.getSpecialization());
        dt.setExperience(doctorEntity.getExperience());
        return dt;
    }

    @Override
    public List<DoctorDTO> getDoctor() {
        List<DoctorEntity> pe = doctorRepository.findAll();
        List<DoctorDTO> dton = new ArrayList<>();
        for(DoctorEntity d : pe){
            DoctorDTO dto = toDto(d);
            dton.add(dto);
        }
        return dton;
    }

    @Override
    public DoctorDTO addDoctor(DoctorDTO doctorDTO) {
        DoctorEntity de = doctorRepository.save(toEntity(doctorDTO));
        return toDto(de);
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorAvailRepository.deleteByDoctorId(id);
        doctorRepository.deleteById(id);
    }

    @Override
    public DoctorDTO updateDoctor(DoctorDTO doctorDTO, Long id) {
        DoctorEntity de = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor Not Found"));
        de.setId(doctorDTO.getId());
        de.setName(doctorDTO.getName());
        de.setEducation(doctorDTO.getEducation());
        de.setSpecialization(doctorDTO.getSpecialization());
        de.setSpecialization(doctorDTO.getSpecialization());
        return toDto(doctorRepository.save(de));
    }
}

package com.hms.serviceInterface;

import com.hms.DTO.DoctorDTO;

import java.util.List;

public interface DoctorServIntrf {
    public List<DoctorDTO> getDoctor();
    public DoctorDTO addDoctor(DoctorDTO doctorDTO);
    public void deleteDoctor(Long id);
    public DoctorDTO updateDoctor(DoctorDTO doctorDTO,Long id);
}

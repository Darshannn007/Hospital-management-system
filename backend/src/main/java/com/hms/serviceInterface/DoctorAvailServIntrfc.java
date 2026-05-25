package com.hms.serviceInterface;

import com.hms.DTO.DoctorAvailDTO;
import com.hms.entity.DoctorEntity;

import java.util.List;

public interface DoctorAvailServIntrfc {
    public List<DoctorAvailDTO> getSlots(Long doctorId, String Date);
    public void bookSlot(Long id);
    public DoctorAvailDTO createSlot(DoctorAvailDTO doctorAvailDTO);
}

package com.hms.serviceIMPL;


import com.hms.DTO.DoctorAvailDTO;
import com.hms.entity.DoctorAvailEntity;
import com.hms.entity.DoctorEntity;
import com.hms.repository.DoctorAvailRepository;
import com.hms.repository.DoctorRepository;
import com.hms.serviceInterface.DoctorAvailServIntrfc;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorAvailServImpl implements DoctorAvailServIntrfc {

    private final DoctorRepository doctorRepository;

   private final DoctorAvailRepository doctorAvailRepository;
    public DoctorAvailServImpl(DoctorAvailRepository doctorAvailRepository, DoctorRepository doctorRepository){
        this.doctorAvailRepository = doctorAvailRepository;
        this.doctorRepository = doctorRepository;
    }
    private DoctorAvailEntity toEntity(DoctorAvailDTO doctorAvailDTO){
        DoctorAvailEntity dae = new DoctorAvailEntity();
        dae.setId(doctorAvailDTO.getId());
        dae.setDate(doctorAvailDTO.getDate());
        dae.setTimeSlot(doctorAvailDTO.getTimeSlot());
        dae.setBooked(doctorAvailDTO.isBooked());
         DoctorEntity da = doctorRepository.findById(doctorAvailDTO.getDoctorId()).orElseThrow(() -> new RuntimeException("Doctor not found"));
         dae.setDoctor(da);
         return dae;
    }

    private DoctorAvailDTO toDto(DoctorAvailEntity dae){
        DoctorAvailDTO dt = new DoctorAvailDTO();
        dt.setId(dae.getId());
        dt.setDate(dae.getDate());
        dt.setTimeSlot(dae.getTimeSlot());
        dt.setBooked(dae.isBooked());
        dt.setDoctorId(dae.getDoctor().getId());
        return dt;
    }



    @Override
    public DoctorAvailDTO createSlot(DoctorAvailDTO doctorAvailDTO) {
        DoctorAvailEntity saved = doctorAvailRepository.save(toEntity(doctorAvailDTO));
        return toDto(saved);
    }


    @Override
    public List<DoctorAvailDTO> getSlots(Long doctorId,String date){
        List<DoctorAvailEntity> dct = doctorAvailRepository.findByDoctorIdAndDate(doctorId,date);
        List<DoctorAvailDTO> dto = new ArrayList<>();

        for(DoctorAvailEntity d : dct){
            dto.add(toDto(d));
        }
        return dto;
    }

    @Override
    public void bookSlot(Long id) {
        DoctorAvailEntity slot = doctorAvailRepository.findById(id).orElseThrow(() -> new RuntimeException("Slot not found"));
        if (slot.isBooked()){
            throw new RuntimeException("Already Booked");
        }
        slot.setBooked(true);
        doctorAvailRepository.save(slot);
    }

}

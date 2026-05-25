package com.hms.serviceIMPL;

import com.hms.DTO.AppointmentDTO;
import com.hms.entity.AppointmentEntity;
import com.hms.entity.DoctorEntity;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.serviceInterface.AppointmentServIntrf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentServImpl implements AppointmentServIntrf {
    private AppointmentRepository appointmentRepository;
    private DoctorRepository doctorRepository;

    public AppointmentServImpl(AppointmentRepository appointmentRepository,DoctorRepository doctorRepository){
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public List<AppointmentDTO> getAppointment() {
        List<AppointmentEntity> ent = appointmentRepository.findAll();
        List<AppointmentDTO> aptdto = new ArrayList<>();

        for(AppointmentEntity a : ent){
            AppointmentDTO dto = new AppointmentDTO();
            dto.setId(a.getId());
            dto.setPatientName(a.getPatientName());
            dto.setDate(a.getDate());
            dto.setStatus(a.getStatus());
            dto.setDoctorName(a.getDoctorEntity().getName());

            aptdto.add(dto);
        }

        return aptdto;
    }

    @Override
    public AppointmentDTO appointmentCreate(AppointmentDTO appointmentDTO) {
      DoctorEntity doctorEntity = doctorRepository.findById(appointmentDTO.getDoctorId()).orElseThrow(()->
              new RuntimeException("Doctor not found"));

      AppointmentEntity ae = new AppointmentEntity();
      ae.setPatientName(appointmentDTO.getPatientName());
      ae.setDate(appointmentDTO.getDate());
      ae.setStatus("PENDING");  
      ae.setDoctorEntity(doctorEntity);

      AppointmentEntity saved = appointmentRepository.save(ae);

      AppointmentDTO res = new AppointmentDTO();
        res.setId(saved.getId());
        res.setPatientName(saved.getPatientName());
        res.setDoctorId(doctorEntity.getId());
        res.setDoctorName(doctorEntity.getName());
        res.setDate(saved.getDate());
        res.setStatus(saved.getStatus());

        return res;
    }

    @Override
    public void updateStatus(Long id, String status) {
       AppointmentEntity appt = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
       appt.setStatus(status.toUpperCase());
       appointmentRepository.save(appt);
    }

    @Override
    public void deleteAppoitment(Long id) {
        appointmentRepository.deleteById(id);
    }
}

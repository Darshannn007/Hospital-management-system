package com.hms.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAvailDTO {
    private Long id;
    private String date;
    private String timeSlot;
    private boolean booked;
    private Long doctorId;
}

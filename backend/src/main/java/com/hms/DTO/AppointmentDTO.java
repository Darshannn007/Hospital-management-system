package com.hms.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDTO {
    private Long id;

    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String date;
    private String status;
}

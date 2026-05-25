package com.hms.DTO;

import com.hms.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    private String email;
    private String name;
    private String phone;
    private Integer age;
    private String gender;
    private String password;
    private Role role;
    private String education;
    private String specialization;
    private String experience;
}

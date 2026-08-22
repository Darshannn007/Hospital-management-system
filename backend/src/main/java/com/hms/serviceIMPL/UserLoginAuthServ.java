package com.hms.serviceIMPL;

import com.hms.DTO.RegisterRequestDTO;
import com.hms.auth.JwtUtil;
import com.hms.entity.DoctorEntity;
import com.hms.entity.PatientEntity;
import com.hms.entity.Role;
import com.hms.entity.UserEntity;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.UserRepository;
import com.hms.serviceInterface.UserLoginAuthServIntrfc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserLoginAuthServ implements UserLoginAuthServIntrfc {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public UserLoginAuthServ(UserRepository userRepository, JwtUtil jwtUtil, 
                              PatientRepository patientRepository, DoctorRepository doctorRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.jwtUtil = jwtUtil;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void registerUser(RegisterRequestDTO registerRequestDTO) {
        userRepository.findByEmail(registerRequestDTO.getEmail()).ifPresent(u -> {
            throw new RuntimeException("User Already Exist");
        });
        if (registerRequestDTO.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Admin Register Not Allowed");
        }
        UserEntity usr = new UserEntity();
        usr.setEmail(registerRequestDTO.getEmail());
        usr.setPassword(passwordEncoder.encode(registerRequestDTO.getPassword()));
        usr.setRole(registerRequestDTO.getRole());
        userRepository.save(usr);

        if (registerRequestDTO.getRole() == Role.PATIENT){
            PatientEntity pt = new PatientEntity();
            pt.setEmail(registerRequestDTO.getEmail());
            pt.setName(registerRequestDTO.getName());
            pt.setAge(registerRequestDTO.getAge());
            pt.setGender(registerRequestDTO.getGender());
            pt.setPhone(registerRequestDTO.getPhone());
            patientRepository.save(pt);
        }
        if (registerRequestDTO.getRole() == Role.DOCTOR){
            DoctorEntity dc = new DoctorEntity();
            dc.setName(registerRequestDTO.getName());
            dc.setEducation(registerRequestDTO.getEducation());
            dc.setSpecialization(registerRequestDTO.getSpecialization());
            dc.setExperience(registerRequestDTO.getExperience());
            dc.setPhone(registerRequestDTO.getPhone());
            doctorRepository.save(dc);
        }
    }

    // 🔥 STEP 1: USER RETURN KARO (token nahi)
    @Override
    public UserEntity loginUser(String email, String pass) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found ✕"));

        if (!passwordEncoder.matches(pass, user.getPassword())) {
            throw new RuntimeException("Invalid password ✕");
        }

        return user; // 🔥 IMPORTANT
    }


    // 🔥 STEP 2: TOKEN ALAG METHOD ME
    public String generateToken(UserEntity user) {
        return jwtUtil.generateToken(user);
    }
}
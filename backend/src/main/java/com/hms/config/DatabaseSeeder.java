package com.hms.config;


import com.hms.entity.Role;
import com.hms.entity.UserEntity;
import com.hms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseSeeder {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository){
    return args -> {
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()){
            UserEntity admin = new UserEntity();
            admin.setEmail("admin@gmail.com");
            admin.setPassword("1234");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }
        if (userRepository.findByEmail("patient@gmail.com").isEmpty()){
            UserEntity patient = new UserEntity();
            patient.setEmail("patient@gmail.com");
            patient.setPassword("1234");
            patient.setRole(Role.PATIENT);
            userRepository.save(patient);
        }
    };
    }
}

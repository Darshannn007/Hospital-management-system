package com.hms.config;

import com.hms.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupWarmup implements ApplicationRunner {
    private final UserRepository userRepository;

    public StartupWarmup(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Touch the database once to warm up the connection pool
        userRepository.count();
    }
}

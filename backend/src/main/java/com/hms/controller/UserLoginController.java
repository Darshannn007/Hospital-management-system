package com.hms.controller;

import com.hms.DTO.LoginRequestDTO;
import com.hms.DTO.RegisterRequestDTO;
import com.hms.entity.UserEntity;
import com.hms.serviceIMPL.UserLoginAuthServ;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserLoginController {

    private final UserLoginAuthServ userLoginAuthServ;

    public UserLoginController(UserLoginAuthServ userLoginAuthServ){
        this.userLoginAuthServ = userLoginAuthServ;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequestDTO registerRequestDTO){
        userLoginAuthServ.registerUser(registerRequestDTO);
            return Map.of("message","User Regitstered Successfully!");
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        UserEntity user = userLoginAuthServ.loginUser(loginRequestDTO.getEmail(), loginRequestDTO.getPassword());
        String token = userLoginAuthServ.generateToken(user);
        return Map.of(
                "token", token,
                "email", user.getEmail(),
                "role", user.getRole().name()
        );
    }
}

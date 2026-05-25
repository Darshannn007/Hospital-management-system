package com.hms.serviceInterface;

import com.hms.DTO.RegisterRequestDTO;
import com.hms.entity.UserEntity;

public interface UserLoginAuthServIntrfc {

    // 🔥 USER RETURN (NOT TOKEN)
    UserEntity loginUser(String email, String pass);
    public void registerUser(RegisterRequestDTO registerRequestDTO);
}
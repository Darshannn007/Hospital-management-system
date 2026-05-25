package com.hms.repository;

import com.hms.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository <PatientEntity,Long> {
    Optional<PatientEntity> findByUserId(Long userId);
    Optional<PatientEntity> findByEmail(String email);
}

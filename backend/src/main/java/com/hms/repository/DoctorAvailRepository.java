package com.hms.repository;


import com.hms.entity.DoctorAvailEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorAvailRepository extends JpaRepository<DoctorAvailEntity, Long> {
    List<DoctorAvailEntity> findByDoctorIdAndDate(Long doctorId, String date);
    @Modifying
    @Transactional
    @Query("DELETE FROM DoctorAvailEntity da WHERE da.doctor.id = :doctorId")
    void deleteByDoctorId(Long doctorId);
}

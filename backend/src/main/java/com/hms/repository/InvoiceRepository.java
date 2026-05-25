package com.hms.repository;

import com.hms.entity.InvoiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository <InvoiceEntity,Long>{
    List<InvoiceEntity> findByPatientId(Long patientId);
 }

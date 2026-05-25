package com.hms.serviceInterface;

import com.hms.entity.PharmacyEntity;

import java.util.List;

public interface PharmacyServIntrf {
    List<PharmacyEntity> getAllPharm();
    PharmacyEntity addPharm(PharmacyEntity pharmacyEntity);
    PharmacyEntity updatePharm(Long id,Integer stock);
    PharmacyEntity markOrdered(Long id);
}
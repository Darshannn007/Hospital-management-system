package com.hms.serviceIMPL;

import com.hms.entity.PharmacyEntity;
import com.hms.repository.PharmacyRepository;
import com.hms.serviceInterface.PharmacyServIntrf;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PharmacyServIMPL implements PharmacyServIntrf {

    private final PharmacyRepository pharmacyRepository;

    public PharmacyServIMPL(PharmacyRepository pharmacyRepository){
        this.pharmacyRepository = pharmacyRepository;
    }

    @Override
    public List<PharmacyEntity> getAllPharm() {
        return pharmacyRepository.findAll();
    }

    @Override
    public PharmacyEntity addPharm(PharmacyEntity pharmacyEntity) {
        if (pharmacyEntity.getOrdered() == null){pharmacyEntity.setOrdered(false);}
        return pharmacyRepository.save(pharmacyEntity);
    }

    @Override
    public PharmacyEntity updatePharm(Long id, Integer stock) {
        PharmacyEntity pm = pharmacyRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
        if (stock > 0) {
            pm.setOrdered(false);
        }
        return pharmacyRepository.save(pm);
    }
    @Override
    public PharmacyEntity markOrdered(Long id) {
        PharmacyEntity pm = pharmacyRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
        pm.setOrdered(true);
        return pharmacyRepository.save(pm);
    }
}

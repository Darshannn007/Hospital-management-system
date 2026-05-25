package com.hms.controller;


import com.hms.entity.PharmacyEntity;
import com.hms.serviceIMPL.PharmacyServIMPL;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pharmacy")
@CrossOrigin(origins = "http://localhost:5173")
public class PharmacyController {

    private final PharmacyServIMPL pharmacyServIMPL;
    public PharmacyController(PharmacyServIMPL pharmacyServIMPL){
        this.pharmacyServIMPL = pharmacyServIMPL;
    }

    @GetMapping
    public List<PharmacyEntity> getAllPharm(){
        return pharmacyServIMPL.getAllPharm();
    }

    @PostMapping
    public PharmacyEntity addPharm(@RequestBody PharmacyEntity pharmacyEntity){
        return pharmacyServIMPL.addPharm(pharmacyEntity);
    }

    @PutMapping("/{id}/stock")
    public PharmacyEntity updatePharm(@PathVariable Long id, @RequestBody Map<String, Integer> body){
        Integer stock = body.get("stock");
        return pharmacyServIMPL.updatePharm(id,stock);
    }

    @PutMapping("/{id}/mark-ordered")
    public PharmacyEntity markOrdered(@PathVariable Long id){
        return pharmacyServIMPL.markOrdered(id);
    }


}

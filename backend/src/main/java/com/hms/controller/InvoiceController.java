package com.hms.controller;


import com.hms.entity.InvoiceEntity;
import com.hms.entity.PatientEntity;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import com.hms.repository.InvoiceRepository;
import com.hms.repository.PatientRepository;
import com.hms.serviceIMPL.InvoiceServImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "http://localhost:5173")
public class InvoiceController {

    InvoiceRepository invoiceRepository;
    InvoiceServImpl invoiceServ;
    PatientRepository patientRepository;

    public InvoiceController(InvoiceRepository invoiceRepository,InvoiceServImpl invoiceServ,PatientRepository patientRepository) {
        this.invoiceRepository = invoiceRepository;
        this.invoiceServ = invoiceServ;
        this.patientRepository = patientRepository;
    }

    //ALL INVOICES
    @GetMapping
    public List<InvoiceEntity> getAllInvoices(){
        return invoiceServ.getAllInvoices();
    }

    //UPLOAD INVOICES
    @PostMapping("/upload")
    public InvoiceEntity uploadInvoice(@RequestParam Long patientId,
                                       @RequestParam MultipartFile invoiceFile,
                                       @RequestParam String paymentStatus)throws Exception {
        return invoiceServ.uploadInvoice(patientId, paymentStatus, invoiceFile);
    }

    //UPDATION
    @PutMapping("/{id}/payment_status")
    public String updatePaymentStatus(@PathVariable Long id, @RequestParam String status){
        invoiceServ.updatePaymentStatus(id,status);
        return "Updated Successfully";
    }

    @GetMapping("/my-invoices")
    public List<InvoiceEntity> getMyInvoices(
            @RequestHeader("Authorization") String authHeader
    ) {

        String token = authHeader.replace("Bearer ", "");

        String email = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(
                        "mysecretkeyyyyyyyyyyyyyyyyyyyyyyyyy123".getBytes()
                ))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

        PatientEntity patient =
                patientRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Patient not found"));

        return invoiceServ.getInvoiceByPatientId(patient.getId());
    }

    @GetMapping("/my-invoices/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {

        InvoiceEntity invoice = invoiceServ.getInvoice(id);

        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=" + invoice.getFileName())
                .body(invoice.getData());
    }


}

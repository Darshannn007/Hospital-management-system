package com.hms.serviceIMPL;

import com.hms.entity.InvoiceEntity;
import com.hms.entity.PatientEntity;
import com.hms.repository.InvoiceRepository;
import com.hms.repository.PatientRepository;
import com.hms.serviceInterface.InvoiceServiceIntrf;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class  InvoiceServImpl implements InvoiceServiceIntrf {

    private final PatientRepository patientRepository;
    private final InvoiceRepository invoiceRepository;

    public InvoiceServImpl(InvoiceRepository invoiceRepository,PatientRepository patientRepository){
        this.invoiceRepository = invoiceRepository;
        this.patientRepository = patientRepository;
    }


    @Override
    public InvoiceEntity uploadInvoice(Long patientId, String paymentStatus, MultipartFile invoiceFile) throws IOException {

        PatientEntity patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        InvoiceEntity iv = new InvoiceEntity();
        iv.setPatient(patient);
        iv.setData(invoiceFile.getBytes());
        iv.setUploadedAt(LocalDateTime.now());
        iv.setFileName(invoiceFile.getOriginalFilename());
        iv.setFileType(invoiceFile.getContentType());
        iv.setPaymentStatus(paymentStatus);

        return invoiceRepository.save(iv);
    }

    @Override
    public List<InvoiceEntity> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public List<InvoiceEntity> getInvoiceByPatientId(Long patientId) {
        return invoiceRepository.findByPatientId(patientId);
    }

    @Override
    public void updatePaymentStatus(Long id, String status) {
        InvoiceEntity iv = invoiceRepository.findById(id).orElseThrow(()->new RuntimeException("Invoice not found"));
        iv.setPaymentStatus(status);
        invoiceRepository.save(iv);
    }

    @Override
    public InvoiceEntity getInvoice(Long id) {
      return invoiceRepository.findById(id).orElseThrow(()->new RuntimeException("Invoice not found"));
    }
}

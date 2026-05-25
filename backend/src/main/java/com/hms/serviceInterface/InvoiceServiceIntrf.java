package com.hms.serviceInterface;

import com.hms.entity.InvoiceEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface InvoiceServiceIntrf {
        public InvoiceEntity uploadInvoice(Long patientId, String paymentStatus, MultipartFile file) throws IOException;
        public List<InvoiceEntity> getAllInvoices();
        public List<InvoiceEntity> getInvoiceByPatientId(Long patientId);
        public void updatePaymentStatus(Long id,String status);
        public InvoiceEntity getInvoice(Long id);
}

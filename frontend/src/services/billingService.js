import api from "./api";

export const getAdminInvoices = () => {
  return api.get("/billing");
};

export const uploadInvoiceForPatient = ({ patientId, paymentStatus, invoiceFile }) => {
  const formData = new FormData();
  formData.append("patientId", patientId);
  formData.append("paymentStatus", paymentStatus);
  formData.append("invoiceFile", invoiceFile);

  return api.post("/billing/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateInvoicePaymentStatus = (invoiceId, status) => {
  return api.put(`/billing/${invoiceId}/payment_status?status=${status}`, {});
};

export const getMyInvoices = () => {
  return api.get("/billing/my-invoices");
};

export const downloadMyInvoice = (invoiceId) => {
  return api.get(`/billing/my-invoices/${invoiceId}/download`, {
    responseType: "blob",
  });
};

export const createPaymentOrder = (amount) => {
  return api.post("/payment/create-order", { amount });
};

export const verifyPayment = (paymentData) => {
  return api.post("/payment/verify", paymentData);
};


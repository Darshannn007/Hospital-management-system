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
    },});};

export const updateInvoicePaymentStatus = (invoiceId, status) => {
  return api.put(`/billing/${invoiceId}/payment-status?status=${status}`, {});
};

export const getMyInvoices = () => {
  return api.get("/billing/my-invoices");
};

export const downloadMyInvoice = (invoiceId) => {
  return api.get(`/billing/my-invoices/${invoiceId}/download`, {
    responseType: "blob",
  });};

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { IconCalendar } from "@tabler/icons-react";
import {
  downloadMyInvoice,
  getAdminInvoices,
  getMyInvoices,
  updateInvoicePaymentStatus,
  uploadInvoiceForPatient,
} from "../services/billingService";

const getInvoiceNumber = (invoice) =>
  invoice.invoiceNumber || invoice.number || `INV-${invoice.id || "NA"}`;

const getInvoiceDate = (invoice) => invoice.invoiceDate || invoice.date || invoice.createdAt;

const getInvoiceAmount = (invoice) =>
  invoice.totalAmount ?? invoice.amount ?? invoice.total ?? invoice.grandTotal ?? 0;

const getPatientIdFromInvoice = (invoice) =>
  invoice.patientId || invoice.patient?.id || invoice.patient?.patientId || "-";

const getPaymentStatus = (invoice) => (invoice.paymentStatus || invoice.status || "pending").toUpperCase();

const normalizeInvoices = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const formatDate = (value) => {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN");
};

const formatAmount = (value) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value || "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const getFilenameFromDisposition = (contentDisposition) => {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const quotedMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return quotedMatch?.[1] || null;
};

const Billing = () => {
  const { role } = useSelector((state) => state.auth);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [adminForm, setAdminForm] = useState({
    patientId: "",
    paymentStatus: "Pending",
    invoiceFile: null,
  });

  const fetchMyInvoices = async () => {
    setLoading(true);
    try {
      const res = await getMyInvoices();
      setInvoices(normalizeInvoices(res.data));
    } catch (err) {
      console.log(err);
      toast.error("Unable to load invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminInvoices = async () => {
    setLoading(true);
    try {
      const res = await getAdminInvoices();
      setInvoices(normalizeInvoices(res.data));
    } catch (err) {
      console.log(err);
      toast.error("Unable to load admin invoices");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "PATIENT") {
      fetchMyInvoices();
      return;
    }

    if (role === "ADMIN") {
      fetchAdminInvoices();
      return;
    }

    setLoading(false);
  }, [role]);

  const handleUploadForPatient = async (e) => {
    e.preventDefault();

    if (!adminForm.patientId.trim()) {
      toast.error("Patient ID required");
      return;
    }

    if (!adminForm.invoiceFile) {
      toast.error("Invoice file required");
      return;
    }

    try {
      setUploading(true);
      await uploadInvoiceForPatient({
        patientId: adminForm.patientId.trim(),
        paymentStatus: adminForm.paymentStatus,
        invoiceFile: adminForm.invoiceFile,
      });

      toast.success("Invoice uploaded successfully");

      setAdminForm({
        patientId: "",
        paymentStatus: "Pending",
        invoiceFile: null,
      });

      fetchAdminInvoices();
    } catch (err) {
      console.log(err);
      toast.error("Invoice upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAdminStatusUpdate = async (invoice, status) => {
    const invoiceId = invoice.id || invoice.invoiceId;

    if (!invoiceId) {
      toast.error("Invalid invoice");
      return;
    }

    try {
      setUpdatingId(invoiceId);
      await updateInvoicePaymentStatus(invoiceId, status);
      toast.success(`Payment status marked ${status}`);
      fetchAdminInvoices();
    } catch (err) {
      console.log(err);
      toast.error("Payment status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownload = async (invoice) => {
    const invoiceId = invoice.id || invoice.invoiceId;

    if (!invoiceId) {
      toast.error("Invalid invoice");
      return;
    }

    try {
      setDownloadingId(invoiceId);
      const res = await downloadMyInvoice(invoiceId);

      const contentType = res.headers?.["content-type"] || "application/pdf";
      const blob = new Blob([res.data], { type: contentType });

      let fileName = getFilenameFromDisposition(res.headers?.["content-disposition"]);

      if (!fileName) {
        const invoiceNo = getInvoiceNumber(invoice);
        const extension = contentType.includes("pdf") ? "pdf" : "bin";
        fileName = `${invoiceNo}.${extension}`;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Invoice downloaded");
    } catch (err) {
      console.log(err);
      toast.error("Error occured during download Invoice");
    } finally {
      setDownloadingId(null);
    }
  };

  if (role === "ADMIN") {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-gray-800 p-4 md:p-6 overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="mb-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <IconCalendar size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                💰 Billing Management
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
              Admin Billing
            </h1>
            <p className="text-gray-600 mt-1">
              Patient ID ke basis par invoice upload karo aur payment status manually update karo.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Invoice For Patient</h2>

            <form onSubmit={handleUploadForPatient} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Patient ID</label>
                <input
                  type="text"
                  value={adminForm.patientId}
                  onChange={(e) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      patientId: e.target.value,
                    }))
                  }
                  placeholder="Enter patient ID"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Payment Status</label>
                <select
                  value={adminForm.paymentStatus}
                  onChange={(e) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      paymentStatus: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                >
                  <option value="pending">PENDING</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Invoice File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    setAdminForm((prev) => ({
                      ...prev,
                      invoiceFile: e.target.files?.[0] || null,
                    }))
                  }
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-3 rounded-xl text-sm font-semibold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Invoice"}
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">All Invoice Records</h2>
                <p className="text-gray-500 text-xs">Total {invoices.length} invoice(s)</p>
              </div>
              <button
                onClick={fetchAdminInvoices}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Invoice No</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Patient ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        Loading invoices...
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        No invoices available.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice, index) => {
                      const invoiceId = invoice.id || invoice.invoiceId || `admin-row-${index}`;
                      const paymentStatus = getPaymentStatus(invoice);

                      return (
                        <tr
                          key={invoiceId}
                          className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">{getInvoiceNumber(invoice)}</td>
                          <td className="px-6 py-4 text-gray-700">{getPatientIdFromInvoice(invoice)}</td>
                          <td className="px-6 py-4 text-gray-700">{formatDate(getInvoiceDate(invoice))}</td>
                          <td className="px-6 py-4 text-gray-700">{formatAmount(getInvoiceAmount(invoice))}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                paymentStatus === "DONE"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAdminStatusUpdate(invoice, "DONE")}
                                disabled={updatingId === (invoice.id || invoice.invoiceId)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Mark Done
                              </button>
                              <button
                                onClick={() => handleAdminStatusUpdate(invoice, "pending")}
                                disabled={updatingId === (invoice.id || invoice.invoiceId)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                Mark pending
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role !== "PATIENT") {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-gray-800 p-4 md:p-6 overflow-hidden">
        <div className="relative z-10 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 p-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
            Billing
          </h1>
          <p className="text-gray-600 mt-2">
            Patient invoices download feature enabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-gray-800 p-4 md:p-6 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <IconCalendar size={20} className="text-white" />
            </div>
            <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              🧾 My Billing
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
            My Invoices
          </h1>
          <p className="text-gray-600 mt-1">You can download your invoices from here.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Invoice Records</h2>
              <p className="text-gray-500 text-xs">Total {invoices.length} invoice(s)</p>
            </div>
            <button
              onClick={fetchMyInvoices}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      Loading invoices...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      Aapke account me abhi koi invoice available nahi hai.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice, index) => {
                    const invoiceId = invoice.id || invoice.invoiceId || `row-${index}`;
                    const status = invoice.status || "PENDING";

                    return (
                      <tr
                        key={invoiceId}
                        className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{getInvoiceNumber(invoice)}</td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(getInvoiceDate(invoice))}</td>
                        <td className="px-6 py-4 text-gray-700">{formatAmount(getInvoiceAmount(invoice))}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDownload(invoice)}
                            disabled={downloadingId === (invoice.id || invoice.invoiceId)}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {downloadingId === (invoice.id || invoice.invoiceId)
                              ? "Downloading..."
                              : "Download Invoice"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;

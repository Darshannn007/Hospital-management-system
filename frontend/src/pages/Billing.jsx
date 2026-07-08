import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { 
  IconCalendar, 
  IconFileInvoice, 
  IconUpload, 
  IconDownload, 
  IconRefresh, 
  IconCheck, 
  IconClock 
} from "@tabler/icons-react";
import {
  downloadMyInvoice,
  getAdminInvoices,
  getMyInvoices,
  updateInvoicePaymentStatus,
  uploadInvoiceForPatient,
} from "../services/billingService";

const PAYMENT_STATUS = {
  DONE: "DONE",
  PENDING: "PENDING",
};

const getInvoiceNumber = (invoice) =>
  invoice.invoiceNumber || invoice.number || `INV-${invoice.id || "NA"}`;

const getInvoiceDate = (invoice) => invoice.invoiceDate || invoice.date || invoice.createdAt;

const getInvoiceAmount = (invoice) =>
  invoice.totalAmount ?? invoice.amount ?? invoice.total ?? invoice.grandTotal ?? 0;

const getPatientIdFromInvoice = (invoice) =>
  invoice.patientId || invoice.patient?.id || invoice.patient?.patientId || "-";

const getPaymentStatus = (invoice) => {
  const rawStatus = String(invoice.paymentStatus || invoice.status || PAYMENT_STATUS.PENDING).toUpperCase();

  if (rawStatus === PAYMENT_STATUS.DONE || rawStatus === "PAID") {
    return PAYMENT_STATUS.DONE;
  }
  return PAYMENT_STATUS.PENDING;
};

const toBackendPaymentStatus = (status) =>
  status === PAYMENT_STATUS.DONE ? PAYMENT_STATUS.DONE : PAYMENT_STATUS.PENDING;

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
    paymentStatus: PAYMENT_STATUS.PENDING,
    invoiceFile: null,
  });

  const fetchMyInvoices = async () => {
    setLoading(true);
    try {
      const res = await getMyInvoices();
      setInvoices(normalizeInvoices(res.data));
    } catch (err) {
      console.log(err);
      toast.error("Invoices registry inaccessible");
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
      toast.error("Unable to load invoices ledger");
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
      toast.error("Patient ID is required");
      return;
    }
    if (!adminForm.invoiceFile) {
      toast.error("Invoice PDF file is required");
      return;
    }

    try {
      setUploading(true);
      await uploadInvoiceForPatient({
        patientId: adminForm.patientId.trim(),
        paymentStatus: toBackendPaymentStatus(adminForm.paymentStatus),
        invoiceFile: adminForm.invoiceFile,
      });

      toast.success("Invoice PDF uploaded successfully! ✅");
      setAdminForm({
        patientId: "",
        paymentStatus: PAYMENT_STATUS.PENDING,
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
      toast.error("Invalid invoice selection");
      return;
    }

    try {
      setUpdatingId(invoiceId);
      await updateInvoicePaymentStatus(invoiceId, toBackendPaymentStatus(status));
      toast.success(`Payment marked as ${status} ✅`);
      fetchAdminInvoices();
    } catch (err) {
      console.log(err);
      toast.error("Payment status modification failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDownload = async (invoice) => {
    const invoiceId = invoice.id || invoice.invoiceId;
    if (!invoiceId) {
      toast.error("Invalid invoice selection");
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

      toast.success("Invoice downloaded successfully! 📥");
    } catch (err) {
      console.log(err);
      toast.error("Error occurred while downloading invoice PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  // ADMIN SCREEN LAYOUT
  if (role === "ADMIN") {
    return (
      <div className="p-5 md:p-8 space-y-6 text-slate-200">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/3 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Ledger
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 uppercase">
              Admin Billing Ledger
            </h1>
            <p className="text-xs text-slate-300 mt-1.5 font-medium tracking-wide">
              Upload patient invoices and manually audit billing payment streams.
            </p>
          </div>
        </div>

        {/* Upload Segment Form */}
        <div className="glass-card rounded-3xl p-6 shadow-sm space-y-5 border border-white/10">
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Upload Patient Invoice</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Draft files to Patients Registry profile
            </p>
          </div>

          <form onSubmit={handleUploadForPatient} className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Patient ID</label>
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
                className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Payment Status</label>
              <select
                value={adminForm.paymentStatus}
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer focus:border-cyan-500"
              >
                <option value={PAYMENT_STATUS.PENDING} className="bg-slate-900 text-slate-200">PENDING</option>
                <option value={PAYMENT_STATUS.DONE} className="bg-slate-900 text-slate-200">DONE</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Invoice PDF File</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setAdminForm((prev) => ({
                    ...prev,
                    invoiceFile: e.target.files?.[0] || null,
                  }))
                }
                className="w-full px-3 py-2 border border-dashed border-white/20 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-xs text-slate-400 bg-white/2 cursor-pointer"
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full btn-teal-outline px-5 py-3 rounded-xl font-bold text-xs shadow-md uppercase tracking-wider h-[42px] disabled:opacity-60"
            >
              <IconUpload size={15} className="inline mr-1" />
              {uploading ? "Uploading..." : "Upload Invoice"}
            </button>
          </form>
        </div>

        {/* Invoice List Table */}
        <div className="glass-card rounded-3xl shadow-sm overflow-hidden border border-white/10">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">All Ledger Invoices</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Audit list of {invoices.length} registers
              </p>
            </div>
            <button
              onClick={fetchAdminInvoices}
              className="p-2 bg-cyan-950/20 hover:bg-cyan-950/45 border border-cyan-500/20 text-cyan-400 rounded-xl transition-colors"
              title="Refresh ledger"
            >
              <IconRefresh size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-white/2 border-b border-white/5 text-slate-350">
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Invoice Code</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Patient Code</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Billing Date</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Total Value</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Status Badge</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Audit Controls</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="hms-spinner mx-auto mb-3"></div>
                      <p className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Loading Invoices...</p>
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-450 text-xs font-bold uppercase tracking-widest">
                      No invoices uploaded
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice, index) => {
                    const invoiceId = invoice.id || invoice.invoiceId || `admin-row-${index}`;
                    const paymentStatus = getPaymentStatus(invoice);

                    return (
                      <tr key={invoiceId} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 font-bold text-xs text-white">{getInvoiceNumber(invoice)}</td>
                        <td className="px-6 py-4 text-xs text-slate-200 font-semibold">{getPatientIdFromInvoice(invoice)}</td>
                        <td className="px-6 py-4 text-xs text-slate-350">{formatDate(getInvoiceDate(invoice))}</td>
                        <td className="px-6 py-4 text-xs text-white font-bold">{formatAmount(getInvoiceAmount(invoice))}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border ${
                              paymentStatus === PAYMENT_STATUS.DONE
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {paymentStatus === PAYMENT_STATUS.DONE ? <IconCheck size={10} /> : <IconClock size={10} />}
                            {paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAdminStatusUpdate(invoice, PAYMENT_STATUS.DONE)}
                              disabled={updatingId === (invoice.id || invoice.invoiceId)}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/20 transition-colors disabled:opacity-60"
                            >
                              Paid
                            </button>
                            <button
                              onClick={() => handleAdminStatusUpdate(invoice, PAYMENT_STATUS.PENDING)}
                              disabled={updatingId === (invoice.id || invoice.invoiceId)}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-950/20 text-amber-400 hover:bg-amber-950/40 border border-amber-500/20 transition-colors disabled:opacity-60"
                            >
                              Pending
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
    );
  }

  // PATIENT SCREEN LAYOUT
  if (role === "PATIENT") {
    return (
      <div className="p-5 md:p-8 space-y-6 text-slate-200">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/3 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Finance
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 uppercase">
              My Invoices
            </h1>
            <p className="text-xs text-slate-300 mt-1.5 font-medium tracking-wide">
              Download clinical invoice receipts and review pending settlements.
            </p>
          </div>
        </div>

        {/* Invoice table list */}
        <div className="glass-card rounded-3xl shadow-sm overflow-hidden border border-white/10">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Invoice List</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Total {invoices.length} invoice(s) registered
              </p>
            </div>
            <button
              onClick={fetchMyInvoices}
              className="p-2 bg-cyan-950/20 hover:bg-cyan-950/45 border border-cyan-500/20 text-cyan-400 rounded-xl transition-colors"
              title="Refresh invoices"
            >
              <IconRefresh size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-white/2 border-b border-white/5 text-slate-350">
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Invoice Code</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Billing Date</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Total Value</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Payment Status</th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="hms-spinner mx-auto mb-3"></div>
                      <p className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Loading Invoices...</p>
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-450 text-xs font-bold uppercase tracking-widest">
                      No invoices available on your profile
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice, index) => {
                    const invoiceId = invoice.id || invoice.invoiceId || `row-${index}`;
                    const status = getPaymentStatus(invoice);

                    return (
                      <tr key={invoiceId} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 font-bold text-xs text-white">{getInvoiceNumber(invoice)}</td>
                        <td className="px-6 py-4 text-xs text-slate-350">{formatDate(getInvoiceDate(invoice))}</td>
                        <td className="px-6 py-4 text-xs text-white font-bold">{formatAmount(getInvoiceAmount(invoice))}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 border ${
                              status === PAYMENT_STATUS.DONE
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {status === PAYMENT_STATUS.DONE ? <IconCheck size={10} /> : <IconClock size={10} />}
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDownload(invoice)}
                            disabled={downloadingId === (invoice.id || invoice.invoiceId)}
                            className="btn-teal-outline px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60"
                          >
                            <IconDownload size={12} />
                            {downloadingId === (invoice.id || invoice.invoiceId) ? "Downloading..." : "Download"}
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
    );
  }

  // FALLBACK FOR DOCTOR/OTHER ROLES
  return (
    <div className="p-5 md:p-8 space-y-6 text-slate-200">
      <div className="glass-card rounded-3xl p-6 space-y-4 border border-white/10">
        <h1 className="text-xl font-black text-white uppercase tracking-tight">Invoice Ledger</h1>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Invoices downloading features are currently restricted for Doctor profiles. Patient profiles have direct download access.
        </p>
      </div>
    </div>
  );
};

export default Billing;

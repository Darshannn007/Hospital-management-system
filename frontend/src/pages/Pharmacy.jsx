import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  IconPill,
  IconSearch,
  IconRefresh,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconPlus,
  IconShoppingCart,
  IconBox,
} from "@tabler/icons-react";
import {
  getMedicines,
  addMedicine,
  updateMedicineStock,
  markMedicineOrdered,
} from "../services/pharmacyServices";

const STOCK_STATUS = {
  AVAILABLE: "AVAILABLE",
  LOW: "LOW",
  OUT: "OUT",
};

const normalizeMedicines = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN");
};

const formatAmount = (value) => {
  const amount = toNumber(value, 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const getStockStatus = (medicine) => {
  const stock = toNumber(medicine.stock, 0);
  const reorderLevel = toNumber(medicine.reorderLevel, 0);

  if (stock <= 0) return STOCK_STATUS.OUT;
  if (stock <= reorderLevel) return STOCK_STATUS.LOW;
  return STOCK_STATUS.AVAILABLE;
};

const isOrdered = (medicine) => {
  const raw = medicine.ordered ?? medicine.isOrdered ?? medicine.orderStatus;
  if (typeof raw === "string") return raw.toUpperCase() === "ORDERED";
  return Boolean(raw);
};

const Pharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [adding, setAdding] = useState(false);
  const [orderingId, setOrderingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [stockDrafts, setStockDrafts] = useState({});

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    stock: "",
    reorderLevel: "",
    expiryDate: "",
    supplier: "",
    batchNo: "",
    unitPrice: "",
  });

  const fetchMedicines = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await getMedicines();
      setMedicines(normalizeMedicines(res.data));
    } catch (err) {
      console.log(err);
      toast.error("Unable to load medicines inventory");
      setMedicines([]);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const stats = useMemo(() => {
    const totals = {
      total: medicines.length,
      available: 0,
      low: 0,
      out: 0,
    };

    medicines.forEach((medicine) => {
      const status = getStockStatus(medicine);
      if (status === STOCK_STATUS.AVAILABLE) totals.available += 1;
      if (status === STOCK_STATUS.LOW) totals.low += 1;
      if (status === STOCK_STATUS.OUT) totals.out += 1;
    });

    return totals;
  }, [medicines]);

  const categories = useMemo(() => {
    const set = new Set();
    medicines.forEach((medicine) => {
      if (medicine.category) set.add(medicine.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const status = getStockStatus(medicine);

      const matchesSearch =
        medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.batchNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      const matchesCategory =
        categoryFilter === "ALL" || medicine.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [medicines, searchTerm, statusFilter, categoryFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMedicines(false);
    setRefreshing(false);
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();

    if (!newMedicine.name.trim()) {
      toast.error("Medicine name is required");
      return;
    }

    const payload = {
      name: newMedicine.name.trim(),
      category: newMedicine.category.trim(),
      stock: toNumber(newMedicine.stock, 0),
      reorderLevel: toNumber(newMedicine.reorderLevel, 0),
      expiryDate: newMedicine.expiryDate || null,
      supplier: newMedicine.supplier.trim(),
      batchNo: newMedicine.batchNo.trim(),
      unitPrice: toNumber(newMedicine.unitPrice, 0),
    };

    try {
      setAdding(true);
      await addMedicine(payload);
      toast.success("Medicine added to inventory successfully! ✅");
      setNewMedicine({
        name: "",
        category: "",
        stock: "",
        reorderLevel: "",
        expiryDate: "",
        supplier: "",
        batchNo: "",
        unitPrice: "",
      });
      fetchMedicines();
    } catch (err) {
      console.log(err);
      toast.error("Failed to add medicine to inventory");
    } finally {
      setAdding(false);
    }
  };

  const handleStockUpdate = async (medicine) => {
    const medicineId = medicine.id || medicine.medicineId;
    if (!medicineId) {
      toast.error("Invalid medicine selected");
      return;
    }

    const draft = stockDrafts[medicineId];
    const newStock = toNumber(draft, toNumber(medicine.stock, 0));

    try {
      setUpdatingId(medicineId);
      await updateMedicineStock(medicineId, newStock);
      toast.success("Stock level updated successfully! ✅");
      setStockDrafts((prev) => {
        const next = { ...prev };
        delete next[medicineId];
        return next;
      });
      fetchMedicines(false);
    } catch (err) {
      console.log(err);
      toast.error("Stock update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkOrdered = async (medicine) => {
    const medicineId = medicine.id || medicine.medicineId;
    if (!medicineId) {
      toast.error("Invalid medicine selected");
      return;
    }

    try {
      setOrderingId(medicineId);
      await markMedicineOrdered(medicineId);
      toast.success("Marked as ordered! 🛒");
      fetchMedicines(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to flag reorder");
    } finally {
      setOrderingId(null);
    }
  };

  return (
    <div className="p-5 md:p-8 space-y-6 text-slate-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/3 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Pharmacy
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 uppercase">
            Pharmacy Inventory
          </h1>
          <p className="text-xs text-slate-300 mt-1.5 font-medium tracking-wide">
            Track availability, warning levels, expiration dates, and reorder triggers.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 border border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-white/3 border border-white/10 text-cyan-400 flex items-center justify-center">
            <IconBox size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Total Registers</span>
            <span className="text-xl font-black text-white block mt-0.5">{stats.total}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 border border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-white/3 border border-white/10 text-emerald-400 flex items-center justify-center">
            <IconCircleCheck size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Available</span>
            <span className="text-xl font-black text-white block mt-0.5">{stats.available}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 border border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-white/3 border border-white/10 text-amber-400 flex items-center justify-center">
            <IconAlertTriangle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Low Stock</span>
            <span className="text-xl font-black text-white block mt-0.5">{stats.low}</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 border border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-white/3 border border-white/10 text-rose-450 flex items-center justify-center">
            <IconCircleX size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Out of Stock</span>
            <span className="text-xl font-black text-white block mt-0.5">{stats.out}</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center border border-white/10 shadow-sm">
        <div className="relative flex-1 w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <IconSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by medicine name, batch code, supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 glass-input rounded-xl text-xs outline-none"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-3 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer focus:border-cyan-500"
          >
            <option value="ALL" className="bg-slate-900 text-slate-200">All Status</option>
            <option value={STOCK_STATUS.AVAILABLE} className="bg-slate-900 text-slate-200">Available</option>
            <option value={STOCK_STATUS.LOW} className="bg-slate-900 text-slate-200">Low Stock</option>
            <option value={STOCK_STATUS.OUT} className="bg-slate-900 text-slate-200">Out of Stock</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-44 px-3 py-3 bg-slate-900/80 border border-white/12 rounded-xl text-xs outline-none text-slate-200 cursor-pointer focus:border-cyan-500"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="bg-slate-900 text-slate-200">
                {category === "ALL" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add new medicine form */}
      <div className="glass-card rounded-3xl p-6 shadow-sm space-y-5 border border-white/10">
        <div className="flex items-center gap-2">
          <IconPlus size={16} className="text-cyan-400" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Add New Medicine</h3>
        </div>

        <form onSubmit={handleAddMedicine} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Medicine Name</label>
            <input
              type="text"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Paracetamol"
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Category</label>
            <input
              type="text"
              value={newMedicine.category}
              onChange={(e) => setNewMedicine((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="e.g. Analgesic"
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Stock qty</label>
            <input
              type="number"
              min="0"
              value={newMedicine.stock}
              onChange={(e) => setNewMedicine((prev) => ({ ...prev, stock: e.target.value }))}
              placeholder="e.g. 100"
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Reorder Level</label>
            <input
              type="number"
              min="0"
              value={newMedicine.reorderLevel}
              onChange={(e) => setNewMedicine((prev) => ({ ...prev, reorderLevel: e.target.value }))}
              placeholder="e.g. 15"
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Expiry Date</label>
            <input
              type="date"
              value={newMedicine.expiryDate}
              onChange={(e) => setNewMedicine((prev) => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-900/80 border border-white/12 rounded-xl text-xs text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Supplier</label>
            <input
              type="text"
              value={newMedicine.supplier}
              onChange={(e) => setNewMedicine((prev) => ({ ...prev, supplier: e.target.value }))}
              placeholder="e.g. Acme Pharma"
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Batch Code</label>
            <input
              type="text"
              value={newMedicine.batchNo}
              onChange={(e) => setNewMedicine((prev) => ({ ...prev, batchNo: e.target.value }))}
              placeholder="e.g. B-9981"
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Unit price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newMedicine.unitPrice}
              onChange={(e) => setNewMedicine((prev) => ({ ...prev, unitPrice: e.target.value }))}
              placeholder="e.g. 5.50"
              className="w-full px-4 py-3 glass-input rounded-xl text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            className="w-full btn-teal-outline px-5 py-3 rounded-xl font-bold text-xs shadow-md uppercase tracking-wider h-[42px] disabled:opacity-60"
          >
            {adding ? "Adding..." : "Add Medicine"}
          </button>
        </form>
      </div>

      {/* Inventory table */}
      <div className="glass-card rounded-3xl shadow-sm overflow-hidden border border-white/10">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">Inventory Ledger</h3>
            <p className="text-[10px] text-slate-405 font-bold uppercase tracking-widest mt-0.5">
              Showing {filteredMedicines.length} of {medicines.length} items
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-cyan-950/20 hover:bg-cyan-950/45 text-cyan-400 border border-cyan-500/20 rounded-xl transition-colors disabled:opacity-60"
            title="Refresh inventory"
          >
            <IconRefresh size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-white/2 border-b border-white/5 text-slate-350">
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Medicine Name</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Category</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Stock Qty</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Reorder Level</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Expiry Date</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Supplier</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Status</th>
                <th className="px-6 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest">Controls</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="hms-spinner mx-auto mb-3"></div>
                    <p className="font-bold uppercase tracking-widest text-[9px] text-slate-400">Loading Inventory...</p>
                  </td>
                </tr>
              ) : filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    No matching medicines found
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((medicine) => {
                  const medicineId = medicine.id || medicine.medicineId;
                  const status = getStockStatus(medicine);
                  const orderedFlag = isOrdered(medicine);

                  return (
                    <tr
                      key={medicineId}
                      className="hover:bg-white/2 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-xs text-white">{medicine.name}</td>
                      <td className="px-6 py-4 text-xs text-slate-200 font-semibold">{medicine.category || "-"}</td>
                      <td className="px-6 py-4 text-xs text-slate-200 font-medium">{toNumber(medicine.stock, 0)}</td>
                      <td className="px-6 py-4 text-xs text-slate-350">{toNumber(medicine.reorderLevel, 0)}</td>
                      <td className="px-6 py-4 text-xs text-slate-350">{formatDate(medicine.expiryDate)}</td>
                      <td className="px-6 py-4 text-xs text-slate-200">{medicine.supplier || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 w-fit border ${
                              status === STOCK_STATUS.AVAILABLE
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : status === STOCK_STATUS.LOW
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-450 border border-rose-500/20 animate-pulse animate-warning-glow"
                            }`}
                          >
                            {status === STOCK_STATUS.AVAILABLE
                              ? "Available"
                              : status === STOCK_STATUS.LOW
                              ? "Low Stock"
                              : "Out of Stock"}
                          </span>
                          {orderedFlag && (
                            <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-cyan-950/20 text-cyan-400 border border-cyan-500/20 w-fit">
                              Ordered
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={
                                stockDrafts[medicineId] ??
                                toNumber(medicine.stock, 0)
                              }
                              onChange={(e) =>
                                setStockDrafts((prev) => ({
                                  ...prev,
                                  [medicineId]: e.target.value,
                                }))
                              }
                              className="w-16 px-2.5 py-1.5 bg-white/2 border border-white/12 rounded-lg text-xs outline-none focus:border-cyan-500 text-white"
                            />
                            <button
                              onClick={() => handleStockUpdate(medicine)}
                              disabled={updatingId === medicineId}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-cyan-950/20 text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/20 transition-colors disabled:opacity-60"
                            >
                              {updatingId === medicineId ? "Updating" : "Update"}
                            </button>
                          </div>
                          <button
                            onClick={() => handleMarkOrdered(medicine)}
                            disabled={orderingId === medicineId}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-950/20 text-amber-400 hover:bg-amber-950/40 border border-amber-500/20 transition-colors disabled:opacity-60 flex items-center gap-1.5 w-fit"
                          >
                            <IconShoppingCart size={12} />
                            {orderingId === medicineId ? "Ordering..." : "Reorder"}
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
};

export default Pharmacy;
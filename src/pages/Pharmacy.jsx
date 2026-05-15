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
      toast.error("Unable to load medicines");
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
      toast.error("Medicine name required");
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
      toast.success("Medicine added");
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
      toast.error("Failed to add medicine");
    } finally {
      setAdding(false);
    }
  };

  const handleStockUpdate = async (medicine) => {
    const medicineId = medicine.id || medicine.medicineId;
    if (!medicineId) {
      toast.error("Invalid medicine");
      return;
    }

    const draft = stockDrafts[medicineId];
    const newStock = toNumber(draft, toNumber(medicine.stock, 0));

    try {
      setUpdatingId(medicineId);
      await updateMedicineStock(medicineId, newStock);
      toast.success("Stock updated");
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
      toast.error("Invalid medicine");
      return;
    }

    try {
      setOrderingId(medicineId);
      await markMedicineOrdered(medicineId);
      toast.success("Marked as ordered");
      fetchMedicines(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to mark ordered");
    } finally {
      setOrderingId(null);
    }
  };

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
              <IconPill size={20} className="text-white" />
            </div>
            <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Pharmacy Inventory
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent">
            Pharmacy
          </h1>
          <p className="text-gray-600 mt-1">
            Track availability, low stock, and reorder needs in one view.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <IconBox size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Medicines</p>
              <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <IconCircleCheck size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-xl font-semibold text-gray-900">{stats.available}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <IconAlertTriangle size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-xl font-semibold text-gray-900">{stats.low}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <IconCircleX size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-xl font-semibold text-gray-900">{stats.out}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <IconSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by medicine, batch, supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-44 px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
            >
              <option value="ALL">All Status</option>
              <option value={STOCK_STATUS.AVAILABLE}>Available</option>
              <option value={STOCK_STATUS.LOW}>Low Stock</option>
              <option value={STOCK_STATUS.OUT}>Out of Stock</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-44 px-3 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "ALL" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <IconPlus size={18} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Add New Medicine</h2>
          </div>

          <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Medicine Name</label>
              <input
                type="text"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
              <input
                type="text"
                value={newMedicine.category}
                onChange={(e) => setNewMedicine((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Category"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Stock</label>
              <input
                type="number"
                min="0"
                value={newMedicine.stock}
                onChange={(e) => setNewMedicine((prev) => ({ ...prev, stock: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Stock qty"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Reorder Level</label>
              <input
                type="number"
                min="0"
                value={newMedicine.reorderLevel}
                onChange={(e) => setNewMedicine((prev) => ({ ...prev, reorderLevel: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Threshold"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Expiry Date</label>
              <input
                type="date"
                value={newMedicine.expiryDate}
                onChange={(e) => setNewMedicine((prev) => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Supplier</label>
              <input
                type="text"
                value={newMedicine.supplier}
                onChange={(e) => setNewMedicine((prev) => ({ ...prev, supplier: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Supplier"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Batch No</label>
              <input
                type="text"
                value={newMedicine.batchNo}
                onChange={(e) => setNewMedicine((prev) => ({ ...prev, batchNo: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Batch"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Unit Price</label>
              <input
                type="number"
                min="0"
                value={newMedicine.unitPrice}
                onChange={(e) => setNewMedicine((prev) => ({ ...prev, unitPrice: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                placeholder="Price"
              />
            </div>

            <button
              type="submit"
              disabled={adding}
              className="px-5 py-3 rounded-xl text-sm font-semibold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {adding ? "Adding..." : "Add Medicine"}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Inventory Records</h2>
              <p className="text-gray-500 text-xs">
                Showing {filteredMedicines.length} of {medicines.length} medicines
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <IconRefresh size={16} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Medicine</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Reorder Level</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-gray-500">
                      Loading medicines...
                    </td>
                  </tr>
                ) : filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-12 text-gray-500">
                      No medicines found.
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
                        className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{medicine.name}</td>
                        <td className="px-6 py-4 text-gray-700">{medicine.category || "-"}</td>
                        <td className="px-6 py-4 text-gray-700">{toNumber(medicine.stock, 0)}</td>
                        <td className="px-6 py-4 text-gray-700">{toNumber(medicine.reorderLevel, 0)}</td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(medicine.expiryDate)}</td>
                        <td className="px-6 py-4 text-gray-700">{medicine.supplier || "-"}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                                status === STOCK_STATUS.AVAILABLE
                                  ? "bg-green-100 text-green-700"
                                  : status === STOCK_STATUS.LOW
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {status === STOCK_STATUS.AVAILABLE
                                ? "Available"
                                : status === STOCK_STATUS.LOW
                                ? "Low Stock"
                                : "Out of Stock"}
                            </span>
                            {orderedFlag && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 w-fit">
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
                                className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                              />
                              <button
                                onClick={() => handleStockUpdate(medicine)}
                                disabled={updatingId === medicineId}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {updatingId === medicineId ? "Updating..." : "Update Stock"}
                              </button>
                            </div>
                            <button
                              onClick={() => handleMarkOrdered(medicine)}
                              disabled={orderingId === medicineId}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                            >
                              <IconShoppingCart size={14} />
                              {orderingId === medicineId ? "Ordering..." : "Mark Ordered"}
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
};

export default Pharmacy;
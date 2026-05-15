"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AdminLayout from "@/app/components/AdminLayout";
import ImageUploader from "@/app/components/ImageUploader";
import { fetchEvents, fetchParks } from "@/app/services/api";

const API = process.env.NEXT_PUBLIC_API_URL;
const EMPTY_FORM = { title: "", description: "", location: "", date: "", image: "", parkId: "" };

export default function AdminEventsPage() {
  const { isAuthenticated, isAdmin, loading: authLoading, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (!isAdmin) router.replace("/");
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [evData, pkData] = await Promise.all([fetchEvents(), fetchParks()]);
    setEvents(evData);
    setParks(pkData);
    setLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) loadData(); }, [isAdmin, loadData]);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (event) => {
    setEditTarget(event);
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      date: event.date ? event.date.slice(0, 10) : "",
      image: event.image || "",
      parkId: event.parkId || "",
    });
    setError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSubmit = async () => {
    if (!form.title) { setError("Judul acara wajib diisi."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const isEdit = Boolean(editTarget);
      const url = isEdit
        ? `${API}/api/events/${editTarget._id || editTarget.id}`
        : `${API}/api/events`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          date: form.date || undefined,
          parkId: form.parkId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan acara");
      showSuccess(isEdit ? "Acara berhasil diperbarui!" : "Acara berhasil ditambahkan!");
      closeForm();
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/events/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus acara");
      showSuccess("Acara berhasil dihapus!");
      setDeleteId(null);
      loadData();
    } catch (err) {
      setError(err.message);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || !isAdmin) return null;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Acara</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola data acara Jakarta Pusat</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
          + Tambah Acara
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4 flex justify-between">
          ⚠️ {error} <button onClick={() => setError(null)}>✕</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4">
          ✅ {success}
        </div>
      )}

      {/* Modal Tambah / Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {editTarget ? "Edit Acara" : "Tambah Acara Baru"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Acara *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Contoh: Festival Hijau Jakarta"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Contoh: Taman Suropati, Jakarta Pusat"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taman Terkait</label>
                <select value={form.parkId} onChange={e => setForm(f => ({ ...f, parkId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white">
                  <option value="">Pilih taman (opsional)...</option>
                  {parks.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Deskripsi acara..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Acara</label>
                <ImageUploader
                  folder="events"
                  currentImage={form.image}
                  onUpload={(url) => setForm(f => ({ ...f, image: url }))}
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-500">⚠️ {error}</p>}

            <div className="flex gap-3 mt-6">
              <button onClick={closeForm}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                Batal
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50">
                {submitting ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Simpan Acara"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Hapus Acara?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Acara ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                Batal
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50">
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <input type="text" placeholder="Cari acara..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 mb-5" />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {["#", "Acara", "Tanggal", "Lokasi", "Aksi"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-400 text-sm">Memuat acara...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-400 text-sm">Tidak ada acara.</td></tr>
            ) : filtered.map((event, i) => (
              <tr key={event._id || event.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {event.image
                      ? <img src={event.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-300 text-xs">📷</span>
                        </div>
                    }
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      {event.description && <p className="text-xs text-gray-400 truncate max-w-xs">{event.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {event.date
                    ? new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{event.location || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(event)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">
                      Edit
                    </button>
                    <button onClick={() => setDeleteId(event._id || event.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} acara</div>
        )}
      </div>
    </AdminLayout>
  );
}
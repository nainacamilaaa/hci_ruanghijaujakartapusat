"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AdminLayout from "@/app/components/AdminLayout";
import { fetchEvents, fetchParks } from "@/app/services/api";

const EMPTY_FORM = { title: "", description: "", location: "", date: "", image: "", parkId: "" };

export default function AdminEventsPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (!isAdmin) router.replace("/");
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const [evData, pkData] = await Promise.all([fetchEvents(), fetchParks()]);
    setEvents(evData);
    setParks(pkData);
    setLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) loadEvents(); }, [isAdmin, loadEvents]);

  const handleSubmit = async () => {
    if (!form.title) { setError("Judul acara wajib diisi."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem("rhj_token");
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, date: form.date || undefined, parkId: form.parkId || undefined }),
      });
      if (!res.ok) throw new Error("Gagal menambah acara");
      setSuccess("Acara berhasil ditambahkan!");
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadEvents();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
        <button
          onClick={() => { setShowForm(true); setError(null); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
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

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Tambah Acara Baru</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://example.com/gambar.jpg"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
                {form.image && (
                  <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" onError={e => e.target.style.display = "none"} />
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">Batal</button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50">
                {submitting ? "Menyimpan..." : "Simpan Acara"}
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
              {["#", "Acara", "Tanggal", "Lokasi"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Memuat acara...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Tidak ada acara.</td></tr>
            ) : filtered.map((event, i) => (
              <tr key={event.id || event._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {event.image && <img src={event.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title || event.name}</p>
                      {event.description && <p className="text-xs text-gray-400 truncate max-w-xs">{event.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {event.date ? new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{event.location || "—"}</td>
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
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AdminLayout from "@/app/components/AdminLayout";
import { fetchParks } from "@/app/services/api";

const EMPTY_FORM = { name: "", category: "", bio: "", location: "", image: "" };
const CATEGORIES = ["Taman Kota", "Hutan Kota", "Taman Tematik"];

export default function AdminParksPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
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

  const loadParks = useCallback(async () => {
    setLoading(true);
    const data = await fetchParks();
    setParks(data);
    setLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) loadParks(); }, [isAdmin, loadParks]);

  const handleSubmit = async () => {
    if (!form.name || !form.category) { setError("Nama dan kategori wajib diisi."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem("rhj_token");
      const res = await fetch("http://localhost:5000/api/parks", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal menambah taman");
      setSuccess("Taman berhasil ditambahkan!");
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadParks();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = parks.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || !isAdmin) return null;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Taman</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola data taman Jakarta Pusat</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(null); }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          + Tambah Taman
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Tambah Taman Baru</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Taman *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Contoh: Taman Suropati"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white">
                  <option value="">Pilih kategori...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Contoh: Menteng, Jakarta Pusat"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Deskripsi singkat tentang taman..."
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
                {submitting ? "Menyimpan..." : "Simpan Taman"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <input type="text" placeholder="Cari taman..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 mb-5" />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {["#", "Taman", "Kategori", "Lokasi"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Memuat taman...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Tidak ada taman.</td></tr>
            ) : filtered.map((park, i) => (
              <tr key={park.id || park._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {park.image && <img src={park.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{park.name}</p>
                      {park.bio && <p className="text-xs text-gray-400 truncate max-w-xs">{park.bio}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">{park.category || "—"}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{park.location || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} taman</div>
        )}
      </div>
    </AdminLayout>
  );
}
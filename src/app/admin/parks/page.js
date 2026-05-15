"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AdminLayout from "@/app/components/AdminLayout";
import ImageUploader from "@/app/components/ImageUploader";
import { fetchParks } from "@/app/services/api";

const API = process.env.NEXT_PUBLIC_API_URL;
const EMPTY_FORM = { name: "", category: "", bio: "", location: "", image: "" };
const CATEGORIES = ["Taman Kota", "Hutan Kota", "Taman Tematik"];

export default function AdminParksPage() {
  const { isAuthenticated, isAdmin, loading: authLoading, token } = useAuth();
  const router = useRouter();
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = tambah, object = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // modal konfirmasi hapus
  const [deleting, setDeleting] = useState(false);
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

  // Buka modal tambah
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowForm(true);
  };

  // Buka modal edit
  const openEdit = (park) => {
    setEditTarget(park);
    setForm({
      name: park.name || "",
      category: park.category || "",
      bio: park.bio || "",
      location: park.location || "",
      image: park.image || "",
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

  // Submit tambah / edit
  const handleSubmit = async () => {
    if (!form.name || !form.category) { setError("Nama dan kategori wajib diisi."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const isEdit = Boolean(editTarget);
      const url = isEdit ? `${API}/api/parks/${editTarget._id || editTarget.id}` : `${API}/api/parks`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan taman");
      showSuccess(isEdit ? "Taman berhasil diperbarui!" : "Taman berhasil ditambahkan!");
      closeForm();
      loadParks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus taman
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/parks/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus taman");
      showSuccess("Taman berhasil dihapus!");
      setDeleteId(null);
      loadParks();
    } catch (err) {
      setError(err.message);
      setDeleteId(null);
    } finally {
      setDeleting(false);
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
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
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

      {/* Modal Tambah / Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {editTarget ? "Edit Taman" : "Tambah Taman Baru"}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Taman</label>
                <ImageUploader
                  folder="parks"
                  currentImage={form.image}
                  onUpload={(url) => setForm(f => ({ ...f, image: url }))}
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-500">⚠️ {error}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={closeForm}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                Batal
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50">
                {submitting ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Simpan Taman"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Hapus Taman?</h2>
            <p className="text-sm text-gray-500 mb-6">
              Taman ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
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
      <input type="text" placeholder="Cari taman..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 mb-5" />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {["#", "Taman", "Kategori", "Lokasi", "Aksi"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-400 text-sm">Memuat taman...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-gray-400 text-sm">Tidak ada taman.</td></tr>
            ) : filtered.map((park, i) => (
              <tr key={park._id || park.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="px-4 py-3 text-sm text-gray-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {park.image
                      ? <img src={park.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-300 text-xs">📷</span>
                        </div>
                    }
                    <div>
                      <p className="text-sm font-medium text-gray-900">{park.name}</p>
                      {park.bio && <p className="text-xs text-gray-400 truncate max-w-xs">{park.bio}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                    {park.category || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{park.location || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(park)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">
                      Edit
                    </button>
                    <button onClick={() => setDeleteId(park._id || park.id)}
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
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} taman</div>
        )}
      </div>
    </AdminLayout>
  );
}
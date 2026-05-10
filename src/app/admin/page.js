"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getAdminStats, getAdminUsers, updateUserRole } from "@/app/services/api";
import AdminLayout from "@/app/components/AdminLayout";

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-sm" style={{ borderLeft: `4px solid ${color}` }}>
      <span className="text-4xl">{icon}</span>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value ?? "—"}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function UserRow({ user, onRoleChange, currentUserId }) {
  const [updating, setUpdating] = useState(false);
  const isSelf = user._id === currentUserId;

  const toggleRole = async () => {
    if (isSelf) return;
    setUpdating(true);
    await onRoleChange(user._id, user.role === "admin" ? "user" : "admin");
    setUpdating(false);
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {user.avatar && <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />}
          <div>
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === "admin" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString("id-ID")}</td>
      <td className="px-4 py-3">
        {isSelf ? (
          <span className="text-xs text-gray-300 italic">Anda</span>
        ) : (
          <button onClick={toggleRole} disabled={updating} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:border-green-400 hover:text-green-700 transition disabled:opacity-50">
            {updating ? "..." : user.role === "admin" ? "Jadikan User" : "Jadikan Admin"}
          </button>
        )}
      </td>
    </tr>
  );
}

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (!isAdmin) router.replace("/");
  }, [authLoading, isAuthenticated, isAdmin, router]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getAdminStats();
      setStats(data.stats);
    } catch (err) { setError(err.message); }
    finally { setLoadingStats(false); }
  }, []);

  const fetchUsers = useCallback(async (p = 1) => {
    setLoadingUsers(true);
    try {
      const data = await getAdminUsers(p, 10);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) { setError(err.message); }
    finally { setLoadingUsers(false); }
  }, []);

  useEffect(() => {
    if (isAdmin) { fetchStats(); fetchUsers(1); }
  }, [isAdmin, fetchStats, fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) { setError(err.message); }
  };

  if (authLoading || !isAdmin) return null;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Selamat datang, {user?.name}!</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5 flex justify-between">
          ⚠️ {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {loadingStats ? [1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />) : (
          <>
            <StatCard icon="🌳" label="Total Taman" value={stats?.totalParks} color="#4caf50" />
            <StatCard icon="📅" label="Total Acara" value={stats?.totalEvents} color="#2196f3" />
            <StatCard icon="👥" label="Total Pengguna" value={stats?.totalUsers} color="#ff9800" />
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Manajemen Pengguna</h2>
          <button onClick={() => fetchUsers(page)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:border-green-400 transition">🔄 Refresh</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {["Pengguna", "Role", "Bergabung", "Aksi"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Memuat...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-gray-400 text-sm">Belum ada pengguna.</td></tr>
              ) : users.map(u => (
                <UserRow key={u._id} user={u} onRoleChange={handleRoleChange} currentUserId={user?._id || user?.id} />
              ))}
            </tbody>
          </table>
        </div>
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-5 py-4 border-t border-gray-100">
            <button disabled={page <= 1} onClick={() => { setPage(p => p-1); fetchUsers(page-1); }} className="text-sm px-4 py-1.5 border rounded-lg disabled:opacity-40">← Prev</button>
            <span className="text-sm text-gray-500">Halaman {page} dari {pagination.totalPages}</span>
            <button disabled={page >= pagination.totalPages} onClick={() => { setPage(p => p+1); fetchUsers(page+1); }} className="text-sm px-4 py-1.5 border rounded-lg disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
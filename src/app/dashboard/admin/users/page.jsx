"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { authClient } from "../../../../lib/auth-client";
import Heading from "../../../../components/Heading";
import Card from "../../../../components/Card";
import Loading from "../../../../components/Loading";
import RoleBadge from "../../../../components/RoleBadge";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users on load
  useEffect(() => {
    fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    if (session?.user?.role !== "admin") return;
    
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users`, {
        withCredentials: true
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load user data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Role Change
  const handleRoleChange = async (userId, newRole) => {
    // Prevent accidental self-demotion
    if (userId === session?.user?.id && newRole !== "admin") {
      const confirm = window.confirm("Warning: You are about to remove your own Admin privileges. Are you sure?");
      if (!confirm) return;
    }

    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`User role updated to ${newRole}`);
        // Update the UI without refreshing the page
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  if (isLoading) return <Loading fullScreen />;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <div>
        <Heading level={2}>👥 Manage Users</Heading>
        <p className="text-[--text-muted] mt-1">View all registered accounts and manage their access levels.</p>
      </div>

      <Card className="overflow-hidden border border-[--border]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[--bg-secondary] border-b border-[--border]">
                <th className="p-4 font-medium text-[--text-muted]">User</th>
                <th className="p-4 font-medium text-[--text-muted]">Joined Date</th>
                <th className="p-4 font-medium text-[--text-muted]">Membership</th>
                <th className="p-4 font-medium text-[--text-muted]">System Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[--border] hover:bg-[--bg-secondary]/50 transition-colors">
                  
                  {/* User Info Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`} 
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover border border-[--border]"
                      />
                      <div>
                        <div className="font-semibold text-[--text]">{u.name}</div>
                        <div className="text-xs text-[--text-muted]">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Joined Date Column */}
                  <td className="p-4 text-sm text-[--text-muted]">
                    {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Premium Status Column */}
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.isPremium ? 'bg-amber-500/10 text-amber-500' : 'bg-[--bg-secondary] text-[--text-muted]'}`}>
                      {u.isPremium ? "PREMIUM" : "FREE"}
                    </span>
                  </td>

                  {/* Action/Role Dropdown Column */}
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className={`
                        text-sm font-semibold rounded-lg px-3 py-1.5 border appearance-none cursor-pointer outline-none transition-colors
                        ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                          u.role === 'seller' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                          'bg-[--bg] text-[--text] border-[--border] hover:border-[--text-muted]'}
                      `}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[--text-muted]">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { authClient } from "../../../lib/auth-client";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Loading from "../../../components/Loading";
import Link from "next/link";
import Button from "../../../components/Button";

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`, {
          withCredentials: true
        });
        
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Admin Fetch Error:", err);
        setError("Access Denied. You do not have permission to view this page.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.role === "admin") {
      fetchAdminStats();
    } else if (session) {
      setIsLoading(false);
      setError("Access Denied. You do not have permission to view this page.");
    }
  }, [session]);

  if (isLoading) return <Loading fullScreen />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🛑</div>
        <Heading level={2} className="text-red-500 mb-2">Access Restricted</Heading>
        <p className="text-[--text-muted]">{error}</p>
      </div>
    );
  }

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Heading level={2}>👑 Admin Command Center</Heading>
          <p className="text-[--text-muted] mt-1">Platform overview and statistics.</p>
        </div>
        
        {/* We will build this page next! */}
        <Link href="/dashboard/admin/users">
          <Button variant="primary">👥 Manage Users</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <Card className="p-6 border-t-4 border-t-blue-500">
          <div className="text-3xl mb-2">🌍</div>
          <div className="text-sm font-medium text-[--text-muted] uppercase tracking-wider">Total Users</div>
          <div className="text-4xl font-bold mt-2">{stats?.totalUsers || 0}</div>
        </Card>

        {/* Premium Users */}
        <Card className="p-6 border-t-4 border-t-amber-500">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-sm font-medium text-[--text-muted] uppercase tracking-wider">Premium Members</div>
          <div className="text-4xl font-bold mt-2">{stats?.premiumUsers || 0}</div>
        </Card>

        {/* Total Lessons */}
        <Card className="p-6 border-t-4 border-t-emerald-500">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-sm font-medium text-[--text-muted] uppercase tracking-wider">Total Lessons</div>
          <div className="text-4xl font-bold mt-2">{stats?.totalLessons || 0}</div>
        </Card>

        {/* Total Purchases */}
        <Card className="p-6 border-t-4 border-t-purple-500">
          <div className="text-3xl mb-2">🛒</div>
          <div className="text-sm font-medium text-[--text-muted] uppercase tracking-wider">Market Purchases</div>
          <div className="text-4xl font-bold mt-2">{stats?.totalPurchases || 0}</div>
        </Card>
      </div>

      {/* Revenue Section */}
      <Card className="p-8 bg-gradient-to-br from-[--bg-secondary] to-[--bg] border border-[--border]">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl text-4xl">
            💰
          </div>
          <div>
            <h3 className="text-lg font-medium text-[--text-muted]">Total Platform Revenue</h3>
            <div className="text-5xl font-black text-[--text] mt-1">
              {formatCurrency(stats?.totalRevenue)}
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
}
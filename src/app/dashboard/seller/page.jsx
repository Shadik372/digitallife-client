"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Loading from "../../../components/Loading";
import SellerRoute from "../../../components/SellerRoute";

export default function SellerDashboardPage() {
  const [stats, setStats] = useState({ totalEarnings: 0, totalSales: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sellers/stats`, {
          withCredentials: true
        });
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentSales(res.data.recentSales);
        }
      } catch (error) {
        console.error("Failed to load seller stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <Loading fullScreen />;

  return (
    <SellerRoute>
      <div className="space-y-8">
        <Heading level={2}>Seller Dashboard</Heading>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-[--accent] text-white">
            <p className="text-white/80 font-medium">Total Earnings</p>
            <p className="text-4xl font-bold mt-2">৳{stats.totalEarnings.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-[--text-muted] font-medium">Total Sales</p>
            <p className="text-4xl font-bold mt-2 text-[--text]">{stats.totalSales}</p>
          </Card>
        </div>

        {/* Recent Sales Table */}
        <Heading level={3}>Recent Transactions</Heading>
        <Card className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[--bg-secondary]">
              <tr className="text-sm text-[--text-muted] uppercase">
                <th className="p-4">Buyer</th>
                <th className="p-4">Lesson</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <tr key={sale._id} className="border-t border-[--border]">
                    <td className="p-4">{sale.buyerId?.name || "Deleted User"}</td>
                    <td className="p-4">{sale.lessonId?.title || "Deleted Lesson"}</td>
                    <td className="p-4 text-right font-semibold text-green-600">৳{sale.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-[--text-muted]">No sales recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </SellerRoute>
  );
}   
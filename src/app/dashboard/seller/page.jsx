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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/purchases/my-sales`, {
          withCredentials: true
        });
        
        if (res.data.success) {
          setStats(res.data.stats); 
          setRecentSales(res.data.sales); 
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
      <div className="space-y-6 sm:space-y-8">
        <Heading level={2}>Seller Dashboard</Heading>

        {/* 🔧 UI FIX 1: Unified Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="p-5 sm:p-6 border border-[--border] bg-[--bg-secondary] shadow-sm">
            <p className="text-[--text-muted] font-medium text-sm sm:text-base uppercase tracking-wider">Total Earnings</p>
            {/* 🔧 UI FIX 2: Text color is now explicitly visible and themed green for money */}
            <p className="text-3xl sm:text-4xl font-black mt-2 text-green-500 break-all">
              ৳{stats.totalEarnings.toLocaleString()}
            </p>
          </Card>
          
          <Card className="p-5 sm:p-6 border border-[--border] bg-[--bg-secondary] shadow-sm">
            <p className="text-[--text-muted] font-medium text-sm sm:text-base uppercase tracking-wider">Total Sales</p>
            <p className="text-3xl sm:text-4xl font-black mt-2 text-[--text]">
              {stats.totalSales}
            </p>
          </Card>
        </div>

        {/* Recent Sales */}
        <Heading level={3}>Recent Transactions</Heading>

        {recentSales.length > 0 ? (
          <>
            {/* Mobile: stacked cards */}
            <Card className="md:hidden overflow-hidden divide-y divide-[--border] border border-[--border]">
              {recentSales.map((sale) => (
                <div key={sale._id} className="p-4 flex flex-col gap-1 bg-[--bg-secondary]/50 hover:bg-[--bg-secondary] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-[--text] truncate">
                      {sale.buyerId?.name || "Deleted User"}
                    </span>
                    <span className="font-black text-green-500 shrink-0">
                      ৳{sale.amount}
                    </span>
                  </div>
                  <p className="text-sm text-[--text-muted] truncate font-medium">
                    {sale.lessonId?.title || "Deleted Lesson"}
                  </p>
                  <p className="text-xs text-[--text-muted]/60 mt-1">
                    {/* 🔧 UI FIX 3: Polished Date Formatting */}
                    {new Date(sale.purchasedAt || sale.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </Card>

            {/* Desktop / tablet: table */}
            <Card className="hidden md:block overflow-x-auto border border-[--border]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[--bg-secondary] border-b border-[--border]">
                  <tr className="text-xs font-bold text-[--text-muted] uppercase tracking-wider">
                    <th className="p-4">Buyer</th>
                    <th className="p-4">Lesson</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--border]">
                  {recentSales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-[--bg-secondary]/50 transition-colors">
                      <td className="p-4 font-bold text-[--text]">{sale.buyerId?.name || "Deleted User"}</td>
                      <td className="p-4 text-[--text-muted] font-medium">{sale.lessonId?.title || "Deleted Lesson"}</td>
                      <td className="p-4 text-sm text-[--text-muted]">
                        {/* 🔧 UI FIX 3: Polished Date Formatting */}
                        {new Date(sale.purchasedAt || sale.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-right font-black text-green-500">৳{sale.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        ) : (
          <Card className="p-12 text-center text-[--text-muted] border-dashed border-2 border-[--border]">
            <span className="text-4xl block mb-3 opacity-50">💸</span>
            <p className="font-medium">No sales recorded yet.</p>
            <p className="text-sm mt-1">When someone buys your premium lessons, they will appear here!</p>
          </Card>
        )}
      </div>
    </SellerRoute>
  );
}
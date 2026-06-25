"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { authClient } from "../../../lib/auth-client";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Loading from "../../../components/Loading";
import Link from "next/link";
import Button from "../../../components/Button";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState(null);
  const [lessons, setLessons] = useState([]); 
  const [reportedLessons, setReportedLessons] = useState([]); // 👈 State for reports
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // 🚀 Fetch Stats, All Lessons, AND Reported Lessons simultaneously
        const [statsRes, lessonsRes, reportsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stats`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/admin/all`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/admin/reported`, { withCredentials: true }) // 👈 Fetch reports
        ]);
        
        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (lessonsRes.data.success) setLessons(lessonsRes.data.lessons);
        if (reportsRes.data.success) setReportedLessons(reportsRes.data.reportedLessons);
        
      } catch (err) {
        console.error("Admin Fetch Error:", err);
        setError("Access Denied. You do not have permission to view this page.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.role === "admin") {
      fetchAdminData();
    } else if (session) {
      setIsLoading(false);
      setError("Access Denied. You do not have permission to view this page.");
    }
  }, [session]);

  // 🗑️ Delete Lesson (Removes from both tables)
  const handleDeleteLesson = async (id) => {
    if (!window.confirm("🚨 Are you sure you want to permanently delete this lesson? This affects the seller and any buyers.")) return;

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}`, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success("Lesson deleted successfully from the platform.");
        setLessons(lessons.filter(lesson => lesson._id !== id));
        setReportedLessons(reportedLessons.filter(report => report.lessonId !== id)); // Remove from reports table too
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete lesson.");
    }
  };

  // 🛡️ Dismiss Reports (False Alarm)
  const handleIgnoreReports = async (id) => {
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}/ignore-reports`, {}, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success("Reports dismissed.");
        setReportedLessons(reportedLessons.filter(report => report.lessonId !== id));
      }
    } catch (error) {
      toast.error("Failed to dismiss reports.");
    }
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <Heading level={2}>👑 Admin Command Center</Heading>
          <p className="text-[--text-muted] mt-1">Platform overview and statistics.</p>
        </div>
        <Link href="/dashboard/admin/users">
          <Button variant="primary">👥 Manage Users</Button>
        </Link>
      </div>

      {/* 📊 STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-t-4 border-t-blue-500">
          <div className="text-3xl mb-2">🌍</div>
          <div className="text-sm font-medium text-[--text-muted] uppercase tracking-wider">Total Users</div>
          <div className="text-4xl font-bold mt-2">{stats?.totalUsers || 0}</div>
        </Card>
        <Card className="p-6 border-t-4 border-t-amber-500">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-sm font-medium text-[--text-muted] uppercase tracking-wider">Premium Members</div>
          <div className="text-4xl font-bold mt-2">{stats?.premiumUsers || 0}</div>
        </Card>
        <Card className="p-6 border-t-4 border-t-emerald-500">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-sm font-medium text-[--text-muted] uppercase tracking-wider">Total Lessons</div>
          <div className="text-4xl font-bold mt-2">{stats?.totalLessons || 0}</div>
        </Card>
        <Card className="p-6 border-t-4 border-t-purple-500">
          <div className="text-3xl mb-2">🛒</div>
          <div className="text-sm font-medium text-[--text-muted] uppercase tracking-wider">Market Purchases</div>
          <div className="text-4xl font-bold mt-2">{stats?.totalPurchases || 0}</div>
        </Card>
      </div>

      {/* 💰 REVENUE SECTION */}
      <Card className="p-8 bg-gradient-to-br from-[--bg-secondary] to-[--bg] border border-[--border]">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl text-4xl">💰</div>
          <div>
            <h3 className="text-lg font-medium text-[--text-muted]">Total Platform Revenue</h3>
            <div className="text-5xl font-black text-[--text] mt-1">
              {formatCurrency(stats?.totalRevenue)}
            </div>
          </div>
        </div>
      </Card>

      {/* 🚩 ACTION REQUIRED: REPORTED LESSONS */}
      {reportedLessons.length > 0 && (
        <div className="space-y-4">
          <Heading level={3} className="text-red-500 flex items-center gap-2">
            🚩 Action Required: Reported Lessons
          </Heading>
          
          <Card className="overflow-x-auto border-2 border-red-500/30">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-red-500/5 border-b border-red-500/20">
                <tr className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  <th className="p-4">Lesson</th>
                  <th className="p-4">Report Count</th>
                  <th className="p-4">Reasons Cited</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--border]">
                {reportedLessons.map((reportItem) => (
                  <tr key={reportItem.lessonId} className="hover:bg-[--bg-secondary]/50 transition-colors">
                    
                    <td className="p-4 font-bold text-[--text]">
                      {reportItem.lessonTitle}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 bg-red-500 text-white font-bold rounded-full text-xs">
                        {reportItem.reportCount} Reports
                      </span>
                    </td>

                    <td className="p-4 text-sm text-[--text-muted]">
                      {/* Pull unique reasons from the array so we don't spam the UI */}
                      {Array.from(new Set(reportItem.reports.map(r => r.reason))).join(", ")}
                    </td>

                    <td className="p-4 flex items-center justify-end gap-2">
                      <Link href={`/lessons/${reportItem.lessonId}`} target="_blank">
                        <Button variant="outline" size="sm" className="!px-3 !py-1 text-xs">View</Button>
                      </Link>
                      <button 
                        onClick={() => handleIgnoreReports(reportItem.lessonId)}
                        className="px-3 py-1 text-xs font-bold text-[--text-muted] border border-[--border] rounded-lg hover:bg-[--bg-secondary] transition-colors"
                      >
                        Dismiss
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(reportItem.lessonId)}
                        className="px-3 py-1 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Delete Lesson
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* 🛡️ ALL PLATFORM LESSONS (MODERATION TABLE) */}
      <div className="space-y-4">
        <Heading level={3}>Content Moderation (All Lessons)</Heading>
        
        <Card className="overflow-x-auto border border-[--border]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[--bg-secondary] border-b border-[--border]">
              <tr className="text-xs font-bold text-[--text-muted] uppercase tracking-wider">
                <th className="p-4">Title</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Access / Price</th>
                <th className="p-4">Date Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[--border]">
              {lessons.map((lesson) => (
                <tr key={lesson._id} className="hover:bg-[--bg-secondary]/50 transition-colors">
                  
                  <td className="p-4">
                    <p className="font-bold text-[--text] line-clamp-1">{lesson.title}</p>
                    <p className="text-xs text-[--text-muted] mt-0.5">{lesson.category}</p>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={lesson.creatorId?.photoURL || `https://ui-avatars.com/api/?name=${lesson.creatorId?.name}&background=random`} 
                        alt="Creator" 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-[--text]">{lesson.creatorId?.name || "Unknown"}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    {lesson.accessLevel === "Premium" ? (
                      <div>
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 rounded">Premium</span>
                        {lesson.isForSale && <span className="block text-xs font-bold text-green-500 mt-1">৳{lesson.price}</span>}
                      </div>
                    ) : (
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 rounded">Free</span>
                    )}
                  </td>

                  <td className="p-4 text-sm text-[--text-muted]">
                    {new Date(lesson.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="p-4 flex items-center justify-end gap-2">
                    <Link href={`/lessons/${lesson._id}`} target="_blank">
                      <Button variant="outline" size="sm" className="!px-3 !py-1 text-xs">View</Button>
                    </Link>
                    <button 
                      onClick={() => handleDeleteLesson(lesson._id)}
                      className="px-3 py-1 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
              
              {lessons.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-[--text-muted] italic">
                    No lessons found on the platform.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

    </div>
  );
}
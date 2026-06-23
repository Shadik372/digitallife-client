"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Heading from "../../../../components/Heading";
import Button from "../../../../components/Button";
import Loading from "../../../../components/Loading";

export default function ReportedLessonsPage() {
  const [reportedLessons, setReportedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    fetchReportedLessons();
  }, []);

  const fetchReportedLessons = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/admin/reported`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setReportedLessons(res.data.reportedLessons);
      }
    } catch (error) {
      console.error("Failed to fetch reports", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIgnore = async (lessonId) => {
    if (!window.confirm("Are you sure you want to ignore these reports? This will clear them from the system.")) return;
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}/ignore-reports`, {}, { withCredentials: true });
      toast.success("Reports cleared successfully");
      fetchReportedLessons();
    } catch (error) {
      toast.error("Failed to clear reports");
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("WARNING: This will permanently delete the lesson from the database. Continue?")) return;
    try {
      // 1. Delete the lesson itself
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}`, { withCredentials: true });
      // 2. Clear the associated reports
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${lessonId}/ignore-reports`, {}, { withCredentials: true });
      
      toast.success("Lesson deleted permanently");
      fetchReportedLessons();
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  };

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-8 relative">
      <Heading level={2}>Reported Lessons</Heading>
      <p className="text-[--text-muted]">Review content flagged by the community for violating platform guidelines.</p>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-xl border border-[--border] bg-[--bg]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[--bg-secondary] border-b border-[--border] text-[--text-muted] uppercase text-xs tracking-wider">
              <th className="p-4 font-semibold">Lesson Title</th>
              <th className="p-4 font-semibold text-center">Report Count</th>
              <th className="p-4 font-semibold text-center">Details</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border]">
            {reportedLessons.map((item) => (
              <tr key={item.lessonId} className="hover:bg-[--bg-secondary]/50 transition-colors">
                <td className="p-4 font-bold text-[--text]">{item.lessonTitle}</td>
                <td className="p-4 text-center">
                  <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-sm font-black">
                    {item.reportCount}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <Button variant="outline" size="sm" onClick={() => setSelectedLesson(item)}>
                    View Reasons
                  </Button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="secondary" size="sm" onClick={() => handleIgnore(item.lessonId)}>Ignore</Button>
                  <button 
                    onClick={() => handleDelete(item.lessonId)}
                    className="px-3 py-2 text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                  >
                    Delete Lesson
                  </button>
                </td>
              </tr>
            ))}
            {reportedLessons.length === 0 && (
              <tr>
                <td colSpan="4" className="p-12 text-center text-[--text-muted]">
                  <span className="text-4xl block mb-3 opacity-50">🎉</span>
                  No reported lessons! The community is peaceful.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔍 The Reasons Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[--bg] border border-[--border] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="p-6 border-b border-[--border] flex justify-between items-center bg-[--bg-secondary]">
              <div>
                <h3 className="font-bold text-lg text-[--text]">Report Details</h3>
                <p className="text-sm text-[--text-muted] line-clamp-1">{selectedLesson.lessonTitle}</p>
              </div>
              <button onClick={() => setSelectedLesson(null)} className="text-2xl text-[--text-muted] hover:text-[--text]">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-[--bg] space-y-4">
              {selectedLesson.reports.map((report, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[--border] bg-[--bg-secondary]/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-[--text] text-sm">{report.reporterName}</p>
                      <p className="text-xs text-[--text-muted]">{report.reporterEmail}</p>
                    </div>
                    <span className="text-xs text-[--text-muted]">{new Date(report.date).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-400 text-sm font-medium">
                    Reason: {report.reason}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[--border] bg-[--bg-secondary] text-right">
              <Button variant="secondary" onClick={() => setSelectedLesson(null)}>Close Window</Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
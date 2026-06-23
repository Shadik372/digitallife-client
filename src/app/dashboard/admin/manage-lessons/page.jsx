"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Heading from "../../../../components/Heading";
import Button from "../../../../components/Button";
import Loading from "../../../../components/Loading";

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/admin/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setLessons(res.data.lessons);
      }
    } catch (error) {
      console.error("Failed to fetch admin lessons", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🛡️ Admin Actions
  const toggleFeature = async (id) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}/feature`, {}, { withCredentials: true });
      fetchLessons(); // Refresh list to show updated status
    } catch (error) {
      console.error("Failed to feature lesson", error);
    }
  };

  const toggleReview = async (id) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}/review`, {}, { withCredentials: true });
      fetchLessons();
    } catch (error) {
      console.error("Failed to review lesson", error);
    }
  };

  const deleteLesson = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this lesson?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}`, { withCredentials: true });
      fetchLessons();
    } catch (error) {
      console.error("Failed to delete lesson", error);
    }
  };

  // 📊 Stats Calculation
  const publicCount = lessons.filter(l => l.visibility === "Public").length;
  const privateCount = lessons.filter(l => l.visibility === "Private").length;
  const featuredCount = lessons.filter(l => l.isFeatured).length;

  // Filtering Logic
  const filteredLessons = lessons.filter(lesson => {
    if (filter === "Public") return lesson.visibility === "Public";
    if (filter === "Private") return lesson.visibility === "Private";
    if (filter === "Featured") return lesson.isFeatured;
    return true;
  });

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-8">
      <Heading level={2}>Manage Lessons</Heading>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[--bg-secondary] p-6 rounded-2xl border border-[--border]">
          <h3 className="text-[--text-muted] font-semibold uppercase tracking-wider text-sm mb-2">Public Lessons</h3>
          <p className="text-4xl font-black text-[--accent]">{publicCount}</p>
        </div>
        <div className="bg-[--bg-secondary] p-6 rounded-2xl border border-[--border]">
          <h3 className="text-[--text-muted] font-semibold uppercase tracking-wider text-sm mb-2">Private Lessons</h3>
          <p className="text-4xl font-black text-[--text]">{privateCount}</p>
        </div>
        <div className="bg-[--bg-secondary] p-6 rounded-2xl border border-[--border]">
          <h3 className="text-[--text-muted] font-semibold uppercase tracking-wider text-sm mb-2">Featured on Home</h3>
          <p className="text-4xl font-black text-amber-500">{featuredCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center bg-[--bg-secondary] p-4 rounded-xl border border-[--border]">
        <h3 className="font-bold text-[--text]">All Platform Lessons ({filteredLessons.length})</h3>
        <select 
          className="bg-[--bg] border border-[--border] text-[--text] px-4 py-2 rounded-lg outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Visibility</option>
          <option value="Public">Public Only</option>
          <option value="Private">Private Only</option>
          <option value="Featured">Featured Only</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-xl border border-[--border] bg-[--bg]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[--bg-secondary] border-b border-[--border] text-[--text-muted] uppercase text-xs tracking-wider">
              <th className="p-4 font-semibold">Lesson Info</th>
              <th className="p-4 font-semibold">Author</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border]">
            {filteredLessons.map((lesson) => (
              <tr key={lesson._id} className="hover:bg-[--bg-secondary]/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-[--text] line-clamp-1">{lesson.title}</p>
                  <span className="text-xs text-[--text-muted]">{lesson.category} • {lesson.emotionalTone}</span>
                </td>
                <td className="p-4">
                  <p className="text-sm font-medium text-[--text]">{lesson.creatorId?.name || "Unknown User"}</p>
                </td>
                <td className="p-4 flex gap-2 flex-wrap">
                  <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${lesson.visibility === 'Public' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                    {lesson.visibility}
                  </span>
                  {lesson.isFeatured && <span className="px-2 py-1 text-[10px] uppercase font-bold rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">Featured</span>}
                  {lesson.isReviewed && <span className="px-2 py-1 text-[10px] uppercase font-bold rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">Reviewed</span>}
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => toggleFeature(lesson._id)}>
                    {lesson.isFeatured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleReview(lesson._id)}>
                    {lesson.isReviewed ? "Unreview" : "Review"}
                  </Button>
                  <button 
                    onClick={() => deleteLesson(lesson._id)}
                    className="px-3 py-2 text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredLessons.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-[--text-muted]">No lessons found matching this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
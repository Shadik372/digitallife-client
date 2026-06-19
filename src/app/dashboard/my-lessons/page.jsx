"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { authClient } from "../../../lib/auth-client";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";

export default function MyLessonsPage() {
  const { data: session } = authClient.useSession();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null); // State for confirmation modal

  useEffect(() => {
    fetchMyLessons();
  }, []);

  const fetchMyLessons = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/me/all`, {
        withCredentials: true
      });
      if (res.data.success) setLessons(res.data.lessons);
    } catch (error) {
      toast.error("Failed to load your lessons.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickUpdate = async (id, field, value) => {
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${id}`, 
        { [field]: value },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`${field} updated successfully!`);
        setLessons(lessons.map(l => l._id === id ? { ...l, [field]: value } : l));
      }
    } catch (error) {
      toast.error(`Failed to update ${field}.`);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${deleteId}`, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("Lesson deleted.");
        setLessons(lessons.filter(l => l._id !== deleteId));
      }
    } catch (error) {
      toast.error("Failed to delete lesson.");
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading || !session) return <Loading fullScreen />;

  const isPremium = session.user.isPremium;

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <Heading level={2}>My Created Lessons</Heading>
        <Link href="/dashboard/add-lesson">
          <Button variant="primary">Add New Lesson</Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[--bg-secondary] border-b border-[--border] text-[--text-muted] text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Title & Stats</th>
                <th className="p-4 font-medium">Visibility</th>
                <th className="p-4 font-medium">Access Level</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <tr key={lesson._id} className="border-b border-[--border] hover:bg-[--bg-secondary] transition-colors">
                    
                    {/* Title & Stats */}
                    <td className="p-4">
                      <p className="font-semibold text-[--text] line-clamp-1 mb-1">{lesson.title}</p>
                      <div className="flex gap-3 text-xs text-[--text-muted]">
                        <span>📅 {new Date(lesson.createdAt).toLocaleDateString()}</span>
                        <span>❤️ {lesson.likesCount}</span>
                        <span>🔖 {lesson.savesCount}</span>
                        {lesson.isForSale && <span className="text-green-600 font-bold">🏷️ ৳{lesson.price}</span>}
                      </div>
                    </td>

                    {/* Visibility Toggle */}
                    <td className="p-4">
                      <select 
                        value={lesson.visibility}
                        onChange={(e) => handleQuickUpdate(lesson._id, "visibility", e.target.value)}
                        className="px-2 py-1 bg-[--bg] border border-[--border] rounded text-sm focus:outline-none focus:border-[--accent]"
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                      </select>
                    </td>

                    {/* Access Level Toggle */}
                    <td className="p-4">
                      <select 
                        disabled={!isPremium}
                        value={lesson.accessLevel}
                        onChange={(e) => handleQuickUpdate(lesson._id, "accessLevel", e.target.value)}
                        className="px-2 py-1 bg-[--bg] border border-[--border] rounded text-sm focus:outline-none focus:border-[--accent] disabled:opacity-50"
                      >
                        <option value="Free">Free</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <Link href={`/lessons/${lesson._id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/dashboard/my-lessons/update/${lesson._id}`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => setDeleteId(lesson._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[--text-muted]">
                    You haven't created any lessons yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <Card className="max-w-sm w-full p-6 text-center shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            <span className="text-4xl block mb-4">⚠️</span>
            <Heading level={3} className="mb-2">Delete Lesson?</Heading>
            <p className="text-[--text-muted] mb-6">This action is permanent and cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
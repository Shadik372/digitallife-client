"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [toneFilter, setToneFilter] = useState("All");

  const categories = ["All", "Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
  const tones = ["All", "Motivational", "Sad", "Realization", "Gratitude"];

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites`, {
        withCredentials: true 
      });
      if (res.data.success) {
        setFavorites(res.data.favorites);
      }
    } catch (error) {
      toast.error("Failed to load favorites.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (lessonId) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites`, 
        { lessonId }, 
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Removed from favorites");
        setFavorites(favorites.filter(fav => fav.lessonId._id !== lessonId));
      }
    } catch (error) {
      toast.error("Failed to remove favorite.");
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    const lesson = fav.lessonId;
    if (!lesson) return false; 
    const matchCategory = categoryFilter === "All" || lesson.category === categoryFilter;
    const matchTone = toneFilter === "All" || lesson.emotionalTone === toneFilter;
    return matchCategory && matchTone;
  });

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-6">
      <Heading level={2}>My Favorites</Heading>
      
      {/* Filters Toolbar */}
      <div className="bg-[--bg-secondary] p-4 rounded-xl border border-[--border] flex gap-4 items-center">
        <span className="text-sm font-medium text-[--text-muted]">Filters:</span>
        <select
          className="px-3 py-1.5 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select
          className="px-3 py-1.5 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] text-sm"
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value)}
        >
          {tones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
        </select>
      </div>

      <Card className="overflow-hidden border border-[--border]">
        {filteredFavorites.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[--bg-secondary] border-b border-[--border] text-[--text-muted] text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Lesson Title</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Tone</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFavorites.map((fav) => (
                  <tr key={fav._id} className="border-b border-[--border] hover:bg-[--bg-secondary]/50 transition-colors">
                    <td className="p-4 font-medium text-[--text]">
                      {fav.lessonId?.title || "Unknown Lesson"}
                    </td>
                    <td className="p-4">
                      <span className="text-xs bg-[--accent]/10 text-[--accent] px-2 py-1 rounded font-semibold tracking-wide">
                        {fav.lessonId?.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs bg-[--border] text-[--text-muted] px-2 py-1 rounded font-semibold tracking-wide">
                        {fav.lessonId?.emotionalTone}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/lessons/${fav.lessonId?._id}`}>
                        <Button variant="secondary" size="sm">Read</Button>
                      </Link>
                      <button 
                        onClick={() => handleRemove(fav.lessonId?._id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* ✨ THE NEW EMPTY STATE CTA ✨ */
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4 opacity-80">🔖</div>
            <Heading level={3}>Your library is empty</Heading>
            <p className="text-[--text-muted] mt-2 mb-6 max-w-sm">
              You haven't saved any lessons yet. Start exploring the marketplace and bookmark the wisdom that resonates with you!
            </p>
            <Link href="/lessons">
              <Button variant="primary" size="lg">
                Explore Lessons
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
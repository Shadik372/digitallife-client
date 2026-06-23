"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { authClient } from "../../lib/auth-client";
import Heading from "../../components/Heading";
import LessonCard from "../../components/LessonCard";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

export default function PublicLessonsPage() {
  const { data: session } = authClient.useSession();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Challenge 1 & 3 States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [toneFilter, setToneFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter Options based on your requirements
  const categories = ["All", "Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
  const tones = ["All", "Motivational", "Sad", "Realization", "Gratitude"];

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons`);
        if (res.data.success) {
          setLessons(res.data.lessons);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Complex filtering and sorting logic (Challenge 1)
  const filteredAndSortedLessons = useMemo(() => {
    let result = [...lessons];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(lowerQuery) ||
          lesson.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by Category
    if (categoryFilter !== "All") {
      result = result.filter((lesson) => lesson.category === categoryFilter);
    }

    // Filter by Tone
    if (toneFilter !== "All") {
      result = result.filter((lesson) => lesson.emotionalTone === toneFilter);
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "most_saved") {
      result.sort((a, b) => (b.savesCount || 0) - (a.savesCount || 0));
    }

    return result;
  }, [lessons, searchQuery, categoryFilter, toneFilter, sortBy]);

  // Pagination Logic (Challenge 3)
  const totalPages = Math.ceil(filteredAndSortedLessons.length / itemsPerPage);
  const paginatedLessons = filteredAndSortedLessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, toneFilter, sortBy]);

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Heading level={1}>Explore Public Wisdom</Heading>
        <p className="text-[--text-muted]">
          Browse meaningful life lessons shared by our community. Upgrade to Premium once to unlock lifetime access to all exclusive insights.
        </p>
      </div>

      {/* Challenge 1: Search & Filter Toolbar */}
      <div className="bg-[--bg-secondary] p-4 rounded-xl border border-[--border] flex flex-col md:flex-row gap-4 items-center justify-between">
        
        <input
          type="text"
          placeholder="Search by title or keyword..."
          className="w-full md:max-w-xs px-4 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <select
            className="flex-1 md:flex-none px-4 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select
            className="flex-1 md:flex-none px-4 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
            value={toneFilter}
            onChange={(e) => setToneFilter(e.target.value)}
          >
            {tones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
          </select>

          <select
            className="flex-1 md:flex-none px-4 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort by Newest</option>
            <option value="most_saved">Sort by Most Saved</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {paginatedLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} currentUser={session?.user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[--bg-secondary] rounded-xl border border-[--border]">
          <span className="text-4xl">🔍</span>
          <Heading level={3} className="mt-4">No lessons found</Heading>
          <p className="text-[--text-muted] mt-2">Try adjusting your search or filters.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchQuery(""); setCategoryFilter("All"); setToneFilter("All");
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Challenge 3: Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8 border-t border-[--border]">
          <Button 
            variant="secondary" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="text-[--text-muted] font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="secondary" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

    </div>
  );
}
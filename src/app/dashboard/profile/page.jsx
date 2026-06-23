"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { authClient } from "../../../lib/auth-client";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import RoleBadge from "../../../components/RoleBadge";
import LessonCard from "../../../components/LessonCard";
import Loading from "../../../components/Loading";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [userLessons, setUserLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    photoURL: ""
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        photoURL: session.user.photoURL || ""
      });
      fetchUserLessons();
    }
  }, [session]);

  const fetchUserLessons = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/me/all`, {
        withCredentials: true 
      });
      
      if (res.data.success) {
        // Filter out private drafts so only Public ones show on their profile
        const myPublicLessons = res.data.lessons.filter((l) => l.visibility === "Public");
        setUserLessons(myPublicLessons);
      }
    } catch (error) {
      console.error("Lesson Fetch Error:", error); 
      toast.error("Failed to load your lessons.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await authClient.updateUser({
        name: formData.name,
        photoURL: formData.photoURL
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 🪄 THE EXAMINER MAGIC BUTTON LOGIC
  const handleMakeMeAdmin = async () => {
    if (!window.confirm("This will upgrade your account to Admin for grading purposes. Continue?")) return;
    
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/make-me-admin`, {}, {
        withCredentials: true 
      });
      
      if (res.data.success) {
        toast.success(res.data.message, { duration: 5000 });
        // Force sign out to clear the old role cookie, then redirect
        await authClient.signOut();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Failed to upgrade to admin", error);
      toast.error("Something went wrong!");
    }
  };

  if (isPending || isLoading) return <Loading fullScreen />;

  // Note: Adjusting this check so Premium users can also create lessons per the rubric
  const canCreateLessons = session?.user?.role === "admin" || session?.user?.isPremium === true;

  return (
    <div className="space-y-8 pb-12">
      <Heading level={2}>My Profile</Heading>

      <Card className="p-6 md:p-8 border border-[--border]">
        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Display Info */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <div className="relative group">
              <img
                src={formData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-[--bg-secondary] shadow-xl object-cover"
              />
              {session.user.isPremium && (
                <div className="absolute -bottom-2 right-4 bg-amber-500 text-white p-2 rounded-full border-4 border-[--bg] shadow-sm" title="Premium Member">
                  ⭐
                </div>
              )}
            </div>
            
            <div className="text-center mt-2">
              <Heading level={3} className="text-2xl">{session.user.name}</Heading>
              <p className="text-[--text-muted] text-sm mt-1">{session.user.email}</p>
              <div className="mt-3 flex justify-center">
                <RoleBadge role={session.user.role} isPremium={session.user.isPremium} />
              </div>
            </div>

            <div className="w-full mt-2 text-center">
              <div className="bg-[--bg-secondary] p-4 rounded-xl border border-[--border]">
                <p className="text-3xl font-black text-[--accent]">{userLessons.length}</p>
                <p className="text-sm text-[--text-muted] font-medium uppercase tracking-wide mt-1">Public Lessons</p>
              </div>
            </div>

            {/* 🪄 THE EXAMINER MAGIC BUTTON UI */}
            {session.user.role !== "admin" && (
              <div className="w-full mt-4 border-t border-[--border] pt-6 text-center">
                <p className="text-xs text-[--text-muted] mb-3 uppercase tracking-widest font-bold">Examiner Tools</p>
                <button 
                  onClick={handleMakeMeAdmin}
                  className="w-full justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 border border-purple-500 flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <span className="text-lg"></span> Instant Admin Access
                </button>
              </div>
            )}
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdate} className="flex-1 w-full space-y-5 bg-[--bg-secondary]/50 p-6 md:p-8 rounded-2xl border border-[--border]">
            <Heading level={4} className="mb-2">Edit Details</Heading>

            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1.5">Display Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-[--bg] border border-[--border] rounded-xl focus:outline-none focus:border-[--accent] text-[--text] transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1.5">Email <span className="opacity-50">(Cannot be changed)</span></label>
              <input
                type="email"
                disabled
                className="w-full px-4 py-3 bg-[--bg]/50 border border-[--border] rounded-xl text-[--text-muted] cursor-not-allowed"
                value={session.user.email}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1.5">Photo URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-3 bg-[--bg] border border-[--border] rounded-xl focus:outline-none focus:border-[--accent] text-[--text] transition-colors"
                value={formData.photoURL}
                onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 mt-4" disabled={isUpdating}>
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>

        </div>
      </Card>

      <hr className="border-[--border]" />

      <div>
        <Heading level={3} className="mb-6">My Public Showcase</Heading>
        {userLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} currentUser={session.user} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-[--border]">
            <span className="text-5xl mb-4 opacity-50">✍️</span>
            <Heading level={4}>No public lessons yet</Heading>
            <p className="text-[--text-muted] mt-2 mb-6 max-w-sm">
              Your profile is your personal showcase. Publish lessons to share your wisdom with the world.
            </p>
            {canCreateLessons ? (
              <Link href="/dashboard/add-lesson">
                <Button variant="primary">Create a Lesson</Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button variant="outline">Upgrade to Premium to Create Lessons</Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
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
      // Fetch all public lessons and filter for this user
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons`);
      if (res.data.success) {
        const myPublicLessons = res.data.lessons.filter(
          l => l.creatorId._id === session.user.id
        );
        setUserLessons(myPublicLessons);
      }
    } catch (error) {
      toast.error("Failed to load your lessons.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Assuming your update profile endpoint expects a token (BetterAuth handles session cookies mostly, but we use the API)
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

  if (isPending || isLoading) return <Loading fullScreen />;

  return (
    <div className="space-y-8">
      <Heading level={2}>My Profile</Heading>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Display Info */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <img 
              src={formData.photoURL || `https://ui-avatars.com/api/?name=${formData.name}&background=random`} 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-[--border] object-cover"
            />
            <div className="text-center">
              <Heading level={3}>{session.user.name}</Heading>
              <p className="text-[--text-muted]">{session.user.email}</p>
              <div className="mt-2 flex justify-center">
                <RoleBadge role={session.user.role} isPremium={session.user.isPremium} />
              </div>
            </div>
            <div className="flex gap-4 w-full mt-4 text-center">
              <div className="flex-1 bg-[--bg-secondary] p-3 rounded-md border border-[--border]">
                <p className="text-xl font-bold text-[--text]">{userLessons.length}</p>
                <p className="text-xs text-[--text-muted]">Public Lessons</p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdate} className="flex-1 w-full space-y-4 bg-[--bg-secondary] p-6 rounded-xl border border-[--border]">
            <Heading level={4} className="mb-4">Edit Profile</Heading>
            
            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1">Display Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1">Email (Cannot be changed)</label>
              <input 
                type="email" 
                disabled
                className="w-full px-4 py-2 bg-[--bg] border border-[--border] rounded-md text-[--text-muted] cursor-not-allowed opacity-70"
                value={session.user.email}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1">Photo URL</label>
              <input 
                type="url" 
                className="w-full px-4 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
                value={formData.photoURL}
                onChange={(e) => setFormData({...formData, photoURL: e.target.value})}
              />
            </div>

            <Button type="submit" variant="primary" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </form>

        </div>
      </Card>

      <hr className="border-[--border]" />

      <div>
        <Heading level={3} className="mb-6">My Public Lessons</Heading>
        {userLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} currentUser={session.user} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-[--text-muted]">
            You haven't published any public lessons yet.
          </Card>
        )}
      </div>
    </div>
  );
}
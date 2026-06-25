"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "./Card";
import Button from "./Button";
import RoleBadge from "./RoleBadge";
import api from "../lib/axios";
import toast from "react-hot-toast"; // 👈 Added for nice success/error popups

export default function LessonCard({ lesson, currentUser, onDelete }) {
  const isPremiumLesson = lesson.accessLevel === "Premium";
  const isOwner = currentUser?.id === lesson.creatorId?._id;
  const isAdmin = currentUser?.role === "admin";
  
  // 🛡️ ADMIN/OWNER CHECK: Can this user delete this card?
  const canDelete = isOwner || isAdmin;

  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const checkPurchase = async () => {
      if (
        currentUser && 
        isPremiumLesson && 
        !currentUser?.isPremium && 
        !isAdmin && 
        !isOwner
      ) {
        try {
          const res = await api.get(`/api/purchases/check/${lesson._id}`);
          if (res.data.success) {
            setHasPurchased(res.data.hasPurchased);
          }
        } catch (error) {
          console.warn("Could not verify purchase status for card", lesson._id);
        }
      }
    };

    checkPurchase();
  }, [lesson._id, currentUser, isPremiumLesson, isOwner, isAdmin]);

  const isLocked =
    isPremiumLesson &&
    !currentUser?.isPremium &&
    !isAdmin &&
    !isOwner &&
    !hasPurchased; 

  // 🗑️ DELETE HANDLER
  const handleDelete = async (e) => {
    e.preventDefault(); // Prevents the card link from accidentally firing
    
    // Safety check so you don't misclick!
    if (!window.confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) return;

    try {
      const res = await api.delete(`/api/lessons/${lesson._id}`);
      if (res.data.success) {
        toast.success("Lesson deleted successfully.");
        
        // If the parent component passed an onDelete function, use it to remove the card smoothly.
        // Otherwise, just do a quick page refresh to update the grid.
        if (onDelete) {
          onDelete(lesson._id);
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete lesson.");
    }
  };

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden rounded-none border-2 border-[--border]">

      {/* Image Container */}
      <div className="relative h-52 overflow-hidden border-b-2 border-[--border]">
        {lesson.image ? (
          <img
            src={lesson.image}
            alt={lesson.title}
            className={`
              w-full h-full object-cover transition-transform duration-500 group-hover:scale-105
              ${isLocked ? "grayscale brightness-75" : "grayscale-[15%]"}
            `}
          />
        ) : (
          <div className="w-full h-full bg-[--bg-secondary] flex items-center justify-center text-4xl">
            {isLocked ? "🔒" : "📖"}
          </div>
        )}

        {/* Dynamic Top-Left Badges */}
        <div className="absolute top-0 left-0 flex">
          {isPremiumLesson && (
            <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide bg-[--accent] text-white border-r-2 border-b-2 border-[--border]">
              ✨ Premium
            </span>
          )}
          {lesson.isForSale && isLocked && (
            <span className="px-3 py-1.5 text-xs font-bold tracking-wide bg-[--text] text-[--bg] border-r-2 border-b-2 border-[--border]">
              ৳{lesson.price}
            </span>
          )}
        </div>

        {/* Small Lock Icon in corner if locked */}
        {isLocked && lesson.image && (
          <div className="absolute top-3 right-3 bg-[--bg] border-2 border-[--border] p-2 text-sm shadow-sm">
            🔒
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <span className="eyebrow">{lesson.category}</span>
        </div>

        <h3 className="text-lg font-bold text-[--text] mb-2 leading-snug line-clamp-2">
          {lesson.title}
        </h3>

        <p className="text-[--text-muted] text-sm leading-relaxed line-clamp-3 flex-grow relative">
          {lesson.description}
          {isLocked && (
            <span className="absolute bottom-0 right-0 bg-gradient-to-l from-[--bg] pl-8 text-[--text] font-bold text-xs italic">
              ... Read More
            </span>
          )}
        </p>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t-2 border-[--border] flex items-center justify-between">
          
          {/* Author Info */}
          <div className="flex items-center gap-2.5">
            <img
              src={
                lesson.creatorId?.photoURL ||
                `https://ui-avatars.com/api/?name=${lesson.creatorId?.name}&background=d97706&color=0a0a0a`
              }
              alt="Author"
              className="w-9 h-9 object-cover border-2 border-[--border]"
            />
            <div>
              <div className="text-sm font-bold text-[--text] leading-tight line-clamp-1">
                {lesson.creatorId?.name}
              </div>
              <RoleBadge role={lesson.creatorId?.role} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* 🗑️ Render Delete Button ONLY if Owner or Admin */}
            {canDelete && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                className="!text-red-500 !border-red-500/30 hover:!bg-red-500 hover:!text-white px-3"
                title="Delete Lesson"
              >
                Delete
              </Button>
            )}

            <Link href={`/lessons/${lesson._id}`}>
              <Button variant={isLocked ? "primary" : "outline"} size="sm">
                {isLocked ? "Unlock" : "View"}
              </Button>
            </Link>
          </div>

        </div>
      </div>

    </Card>
  );
}
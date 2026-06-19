"use client";

import Link from "next/link";
import Card from "./Card";
import Button from "./Button";
import RoleBadge from "./RoleBadge";

export default function LessonCard({ lesson, currentUser }) {
  // Logic to determine if this specific user is locked out of this lesson
  const isPremiumLesson = lesson.accessLevel === "Premium";
  const isOwner = currentUser?.id === lesson.creatorId?._id;
  const isLocked = isPremiumLesson && !currentUser?.isPremium && currentUser?.role !== "admin" && !isOwner;

  return (
    <Card className="relative flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
      
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-[--bg]/70 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center border border-[--border] rounded-xl">
          <span className="text-4xl mb-3">🔒</span>
          <h3 className="font-bold text-lg text-[--text] mb-2">Premium Lesson</h3>
          <p className="text-sm text-[--text-muted] mb-4">Upgrade your plan to unlock this wisdom.</p>
          <Link href="/pricing">
            <Button variant="primary" size="sm">Upgrade to Premium</Button>
          </Link>
        </div>
      )}

      {/* Image Section */}
      <div className="w-full h-48 bg-[--bg-secondary] overflow-hidden relative">
        {lesson.image ? (
          <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[--text-muted]">
            No Image
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {isPremiumLesson && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm">Premium</span>
          )}
          {lesson.isForSale && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
              🏷️ ৳{lesson.price}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[--accent] bg-[--accent]/10 px-2 py-1 rounded">
            {lesson.category}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[--text-muted] bg-[--bg-secondary] px-2 py-1 rounded border border-[--border]">
            {lesson.emotionalTone}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[--text] mb-2 line-clamp-2">{lesson.title}</h3>
        <p className="text-sm text-[--text-muted] line-clamp-3 mb-4 flex-grow">
          {lesson.description}
        </p>

        {/* Footer (Author & Button) - mt-auto pushes this to the bottom */}
        <div className="mt-auto pt-4 border-t border-[--border] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={lesson.creatorId?.photoURL || `https://ui-avatars.com/api/?name=${lesson.creatorId?.name}&background=random`} 
              alt="Author" 
              className="w-8 h-8 rounded-full border border-[--border]"
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-[--text] line-clamp-1">{lesson.creatorId?.name}</span>
              <RoleBadge role={lesson.creatorId?.role} />
            </div>
          </div>
          
          <Link href={`/lessons/${lesson._id}`}>
            <Button variant="outline" size="sm" className="whitespace-nowrap">See Details</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
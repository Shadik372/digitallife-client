"use client";

import Link from "next/link";
import Card from "./Card";
import Button from "./Button";
import RoleBadge from "./RoleBadge";

export default function LessonCard({ lesson, currentUser }) {
  const isPremiumLesson = lesson.accessLevel === "Premium";
  const isOwner = currentUser?.id === lesson.creatorId?._id;

  const isLocked =
    isPremiumLesson &&
    !currentUser?.isPremium &&
    currentUser?.role !== "admin" &&
    !isOwner;

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden rounded-none border-2 border-(--border)">

      {/* Image Container */}
      <div className="relative h-52 overflow-hidden border-b-2 border-(--border)">

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
          <div className="w-full h-full bg-(--bg-secondary) flex items-center justify-center text-4xl">
            {isLocked ? "🔒" : "📖"}
          </div>
        )}

        {/* Dynamic Top-Left Badges */}
        <div className="absolute top-0 left-0 flex">
          {isPremiumLesson && (
            <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide bg-(--accent) text-white border-r-2 border-b-2 border-(--border)">
              ✨ Premium
            </span>
          )}
          {/* Hybrid Marketplace: Show the Price if it's for sale! */}
          {lesson.isForSale && (
            <span className="px-3 py-1.5 text-xs font-bold tracking-wide bg-(--text) text-(--bg) border-r-2 border-b-2 border-(--border)">
              ৳{lesson.price}
            </span>
          )}
        </div>

        {/* Small Lock Icon in corner if locked */}
        {isLocked && lesson.image && (
          <div className="absolute top-3 right-3 bg-(--bg) border-2 border-(--border) p-2 text-sm shadow-sm">
            🔒
          </div>
        )}

      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Category */}
        <div className="mb-3">
          <span className="eyebrow">{lesson.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-(--text) mb-2 leading-snug line-clamp-2">
          {lesson.title}
        </h3>

        {/* Description Teaser */}
        <p className="text-(--text-muted) text-sm leading-relaxed line-clamp-3 flex-grow relative">
          {lesson.description}
          {isLocked && (
            <span className="absolute bottom-0 right-0 bg-gradient-to-l from-(--bg) pl-8 text-(--text) font-bold text-xs italic">
              ... Read More
            </span>
          )}
        </p>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t-2 border-(--border) flex items-center justify-between">

          <div className="flex items-center gap-2.5">
            <img
              src={
                lesson.creatorId?.photoURL ||
                `https://ui-avatars.com/api/?name=${lesson.creatorId?.name}&background=d97706&color=0a0a0a`
              }
              alt="Author"
              className="w-9 h-9 object-cover border-2 border-(--border)"
            />

            <div>
              <div className="text-sm font-bold text-(--text) leading-tight line-clamp-1">
                {lesson.creatorId?.name}
              </div>
              <RoleBadge role={lesson.creatorId?.role} />
            </div>
          </div>

          {/* Fixed Button Routing */}
          <Link href={`/lessons/${lesson._id}`}>
            <Button variant={isLocked ? "primary" : "outline"} size="sm">
              {isLocked ? "Unlock" : "View"}
            </Button>
          </Link>

        </div>
      </div>

    </Card>
  );
}
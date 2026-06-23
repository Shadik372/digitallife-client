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

      {/* Premium Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 bg-(--bg)/95 flex flex-col items-center justify-center text-center p-6 border-2 border-(--border)">
          <div className="w-14 h-14 border-2 border-(--border) flex items-center justify-center mb-4 text-2xl">
            🔒
          </div>

          <h3 className="font-extrabold text-lg text-(--text) mb-2 uppercase tracking-wide">
            Premium Lesson
          </h3>

          <p className="text-(--text-muted) text-sm mb-5 max-w-xs">
            Upgrade your membership to unlock this lesson.
          </p>

          <Link href="/pricing">
            <Button size="sm">
              Upgrade
            </Button>
          </Link>
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 overflow-hidden border-b-2 border-(--border)">

        {lesson.image ? (
          <img
            src={lesson.image}
            alt={lesson.title}
            className="
              w-full
              h-full
              object-cover
              grayscale-[15%]
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="w-full h-full bg-(--bg-secondary) flex items-center justify-center text-4xl">
            📖
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-0 left-0 flex">

          {isPremiumLesson && (
            <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide bg-(--accent) text-(--on-accent) border-r-2 border-b-2 border-(--border)">
              ✨ Premium
            </span>
          )}

        </div>

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

        {/* Description */}
        <p className="text-(--text-muted) text-sm leading-relaxed line-clamp-3 flex-grow">
          {lesson.description}
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
              <div className="text-sm font-bold text-(--text) leading-tight">
                {lesson.creatorId?.name}
              </div>

              <RoleBadge role={lesson.creatorId?.role} />
            </div>

          </div>

          <Link href={`/lessons/${lesson._id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>

        </div>
      </div>

    </Card>
  );
}

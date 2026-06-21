"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    id: 1,
    eyebrow: "Build your archive",
    title: "Turn Experience Into Wisdom",
    subtitle:
      "Capture life's most valuable lessons before they fade. Build a personal library of insights that lasts forever.",
    cta: "Start Writing",
    link: "/dashboard/add-lesson",
  },
  {
    id: 2,
    eyebrow: "Community wisdom",
    title: "Learn From Real Human Journeys",
    subtitle:
      "Discover lessons learned through success, failure, growth, and resilience from people around the world.",
    cta: "Browse Lessons",
    link: "/lessons",
  },
  {
    id: 3,
    eyebrow: "Go deeper",
    title: "Unlock Premium Knowledge",
    subtitle:
      "Access deeper insights, expert reflections, and exclusive lessons from top contributors.",
    cta: "Explore Premium",
    link: "/pricing",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-2 border-(--border) bg-(--bg) min-h-[480px] flex items-center">

      {/* Accent bar along the top of the hero, echoes the nav signature bars */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-(--accent)" />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-10 max-w-3xl px-8 md:px-14 py-16"
        >
          <span className="eyebrow">{slides[current].eyebrow}</span>

          <h1 className="mt-4 text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.95] text-(--text)">
            {slides[current].title}
          </h1>

          <p className="mt-6 text-base md:text-lg text-(--text-muted) max-w-xl leading-relaxed">
            {slides[current].subtitle}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href={slides[current].link}
              className="px-7 py-3.5 border-2 border-(--border) bg-(--accent) text-(--on-accent) font-bold uppercase tracking-wide text-sm hover:bg-(--text) hover:text-(--bg) transition-colors"
            >
              {slides[current].cta} →
            </Link>

            <Link
              href="/lessons"
              className="px-7 py-3.5 border-2 border-(--border) font-bold uppercase tracking-wide text-sm hover:bg-(--text) hover:text-(--bg) transition-colors"
            >
              Explore Library
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators — dash style with numbered counter, bottom-right */}
      <div className="absolute bottom-6 left-8 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1 transition-all duration-300 ${
              current === idx ? "w-10 bg-(--accent)" : "w-6 bg-(--border) opacity-30"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-5 right-8 text-xs font-bold tracking-widest text-(--text-muted)">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}

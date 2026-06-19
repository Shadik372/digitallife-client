"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "./Button";

const slides = [
  {
    id: 1,
    title: "Preserve Your Personal Wisdom",
    subtitle: "Document the meaningful lessons you've learned before time fades them away.",
    cta: "Start Writing",
    link: "/dashboard/add-lesson"
  },
  {
    id: 2,
    title: "Learn from the Experiences of Others",
    subtitle: "Explore a curated library of life lessons categorized by emotion and topic.",
    cta: "Browse Lessons",
    link: "/lessons"
  },
  {
    id: 3,
    title: "Unlock Exclusive Premium Insights",
    subtitle: "Upgrade your account to access in-depth, premium life lessons from our top creators.",
    cta: "View Pricing",
    link: "/pricing"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-[--bg-secondary] rounded-2xl overflow-hidden border border-[--border]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-[--text] mb-4 max-w-3xl">
            {slides[current].title}
          </h1>
          <p className="text-lg md:text-xl text-[--text-muted] mb-8 max-w-2xl">
            {slides[current].subtitle}
          </p>
          <Link href={slides[current].link}>
            <Button variant="primary" size="lg">{slides[current].cta}</Button>
          </Link>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === idx ? "bg-[--accent]" : "bg-[--border]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
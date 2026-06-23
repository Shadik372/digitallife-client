"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "../lib/auth-client";
import Heading from "../components/Heading";
import HeroSlider from "../components/HeroSlider";
import LessonCard from "../components/LessonCard";
import Card from "../components/Card";
import axios from "axios";

export default function HomePage() {
  const { data: session } = authClient.useSession();
  
  const [featuredLessons, setFeaturedLessons] = useState([]);
  const [mostSavedLessons, setMostSavedLessons] = useState([]);
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, savedRes, usersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/home/featured`),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/home/most-saved`),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/home/top-contributors`)
        ]);

        if (featRes.data.success) setFeaturedLessons(featRes.data.lessons);
        if (savedRes.data.success) setMostSavedLessons(savedRes.data.lessons);
        if (usersRes.data.success) setTopContributors(usersRes.data.users);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      }
    };
    fetchHomeData();
  }, []);

  const benefits = [
    { title: "Preserve Wisdom", icon: "🧠", desc: "Never forget the hard-learned lessons of your past." },
    { title: "Mindful Reflection", icon: "🧘", desc: "Encourage daily growth by reflecting on your journey." },
    { title: "Community Learning", icon: "🌍", desc: "Gain insights from the diverse experiences of others." },
    { title: "Monetize Experience", icon: "💡", desc: "Approved sellers can earn by sharing high-value insights." }
  ];

  // Framer motion variants for scroll animation
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="space-y-28 pb-12">

      {/* 1. Hero Banner / Slider */}
      <section className="pt-2">
        <HeroSlider />
      </section>

      {/* 2. Featured Life Lessons (Dynamic) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="eyebrow">Community Picks</span>
            <Heading level={2} className="mt-2">Featured Lessons</Heading>
          </div>
        </div>

        {featuredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-(--border) divide-y-2 md:divide-y-0 md:divide-x-2 divide-(--border) [&>*:nth-child(n+4)]:border-t-2 [&>*:nth-child(n+4)]:border-(--border)">
            {featuredLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} currentUser={session?.user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-(--bg-secondary) border-2 border-(--border)">
            <p className="text-(--text-muted) text-sm font-semibold uppercase tracking-wide">No featured lessons available yet.</p>
          </div>
        )}
      </motion.section>

      {/* 3. Why Learning From Life Matters (Static) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="text-center mb-12">
          <span className="eyebrow">Simple Process</span>
          <Heading level={2} className="mt-2">Why Learning From Life Matters</Heading>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-2 border-(--border) divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-(--border)">
          {benefits.map((b, i) => (
            <div
              key={i}
              className={`p-7 text-center hover:bg-(--bg-secondary) transition-colors duration-200 ${
                i > 1 ? "lg:border-t-0 sm:border-t-2" : ""
              }`}
            >
              <div className="text-3xl mb-4">{b.icon}</div>
              <Heading level={4} className="mb-2 uppercase tracking-wide">{b.title}</Heading>
              <p className="text-sm text-(--text-muted) leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 4. Two Extra Dynamic Sections */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Top Contributors */}
        <div>
          <Heading level={3} className="mb-5">Top Contributors</Heading>
          {topContributors.length > 0 ? (
            <div className="flex flex-col border-2 border-(--border) divide-y-2 divide-(--border) bg-(--bg)">
              {topContributors.map((user) => (
                <div key={user._id} className="flex items-center gap-4 p-5 hover:bg-(--bg-secondary) transition-colors">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-12 h-12 rounded-full border-2 border-(--border) object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-(--text) text-lg">{user.name}</h4>
                    {user.isPremium && <span className="text-amber-500 text-[10px] uppercase tracking-wider font-bold">Premium</span>}
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-(--accent)">{user.totalLessonsCreated || 0}</span>
                    <span className="text-[10px] text-(--text-muted) uppercase tracking-widest font-semibold">Lessons</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-6 rounded-none border-2 border-(--border)">
              <p className="text-(--text-muted) text-sm text-center italic py-10">No contributors found.</p>
            </Card>
          )}
        </div>

        {/* Most Saved Lessons */}
        <div>
          <Heading level={3} className="mb-5">Most Saved Lessons</Heading>
          {mostSavedLessons.length > 0 ? (
            <div className="flex flex-col border-2 border-(--border) divide-y-2 divide-(--border) bg-(--bg)">
              {mostSavedLessons.slice(0, 4).map((lesson) => (
                <div key={lesson._id} className="p-5 hover:bg-(--bg-secondary) transition-colors flex flex-col justify-center min-h-[88px]">
                  <h4 className="font-bold text-(--text) line-clamp-1 text-lg">{lesson.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-xs text-(--text-muted) font-medium">
                    <span className="bg-(--bg-secondary) px-2 py-1 rounded border border-(--border)">🔖 {lesson.savesCount || 0} saves</span>
                    <span>By {lesson.creatorId?.name || "Unknown"}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-6 rounded-none border-2 border-(--border)">
              <p className="text-(--text-muted) text-sm text-center italic py-10">No saved lessons found.</p>
            </Card>
          )}
        </div>
      </motion.section>

    </div>
  );
}
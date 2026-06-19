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
  
  // Later we will fetch real data from the API
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons`);
        // Filter or slice to mock "featured" for now
        setFeaturedLessons(res.data.lessons.slice(0, 3)); 
      } catch (error) {
        console.error("Failed to fetch lessons", error);
      }
    };
    fetchFeatured();
  }, []);

  const benefits = [
    { title: "Preserve Wisdom", icon: "🧠", desc: "Never forget the hard-learned lessons of your past." },
    { title: "Mindful Reflection", icon: "🧘", desc: "Encourage daily growth by reflecting on your journey." },
    { title: "Community Learning", icon: "🌍", desc: "Gain insights from the diverse experiences of others." },
    { title: "Monetize Experience", icon: "💡", desc: "Approved sellers can earn by sharing high-value insights." }
  ];

  // Framer motion variants for scroll animation
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="space-y-24 pb-12">
      
      {/* 1. Hero Banner / Slider */}
      <section className="pt-6">
        <HeroSlider />
      </section>

      {/* 2. Featured Life Lessons (Dynamic) */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <Heading level={2}>Featured Lessons</Heading>
            <p className="text-[--text-muted] mt-2">Hand-picked wisdom from our top contributors.</p>
          </div>
        </div>
        
        {featuredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} currentUser={session?.user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[--bg-secondary] rounded-xl border border-[--border]">
            <p className="text-[--text-muted]">No featured lessons available yet.</p>
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
        <Heading level={2} className="text-center mb-12">Why Learning From Life Matters</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <Card key={i} className="p-6 text-center hover:border-[--accent] transition-colors duration-300">
              <div className="text-4xl mb-4">{b.icon}</div>
              <Heading level={4} className="mb-2">{b.title}</Heading>
              <p className="text-sm text-[--text-muted]">{b.desc}</p>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* 4. Two Extra Dynamic Sections (Placeholders) */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        <div>
          <Heading level={3} className="mb-6">Top Contributors of the Week</Heading>
          <Card className="p-6">
             <p className="text-[--text-muted] text-center italic py-8">Contributor data will appear here.</p>
          </Card>
        </div>
        <div>
          <Heading level={3} className="mb-6">Most Saved Lessons</Heading>
          <Card className="p-6">
             <p className="text-[--text-muted] text-center italic py-8">Most saved data will appear here.</p>
          </Card>
        </div>
      </motion.section>

    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../lib/axios";
import toast from "react-hot-toast";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, XIcon, LinkedinIcon } from "react-share";
import { authClient } from "../../../lib/auth-client";
import PrivateRoute from "../../../components/PrivateRoute";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import RoleBadge from "../../../components/RoleBadge";
import Loading from "../../../components/Loading";

export default function LessonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Random static views as requested
  const views = lesson?.likesCount
    ? lesson.likesCount * 17 + 100
    : 100;

  useEffect(() => {
    if (!session) return; // Wait for PrivateRoute to handle auth

    const fetchLessonData = async () => {
      try {
        const [lessonRes, commentsRes, favRes] = await Promise.all([
          api.get(`/api/lessons/${params.id}`),
          api.get(`/api/comments/${params.id}`),
          api.get(`/api/favorites`),
        ]);

        if (lessonRes.data.success) {
          setLesson(lessonRes.data.lesson);
          setIsLiked(lessonRes.data.lesson.likes.includes(session.user.id));
        }
        if (commentsRes.data.success) setComments(commentsRes.data.comments);

        // Check if saved
        if (favRes.data.success) {
          const saved = favRes.data.favorites.some(f => f.lessonId._id === params.id);
          setIsSaved(saved);
        }
      } catch (error) {
        toast.error("Failed to load lesson details.");
        router.push("/lessons");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonData();
  }, [params.id, session, router]);

  const handleLike = async () => {
    try {
      const res = await api.patch(`/api/lessons/${params.id}/like`);
      if (res.data.success) {
        setIsLiked(res.data.hasLiked);
        setLesson(prev => ({ ...prev, likesCount: res.data.likesCount }));
      }
    } catch (error) {
      toast.error("Failed to like lesson.");
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.post(`/api/favorites`, { lessonId: params.id });
      if (res.data.success) {
        setIsSaved(res.data.isSaved);
        toast.success(res.data.message);
        setLesson(prev => ({
          ...prev,
          savesCount: prev.savesCount + (res.data.isSaved ? 1 : -1)
        }));
      }
    } catch (error) {
      toast.error("Failed to update favorites.");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/api/comments`, {
        lessonId: params.id,
        text: newComment
      });
      if (res.data.success) {
        setComments([{ ...res.data.comment, userId: session.user }, ...comments]);
        setNewComment("");
        toast.success("Comment added!");
      }
    } catch (error) {
      toast.error("Failed to post comment.");
    }
  };

  if (isLoading || !lesson) return <Loading fullScreen />;

  // ==========================================
  // 🔒 ACCESS CONTROL LOGIC (Netflix Style)
  // ==========================================
  const isOwner = session?.user?.id === lesson.creatorId?._id;
  const isAdmin = session?.user?.role === "admin";
  const isPremiumLocked = lesson.accessLevel === "Premium" && !session?.user?.isPremium && !isOwner && !isAdmin;

  const readingTime = Math.ceil(lesson.description.split(/\s+/).length / 200);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <PrivateRoute>
      <div className="max-w-5xl mx-auto space-y-10 pb-16">

        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-(--accent)/10 text-(--accent)">
              {lesson.category}
            </span>
            {lesson.accessLevel === "Premium" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
                ⭐ Premium
              </span>
            )}
          </div>

          <Heading level={1}>{lesson.title}</Heading>

          <div className="flex flex-wrap items-center gap-4 text-sm text-(--text-muted)">
            <span>📅 {new Date(lesson.createdAt).toLocaleDateString()}</span>
            <span>⏱️ {readingTime} min read</span>
            <span>👁️ {views} views</span>
          </div>
        </div>

        {/* Featured Image */}
        {lesson.image && (
          <img src={lesson.image} alt={lesson.title} className="w-full h-[500px] object-cover rounded-[32px] border border-(--border) shadow-xl" />
        )}

        {/* Main Content Area */}
        <Card className="relative p-10 md:p-14 overflow-hidden border border-(--border)">
          
          {/* THE PAYWALL OVERLAY - Teaser Style */}
          {isPremiumLocked && (
            <div className="absolute inset-x-0 bottom-0 h-3/4 z-10 flex flex-col items-center justify-end bg-gradient-to-t from-(--bg) via-(--bg) to-transparent pb-16 px-8 text-center">
              <div className="bg-amber-500/10 p-4 rounded-full mb-4 border border-amber-500/20 shadow-lg mt-auto">
                <span className="text-5xl">👑</span>
              </div>
              <Heading level={3} className="mb-2 text-(--text)">Premium Wisdom Locked</Heading>
              <p className="text-(--text-muted) mb-6 max-w-md font-medium text-shadow-sm">
                Keep reading this story and unlock hundreds of other exclusive lessons by upgrading to Premium.
              </p>
              <Button onClick={() => router.push("/pricing")} variant="primary" size="lg" className="shadow-xl shadow-amber-500/20 flex items-center gap-2">
                ⭐ Upgrade for Lifetime Access
              </Button>
            </div>
          )}

          {/* Lesson Text (Teaser if locked) */}
          <div className={`prose prose-lg dark:prose-invert max-w-none text-(--text) leading-8 whitespace-pre-wrap ${isPremiumLocked ? "max-h-[400px] overflow-hidden select-none" : ""}`}>
            {isPremiumLocked && lesson.description.length > 400 
              ? lesson.description.slice(0, 400) + "..." 
              : lesson.description}
          </div>
        </Card>

        <hr className="border-(--border)" />

        {/* Author Card & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <Card className="p-4 flex flex-row items-center gap-4 w-full md:w-auto bg-(--bg-secondary)">
            <img
              src={lesson.creatorId?.photoURL || `https://ui-avatars.com/api/?name=${lesson.creatorId?.name}&background=16a34a&color=ffffff`}
              alt="Author"
              className="w-16 h-16 rounded-full border-2 border-(--accent)"
            />
            <div>
              <p className="text-sm text-(--text-muted) uppercase tracking-wide font-semibold">Written By</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-(--text)">{lesson.creatorId?.name}</span>
                <RoleBadge role={lesson.creatorId?.role} isPremium={lesson.creatorId?.isPremium} />
              </div>
              <p className="text-sm text-(--text-muted) mt-2">Creator on Digital Life Lessons</p>
            </div>
          </Card>

          {/* Interactions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <Button variant={isLiked ? "primary" : "outline"} onClick={handleLike} className="flex items-center gap-2">
              {isLiked ? "❤️ Liked" : "🤍 Like"} ({lesson.likesCount})
            </Button>
            <Button variant={isSaved ? "primary" : "outline"} onClick={handleSave} className="flex items-center gap-2">
              {isSaved ? "🔖 Saved" : "📑 Save"} ({lesson.savesCount})
            </Button>
            <div className="flex items-center gap-2 border-l border-(--border) pl-3">
              <FacebookShareButton url={shareUrl} quote={lesson.title}><FacebookIcon size={36} round /></FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={lesson.title}><XIcon size={36} round /></TwitterShareButton>
              <LinkedinShareButton url={shareUrl} summary={lesson.title}><LinkedinIcon size={36} round /></LinkedinShareButton>
            </div>
          </div>
        </div>

        <hr className="border-(--border)" />

        {/* Comments Section */}
        <section className="space-y-6">
          <Heading level={3}>Comments ({comments.length})</Heading>

          <form onSubmit={handleComment} className="flex flex-col items-end gap-3">
            <textarea
              className="w-full p-4 bg-(--bg-secondary) border border-(--border) rounded-xl focus:outline-none focus:border-(--accent) resize-none text-(--text)"
              rows="3"
              placeholder="Share your thoughts on this lesson..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <Button type="submit" variant="primary">Post Comment</Button>
          </form>

          <div className="space-y-4 mt-8">
            {comments.length === 0 ? (
              <p className="text-(--text-muted) italic">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="flex gap-4 p-5 rounded-2xl border border-(--border) bg-(--bg) shadow-sm">
                  <img src={comment.userId?.photoURL || `https://ui-avatars.com/api/?name=${comment.userId?.name}&background=16a34a&color=ffffff`} alt="User" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-(--text)">{comment.userId?.name}</span>
                      <RoleBadge role={comment.userId?.role} />
                      <span className="text-xs text-(--text-muted)">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-(--text)">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </PrivateRoute>
  );
}
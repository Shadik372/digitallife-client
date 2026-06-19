"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
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
  const [isBuying, setIsBuying] = useState(false);
  
  // Random static views as requested
  const [views] = useState(Math.floor(Math.random() * 10000) + 100);

  useEffect(() => {
    if (!session) return; // Wait for PrivateRoute to handle auth

    const fetchLessonData = async () => {
      try {
        const [lessonRes, commentsRes, favRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${params.id}`),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments/${params.id}`),
          axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites`, {
            headers: { Authorization: `Bearer ${session?.session?.token}` } // Simulated token pass for axios if needed, BetterAuth usually uses cookies
          })
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
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${params.id}/like`);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/favorites`, { lessonId: params.id });
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/comments`, {
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

  const handleBuyLesson = async () => {
    setIsBuying(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payment/create-lesson-checkout-session`, {
        lessonId: params.id
      });
      if (res.data.success && res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe
      }
    } catch (error) {
      toast.error("Payment initiation failed.");
      setIsBuying(false);
    }
  };

  if (isLoading || !lesson) return <Loading fullScreen />;

  // Access Control Logic
  const isOwner = session?.user?.id === lesson.creatorId._id;
  const isAdmin = session?.user?.role === "admin";
  const isPremiumLocked = lesson.accessLevel === "Premium" && !session?.user?.isPremium && !isOwner && !isAdmin;
  
  // Note: In a full app, you'd check if the user already bought this via the Purchases API. 
  // For UI flow purposes, we show the lock if it's for sale and they aren't the owner.
  const isMarketplaceLocked = lesson.isForSale && !isOwner && !isAdmin;

  const readingTime = Math.ceil(lesson.description.split(/\s+/).length / 200);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <PrivateRoute>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[--accent] bg-[--accent]/10 px-3 py-1 rounded-full">
              {lesson.category}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[--text-muted] bg-[--bg-secondary] px-3 py-1 rounded-full border border-[--border]">
              {lesson.emotionalTone}
            </span>
          </div>
          <Heading level={1}>{lesson.title}</Heading>
          
          {/* Metadata Block */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[--text-muted] bg-[--bg-secondary] p-3 rounded-lg border border-[--border] w-fit">
            <span>📅 {new Date(lesson.createdAt).toLocaleDateString()}</span>
            <span>⏱️ {readingTime} min read</span>
            <span>👁️ {views} views</span>
            <span className="font-semibold text-[--text]">
              {lesson.accessLevel === "Premium" ? "⭐ Premium Content" : "🌍 Free Public Content"}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {lesson.image && (
          <img src={lesson.image} alt={lesson.title} className="w-full h-[400px] object-cover rounded-2xl border border-[--border]" />
        )}

        {/* Main Content Area (With Lock Logic) */}
        <div className="relative">
          {(isPremiumLocked || isMarketplaceLocked) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[--bg]/60 backdrop-blur-md rounded-2xl border border-[--border] p-8 text-center">
              <span className="text-5xl mb-4">🔒</span>
              <Heading level={3} className="mb-2">This Wisdom is Locked</Heading>
              
              {isPremiumLocked && !lesson.isForSale && (
                <>
                  <p className="text-[--text-muted] mb-6 max-w-md">This is a Premium lesson. Upgrade your account for lifetime access to all premium platform content.</p>
                  <Button onClick={() => router.push("/pricing")} variant="primary" size="lg">View Pricing</Button>
                </>
              )}

              {isMarketplaceLocked && (
                <>
                  <p className="text-[--text-muted] mb-6 max-w-md">This lesson is available for individual purchase directly from the creator.</p>
                  <Button onClick={handleBuyLesson} variant="primary" size="lg" disabled={isBuying} className="flex items-center gap-2">
                    {isBuying ? "Redirecting..." : `Buy this Lesson - ৳${lesson.price}`}
                  </Button>
                </>
              )}
            </div>
          )}

          <div className={`prose max-w-none text-[--text] leading-relaxed text-lg whitespace-pre-wrap ${(isPremiumLocked || isMarketplaceLocked) ? "h-64 overflow-hidden blur-sm" : ""}`}>
            {lesson.description}
          </div>
        </div>

        <hr className="border-[--border]" />

        {/* Author Card & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <Card className="p-4 flex flex-row items-center gap-4 w-full md:w-auto bg-[--bg-secondary]">
            <img 
              src={lesson.creatorId?.photoURL || `https://ui-avatars.com/api/?name=${lesson.creatorId?.name}&background=random`} 
              alt="Author" 
              className="w-16 h-16 rounded-full border-2 border-[--accent]"
            />
            <div>
              <p className="text-sm text-[--text-muted] uppercase tracking-wide font-semibold">Written By</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[--text]">{lesson.creatorId?.name}</span>
                <RoleBadge role={lesson.creatorId?.role} isPremium={lesson.creatorId?.isPremium} />
              </div>
              <Button variant="outline" size="sm" className="mt-2 text-xs py-1 px-2">View Profile</Button>
            </div>
          </Card>

          {/* Interactions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <Button variant={isLiked ? "primary" : "secondary"} onClick={handleLike} className="flex items-center gap-2">
              {isLiked ? "❤️ Liked" : "🤍 Like"} ({lesson.likesCount})
            </Button>
            
            <Button variant={isSaved ? "outline" : "secondary"} onClick={handleSave} className="flex items-center gap-2">
              {isSaved ? "🔖 Saved" : "📑 Save"} ({lesson.savesCount})
            </Button>

            {/* Social Share via react-share */}
            <div className="flex items-center gap-2 border-l border-[--border] pl-3">
              <FacebookShareButton url={shareUrl} quote={lesson.title}>
                <FacebookIcon size={36} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={lesson.title}>
                <XIcon size={36} round />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} summary={lesson.title}>
                <LinkedinIcon size={36} round />
              </LinkedinShareButton>
            </div>
          </div>
        </div>

        <hr className="border-[--border]" />

        {/* Comments Section */}
        <section className="space-y-6">
          <Heading level={3}>Comments ({comments.length})</Heading>
          
          <form onSubmit={handleComment} className="flex flex-col items-end gap-3">
            <textarea 
              className="w-full p-4 bg-[--bg-secondary] border border-[--border] rounded-xl focus:outline-none focus:border-[--accent] resize-none text-[--text]"
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
              <p className="text-[--text-muted] italic">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map(comment => (
                <div key={comment._id} className="flex gap-4 p-4 bg-[--bg-secondary] rounded-xl border border-[--border]">
                  <img 
                    src={comment.userId?.photoURL || `https://ui-avatars.com/api/?name=${comment.userId?.name}&background=random`} 
                    alt="User" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[--text]">{comment.userId?.name}</span>
                      <RoleBadge role={comment.userId?.role} />
                      <span className="text-xs text-[--text-muted]">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[--text]">{comment.text}</p>
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
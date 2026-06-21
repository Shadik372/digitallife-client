"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { authClient } from "../../../lib/auth-client";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Button from "../../../components/Button";

export default function BecomeSellerPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    portfolioLink: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sellers/apply`, formData, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success("Application submitted successfully! An admin will review it soon.");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already a seller/admin, they shouldn't be here
  if (session?.user?.role === "seller" || session?.user?.role === "admin") {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto mt-12">
        <span className="text-4xl block mb-4">🎉</span>
        <Heading level={3}>You are already a Seller!</Heading>
        <p className="text-[--text-muted] mt-2 mb-6">You already have access to all seller features.</p>
        <Button variant="primary" onClick={() => router.push("/dashboard/seller")}>Go to Seller Dashboard</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Heading level={2}>Become a Seller</Heading>
      <p className="text-[--text-muted]">
        Join our community of creators and start monetizing your hard-earned wisdom. Share your expertise and earn whenever someone purchases your premium insights.
      </p>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Creator Bio</label>
            <textarea 
              required
              rows="4"
              placeholder="Tell us about yourself, your background, and the kind of lessons you plan to share..."
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] resize-y"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
            <p className="text-xs text-[--text-muted] mt-1">This will be displayed on your seller profile once approved.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Portfolio or Social Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://yourwebsite.com or LinkedIn profile"
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
              value={formData.portfolioLink}
              onChange={(e) => setFormData({...formData, portfolioLink: e.target.value})}
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
          </Button>

        </form>
      </Card>
    </div>
  );
}
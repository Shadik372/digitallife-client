"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { authClient } from "../../../lib/auth-client";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Button from "../../../components/Button";

export default function AddLessonPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 1. STATE UPDATE: Added isForSale and price back in
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Personal Growth",
    emotionalTone: "Motivational",
    accessLevel: "Free",
    visibility: "Public",
    isForSale: false,
    price: ""
  });
  const [imageFile, setImageFile] = useState(null);

  const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
  const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, formData);
      return res.data.data.display_url;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) {
        setIsLoading(false);
        return;
      }
    }

    try {
      // 2. PAYLOAD UPDATE: Ensure price is formatted correctly
      const payload = {
        ...formData,
        price: formData.isForSale ? Number(formData.price) : 0,
        image: imageUrl
      };

      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons`, payload, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success("Lesson created successfully!");
        router.push("/dashboard/my-lessons");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lesson.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  // Logic to determine if they are allowed to create Premium content
  const canCreatePremium = session.user.role === "seller" || session.user.role === "admin";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Heading level={2}>Create a New Lesson</Heading>
      <p className="text-[--text-muted]">Share your wisdom with the world or keep it private.</p>

      <Card className="p-6 md:p-8 border border-[--border]">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Lesson Title</label>
            <input 
              type="text" 
              required
              placeholder="E.g., The hardest lesson I learned in my 20s"
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Full Description / Story</label>
            <textarea 
              required
              rows="8"
              placeholder="Share the full insight here..."
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] resize-y transition-colors"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Dropdowns Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1">Category</label>
              <select 
                className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1">Emotional Tone</label>
              <select 
                className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
                value={formData.emotionalTone}
                onChange={(e) => setFormData({...formData, emotionalTone: e.target.value})}
              >
                {tones.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Settings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[--border]">
            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1">Visibility</label>
              <select 
                className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
                value={formData.visibility}
                onChange={(e) => setFormData({...formData, visibility: e.target.value})}
              >
                <option value="Public">Public (Visible to others)</option>
                <option value="Private">Private (Only you)</option>
              </select>
            </div>
            
            <div className="relative group">
              <label className="block text-sm font-medium text-[--text-muted] mb-1 flex items-center gap-2">
                Access Level 
                {!canCreatePremium && (
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20">
                    Sellers Only
                  </span>
                )}
              </label>
              <select 
                disabled={!canCreatePremium}
                className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] disabled:opacity-50 disabled:cursor-not-allowed"
                value={formData.accessLevel}
                onChange={(e) => {
                  const newLevel = e.target.value;
                  setFormData({
                    ...formData, 
                    accessLevel: newLevel,
                    // Auto-reset sale status if they switch back to Free
                    isForSale: newLevel === "Free" ? false : formData.isForSale 
                  });
                }}
              >
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>

          {/* 3. UI UPDATE: HYBRID MODEL PRICING (Only shows for Premium) */}
          {formData.accessLevel === "Premium" && (
            <div className="mt-4 p-5 border border-[--border] bg-[--bg-secondary]/50 rounded-xl space-y-4 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[--text]">Sell Individually?</h4>
                  <p className="text-sm text-[--text-muted]">Allow non-premium users to buy this specific lesson.</p>
                </div>
                
                {/* 🔧 FIXED: Visible Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.isForSale}
                    onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[--accent]"></div>
                </label>
              </div>

              {formData.isForSale && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-[--text] mb-1">Set Price (Max ৳50)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[--text-muted] font-bold">৳</span>
                    <input 
                      type="number" 
                      min="1"
                      max="50"
                      required
                      className="w-full pl-8 pr-4 py-3 bg-[--bg] border border-[--border] rounded-xl focus:outline-none focus:border-[--accent] text-[--text]"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Featured Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="block w-full text-sm text-[--text-muted] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[--accent]/10 file:text-[--accent] hover:file:bg-[--accent]/20 transition-colors cursor-pointer"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-3 text-lg mt-4" disabled={isLoading}>
            {isLoading ? "Publishing Lesson..." : "Publish Lesson"}
          </Button>

        </form>
      </Card>
    </div>
  );
}
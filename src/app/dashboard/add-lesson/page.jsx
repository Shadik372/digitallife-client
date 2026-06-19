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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Personal Growth",
    emotionalTone: "Motivational",
    accessLevel: "Free", // Defaults to Free
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
      const payload = {
        ...formData,
        image: imageUrl,
        price: formData.isForSale ? Number(formData.price) : 0
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

  const isPremium = session.user.isPremium;
  const canSell = session.user.role === "seller" || session.user.role === "admin";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Heading level={2}>Create a New Lesson</Heading>
      <p className="text-[--text-muted]">Share your wisdom with the world or keep it private.</p>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Lesson Title</label>
            <input 
              type="text" 
              required
              placeholder="E.g., The hardest lesson I learned in my 20s"
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Full Description / Story</label>
            <textarea 
              required
              rows="6"
              placeholder="Share the full insight here..."
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] resize-y"
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
                {!isPremium && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded cursor-help">Upgrade to unlock Premium</span>}
              </label>
              <select 
                disabled={!isPremium}
                className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] disabled:opacity-50"
                value={formData.accessLevel}
                onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
              >
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Featured Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="block w-full text-sm text-[--text-muted] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[--accent] file:text-white hover:file:bg-[--accent-hover] transition-colors"
            />
          </div>

          {/* Seller Exclusive: Marketplace Pricing */}
          {canSell && formData.visibility === "Public" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-300">List in Marketplace (Seller Exclusive)</h4>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">Sell this specific lesson individually to any user.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.isForSale} onChange={(e) => setFormData({...formData, isForSale: e.target.checked})} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[--accent]"></div>
                </label>
              </div>

              {formData.isForSale && (
                <div>
                  <label className="block text-sm font-medium text-[--text-muted] mb-1">Price (৳ BDT)</label>
                  <input 
                    type="number" 
                    min="10"
                    required={formData.isForSale}
                    placeholder="E.g., 200"
                    className="w-full md:w-1/3 px-4 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              )}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Lesson..." : "Create Lesson"}
          </Button>

        </form>
      </Card>
    </div>
  );
}
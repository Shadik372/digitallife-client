"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { authClient } from "../../../../../lib/auth-client";
import Heading from "../../../../../components/Heading";
import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";
import Loading from "../../../../../components/Loading";

export default function UpdateLessonPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const params = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    accessLevel: "Free",
    visibility: "Public",
    isForSale: false,
    price: "",
    image: ""
  });
  
  const [newImageFile, setNewImageFile] = useState(null);

  const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
  const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${params.id}`);
        if (res.data.success) {
          const lesson = res.data.lesson;
          
          // Verify ownership (Admin can also edit, so we let backend strictly enforce if we don't catch it here)
          if (session?.user?.id !== lesson.creatorId._id && session?.user?.role !== "admin") {
            toast.error("Unauthorized to edit this lesson.");
            router.push("/dashboard/my-lessons");
            return;
          }

          setFormData({
            title: lesson.title,
            description: lesson.description,
            category: lesson.category,
            emotionalTone: lesson.emotionalTone,
            accessLevel: lesson.accessLevel,
            visibility: lesson.visibility,
            isForSale: lesson.isForSale || false,
            price: lesson.price || "",
            image: lesson.image || ""
          });
        }
      } catch (error) {
        toast.error("Failed to load lesson data.");
        router.push("/dashboard/my-lessons");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) fetchLesson();
  }, [params.id, session, router]);

  const handleImageUpload = async () => {
    if (!newImageFile) return null;
    const uploadData = new FormData();
    uploadData.append("image", newImageFile);
    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, uploadData);
      return res.data.data.display_url;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    let imageUrl = formData.image; // keep existing by default
    if (newImageFile) {
      const uploadedUrl = await handleImageUpload();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        setIsUpdating(false);
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        image: imageUrl,
        price: formData.isForSale ? Number(formData.price) : 0
      };

      const res = await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/lessons/${params.id}`, payload, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success("Lesson updated successfully!");
        router.push("/dashboard/my-lessons");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update lesson.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !session) return <Loading fullScreen />;

  const isPremium = session.user.isPremium;
  const canSell = session.user.role === "seller" || session.user.role === "admin";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Heading level={2}>Update Lesson</Heading>
      <p className="text-[--text-muted]">Make changes to your previously published wisdom.</p>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Lesson Title</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Full Description / Story</label>
            <textarea 
              required
              rows="6"
              className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text] resize-y"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[--border]">
            <div>
              <label className="block text-sm font-medium text-[--text-muted] mb-1">Visibility</label>
              <select 
                className="w-full px-4 py-2 bg-[--bg-secondary] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
                value={formData.visibility}
                onChange={(e) => setFormData({...formData, visibility: e.target.value})}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>
            
            <div className="relative group">
              <label className="block text-sm font-medium text-[--text-muted] mb-1 flex items-center gap-2">
                Access Level
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

          <div>
            <label className="block text-sm font-medium text-[--text-muted] mb-1">Update Image (Optional)</label>
            {formData.image && (
              <div className="mb-2 text-sm text-[--text-muted] flex items-center gap-2">
                <img src={formData.image} alt="Current" className="w-12 h-12 object-cover rounded" />
                <span>Current Image</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setNewImageFile(e.target.files[0])}
              className="block w-full text-sm text-[--text-muted] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[--accent] file:text-white hover:file:bg-[--accent-hover] transition-colors"
            />
          </div>

          {canSell && formData.visibility === "Public" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-300">List in Marketplace</h4>
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
                    className="w-full md:w-1/3 px-4 py-2 bg-[--bg] border border-[--border] rounded-md focus:outline-none focus:border-[--accent] text-[--text]"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              )}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={isUpdating}>
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </Button>

        </form>
      </Card>
    </div>
  );
}
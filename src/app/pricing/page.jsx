"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { authClient } from "../../lib/auth-client";
import Heading from "../../components/Heading";
import Card from "../../components/Card";
import Button from "../../components/Button";

export default function PricingPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    if (!session) {
      toast.error("Please log in to upgrade your account.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      // Call the Express backend to create a Stripe Checkout Session
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payment/create-checkout-session`, {}, {
        withCredentials: true // Ensures BetterAuth session cookies are sent
      });

      if (res.data.success && res.data.url) {
        // Redirect the user to the Stripe hosted checkout page
        window.location.href = res.data.url;
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const isPremium = session?.user?.isPremium;

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <Heading level={1}>Invest in Lifelong Wisdom</Heading>
        <p className="text-[--text-muted] max-w-2xl mx-auto text-lg">
          Choose the plan that fits your journey. Upgrade to Premium to unlock every locked lesson on the platform, forever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        
        {/* Free Plan */}
        <Card className="p-8 flex flex-col">
          <Heading level={3} className="mb-2">Explorer (Free)</Heading>
          <div className="text-4xl font-bold text-[--text] mb-6">৳0 <span className="text-lg text-[--text-muted] font-normal">/forever</span></div>
          
          <ul className="space-y-4 mb-8 flex-grow text-[--text-muted]">
            <li className="flex items-center gap-3"><span>✓</span> Access to all public free lessons</li>
            <li className="flex items-center gap-3"><span>✓</span> Create and manage your own lessons</li>
            <li className="flex items-center gap-3"><span>✓</span> Save your favorite lessons</li>
            <li className="flex items-center gap-3"><span>✓</span> Apply to become a Seller</li>
            <li className="flex items-center gap-3 opacity-50"><span className="text-red-500">✕</span> Access to Premium locked content</li>
          </ul>

          <Button 
            variant="secondary" 
            className="w-full cursor-default"
            disabled={true}
          >
            {isPremium ? "Included" : "Your Current Plan"}
          </Button>
        </Card>

        {/* Premium Plan */}
        <Card className="p-8 flex flex-col border-2 border-[--accent] relative shadow-lg">
          <div className="absolute top-0 right-0 bg-[--accent] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-bl-lg rounded-tr-lg">
            Recommended
          </div>
          <Heading level={3} className="mb-2 text-[--accent]">Premium Lifetime</Heading>
          <div className="text-4xl font-bold text-[--text] mb-6">৳1,500 <span className="text-lg text-[--text-muted] font-normal">/one-time</span></div>
          
          <ul className="space-y-4 mb-8 flex-grow text-[--text-muted]">
            <li className="flex items-center gap-3"><span>✓</span> <strong>Everything in Explorer, plus:</strong></li>
            <li className="flex items-center gap-3 text-[--text] font-medium"><span>⭐</span> Lifetime access to ALL Premium lessons</li>
            <li className="flex items-center gap-3"><span>⭐</span> Read exclusive insights from top creators</li>
            <li className="flex items-center gap-3"><span>⭐</span> Premium Badge on your profile</li>
            <li className="flex items-center gap-3"><span>⭐</span> One-time payment, no subscriptions</li>
          </ul>

          {isPremium ? (
            <Button variant="primary" className="w-full" disabled={true}>
              You are already Premium 🎉
            </Button>
          ) : (
            <Button 
              variant="primary" 
              className="w-full text-lg py-3" 
              onClick={handleUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? "Redirecting to Stripe..." : "Upgrade to Premium"}
            </Button>
          )}
        </Card>

      </div>
    </div>
  );
}
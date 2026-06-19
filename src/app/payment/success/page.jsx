"use client";

import Link from "next/link";
import { useEffect } from "react";
import confetti from "canvas-confetti"; // Optional: A nice touch for successful payments!
import Card from "../../../components/Card";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button";

export default function PaymentSuccessPage() {
  useEffect(() => {
    // Fire a quick confetti burst on load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4CAF50', '#ffffff', '#FFC107']
    });
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">
          ✓
        </div>
        <Heading level={2} className="mb-2">Payment Successful!</Heading>
        <p className="text-[--text-muted] mb-8">
          Thank you for your purchase. Your account has been updated, and your new content is ready to explore.
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <Link href="/dashboard" className="w-full">
            <Button variant="primary" className="w-full">Go to Dashboard</Button>
          </Link>
          <Link href="/lessons" className="w-full">
            <Button variant="secondary" className="w-full">Browse More Lessons</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
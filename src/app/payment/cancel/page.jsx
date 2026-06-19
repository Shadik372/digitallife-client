"use client";

import Link from "next/link";
import Card from "../../../components/Card";
import Heading from "../../../components/Heading";
import Button from "../../../components/Button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6">
          ✕
        </div>
        <Heading level={2} className="mb-2">Payment Cancelled</Heading>
        <p className="text-[--text-muted] mb-8">
          Your checkout process was cancelled or interrupted. No charges were made to your account.
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <Link href="/lessons" className="w-full">
            <Button variant="primary" className="w-full">Return to Lessons</Button>
          </Link>
          <Link href="/dashboard" className="w-full">
            <Button variant="secondary" className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
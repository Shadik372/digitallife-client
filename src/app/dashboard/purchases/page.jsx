"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { authClient } from "../../../lib/auth-client";
import Heading from "../../../components/Heading";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";

export default function MyPurchasesPage() {
  const { data: session } = authClient.useSession();
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/purchases/my-purchases`, {
          withCredentials: true
        });
        if (res.data.success) {
          setPurchases(res.data.purchases);
        }
      } catch (error) {
        toast.error("Failed to load your purchase history.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) fetchPurchases();
  }, [session]);

  if (isLoading || !session) return <Loading fullScreen />;

  return (
    <div className="space-y-6">
      <Heading level={2}>My Purchases</Heading>
      <p className="text-[--text-muted]">Lessons you have individually purchased from the marketplace.</p>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[--bg-secondary] border-b border-[--border] text-[--text-muted] text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Lesson Title</th>
                <th className="p-4 font-medium">Purchase Date</th>
                <th className="p-4 font-medium">Amount Paid</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <tr key={purchase._id} className="border-b border-[--border] hover:bg-[--bg-secondary] transition-colors">
                    <td className="p-4 font-medium text-[--text]">
                      {purchase.lessonId?.title || "Lesson Unavailable"}
                    </td>
                    <td className="p-4 text-sm text-[--text-muted]">
                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-semibold text-green-600">
                      ৳{purchase.amount}
                    </td>
                    <td className="p-4 text-right">
                      {purchase.lessonId ? (
                        <Link href={`/lessons/${purchase.lessonId._id}`}>
                          <Button variant="secondary" size="sm">Read Lesson</Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-red-500">Deleted by Author</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[--text-muted]">
                    You haven't purchased any lessons yet. Browse the marketplace to find exclusive wisdom!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
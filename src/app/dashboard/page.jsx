"use client";

import { authClient } from "../../lib/auth-client";
import Heading from "../../components/Heading";
import Card from "../../components/Card";
import RoleBadge from "../../components/RoleBadge";
import Link from "next/link";
import Button from "../../components/Button";

export default function DashboardHomePage() {
  const { data: session } = authClient.useSession();

  if (!session) return null; // Guarded by layout

  const { user } = session;

  return (
    <div className="space-y-6">
      <Heading level={2}>Welcome back, {user.name} 👋</Heading>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Account Status Card */}
        <Card className="p-6 flex flex-col items-start gap-4">
          <Heading level={3}>Account Status</Heading>
          
          <div className="flex items-center gap-4">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              alt="Profile" 
              className="w-16 h-16 rounded-full border border-[--border]"
            />
            <div>
              <p className="font-semibold text-lg text-[--text]">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                <RoleBadge role={user.role} isPremium={user.isPremium} />
              </div>
            </div>
          </div>

          {/* Premium Upsell for Free Users */}
          {!user.isPremium && (
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg w-full">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                Unlock all Premium life lessons and exclusive wisdom by upgrading your account.
              </p>
              <Link href="/pricing">
                <Button variant="primary" size="sm">View Premium Plans</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Quick Actions Card */}
        <Card className="p-6">
          <Heading level={3} className="mb-4">Quick Links</Heading>
          <div className="flex flex-col gap-4">
            <Link href="/lessons" className="text-[--accent] hover:underline font-medium flex items-center gap-2">
              <span>📚</span> Browse Public Lessons
            </Link>
            <Link href="/dashboard/favorites" className="text-[--accent] hover:underline font-medium flex items-center gap-2">
              <span>🔖</span> View Saved Lessons
            </Link>
            <Link href="/dashboard/purchases" className="text-[--accent] hover:underline font-medium flex items-center gap-2">
              <span>💳</span> View My Purchases
            </Link>
            
            {user.role === "buyer" && (
              <Link href="/dashboard/become-seller" className="text-[--text-muted] hover:text-[--text] transition-colors flex items-center gap-2 mt-2 pt-2 border-t border-[--border]">
                <span>🏪</span> Apply to become a Seller
              </Link>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
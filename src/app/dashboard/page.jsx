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
<div className="space-y-8">

  {/* Welcome Banner */}
  <Card className="p-8 overflow-hidden relative">

    <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />

    <div className="relative z-10">
      <p className="text-sm text-[--text-muted] mb-2">
        Dashboard
      </p>

      <h1 className="text-4xl font-bold mb-3">
        Welcome back, {user.name} 👋
      </h1>

      <p className="text-[--text-muted] max-w-2xl">
        Continue building your wisdom library, explore new lessons,
        and track your learning journey.
      </p>
    </div>

  </Card>

  {/* Stats */}
  <div className="grid md:grid-cols-3 gap-6">

    <Card className="p-6">
      <div className="text-3xl mb-3">📚</div>
      <div className="text-sm text-[--text-muted]">
        Lessons
      </div>
      <div className="text-3xl font-bold mt-1">
        --
      </div>
    </Card>

    <Card className="p-6">
      <div className="text-3xl mb-3">❤️</div>
      <div className="text-sm text-[--text-muted]">
        Favorites
      </div>
      <div className="text-3xl font-bold mt-1">
        --
      </div>
    </Card>

    <Card className="p-6">
      <div className="text-3xl mb-3">⭐</div>
      <div className="text-sm text-[--text-muted]">
        Membership
      </div>
      <div className="text-xl font-semibold mt-1">
        {user.isPremium ? "Premium" : "Free"}
      </div>
    </Card>

  </div>

  <div className="grid lg:grid-cols-2 gap-6">

    {/* Account Card */}
    <Card className="p-6">

      <div className="flex items-center gap-4 mb-6">

        <img
          src={
            user.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=16a34a&color=ffffff`
          }
          alt={user.name}
          className="w-20 h-20 rounded-3xl border border-[--border]"
        />

        <div>
          <h2 className="font-bold text-xl">
            {user.name}
          </h2>

          <p className="text-[--text-muted]">
            {user.email}
          </p>

          <div className="mt-2">
            <RoleBadge
              role={user.role}
              isPremium={user.isPremium}
            />
          </div>
        </div>

      </div>

      {!user.isPremium && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">

          <h3 className="font-semibold mb-2">
            Upgrade to Premium
          </h3>

          <p className="text-sm text-[--text-muted] mb-4">
            Unlock exclusive premium lessons and deeper insights.
          </p>

          <Link href="/pricing">
            <Button size="sm">
              View Plans
            </Button>
          </Link>

        </div>
      )}

    </Card>

    {/* Quick Actions */}
    <Card className="p-6">

      <h2 className="text-xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid gap-3">

        <Link href="/lessons">
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            📚 Browse Lessons
          </Button>
        </Link>

        <Link href="/dashboard/my-favorites">
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            ❤️ My Favorites
          </Button>
        </Link>

        <Link href="/dashboard/purchases">
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            💳 Purchases
          </Button>
        </Link>

        <Link href="/dashboard/add-lesson">
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            ✍️ Create Lesson
          </Button>
        </Link>

      </div>

    </Card>

  </div>

</div>  );
}
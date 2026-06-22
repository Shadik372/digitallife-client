"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import Loading from "../../components/Loading";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <Loading fullScreen />;
  if (!session) return null;

  const role = session.user.role;

  // Dynamically build the sidebar navigation based on RBAC
  const navLinks = [
    { name: "Overview", href: "/dashboard" },
    { name: "My Profile", href: "/dashboard/profile" },
    { name: "My Favorites", href: "/dashboard/my-favorites" }, // Updated path
    { name: "My Purchases", href: "/dashboard/purchases" },
    { name: "Add Lesson", href: "/dashboard/add-lesson" },      // Moved here for all users
    { name: "My Created Lessons", href: "/dashboard/my-lessons" } // Moved here for all users
  ];

  if (role === "buyer") {
    navLinks.push({ name: "Become a Seller", href: "/dashboard/become-seller" });
  }

  if (role === "seller" || role === "admin") {
    navLinks.push({ name: "Seller Dashboard", href: "/dashboard/seller" });
  }

  if (role === "admin") {
    navLinks.push({ name: "👑 Command Center", href: "/dashboard/admin" });
    navLinks.push({ name: "📝 Review Queue", href: "/dashboard/admin/applications" });
    navLinks.push({ name: "👥 Manage Users", href: "/dashboard/admin/users" });
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8 min-h-[80vh]">

      {/* Sidebar */}
      <aside
        className="
        h-fit
        sticky
        top-24
        rounded-3xl
        border
        border-[--border]
        bg-[--bg]
        p-5
        shadow-sm
      "
      >

        {/* User Section */}
        <div className="pb-5 border-b border-[--border]">

          <div className="flex items-center gap-3">

            <img
              src={
                session.user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  session.user.name
                )}&background=16a34a&color=ffffff`
              }
              alt={session.user.name}
              className="w-12 h-12 rounded-2xl border border-[--border]"
            />

            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {session.user.name}

                {/* The Premium Badge */}
                {session.user.isPremium && (
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/20 uppercase tracking-wider flex items-center gap-1">
                    ⭐ Premium
                  </span>
                )}
              </h3>

              <p className="text-sm text-[--text-muted]">
                {session.user.role}
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}
        <nav className="mt-5 flex flex-col gap-2">

          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                px-4
                py-3
                rounded-2xl
                transition-all
                duration-300
                font-medium

                ${isActive
                    ? "bg-(--accent) text-white shadow-lg"
                    : "text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)"
                  }
              `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* Content */}
      <section className="min-w-0">
        {children}
      </section>

    </div>
  );
}
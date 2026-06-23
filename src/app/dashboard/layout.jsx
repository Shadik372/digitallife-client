"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import Loading from "../../components/Loading";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Close the mobile nav whenever the route changes
  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

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

  const activeLink = navLinks.find((link) => link.href === pathname);

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4 lg:gap-8 min-h-[80vh]">

      {/* Sidebar */}
      <aside
        className="
        h-fit
        lg:sticky
        lg:top-24
        rounded-3xl
        border
        border-[--border]
        bg-[--bg]
        p-5
        shadow-sm
      "
      >

        {/* User Section */}
        <div
          className="pb-5 border-b border-[--border] flex items-center justify-between gap-3 cursor-pointer lg:cursor-default"
          onClick={() => setIsNavOpen((open) => !open)}
        >

          <div className="flex items-center gap-3 min-w-0">

            <img
              src={
                session.user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  session.user.name
                )}&background=16a34a&color=ffffff`
              }
              alt={session.user.name}
              className="w-12 h-12 rounded-2xl border border-[--border] shrink-0"
            />

            <div className="min-w-0">
              <h3 className="font-semibold flex items-center gap-2 truncate">
                {session.user.name}

                {/* The Premium Badge */}
                {session.user.isPremium && (
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-bold border border-amber-500/20 uppercase tracking-wider flex items-center gap-1 shrink-0">
                    ⭐ Premium
                  </span>
                )}
              </h3>

              <p className="text-sm text-[--text-muted] truncate">
                {activeLink ? activeLink.name : session.user.role}
              </p>
            </div>

          </div>

          {/* Mobile-only expand/collapse chevron */}
          <svg
            className={`lg:hidden shrink-0 transition-transform duration-300 ${isNavOpen ? "rotate-180" : ""}`}
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>

        </div>

        {/* Navigation */}
        <nav className={`mt-5 flex-col gap-2 ${isNavOpen ? "flex" : "hidden"} lg:flex`}>

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
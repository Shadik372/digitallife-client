"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import ThemeToggle from "./ThemeToggle";
import RoleBadge from "./RoleBadge";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Signature top bars */}
      <div className="brutal-bar" />
      <div className="brutal-bar-accent" />

      <nav className="bg-(--bg) border-b-2 border-(--border)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo & Primary Links */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-extrabold text-(--text)"
              >
                <div className="w-8 h-8 bg-(--text) text-(--bg) flex items-center justify-center text-xs font-bold">
                  DL
                </div>
                <span className="text-base">
                  Digital<span className="text-(--accent)">Life</span>
                </span>
              </Link>

              <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-wide">
                <Link href="/lessons" className="text-(--text-muted) hover:text-(--accent) transition-colors">Lessons</Link>
                {session && (
                  <>
                    <Link href="/dashboard/add-lesson" className="text-(--text-muted) hover:text-(--accent) transition-colors">Add Lesson</Link>
                    <Link href="/dashboard/my-lessons" className="text-(--text-muted) hover:text-(--accent) transition-colors">My Lessons</Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {isPending ? (
                <div className="w-8 h-8 border-2 border-(--border) border-t-(--accent) animate-spin"></div>
              ) : session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <img
                      src={
                        session.user.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          session.user.name
                        )}&background=d97706&color=0a0a0a`
                      } alt="Avatar"
                      className="w-9 h-9 object-cover border-2 border-(--border)"
                    />
                  </button>

                  {/* Avatar Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-(--bg) border-2 border-(--border) flex flex-col z-50">
                      <div className="px-4 py-3 border-b-2 border-(--border)">
                        <p className="text-sm text-(--text) font-bold">{session.user.name}</p>
                        <div className="mt-1.5">
                          <RoleBadge role={session.user.role} isPremium={session.user.isPremium} />
                        </div>
                      </div>

                      <Link href="/dashboard" className="block px-4 py-2.5 text-sm font-semibold text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)" onClick={() => setIsDropdownOpen(false)}>Dashboard</Link>
                      <Link href="/dashboard/profile" className="block px-4 py-2.5 text-sm font-semibold text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)" onClick={() => setIsDropdownOpen(false)}>Profile</Link>

                      {!session.user.isPremium && (
                        <Link href="/pricing" className="block px-4 py-2.5 text-sm font-bold text-(--accent) hover:bg-(--bg-secondary)" onClick={() => setIsDropdownOpen(false)}>Upgrade to Premium</Link>
                      )}

                      {session.user.role === "buyer" && (
                        <Link href="/become-seller" className="block px-4 py-2.5 text-sm font-semibold text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)" onClick={() => setIsDropdownOpen(false)}>Become a Seller</Link>
                      )}
                      {(session.user.role === "seller" || session.user.role === "admin") && (
                        <Link href="/dashboard/seller" className="block px-4 py-2.5 text-sm font-semibold text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)" onClick={() => setIsDropdownOpen(false)}>Seller Dashboard</Link>
                      )}

                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-(--bg-secondary) border-t-2 border-(--border)">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="bg-(--accent) text-(--on-accent) border-2 border-(--border) px-4 py-2 font-bold uppercase tracking-wide text-xs hover:bg-(--text) hover:text-(--bg) transition-colors">
                  Login / Signup
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>
    </div>
  );
}

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const closeAll = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    closeAll();
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
                onClick={closeAll}
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
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />

              {isPending ? (
                <div className="w-8 h-8 border-2 border-(--border) border-t-(--accent) animate-spin"></div>
              ) : session ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                    aria-label="Open account menu"
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

                      <Link href="/dashboard" className="block px-4 py-2.5 text-sm font-semibold text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)" onClick={closeAll}>Dashboard</Link>
                      <Link href="/dashboard/profile" className="block px-4 py-2.5 text-sm font-semibold text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)" onClick={closeAll}>Profile</Link>

                      {!session.user.isPremium && (
                        <Link href="/pricing" className="block px-4 py-2.5 text-sm font-bold text-(--accent) hover:bg-(--bg-secondary)" onClick={closeAll}>Upgrade to Premium</Link>
                      )}

                      {session.user.role === "buyer" && (
                        <Link href="/become-seller" className="block px-4 py-2.5 text-sm font-semibold text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)" onClick={closeAll}>Become a Seller</Link>
                      )}
                      {(session.user.role === "seller" || session.user.role === "admin") && (
                        <Link href="/dashboard/seller" className="block px-4 py-2.5 text-sm font-semibold text-(--text-muted) hover:bg-(--bg-secondary) hover:text-(--text)" onClick={closeAll}>Seller Dashboard</Link>
                      )}

                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-(--bg-secondary) border-t-2 border-(--border)">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden md:inline-block bg-(--accent) text-(--on-accent) border-2 border-(--border) px-4 py-2 font-bold uppercase tracking-wide text-xs hover:bg-(--text) hover:text-(--bg) transition-colors">
                  Login / Signup
                </Link>
              )}

              {/* Mobile hamburger toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center border-2 border-(--border) text-(--text)"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-(--border) bg-(--bg)">
            <div className="px-4 sm:px-6 py-4 flex flex-col gap-1">

              {session && (
                <div className="flex items-center gap-3 px-2 pb-3 mb-2 border-b-2 border-(--border)">
                  <img
                    src={
                      session.user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        session.user.name
                      )}&background=d97706&color=0a0a0a`
                    } alt="Avatar"
                    className="w-10 h-10 object-cover border-2 border-(--border)"
                  />
                  <div>
                    <p className="text-sm text-(--text) font-bold">{session.user.name}</p>
                    <div className="mt-1">
                      <RoleBadge role={session.user.role} isPremium={session.user.isPremium} />
                    </div>
                  </div>
                </div>
              )}

              <Link href="/lessons" className="px-2 py-2.5 text-sm font-bold uppercase tracking-wide text-(--text-muted) hover:text-(--accent)" onClick={closeAll}>Lessons</Link>

              {session ? (
                <>
                  <Link href="/dashboard/add-lesson" className="px-2 py-2.5 text-sm font-bold uppercase tracking-wide text-(--text-muted) hover:text-(--accent)" onClick={closeAll}>Add Lesson</Link>
                  <Link href="/dashboard/my-lessons" className="px-2 py-2.5 text-sm font-bold uppercase tracking-wide text-(--text-muted) hover:text-(--accent)" onClick={closeAll}>My Lessons</Link>

                  <div className="my-2 border-t-2 border-(--border)" />

                  <Link href="/dashboard" className="px-2 py-2.5 text-sm font-semibold text-(--text-muted) hover:text-(--text)" onClick={closeAll}>Dashboard</Link>
                  <Link href="/dashboard/profile" className="px-2 py-2.5 text-sm font-semibold text-(--text-muted) hover:text-(--text)" onClick={closeAll}>Profile</Link>

                  {!session.user.isPremium && (
                    <Link href="/pricing" className="px-2 py-2.5 text-sm font-bold text-(--accent)" onClick={closeAll}>Upgrade to Premium</Link>
                  )}

                  {session.user.role === "buyer" && (
                    <Link href="/become-seller" className="px-2 py-2.5 text-sm font-semibold text-(--text-muted) hover:text-(--text)" onClick={closeAll}>Become a Seller</Link>
                  )}
                  {(session.user.role === "seller" || session.user.role === "admin") && (
                    <Link href="/dashboard/seller" className="px-2 py-2.5 text-sm font-semibold text-(--text-muted) hover:text-(--text)" onClick={closeAll}>Seller Dashboard</Link>
                  )}

                  <button onClick={handleLogout} className="mt-2 w-full text-left px-2 py-2.5 text-sm font-bold text-red-600 border-t-2 border-(--border) pt-3">
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="mt-2 inline-flex justify-center bg-(--accent) text-(--on-accent) border-2 border-(--border) px-4 py-2.5 font-bold uppercase tracking-wide text-xs hover:bg-(--text) hover:text-(--bg) transition-colors"
                  onClick={closeAll}
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
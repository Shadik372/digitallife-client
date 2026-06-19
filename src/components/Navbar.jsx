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
    <nav className="sticky top-0 z-50 bg-[--bg] border-b border-[--border] shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Primary Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-[--text] tracking-tight">
              Digital Life Lessons
            </Link>
            <div className="hidden md:flex gap-6 text-[--text-muted] font-medium">
              <Link href="/lessons" className="hover:text-[--accent] transition-colors">Public Lessons</Link>
              {session && (
                <>
                  <Link href="/dashboard/add-lesson" className="hover:text-[--accent] transition-colors">Add Lesson</Link>
                  <Link href="/dashboard/my-lessons" className="hover:text-[--accent] transition-colors">My Lessons</Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {isPending ? (
              <div className="w-8 h-8 rounded-full border-2 border-[--border] border-t-[--accent] animate-spin"></div>
            ) : session ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img 
                    src={session.user.photoURL || `https://ui-avatars.com/api/?name=${session.user.name}&background=random`} 
                    alt="Avatar" 
                    className="w-9 h-9 rounded-full object-cover border border-[--border]"
                  />
                </button>

                {/* Avatar Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[--bg] border border-[--border] rounded-md shadow-lg py-1 flex flex-col z-50">
                    <div className="px-4 py-3 border-b border-[--border]">
                      <p className="text-sm text-[--text] font-semibold">{session.user.name}</p>
                      <div className="mt-1">
                        <RoleBadge role={session.user.role} isPremium={session.user.isPremium} />
                      </div>
                    </div>
                    
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-[--text-muted] hover:bg-[--bg-secondary] hover:text-[--text]" onClick={() => setIsDropdownOpen(false)}>Dashboard</Link>
                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-[--text-muted] hover:bg-[--bg-secondary] hover:text-[--text]" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                    
                    {!session.user.isPremium && (
                      <Link href="/pricing" className="block px-4 py-2 text-sm text-[--accent] font-medium hover:bg-[--bg-secondary]" onClick={() => setIsDropdownOpen(false)}>Upgrade to Premium</Link>
                    )}
                    
                    {session.user.role === "buyer" && (
                      <Link href="/become-seller" className="block px-4 py-2 text-sm text-[--text-muted] hover:bg-[--bg-secondary] hover:text-[--text]" onClick={() => setIsDropdownOpen(false)}>Become a Seller</Link>
                    )}
                    {(session.user.role === "seller" || session.user.role === "admin") && (
                      <Link href="/dashboard/seller" className="block px-4 py-2 text-sm text-[--text-muted] hover:bg-[--bg-secondary] hover:text-[--text]" onClick={() => setIsDropdownOpen(false)}>Seller Dashboard</Link>
                    )}

                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[--bg-secondary] border-t border-[--border] mt-1">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="bg-[--accent] hover:bg-[--accent-hover] text-white px-4 py-2 rounded-md font-medium transition-colors text-sm">
                Login / Signup
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
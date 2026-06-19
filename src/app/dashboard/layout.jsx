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
    // Dynamically build the sidebar navigation
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
        navLinks.push({ name: "Admin Dashboard", href: "/dashboard/admin" });
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-[70vh]">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0">
                <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`whitespace-nowrap px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                        ? "bg-[--accent] text-white shadow-sm"
                                        : "bg-[--bg-secondary] text-[--text-muted] hover:bg-[--border] hover:text-[--text]"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                {children}
            </div>

        </div>
    );
}
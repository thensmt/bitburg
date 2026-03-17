"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const CLIENT_LINKS = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/pros", label: "Find Pros" },
];

const PRO_LINKS = [
  { href: "/jobs", label: "Job Board" },
  { href: "/apply", label: "My Application" },
  { href: "/bookings", label: "Bookings" },
];

const ADMIN_LINKS = [
  { href: "/admin", label: "Admin" },
  { href: "/jobs", label: "Jobs" },
  { href: "/pros", label: "Pros" },
];

export function Nav() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Don't show nav on auth pages
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname === "/"
  ) {
    return null;
  }

  const role = (user?.publicMetadata?.role as string) ?? "CLIENT";
  const links =
    role === "ADMIN" ? ADMIN_LINKS : role === "PRO" ? PRO_LINKS : CLIENT_LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="text-base font-bold tracking-tight text-zinc-950 hover:text-zinc-700"
        >
          Bitburg
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "text-zinc-950"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: dashboard link + user button */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={cn(
              "hidden text-sm font-medium transition-colors sm:block",
              pathname === "/dashboard"
                ? "text-zinc-950"
                : "text-zinc-500 hover:text-zinc-900"
            )}
          >
            Dashboard
          </Link>
          {isLoaded && <UserButton />}
        </div>
      </div>
    </header>
  );
}

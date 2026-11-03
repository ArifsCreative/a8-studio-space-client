
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Aperture,
  ArrowUpRight,
  Loader2,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { signOut, useSession } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = useSession();

  const user = session?.user;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await signOut();

      if (result.error) {
        toast.error(result.error.message || "Unable to log out.");
        return;
      }

      setMenuOpen(false);
      toast.success("You have been logged out.");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="studio-container flex h-18 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="StudioSpace home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Aperture className="size-6" strokeWidth={2} />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}

              {isActive(item.href) && (
                <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div
              className="flex items-center gap-2 text-sm text-muted-foreground"
              role="status"
            >
              <Loader2 className="size-4 animate-spin" />
              Checking session...
            </div>
          ) : user ? (
            <>
              <div className="flex max-w-44 items-center gap-2 rounded-lg border border-border px-3 py-2">
                <UserRound className="size-4 shrink-0 text-primary" />

                <span
                  className="truncate text-sm font-medium text-foreground"
                  title={user.name || user.email}
                >
                  {user.name || user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogOut className="size-4" />
                )}

                {loggingOut ? "Logging Out..." : "Log Out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                Log In
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Get Started
                <ArrowUpRight className="size-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background px-4 py-5 lg:hidden"
        >
          <div className="studio-container flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-lg px-4 py-3 text-sm font-medium hover:bg-secondary ${
                  isActive(item.href)
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              {isPending ? (
                <div
                  className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground"
                  role="status"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Checking session...
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                    <UserRound className="size-5 shrink-0 text-primary" />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name || "StudioSpace User"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {loggingOut ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <LogOut className="size-4" />
                    )}

                    {loggingOut ? "Logging Out..." : "Log Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg border border-border px-4 py-3 text-center text-sm font-medium"
                  >
                    Log In
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}


import Link from "next/link";
import { Aperture, ArrowRight } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/about" },
];

const categories = [
  { label: "Photography", href: "/studios?category=Photography" },
  { label: "Film & Video", href: "/studios?category=Film%20%26%20Video" },
  { label: "Podcast", href: "/studios?category=Podcast" },
  { label: "Music", href: "/studios?category=Music" },
  { label: "Art & Workshops", href: "/studios?category=Art%20%26%20Workshops" },
];

function XLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M18.901 2H22l-6.77 7.74L23.193 22h-6.236l-4.884-7.428L5.575 22H2.473l7.24-8.275L1.807 2h6.394l4.415 6.741L18.901 2Zm-1.094 18h1.716L7.267 3.895H5.425L17.807 20Z" />
    </svg>
  );
}


function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="size-4" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor"
      className="size-4" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function YoutubeLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor"
      className="size-4" aria-hidden="true">
      <path d="M23.498 6.186a2.97 2.97 0 0 0-2.09-2.103C19.565 3.586 12 3.586 12 3.586s-7.565 0-9.408.497A2.97 2.97 0 0 0 .502 6.186 31.04 31.04 0 0 0 0 12a31.04 31.04 0 0 0 .502 5.814 2.97 2.97 0 0 0 2.09 2.103c1.843.497 9.408.497 9.408.497s7.565 0 9.408-.497a2.97 2.97 0 0 0 2.09-2.103A31.04 31.04 0 0 0 24 12a31.04 31.04 0 0 0-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
    </svg>
  );
}


export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="studio-container py-14 md:py-18">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Aperture className="size-6" />
              </span>
              <span className="text-xl font-bold tracking-tight">
                Studio<span className="text-primary">Space</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Find your space. Create your story. Discover inspiring studios
              and production spaces built for your next big idea.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
              >
                <InstagramLogo />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
              >
                <XLogo />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
              >
                <LinkedinLogo />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
              >
                <YoutubeLogo />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-foreground">
              Studio Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.label}>
                  <Link
                    href={category.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-foreground">
              Stay Inspired
            </h3>

            <p className="mb-5 text-sm leading-6 text-muted-foreground">
              Creative inspiration, new studios, and platform updates.
            </p>

            <div className="flex overflow-hidden rounded-lg border border-border bg-background">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Newsletter email address"
                className="min-w-0 flex-1 px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                aria-label="Subscribe to newsletter"
                className="flex items-center justify-center bg-primary px-4 text-primary-foreground hover:opacity-90"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              No spam. Just creative inspiration.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <p>Made for creators, by creators.</p>
        </div>
      </div>
    </footer>
  );
}

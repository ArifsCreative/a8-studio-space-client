
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Creative Studios for Every Vision",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book inspiring photography studios, film stages, podcast lounges, music suites, and creative workspaces. Find your perfect space with StudioSpace.",
  keywords: [
    "StudioSpace",
    "studio rental",
    "photography studio",
    "film production studio",
    "podcast studio",
    "music recording studio",
    "creative workspace",
    "book studio",
  ],
  applicationName: "StudioSpace",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer />

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3500}
        />
      </body>
    </html>
  );
}

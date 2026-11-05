
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  CalendarDays,
  Camera,
} from "lucide-react";

import BookingForm from "@/components/booking-form";

export const dynamic = "force-dynamic";

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  image: string;
  pricePerHour: number;
  currency?: string;
  rating?: number;
  capacity?: number;
  amenities?: string[];
};

type StudioResponse = {
  success: boolean;
  data?: Studio;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getStudio(id: string): Promise<Studio | null> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    const response = await fetch(
      `${apiUrl}/api/studios/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );

    if (response.status === 404 || response.status === 400) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch studio details");
    }

    const result: StudioResponse = await response.json();

    return result.success && result.data ? result.data : null;
  } catch (error) {
    console.error("Studio details fetch error:", error);
    throw new Error("Unable to load studio details right now.");
  }
}

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

export default async function StudioDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-9 sm:px-8 lg:pt-12">

        {/* Back navigation */}
        <Link
          href="/studios"
          className="mb-9 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[#F5A524]"
        >
          <ArrowLeft size={17} />
          Back to Explore Studios
        </Link>

        {/* Studio heading */}
        <section className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#F5A524]/20 bg-[#F5A524]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#F5A524]">
              {studio.category}
            </span>

            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Camera size={14} />
              Creative Space
            </span>
          </div>

          <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {studio.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-2">
              <MapPin size={17} className="text-[#F5A524]" />
              {studio.location}
            </span>

            {typeof studio.rating === "number" && (
              <span className="inline-flex items-center gap-2">
                <Star
                  size={17}
                  className="fill-[#F5A524] text-[#F5A524]"
                />
                <span className="font-semibold text-white">
                  {studio.rating.toFixed(1)}
                </span>
                Rating
              </span>
            )}

            {typeof studio.capacity === "number" && (
              <span className="inline-flex items-center gap-2">
                <Users size={17} className="text-[#F5A524]" />
                Up to {studio.capacity} people
              </span>
            )}
          </div>
        </section>

        {/* Main studio image */}
        <section className="relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-[#17171E] shadow-2xl shadow-black/20">
          <div className="relative h-[280px] sm:h-[420px] lg:h-[510px]">
            <Image
              src={studio.image}
              alt={studio.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1200px"
              className="object-cover transition duration-700 hover:scale-[1.015]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 hidden sm:block sm:bottom-7 sm:left-7">
              <span className="rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                Explore this creative space
              </span>
            </div>
            <div className="absolute bottom-5 right-5 hidden sm:block sm:bottom-7 sm:right-7 rounded-xl border border-white/20 bg-black/60 px-4 py-3 backdrop-blur-md">
              <p className="text-xs text-zinc-300">Starting from</p>
              <p className="mt-1 text-xl font-bold text-[#F5A524]">
                {formatPrice(studio.pricePerHour)}
                <span className="ml-1 text-xs font-normal text-white">
                  / hour
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Main content and booking */}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-10">

          {/* Left content */}
          <div className="min-w-0 space-y-8">

            {/* About */}
            <section className="rounded-2xl border border-white/10 bg-[#14141B] p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#F5A524]/10 text-[#F5A524]">
                  <Camera size={20} />
                </span>

                <div>
                  <h2 className="text-xl font-bold">
                    About This Studio
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Discover your next creative space
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-line text-sm leading-8 text-zinc-300 sm:text-base">
                {studio.description}
              </p>
            </section>

            {/* Studio information */}
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold">
                  Studio Information
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Everything you need to know before booking.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6 transition hover:border-[#F5A524]/30">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#F5A524]/10 text-[#F5A524]">
                    <MapPin size={21} />
                  </div>

                  <h3 className="font-semibold">Location</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {studio.location}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6 transition hover:border-[#F5A524]/30">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#F5A524]/10 text-[#F5A524]">
                    <Clock3 size={21} />
                  </div>

                  <h3 className="font-semibold">Hourly Pricing</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {formatPrice(studio.pricePerHour)} per hour
                  </p>
                </div>

                {typeof studio.capacity === "number" && (
                  <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6 transition hover:border-[#F5A524]/30">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#F5A524]/10 text-[#F5A524]">
                      <Users size={21} />
                    </div>

                    <h3 className="font-semibold">Guest Capacity</h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Accommodates up to {studio.capacity} people
                    </p>
                  </div>
                )}

                {typeof studio.rating === "number" && (
                  <div className="rounded-2xl border border-white/10 bg-[#14141B] p-6 transition hover:border-[#F5A524]/30">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#F5A524]/10 text-[#F5A524]">
                      <Star size={21} />
                    </div>

                    <h3 className="font-semibold">Studio Rating</h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {studio.rating.toFixed(1)} out of 5
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Amenities */}
            {Array.isArray(studio.amenities) &&
              studio.amenities.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-[#14141B] p-6 sm:p-8">
                  <h2 className="text-xl font-bold">
                    Studio Amenities
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    Available facilities and features.
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {studio.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3 text-sm text-zinc-300"
                      >
                        <CheckCircle2
                          size={19}
                          className="shrink-0 text-[#F5A524]"
                        />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Trust information */}
            <section className="flex items-start gap-4 rounded-2xl border border-[#F5A524]/15 bg-[#F5A524]/[0.04] p-5">
              <ShieldCheck
                size={23}
                className="mt-0.5 shrink-0 text-[#F5A524]"
              />

              <div>
                <h3 className="font-semibold">
                  Book with Confidence
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  StudioSpace checks booking availability and verifies
                  reservations through its secure booking system.
                </p>
              </div>
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-[#F5A524]/30 bg-[#17171F] shadow-xl shadow-black/20">

              {/* Booking header */}
              <div className="border-b border-white/10 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Reserve Your Space
                </p>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-bold tracking-tight text-[#F5A524]">
                      {formatPrice(studio.pricePerHour)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      per hour
                    </p>
                  </div>

                  <span className="mb-1 flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
                    <CheckCircle2 size={14} />
                    Booking enabled
                  </span>
                </div>
              </div>

              {/* Booking form */}
              <div className="p-5 sm:p-6">
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F5A524]/10 text-[#F5A524]">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Choose Your Schedule
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Select your preferred date and booking hours.
                    </p>
                  </div>
                </div>

                <BookingForm
                  studioId={studio._id}
                  hourlyRate={studio.pricePerHour}
                  currency="৳"
                />
              </div>

              {/* Booking footer */}
              <div className="border-t border-white/10 bg-black/10 px-5 py-4 text-center">
                <p className="text-xs leading-5 text-zinc-500">
                  Your reservation will initially have pending status.
                  Final pricing and booking conflicts are verified
                  securely by the server.
                </p>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </main>
  );
}

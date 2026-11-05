
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Star,
  Users,
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
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8">
        <Link
          href="/studios"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[#F5A524]"
        >
          <ArrowLeft size={17} />
          Back to Explore Studios
        </Link>

        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F5A524]">
            {studio.category}
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {studio.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-zinc-400">
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
                <span className="font-medium text-white">
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
        </div>

        <div className="relative mb-10 h-[280px] overflow-hidden rounded-3xl border border-white/10 sm:h-[420px] lg:h-[520px]">
          <Image
            src={studio.image}
            alt={studio.name}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <section className="border-b border-white/10 pb-9">
              <h2 className="mb-5 text-2xl font-bold">
                About This Studio
              </h2>
              <p className="whitespace-pre-line leading-8 text-zinc-400">
                {studio.description}
              </p>
            </section>

            {Array.isArray(studio.amenities) &&
              studio.amenities.length > 0 && (
                <section className="border-b border-white/10 py-9">
                  <h2 className="mb-6 text-2xl font-bold">
                    Studio Amenities
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {studio.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 text-zinc-300"
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

            <section className="py-9">
              <h2 className="mb-5 text-2xl font-bold">
                Studio Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#15151C] p-5">
                  <MapPin className="mb-3 text-[#F5A524]" />
                  <h3 className="font-semibold">Location</h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    {studio.location}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#15151C] p-5">
                  <Clock3 className="mb-3 text-[#F5A524]" />
                  <h3 className="font-semibold">Pricing</h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    ৳{studio.pricePerHour.toLocaleString()} per hour
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside>
            <div className="rounded-2xl border border-[#F5A524]/30 bg-[#15151C] p-6 lg:sticky lg:top-24">
              <p className="text-sm text-zinc-400">
                Starting at
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#F5A524]">
                  ৳{studio.pricePerHour.toLocaleString()}
                </span>
                <span className="text-zinc-400">/hour</span>
              </div>

              <div className="my-6 border-t border-white/10" />

              <div className="mb-5 flex items-start gap-3 text-sm text-zinc-400">
                <CalendarDays
                  size={19}
                  className="shrink-0 text-[#F5A524]"
                />
                Choose your preferred date and booking hours.
              </div>

              <BookingForm
                studioId={studio._id}
                hourlyRate={studio.pricePerHour}
                currency={studio.currency || "৳"}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

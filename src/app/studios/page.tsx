
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";

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
};

type StudiosResponse = {
  success: boolean;
  count: number;
  data: Studio[];
};

type PageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

const categories = [
  "All Studios",
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

async function getStudios(category: string): Promise<Studio[]> {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const query = category
    ? `?category=${encodeURIComponent(category)}`
    : "";

  try {
    const response = await fetch(`${apiUrl}/api/studios${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch studios");
    }

    const result: StudiosResponse = await response.json();

    return result.success && Array.isArray(result.data)
      ? result.data
      : [];
  } catch (error) {
    console.error("Explore studios fetch error:", error);
    return [];
  }
}

export default async function StudiosPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const requestedCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category || "";

  const selectedCategory = categories
    .slice(1)
    .includes(requestedCategory)
    ? requestedCategory
    : "";

  const studios = await getStudios(selectedCategory);

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#F5A524]">
          Explore Creative Spaces
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Find Your Perfect{" "}
          <span className="text-[#F5A524]">Creative Studio.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
          Discover inspiring spaces for photography, filming,
          podcasting, music production, and artistic creation.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isAll = category === "All Studios";
            const active = isAll
              ? selectedCategory === ""
              : selectedCategory === category;

            const href = isAll
              ? "/studios"
              : `/studios?category=${encodeURIComponent(category)}`;

            return (
              <Link
                key={category}
                href={href}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "border-[#F5A524] bg-[#F5A524] text-black"
                    : "border-white/15 bg-white/5 text-zinc-300 hover:border-[#F5A524]/60 hover:text-white"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>

        <div className="mb-7 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {selectedCategory || "All Studios"}
          </h2>

          <p className="text-sm text-zinc-400">
            {studios.length}{" "}
            {studios.length === 1 ? "studio" : "studios"} found
          </p>
        </div>

        {studios.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-20 text-center">
            <h3 className="text-xl font-semibold">
              No studios found
            </h3>
            <p className="mt-3 text-zinc-400">
              Try another category or explore all studios.
            </p>
            <Link
              href="/studios"
              className="mt-6 inline-block rounded-full bg-[#F5A524] px-6 py-3 font-semibold text-black"
            >
              View All Studios
            </Link>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#15151C] transition hover:-translate-y-1 hover:border-[#F5A524]/40"
              >
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={studio.image}
                    alt={studio.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                      <MapPin size={15} className="text-[#F5A524]" />
                      {studio.location}
                    </span>

                    {typeof studio.rating === "number" && (
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <Star
                          size={15}
                          className="fill-[#F5A524] text-[#F5A524]"
                        />
                        {studio.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold transition group-hover:text-[#F5A524]">
                    {studio.name}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-zinc-400">
                    {studio.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <span className="text-xl font-bold text-[#F5A524]">
                        ৳{studio.pricePerHour.toLocaleString()}
                      </span>
                      <span className="ml-1 text-sm text-zinc-400">
                        /hour
                      </span>
                    </div>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition hover:text-[#F5A524]"
                    >
                      View Details
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

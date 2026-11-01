
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Image from "next/image";

type Studio = {
    _id: string;
    name: string;
    category: string;
    location: string;
    pricePerHour: number;
    currency: string;
    capacity: number;
    rating: number;
    image: string;
    description: string;
    isFeatured: boolean;
};

type FeaturedResponse = {
    success: boolean;
    count: number;
    data: Studio[];
};

async function getFeaturedStudios(): Promise<Studio[]> {
    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
        const response = await fetch(
            `${apiUrl}/api/studios/featured`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch featured studios");
        }

        const result: FeaturedResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
            throw new Error("Invalid featured studios response");
        }

        return result.data.slice(0, 6);
    } catch (error) {
        console.error("Featured studios fetch error:", error);
        return [];
    }
}

export default async function FeaturedStudios() {
    const studios = await getFeaturedStudios();

    return (
        <section
            id="featured-studios"
            className="bg-[#0B0B0F] px-5 py-20 text-white md:px-10 lg:px-16"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F5A524]">
                            Curated Creative Spaces
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Featured Studios
                        </h2>

                        <p className="mt-3 max-w-xl text-sm text-zinc-400 md:text-base">
                            Discover creative spaces for your next project.
                        </p>
                    </div>

                    <Link
                        href="/studios"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#F5A524] transition hover:text-amber-300"
                    >
                        Explore All Studios
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {studios.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center">
                        <p className="text-lg font-semibold">
                            No featured studios available
                        </p>
                        <p className="mt-2 text-sm text-zinc-400">
                            Please check back soon.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {studios.map((studio) => (
                            <article
                                key={studio._id}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#15151D] transition hover:-translate-y-1 hover:border-[#F5A524]/40"
                            >

                                <div className="relative h-52 overflow-hidden bg-[#27232B]">
                                    <Image
                                        src={studio.image}
                                        alt={`${studio.name} - ${studio.category}`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                </div>


                                <div className="p-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-[#F5A524]/10 px-3 py-1 text-xs font-medium text-[#F5A524]">
                                            {studio.category}
                                        </span>

                                        <span className="flex items-center gap-1 text-sm text-zinc-300">
                                            <Star className="h-4 w-4 fill-[#F5A524] text-[#F5A524]" />
                                            {studio.rating.toFixed(1)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-white">
                                        {studio.name}
                                    </h3>

                                    <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-400">
                                        <MapPin className="h-4 w-4" />
                                        {studio.location}
                                    </p>

                                    <p className="mt-3 line-clamp-2 min-h-10 text-sm text-zinc-400">
                                        {studio.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                                        <div>
                                            <span className="text-xl font-bold text-white">
                                                {studio.currency}{" "}
                                                {studio.pricePerHour.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-zinc-400">
                                                {" "}/hour
                                            </span>
                                        </div>

                                        <Link
                                            href={`/studios/${studio._id}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#F5A524] hover:text-amber-300"
                                        >
                                            View Details
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

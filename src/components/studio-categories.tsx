
import Link from "next/link";
import {
    ArrowUpRight,
    Camera,
    Clapperboard,
    Mic2,
    Music2,
    Palette,
} from "lucide-react";

const categories = [
    {
        name: "Photo Studios",
        description: "Professional lighting, backdrops, and photo shoot spaces",
        icon: Camera,
        image:
            "/images/categories/photo-studios.jpg",
    },
    {
        name: "Sound Stages",
        description: "Film production stages, sets, and cinematic spaces",
        icon: Clapperboard,
        image:
            "/images/categories/sound-stages.jpg",
    },
    {
        name: "Podcast Rooms",
        description: "Podcast studios with microphones and recording setups",
        icon: Mic2,
        image:
            "/images/categories/podcast-rooms.jpg",
    },
    {
        name: "Music Suites",
        description: "Music recording, mixing, and rehearsal studios",
        icon: Music2,
        image:
            "/images/categories/music-suites.jpg",
    },
    {
        name: "Art Workshops",
        description: "Creative workshops for painting, making, and teaching",
        icon: Palette,
        image:
            "/images/categories/art-workshops.jpg",
    },
];

export default function StudioCategories() {
    return (
        <section className="studio-section bg-background">
            <div className="studio-container">
                <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            Browse by Studio Categories
                        </p>

                        <h2 className="studio-heading">
                            A space for every
                            <span className="text-primary"> creative vision.</span>
                        </h2>

                        <p className="studio-description mt-4 max-w-xl">
                            Explore photo studios, sound stages, podcast rooms,
                            music suites, and art workshops built for creators.
                        </p>
                    </div>

                    <Link
                        href="/studios"
                        className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
                    >
                        View All Studios
                        <ArrowUpRight className="size-4" />
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const Icon = category.icon;

                        return (
                            <Link
                                key={category.name}
                                href={`/studios?category=${encodeURIComponent(category.name)}`}
                                className="group relative min-h-72 overflow-hidden rounded-xl border border-border bg-card"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{
                                        backgroundImage: `url("${category.image}")`,
                                    }}
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/35 to-black/10" />

                                <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                                    <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-white/25 bg-white/15 text-white backdrop-blur-md">
                                        <Icon className="size-5" />
                                    </div>

                                    <div className="flex items-end justify-between gap-3">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">
                                                {category.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-zinc-300">
                                                {category.description}
                                            </p>
                                        </div>

                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                                            <ArrowUpRight className="size-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

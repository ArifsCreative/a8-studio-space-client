
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
    name: "Photography",
    description: "Portraits, products, and creative shoots",
    icon: Camera,
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Film & Video",
    description: "Film sets and video production spaces",
    icon: Clapperboard,
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Podcast",
    description: "Recording rooms for every conversation",
    icon: Mic2,
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Music",
    description: "Rehearsal rooms and recording suites",
    icon: Music2,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Art & Workshops",
    description: "Spaces to make, teach, and collaborate",
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
  },
];

export default function StudioCategories() {
  return (
    <section className="studio-section bg-background">
      <div className="studio-container">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Explore by Category
            </p>

            <h2 className="studio-heading">
              A space for every
              <span className="text-primary"> creative vision.</span>
            </h2>

            <p className="studio-description mt-4 max-w-xl">
              Discover professional spaces tailored to your craft,
              from photography and film to music and art.
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

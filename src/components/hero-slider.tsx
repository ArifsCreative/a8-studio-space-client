
"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    eyebrow: "CREATE WITHOUT LIMITS",
    title: "Your Vision.",
    highlight: "Our Space.",
    description:
      "Discover extraordinary creative studios designed for photographers, filmmakers, and storytellers. Find the perfect setting for your next big idea.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Modern creative studio interior",
    category: "Photography Studios",
  },
  {
    eyebrow: "LIGHTS. CAMERA. CREATE.",
    title: "Every Great Story",
    highlight: "Starts Somewhere.",
    description:
      "From intimate film sets to professional production spaces, book inspiring locations that bring your creative vision to life.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Cinematic production environment",
    category: "Film & Video Studios",
  },
  {
    eyebrow: "MAKE YOUR VOICE HEARD",
    title: "Create Something",
    highlight: "Worth Sharing.",
    description:
      "Find podcast rooms, recording studios, and creative workspaces equipped for your next conversation, session, or production.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=2000&q=85",
    imageAlt: "Professional recording studio microphone",
    category: "Podcast & Music Studios",
  },
];

export default function HeroSlider() {
  return (
    <section
      aria-label="Discover creative studios"
      className="relative overflow-hidden"
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop
        speed={900}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: ".studio-hero-next",
          prevEl: ".studio-hero-prev",
        }}
        pagination={{
          el: ".studio-hero-pagination",
          clickable: true,
        }}
        className="studio-hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.eyebrow}>
            <div className="relative flex min-h-[680px] items-center bg-[#0b0b0f] py-24 text-white md:min-h-[740px]">
              {/* Background photograph */}
              <div
                role="img"
                aria-label={slide.imageAlt}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${slide.image}")`,
                }}
              />

              {/* Cinematic overlays */}
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 bg-linear-to-r from-[#0b0b0f]/95 via-[#0b0b0f]/70 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-[#0b0b0f]/85 via-transparent to-transparent" />

              {/* Slide content */}
              <div className="studio-container relative z-10">
                <div className="max-w-3xl">
                  <div className="mb-7 flex items-center gap-3">
                    <span className="h-px w-10 bg-[#f5a524]" />
                    <span className="text-xs font-semibold tracking-[0.25em] text-[#f5a524] sm:text-sm">
                      {slide.eyebrow}
                    </span>
                  </div>

                  <h1 className="max-w-3xl text-5xl leading-[1.1] font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    {slide.title}
                    <br />
                    <span className="text-[#f5a524]">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="mt-7 max-w-xl text-base leading-8 text-zinc-200 sm:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center gap-4">
                    <Link
                      href="/studios"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#f5a524] px-6 py-3 text-sm font-semibold text-[#17120a] hover:bg-[#ffb947]"
                    >
                      Explore Studios
                      <ArrowUpRight className="size-4" />
                    </Link>

                    <Link
                      href="/#how-it-works"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                    >
                      How It Works
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>

                  <div className="mt-12 flex items-center gap-3 text-sm text-zinc-300">
                    <span className="size-2 rounded-full bg-[#f5a524]" />
                    {slide.category}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom slider controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-9 z-20">
        <div className="studio-container flex items-center justify-between gap-4">
          <div className="studio-hero-pagination pointer-events-auto flex items-center gap-2" />

          <div className="pointer-events-auto flex items-center gap-3">
            <button
              type="button"
              className="studio-hero-prev flex size-11 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm hover:bg-white/20"
              aria-label="Previous slide"
            >
              <ArrowRight className="size-5 rotate-180" />
            </button>

            <button
              type="button"
              className="studio-hero-next flex size-11 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm hover:bg-white/20"
              aria-label="Next slide"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

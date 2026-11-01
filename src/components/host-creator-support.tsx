
import Link from "next/link";
import {
    ArrowUpRight,
    CalendarCheck,
    Headphones,
    ShieldCheck,
    Sparkles,
} from "lucide-react";


const benefits = [
    {
        icon: ShieldCheck,
        title: "Liability Protection",
        description:
            "Review studio liability terms and responsibilities before confirming a reservation.",
    },
    {
        icon: CalendarCheck,
        title: "Verified Profiles",
        description:
            "Profile verification is a planned trust feature for studio hosts and creators.",
    },
    {
        icon: Sparkles,
        title: "Equipment Safety",
        description:
            "Check listed equipment, amenities, and studio safety information before booking.",
    },
    {
        icon: Headphones,
        title: "24/7 Host Support",
        description:
            "Round-the-clock host support is a planned platform feature and is not yet available.",
    },
];


export default function HostCreatorSupport() {
    return (
        <section className="studio-section bg-background">
            <div className="studio-container">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left content */}
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            Built for Creators & Hosts
                        </p>

                        <h2 className="studio-heading">
                            Host Guarantee &
                            <span className="text-primary"> Creator Support.</span>
                        </h2>

                        <p className="studio-description mt-6 max-w-xl">
                            StudioSpace brings creative professionals and studio owners
                            together through a straightforward platform for discovering,
                            listing, and booking production spaces.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/studios"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                            >
                                Explore Studios
                                <ArrowUpRight className="size-4" />
                            </Link>

                            <Link
                                href="/add-studio"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary"
                            >
                                List Your Studio
                            </Link>
                        </div>
                    </div>

                    {/* Right benefit cards */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <div
                                    key={benefit.title}
                                    className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                                >
                                    <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon className="size-6" />
                                    </div>

                                    <h3 className="mb-3 text-base font-semibold">
                                        {benefit.title}
                                    </h3>

                                    <p className="text-sm leading-6 text-muted-foreground">
                                        {benefit.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

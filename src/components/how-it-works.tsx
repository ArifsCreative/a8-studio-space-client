
import {
    ArrowUpRight,
    CalendarCheck2,
    Camera,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";


const steps = [
    {
        number: "01",
        title: "Discover Spaces",
        description:
            "Explore creative studios for photography, filmmaking, podcasting, music, and other productions.",
        icon: Search,
    },
    {
        number: "02",
        title: "Select Shoot Hours",
        description:
            "Choose your preferred date, start time, and end time for your creative session.",
        icon: SlidersHorizontal,
    },
    {
        number: "03",
        title: "Book Instantly",
        description:
            "Submit your booking request through StudioSpace and track its confirmation status.",
        icon: CalendarCheck2,
    },
    {
        number: "04",
        title: "Create & Produce",
        description:
            "Arrive at your studio during your reserved hours and bring your creative project to life.",
        icon: Camera,
    },
];


export default function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="studio-section scroll-mt-24 border-y border-border bg-card"
        >
            <div className="studio-container">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        Simple From Start to Finish
                    </p>

                    <h2 className="studio-heading">
                        How Booking <span className="text-primary">Works.</span>
                    </h2>

                    <p className="studio-description mt-5">
                        Spend less time searching for a space and more time creating.
                        StudioSpace makes finding and booking studios simple.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="group relative rounded-xl border border-border bg-background p-7 transition-colors hover:border-primary/50"
                            >
                                <div className="mb-8 flex items-start justify-between">
                                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <Icon className="size-6" />
                                    </span>

                                    <span className="text-4xl font-bold tracking-tight text-muted-foreground/25">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="mb-3 text-lg font-semibold">
                                    {step.title}
                                </h3>

                                <p className="text-sm leading-7 text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/studios"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                        Find Your Studio
                        <ArrowUpRight className="size-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

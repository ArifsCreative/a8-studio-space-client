
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarCheck,
  Clock3,
  MapPin,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Hourglass,
  Receipt,
  CalendarPlus,
} from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";

type Studio = {
  _id: string;
  name: string;
  category?: string;
  location?: string;
  image?: string;
};

type Booking = {
  _id: string;
  studioId: string;
  userId: string;
  startAt: string;
  endAt: string;
  hourlyRate: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  studio?: Studio;
};

type BookingResponse = {
  success: boolean;
  count?: number;
  data?: Booking[];
  message?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-BD", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const styles = {
    pending: {
      className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
      icon: Hourglass,
      label: "Pending",
    },
    confirmed: {
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      icon: CheckCircle2,
      label: "Confirmed",
    },
    cancelled: {
      className: "border-red-500/20 bg-red-500/10 text-red-400",
      icon: XCircle,
      label: "Cancelled",
    },
  };

  const config = styles[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <div className="mx-auto max-w-7xl animate-pulse px-5 pb-24 pt-12 sm:px-8">
        <div className="mb-10 space-y-4">
          <div className="h-4 w-36 rounded bg-white/10" />
          <div className="h-10 w-64 rounded bg-white/10" />
          <div className="h-4 w-80 max-w-full rounded bg-white/10" />
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 rounded-2xl border border-white/10 bg-[#15151C]"
            />
          ))}
        </div>

        <div className="space-y-5">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-56 rounded-2xl border border-white/10 bg-[#15151C]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setError("");

      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        throw new Error("Unable to authenticate your request.");
      }

      const response = await fetch(`${API_URL}/api/bookings/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        cache: "no-store",
      });

      const result: BookingResponse = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load your bookings."
        );
      }

      setBookings(result.data || []);
    } catch (err) {
      console.error("My bookings error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    void fetchBookings();
  }, [session, isPending, router, fetchBookings]);

  async function handleRefresh() {
    if (refreshing) return;

    setRefreshing(true);
    await fetchBookings();
  }

  async function handleCancel(bookingId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setCancellingId(bookingId);

    try {
      const { data, error: tokenError } = await authClient.token();

      if (tokenError || !data?.token) {
        toast.error("Please log in again.");
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/bookings/${encodeURIComponent(bookingId)}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        toast.error("Your session has expired.");
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to cancel this booking."
        );
      }

      toast.success("Booking cancelled successfully.");

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
    } catch (err) {
      console.error("Booking cancellation error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Booking cancellation failed."
      );
    } finally {
      setCancellingId(null);
    }
  }

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const summaryCards = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: Receipt,
      color: "text-white",
      iconBg: "bg-white/5",
      iconColor: "text-zinc-300",
    },
    {
      label: "Pending",
      value: pendingBookings,
      icon: Hourglass,
      color: "text-amber-400",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
      icon: CalendarCheck,
      color: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      label: "Cancelled",
      value: cancelledBookings,
      icon: XCircle,
      color: "text-red-400",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
    },
  ];

  if (isPending || loading) {
    return <LoadingSkeleton />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-9 sm:px-8 lg:pt-12">

        {/* Back navigation */}
        <Link
          href="/studios"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[#F5A524]"
        >
          <ArrowLeft size={17} />
          Explore Studios
        </Link>

        {/* Dashboard heading */}
        <section className="mb-9">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F5A524]/20 bg-[#F5A524]/10 px-3 py-1.5">
            <CalendarDays size={14} className="text-[#F5A524]" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F5A524]">
              Your Reservations
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            My Bookings
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            Manage your studio reservations, upcoming creative sessions,
            and booking history in one place.
          </p>
        </section>

        {/* Summary cards */}
        <section className="mb-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group rounded-2xl border border-white/10 bg-[#15151C] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#F5A524]/30 hover:bg-[#191920] sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-zinc-400">
                    {item.label}
                  </p>

                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <Icon size={19} className={item.iconColor} />
                  </span>
                </div>

                <p
                  className={`mt-4 text-3xl font-bold tabular-nums ${item.color}`}
                >
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Reservation section heading */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              All Reservations
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              {totalBookings}{" "}
              {totalBookings === 1 ? "reservation" : "reservations"} found
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#15151C] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-[#F5A524]/40 hover:text-[#F5A524] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </section>

        {/* Error state */}
        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <XCircle
              size={35}
              className="mx-auto mb-4 text-red-400"
            />

            <h3 className="font-semibold text-white">
              Unable to Load Bookings
            </h3>

            <p className="mt-2 text-sm text-red-400">{error}</p>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-6 rounded-xl bg-[#F5A524] px-5 py-2.5 font-semibold text-black transition hover:bg-[#FFB638] disabled:opacity-50"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-white/10 bg-[#15151C] px-6 py-16 text-center sm:py-20">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-[#F5A524]/20 bg-[#F5A524]/10">
              <CalendarPlus
                size={30}
                className="text-[#F5A524]"
              />
            </div>

            <h3 className="text-xl font-bold sm:text-2xl">
              Your Creative Journey Starts Here
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-400">
              You haven't booked a studio yet. Discover inspiring
              creative spaces and find the perfect studio for your
              next project.
            </p>

            <Link
              href="/studios"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#F5A524] px-6 py-3 font-semibold text-[#171717] transition hover:bg-[#FFB638]"
            >
              Explore Studios
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          /* Booking cards */
          <div className="space-y-5">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#15151C] transition duration-300 hover:border-[#F5A524]/25 hover:bg-[#181820]"
              >
                <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)_220px]">

                  {/* Studio image */}
                  <div className="relative min-h-[190px] overflow-hidden bg-[#20202A] sm:min-h-[220px] lg:min-h-full">
                    {booking.studio?.image ? (
                      <Image
                        src={booking.studio.image}
                        alt={booking.studio.name || "Booked studio"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 220px"
                        className="object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full min-h-[190px] items-center justify-center">
                        <CalendarDays
                          size={38}
                          className="text-zinc-600"
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r" />
                  </div>

                  {/* Booking information */}
                  <div className="min-w-0 p-5 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-snug sm:text-xl">
                          {booking.studio?.name || "Studio reservation"}
                        </h3>

                        {booking.studio?.category && (
                          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#F5A524]">
                            {booking.studio.category}
                          </p>
                        )}
                      </div>

                      <StatusBadge status={booking.status} />
                    </div>

                    {booking.studio?.location && (
                      <p className="mt-5 flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin
                          size={16}
                          className="shrink-0 text-[#F5A524]"
                        />
                        {booking.studio.location}
                      </p>
                    )}

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
                        <CalendarDays
                          size={18}
                          className="mt-0.5 shrink-0 text-[#F5A524]"
                        />

                        <div>
                          <p className="text-xs text-zinc-500">
                            Booking Date
                          </p>

                          <p className="mt-1 text-sm font-medium text-zinc-200">
                            {formatDate(booking.startAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
                        <Clock3
                          size={18}
                          className="mt-0.5 shrink-0 text-[#F5A524]"
                        />

                        <div>
                          <p className="text-xs text-zinc-500">
                            Booking Hours
                          </p>

                          <p className="mt-1 text-sm font-medium text-zinc-200">
                            {formatTime(booking.startAt)} –{" "}
                            {formatTime(booking.endAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 truncate text-[11px] text-zinc-500">
                      Reference: {booking._id}
                    </p>
                  </div>

                  {/* Price and actions */}
                  <div className="flex flex-col justify-between gap-5 border-t border-white/10 bg-black/10 p-5 sm:p-7 lg:border-l lg:border-t-0">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Total Price
                      </p>

                      <p className="mt-2 text-3xl font-bold tracking-tight text-[#F5A524]">
                        {formatPrice(booking.totalPrice)}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {formatPrice(booking.hourlyRate)} / hour
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-[#F5A524]/50 hover:bg-[#F5A524]/5 hover:text-[#F5A524]"
                      >
                        View Studio
                        <ArrowRight size={15} />
                      </Link>

                      {booking.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancellingId === booking._id ? (
                            <RefreshCw
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <XCircle size={16} />
                          )}

                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel Booking"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom information */}
        {bookings.length > 0 && !error && (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-[#F5A524]"
            />

            <p className="text-xs leading-6 text-zinc-500">
              Your booking history is securely linked to your account.
              Pending reservations can be cancelled from this page.
              Booking status is updated using the StudioSpace booking
              service.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}


"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  RefreshCw,
  XCircle,
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
    pending: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    confirmed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    cancelled: "border-red-500/20 bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] text-white">
        <div className="flex items-center gap-3 text-zinc-400">
          <RefreshCw className="animate-spin text-[#F5A524]" />
          Loading your bookings...
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-12 sm:px-8">
        <Link
          href="/studios"
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-[#F5A524]"
        >
          <ArrowLeft size={17} />
          Explore Studios
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#F5A524]">
            Your Reservations
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-3 text-zinc-400">
            Manage your studio reservations and booking history.
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Bookings",
              value: totalBookings,
              color: "text-white",
            },
            {
              label: "Pending",
              value: pendingBookings,
              color: "text-amber-400",
            },
            {
              label: "Confirmed",
              value: confirmedBookings,
              color: "text-emerald-400",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-[#15151C] p-6"
            >
              <p className="text-sm text-zinc-400">{item.label}</p>

              <p className={`mt-3 text-3xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">All Reservations</h2>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void fetchBookings();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-[#F5A524] hover:text-[#F5A524]"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-400">{error}</p>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void fetchBookings();
              }}
              className="mt-5 rounded-lg bg-[#F5A524] px-5 py-2.5 font-semibold text-black"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#15151C] px-6 py-16 text-center">
            <CalendarDays
              size={42}
              className="mx-auto mb-5 text-[#F5A524]"
            />

            <h3 className="text-xl font-bold">
              No Bookings Yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
              You haven't booked a studio yet. Explore our available
              creative spaces and find the perfect studio for your project.
            </p>

            <Link
              href="/studios"
              className="mt-7 inline-flex rounded-xl bg-[#F5A524] px-6 py-3 font-semibold text-black transition hover:bg-[#FFB638]"
            >
              Explore Studios
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-2xl border border-white/10 bg-[#15151C] p-5 sm:p-7"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold">
                        {booking.studio?.name || "Studio reservation"}
                      </h3>

                      <StatusBadge status={booking.status} />
                    </div>

                    {booking.studio?.category && (
                      <p className="mt-2 text-sm text-[#F5A524]">
                        {booking.studio.category}
                      </p>
                    )}

                    {booking.studio?.location && (
                      <p className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin size={16} className="text-[#F5A524]" />
                        {booking.studio.location}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm text-zinc-400">
                      <span className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-[#F5A524]"
                        />
                        {formatDate(booking.startAt)}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3
                          size={16}
                          className="text-[#F5A524]"
                        />
                        {formatTime(booking.startAt)} –{" "}
                        {formatTime(booking.endAt)}
                      </span>
                    </div>

                    <p className="mt-4 text-xs text-zinc-500">
                      Booking ID: {booking._id}
                    </p>
                  </div>

                  <div className="flex min-w-[190px] flex-col justify-between gap-5 border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                    <div>
                      <p className="text-sm text-zinc-400">
                        Total Price
                      </p>

                      <p className="mt-2 text-3xl font-bold text-[#F5A524]">
                        {formatPrice(booking.totalPrice)}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {formatPrice(booking.hourlyRate)} / hour
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:border-[#F5A524] hover:text-[#F5A524]"
                      >
                        View Studio
                      </Link>

                      {booking.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                        >
                          <XCircle size={16} />

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
      </div>
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";

type BookingFormProps = {
  studioId: string;
  hourlyRate: number;
  currency?: string;
};

type UnavailableSlot = {
  startAt: string;
  endAt: string;
};

type AvailabilityResponse = {
  success: boolean;
  data?: {
    unavailableSlots: UnavailableSlot[];
  };
  message?: string;
};

function getLocalDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Create local calendar-day boundaries and convert them to UTC.
// This also handles daylight-saving transitions correctly.
function getLocalDayBounds(dateString: string) {
  const start = new Date(`${dateString}T00:00:00`);
  const end = new Date(start);

  end.setDate(end.getDate() + 1);

  return {
    startAt: start.toISOString(),
    endAt: end.toISOString(),
  };
}

export default function BookingForm({
  studioId,
  hourlyRate,
  currency = "৳",
}: BookingFormProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");

  const [submitting, setSubmitting] = useState(false);

  const [unavailableSlots, setUnavailableSlots] = useState<
    UnavailableSlot[]
  >([]);

  const [availabilityDate, setAvailabilityDate] = useState("");
  const [availabilityLoading, setAvailabilityLoading] =
    useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [availabilityRefreshKey, setAvailabilityRefreshKey] =
    useState(0);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const startMinutes =
    Number(startTime.split(":")[0]) * 60 +
    Number(startTime.split(":")[1]);

  const endMinutes =
    Number(endTime.split(":")[0]) * 60 +
    Number(endTime.split(":")[1]);

  const duration = (endMinutes - startMinutes) / 60;

  const totalPrice =
    duration > 0 ? duration * hourlyRate : 0;

  const dateIsValid =
    bookingDate !== "" &&
    bookingDate >= getLocalDateString();

  const timeIsValid =
    duration > 0 &&
    Number.isFinite(totalPrice) &&
    hourlyRate > 0;

  // Only use availability data belonging to the currently selected date.
  const currentUnavailableSlots =
    availabilityDate === bookingDate
      ? unavailableSlots
      : [];

  // Check whether the selected booking interval overlaps
  // any pending or confirmed booking.
  const selectedStart = bookingDate
    ? new Date(`${bookingDate}T${startTime}:00`).getTime()
    : NaN;

  const selectedEnd = bookingDate
    ? new Date(`${bookingDate}T${endTime}:00`).getTime()
    : NaN;

  const hasConflict = currentUnavailableSlots.some((slot) => {
    const existingStart = new Date(slot.startAt).getTime();
    const existingEnd = new Date(slot.endAt).getTime();

    return (
      selectedStart < existingEnd &&
      selectedEnd > existingStart
    );
  });

  const availabilityChecked =
    availabilityDate === bookingDate && !availabilityLoading;

  const canBook =
    dateIsValid &&
    timeIsValid &&
    !hasConflict &&
    !submitting &&
    !isPending &&
    !availabilityLoading;

  // Automatically retrieve occupied intervals when the selected
  // studio or booking date changes.
  useEffect(() => {
    if (!bookingDate || !dateIsValid) {
      setUnavailableSlots([]);
      setAvailabilityDate("");
      setAvailabilityError("");
      setAvailabilityLoading(false);
      return;
    }

    const controller = new AbortController();

    async function checkAvailability() {
      setAvailabilityLoading(true);
      setAvailabilityError("");

      try {
        const bounds = getLocalDayBounds(bookingDate);

        const params = new URLSearchParams({
          studioId,
          startAt: bounds.startAt,
          endAt: bounds.endAt,
        });

        const response = await fetch(
          `${apiUrl}/api/bookings/availability?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result: AvailabilityResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Availability check failed."
          );
        }

        setUnavailableSlots(
          result.data?.unavailableSlots || []
        );

        setAvailabilityDate(bookingDate);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Availability check failed:", error);

        setAvailabilityError(
          error instanceof Error
            ? error.message
            : "Unable to check availability."
        );

        setAvailabilityDate("");
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false);
        }
      }
    }

    void checkAvailability();

    return () => controller.abort();
  }, [
    bookingDate,
    studioId,
    apiUrl,
    availabilityRefreshKey,
    dateIsValid,
  ]);

  async function handleBooking(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isPending) return;

    if (!session?.user) {
      toast.error("Please log in before booking.");
      router.push("/login");
      return;
    }

    if (!dateIsValid || !timeIsValid) {
      toast.error("Please select a valid date and time.");
      return;
    }

    if (availabilityLoading) {
      toast.error("Please wait while availability is checked.");
      return;
    }

    if (hasConflict) {
      toast.error(
        "This studio is already booked for the selected time."
      );
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Unable to retrieve your authentication token.");
        return;
      }

      const startAt = new Date(
        `${bookingDate}T${startTime}:00`
      );

      const endAt = new Date(
        `${bookingDate}T${endTime}:00`
      );

      if (
        Number.isNaN(startAt.getTime()) ||
        Number.isNaN(endAt.getTime()) ||
        startAt <= new Date()
      ) {
        toast.error("Please select a future booking time.");
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            studioId,
            startAt: startAt.toISOString(),
            endAt: endAt.toISOString(),
          }),
        }
      );

      const result = await response.json();

      if (response.status === 201 && result.success) {
        toast.success("Studio booked successfully!");

        setBookingDate("");
        setStartTime("10:00");
        setEndTime("12:00");

        router.push("/my-bookings");
        router.refresh();

        return;
      }

      if (response.status === 409) {
        toast.error(
          "This studio is already booked for the selected time."
        );

        // Refresh availability after a booking conflict.
        setAvailabilityRefreshKey((previous) => previous + 1);

        return;
      }

      if (response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      toast.error(
        result.message || "Unable to complete your booking."
      );
    } catch (error) {
      console.error("Booking request failed:", error);
      toast.error("Unable to connect to the booking service.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleBooking} className="space-y-5">
      <div>
        <label
          htmlFor="booking-date"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Booking Date
        </label>

        <div className="relative">
          <CalendarDays
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5A524]"
          />

          <input
            id="booking-date"
            type="date"
            value={bookingDate}
            min={getLocalDateString()}
            onChange={(event) =>
              setBookingDate(event.target.value)
            }
            required
            className="w-full rounded-xl border border-white/10 bg-[#0B0B0F] py-3 pl-10 pr-3 text-white outline-none transition focus:border-[#F5A524] [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="start-time"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Start Time
          </label>

          <input
            id="start-time"
            type="time"
            step={1800}
            value={startTime}
            onChange={(event) =>
              setStartTime(event.target.value)
            }
            required
            className="w-full rounded-xl border border-white/10 bg-[#0B0B0F] px-3 py-3 text-white outline-none focus:border-[#F5A524] [color-scheme:dark]"
          />
        </div>

        <div>
          <label
            htmlFor="end-time"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            End Time
          </label>

          <input
            id="end-time"
            type="time"
            step={1800}
            value={endTime}
            onChange={(event) =>
              setEndTime(event.target.value)
            }
            required
            className="w-full rounded-xl border border-white/10 bg-[#0B0B0F] px-3 py-3 text-white outline-none focus:border-[#F5A524] [color-scheme:dark]"
          />
        </div>
      </div>

      {!timeIsValid && (
        <p className="text-xs text-red-400">
          End time must be later than start time.
        </p>
      )}

      {bookingDate && !dateIsValid && (
        <p className="text-xs text-red-400">
          Please select a valid booking date.
        </p>
      )}

      {/* Availability status */}
      {bookingDate && dateIsValid && (
        <div className="rounded-xl border border-white/10 bg-[#0B0B0F] p-4">
          {availabilityLoading ? (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Loader2
                size={17}
                className="animate-spin text-[#F5A524]"
              />
              Checking studio availability...
            </div>
          ) : availabilityError ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-amber-400">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>
                  Availability could not be checked. The server
                  will still verify your booking.
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAvailabilityRefreshKey((previous) => previous + 1)
                }
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#F5A524] hover:underline"
              >
                <RefreshCw size={14} />
                Retry availability check
              </button>
            </div>
          ) : hasConflict ? (
            <div className="flex items-start gap-2 text-sm text-red-400">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>
                This time slot is unavailable. Please choose
                another time.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 size={18} />
              Selected time appears available.
            </div>
          )}

          {availabilityChecked &&
            currentUnavailableSlots.length > 0 && (
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="mb-2 text-xs font-semibold text-zinc-400">
                  Unavailable periods
                </p>

                <div className="space-y-2">
                  {currentUnavailableSlots.map((slot, index) => (
                    <div
                      key={`${slot.startAt}-${slot.endAt}-${index}`}
                      className="flex justify-between gap-2 text-xs text-zinc-400"
                    >
                      <span>
                        {new Date(slot.startAt).toLocaleTimeString(
                          "en-BD",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </span>

                      <span>to</span>

                      <span>
                        {new Date(slot.endAt).toLocaleTimeString(
                          "en-BD",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Price summary */}
      <div className="rounded-xl border border-white/10 bg-[#0B0B0F] p-4">
        <div className="flex justify-between text-sm text-zinc-400">
          <span>Hourly rate</span>
          <span>
            {currency}
            {hourlyRate.toLocaleString()}
          </span>
        </div>

        <div className="mt-3 flex justify-between text-sm text-zinc-400">
          <span>Duration</span>
          <span>
            {timeIsValid ? `${duration} hours` : "—"}
          </span>
        </div>

        <div className="my-4 border-t border-white/10" />

        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">
            Estimated Total
          </span>

          <span className="text-2xl font-bold text-[#F5A524]">
            {currency}
            {totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canBook}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5A524] px-5 py-3.5 font-semibold text-[#171717] transition hover:bg-[#FFB638] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 size={19} className="animate-spin" />
            Processing Booking...
          </>
        ) : availabilityLoading ? (
          <>
            <Loader2 size={19} className="animate-spin" />
            Checking Availability...
          </>
        ) : hasConflict ? (
          <>
            <AlertCircle size={19} />
            Time Slot Unavailable
          </>
        ) : (
          <>
            <Clock3 size={19} />
            Confirm Booking
          </>
        )}
      </button>

      <p className="text-center text-xs leading-5 text-zinc-500">
        Availability is checked before submission. Final pricing
        and booking conflicts are verified by the server.
        Your booking will initially have pending status.
      </p>
    </form>
  );
}

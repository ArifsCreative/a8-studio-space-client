
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back to StudioSpace!");

      router.push("/studios");
      router.refresh();
    } catch {
      toast.error("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] px-5 py-16 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#F5A524]">
            Welcome Back
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sign In to <span className="text-[#F5A524]">StudioSpace</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Access your account and discover creative spaces.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#15151C] p-6 shadow-2xl sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/15 bg-[#0B0B0F] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#F5A524]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/15 bg-[#0B0B0F] py-3 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#F5A524]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5A524] px-5 py-3.5 font-semibold text-black transition hover:bg-[#FFB940] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#F5A524] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Your creative journey continues here.
        </p>
      </div>
    </main>
  );
}

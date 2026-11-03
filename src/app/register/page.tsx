
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created successfully!");
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
            Join the Creative Community
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Your <span className="text-[#F5A524]">Account</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Discover inspiring studios and start creating with StudioSpace.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#15151C] p-6 shadow-2xl sm:p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-zinc-200">
                Full Name
              </label>
              <div className="relative">
                <UserRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/15 bg-[#0B0B0F] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#F5A524]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-zinc-200">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="register-email"
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
              <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-zinc-200">
                Password
              </label>
              <div className="relative">
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-white/15 bg-[#0B0B0F] py-3 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#F5A524]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm" className="mb-2 block text-sm font-medium text-zinc-200">
                Confirm Password
              </label>
              <div className="relative">
                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="register-confirm"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-white/15 bg-[#0B0B0F] py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#F5A524]"
                />
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#F5A524] hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          By creating an account, you agree to use StudioSpace responsibly.
        </p>
      </div>
    </main>
  );
}


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Zap,
} from "lucide-react";
import { createClient } from "../../../utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(
          error.message === "Invalid login credentials"
            ? "Incorrect email or password. Please try again."
            : error.message
        );
        return;
      }

      if (!data.user) {
        setErrorMessage("Unable to sign in. Please try again.");
        return;
      }

      setSuccessMessage("Login successful! Opening your dashboard...");

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage(
        "Unable to connect to the authentication service. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#17201b]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden bg-[#17201b] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 p-10">
            <Link href="/" className="flex w-fit items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Zap size={22} strokeWidth={2.5} />
              </div>

              <div>
                <p className="text-lg font-bold text-white">Voltiva</p>
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
                  EV Management
                </p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 px-10 pb-16">
            <div className="max-w-xl">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                <BatteryCharging size={28} />
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                Smarter control for your electric vehicle.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/50">
                Monitor battery health, charging sessions, vehicle performance
                and nearby charging stations from one intelligent platform.
              </p>

              <div className="mt-10 grid grid-cols-3 gap-3">
                <Feature value="78%" label="Battery" />
                <Feature value="245 km" label="Range" />
                <Feature value="94%" label="Battery health" />
              </div>
            </div>
          </div>

          <div className="relative z-10 p-10">
            <p className="text-xs text-white/30">
              Smart EV management platform
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* MOBILE BRAND */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Zap size={21} />
              </div>

              <div>
                <p className="text-lg font-bold">Voltiva</p>
                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">
                  EV Management
                </p>
              </div>
            </div>

            {/* HEADING */}
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Sign in to Voltiva
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Access your vehicle dashboard and monitor your EV in real time.
              </p>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </label>

                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {errorMessage && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {errorMessage}
                </p>
              )}

              {/* SUCCESS MESSAGE */}
              {successMessage && (
                <p
                  role="status"
                  className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                >
                  {successMessage}
                </p>
              )}

              {/* REMEMBER */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-emerald-600"
                />

                <label htmlFor="remember" className="text-xs text-gray-500">
                  Keep me signed in
                </label>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#17201b] text-sm font-semibold text-white shadow-sm transition hover:bg-[#26332b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}

                {!isLoading && <ArrowRight size={17} />}
              </button>
            </form>

            {/* SIGNUP LINK */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">New to Voltiva?</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Link
              href="/auth/signup"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              Create an account
            </Link>

            {/* FOOTER */}
            <p className="mt-8 text-center text-[11px] leading-5 text-gray-400">
              By continuing, you agree to Voltiva&apos;s Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
        {label}
      </p>
    </div>
  );
}

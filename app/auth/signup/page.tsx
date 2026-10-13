"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Zap,
} from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Signup:", {
      name,
      email,
      password,
      confirmPassword,
      agree,
    });
  }

  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#17201b]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden bg-[#17201b] lg:flex lg:flex-col lg:justify-between">
          {/* Decorative background */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#8ee6b1]/10 blur-3xl" />

          <div className="relative z-10 p-10 xl:p-14">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8ee6b1] text-[#17201b]">
                <Zap size={20} fill="currentColor" />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Voltiva
              </span>
            </Link>

            {/* Main content */}
            <div className="mt-24 max-w-xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#8ee6b1]">
                Smart EV management
              </p>

              <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
                Drive smarter.
                <br />
                Charge better.
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-white/60">
                Create your Voltiva account and take control of your electric
                vehicle, charging sessions, battery health, and energy usage.
              </p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="relative z-10 grid grid-cols-3 gap-4 p-10 xl:p-14">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <BatteryCharging
                size={22}
                className="text-[#8ee6b1]"
              />

              <p className="mt-5 text-2xl font-semibold text-white">78%</p>

              <p className="mt-1 text-xs text-white/50">
                Battery level
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <Zap size={22} className="text-[#8ee6b1]" />

              <p className="mt-5 text-2xl font-semibold text-white">
                11.1 kW
              </p>

              <p className="mt-1 text-xs text-white/50">
                Charging power
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <Check size={22} className="text-[#8ee6b1]" />

              <p className="mt-5 text-2xl font-semibold text-white">94%</p>

              <p className="mt-1 text-xs text-white/50">
                Battery health
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center justify-center lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17201b] text-[#8ee6b1]">
                  <Zap size={20} fill="currentColor" />
                </div>

                <span className="text-xl font-bold tracking-tight">
                  Voltiva
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-[#657168]">
                Welcome to Voltiva
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-[#17201b]">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#657168]">
                Start managing your EV smarter with Voltiva.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#344139]"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a958d]"
                  />

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-[#dce1dd] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#17201b] focus:ring-2 focus:ring-[#17201b]/5"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#344139]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a958d]"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-[#dce1dd] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#17201b] focus:ring-2 focus:ring-[#17201b]/5"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#344139]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a958d]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 w-full rounded-xl border border-[#dce1dd] bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#17201b] focus:ring-2 focus:ring-[#17201b]/5"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a958d] transition hover:text-[#17201b]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-[#7b857e]">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#344139]"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a958d]"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-[#dce1dd] bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#17201b] focus:ring-2 focus:ring-[#17201b]/5"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a958d] transition hover:text-[#17201b]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 rounded border-[#cbd3cd] accent-[#17201b]"
                />

                <span className="text-xs leading-5 text-[#657168]">
                  I agree to the{" "}
                  <span className="font-medium text-[#17201b]">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-[#17201b]">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#17201b] text-sm font-semibold text-white transition hover:bg-[#26342b]"
              >
                Create account

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Login link */}
            <p className="mt-8 text-center text-sm text-[#657168]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-[#17201b] underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>

            {/* Footer */}
            <p className="mt-8 text-center text-xs leading-5 text-[#9aa29c]">
              By creating an account, you agree to Voltiva&apos;s terms and
              privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
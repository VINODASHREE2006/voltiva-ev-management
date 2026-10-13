"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Mail,
  Zap,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Password reset requested for:", email);
  }

  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#17201b]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden bg-[#17201b] lg:flex lg:flex-col lg:justify-between">
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

            <div className="mt-24 max-w-xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#8ee6b1]">
                Account security
              </p>

              <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
                Get back to
                <br />
                your EV.
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-white/60">
                Forgot your password? No problem. Enter your email and we&apos;ll
                help you securely regain access to your Voltiva account.
              </p>
            </div>
          </div>

          {/* Security card */}
          <div className="relative z-10 p-10 xl:p-14">
            <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8ee6b1]/10 text-[#8ee6b1]">
                  <LockKeyhole size={20} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Your account is secure
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    Password reset links are sent only to the email address
                    registered with your Voltiva account.
                  </p>
                </div>
              </div>
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

            {/* Back */}
            <Link
              href="/auth/login"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#657168] transition hover:text-[#17201b]"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#17201b] text-[#8ee6b1]">
                <LockKeyhole size={22} />
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-[#17201b]">
                Forgot your password?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#657168]">
                Enter the email address associated with your account and
                we&apos;ll send you a password reset link.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#17201b] text-sm font-semibold text-white transition hover:bg-[#26342b]"
              >
                Send reset link

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Sign up */}
            <p className="mt-8 text-center text-sm text-[#657168]">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-[#17201b] underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-5 text-[#9aa29c]">
              Voltiva will never ask you to share your password with anyone.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
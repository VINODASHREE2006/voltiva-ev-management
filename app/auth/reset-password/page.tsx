"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Zap } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (data.session) {
          setHasValidSession(true);
        } else {
          // Listen to auth events in case the session is being restored from hash/recovery token
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;
            if (event === "PASSWORD_RECOVERY" || session) {
              setHasValidSession(true);
            }
          });

          // Wait a moment for hash fragments if any
          setTimeout(() => {
            if (!isMounted) return;
            setHasValidSession((current) => (current === null ? false : current));
          }, 1500);

          return () => {
            subscription.unsubscribe();
          };
        }
      } catch {
        if (isMounted) {
          setHasValidSession(false);
        }
      }
    }

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSuccessMessage(
        "Your password has been successfully reset! Redirecting to login..."
      );

      setTimeout(() => {
        router.replace("/auth/login");
      }, 2000);
    } catch {
      setErrorMessage(
        "Unable to reset password. The link may have expired or is invalid."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8f6] px-4 py-10 text-[#17201b]">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* LOGO */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
            <Zap size={24} className="fill-current" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Enter your new password below to secure your Voltiva account.
          </p>
        </div>

        {/* EXPIRED / MISSING RECOVERY SESSION ALERT */}
        {hasValidSession === false ? (
          <div className="space-y-4">
            <div
              role="alert"
              className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
            >
              <p className="font-semibold">Reset link expired or invalid</p>
              <p className="mt-1 text-xs leading-5 text-amber-700">
                This password recovery link has either expired or already been
                used. Please request a new password reset email.
              </p>
            </div>

            <Link
              href="/auth/forgot-password"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Request new reset link
            </Link>

            <p className="text-center text-sm text-gray-500">
              <Link
                href="/auth/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Back to Login
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NEW PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Must be at least 6 characters.
              </p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm new password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                />

                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {errorMessage && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {errorMessage}
              </p>
            )}

            {/* SUCCESS */}
            {successMessage && (
              <p
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
              >
                {successMessage}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Updating password..." : "Update password"}
              {!isLoading && <ArrowRight size={17} />}
            </button>

            <p className="pt-2 text-center text-sm text-gray-500">
              <Link
                href="/auth/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

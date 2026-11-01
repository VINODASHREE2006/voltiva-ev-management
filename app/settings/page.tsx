"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Car,
  ChevronRight,
  Lock,
  LogOut,
  MapPin,
  Settings as SettingsIcon,
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function loadUserProfile() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error || !data.user) {
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadUserProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/auth/login");
      router.refresh();
    } catch {
      router.replace("/auth/login");
    } finally {
      setIsSigningOut(false);
    }
  }

  const metadata = user?.user_metadata;
  const fullName =
    metadata?.full_name ||
    metadata?.name ||
    metadata?.display_name ||
    "";
  const email = user?.email || "";
  const emailPrefix = email ? email.split("@")[0] : "";
  const displayName = fullName || emailPrefix || (loading ? "Loading..." : "Guest User");
  const initial =
    displayName !== "Loading..."
      ? displayName.trim().charAt(0).toUpperCase() || "U"
      : "•";

  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#17201b]">
      <div className="mx-auto max-w-5xl p-5 md:p-8">
        {/* Header */}
        <div>
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">Settings</h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your vehicle, account and notification preferences.
          </p>
        </div>

        {/* Profile */}
        <div className="mt-8 rounded-3xl border border-[#e2e7e2] bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dcefe2] text-xl font-bold text-emerald-800">
              {initial}
            </div>

            <div>
              <h2 className="text-lg font-bold">{displayName}</h2>

              <p className="mt-1 text-sm text-gray-400">
                {user ? "EV Owner" : loading ? "Checking session..." : "Not signed in"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InputBox
              label="Name"
              value={loading ? "Loading..." : fullName || (user ? "Not specified" : "Guest")}
            />

            <InputBox
              label="Email"
              value={loading ? "Loading..." : email || "No email associated"}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="mt-6 space-y-4">
          <SettingsItem
            icon={<Car size={20} />}
            title="Vehicle settings"
            description="Manage your vehicle information and preferences."
          />

          <SettingsItem
            icon={<Bell size={20} />}
            title="Notifications"
            description="Control charging, battery and vehicle alerts."
          />

          <SettingsItem
            icon={<MapPin size={20} />}
            title="Location"
            description="Manage location access and station recommendations."
          />

          <SettingsItem
            icon={<Lock size={20} />}
            title="Privacy & Security"
            description="Manage your account security and data preferences."
          />
        </div>

        {/* Appearance */}
        <div className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
              <SettingsIcon size={19} />
            </div>

            <div>
              <h2 className="font-bold">Application preferences</h2>

              <p className="mt-1 text-xs text-gray-400">
                Customize your Voltiva experience.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <PreferenceRow title="Units" value="Kilometers / Celsius" />
            <PreferenceRow title="Theme" value="Light" />
            <PreferenceRow title="Language" value="English" />
          </div>
        </div>

        {/* Account Session / Sign Out */}
        <div className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">Account Session</h2>
              <p className="mt-1 text-xs text-gray-400">
                {user
                  ? `Signed in as ${email}`
                  : loading
                  ? "Checking authentication status..."
                  : "You are currently not signed in."}
              </p>
            </div>

            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
              >
                <LogOut size={15} />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function InputBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-400">{label}</label>

      <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium">
        {value}
      </div>
    </div>
  );
}

function SettingsItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button className="flex w-full items-center gap-4 rounded-2xl border border-[#e2e7e2] bg-white p-5 text-left transition hover:border-emerald-200 hover:shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>

        <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
      </div>

      <ChevronRight size={18} className="text-gray-400" />
    </button>
  );
}

function PreferenceRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <p className="text-sm font-medium">{title}</p>

      <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
        {value}
      </div>
    </div>
  );
}
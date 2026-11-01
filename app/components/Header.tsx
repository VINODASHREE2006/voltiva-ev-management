
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { createClient } from "../../utils/supabase/client";

export default function Header() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("User");
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (error || !data.user) {
        setDisplayName("User");
        return;
      }

      const metadata = data.user.user_metadata;

      const fullName =
        metadata?.full_name ||
        metadata?.name ||
        metadata?.display_name;

      const emailName = data.user.email?.split("@")[0];

      setDisplayName(fullName || emailName || "User");
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (!user) {
        setDisplayName("User");
        return;
      }

      const metadata = user.user_metadata;

      const fullName =
        metadata?.full_name ||
        metadata?.name ||
        metadata?.display_name;

      const emailName = user.email?.split("@")[0];

      setDisplayName(fullName || emailName || "User");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const profileInitial =
    displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="flex h-20 items-center justify-between border-b border-[#e4e8e4] bg-white/90 px-5 backdrop-blur md:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 lg:hidden"
        >
          <Menu size={19} />
        </button>

        <div>
          <p className="text-xs font-medium text-gray-400">
            EV MANAGEMENT PLATFORM
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight">
            Voltiva
          </h2>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Search"
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 sm:flex"
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>

        {/* Dynamic user profile */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcefe2] text-sm font-bold text-emerald-800">
            {profileInitial}
          </div>

          <div className="hidden md:block">
            <p className="max-w-40 truncate text-sm font-semibold">
              {displayName}
            </p>

            <p className="text-xs text-gray-400">EV Owner</p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

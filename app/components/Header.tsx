"use client";

import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-[#e4e8e4] bg-white/90 px-5 backdrop-blur md:px-8">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile menu */}
        <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 lg:hidden">
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

        {/* Search */}
        <button className="hidden h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 sm:flex">
          <Search size={18} />
        </button>

        {/* Notification */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50">

          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />

        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-gray-200 pl-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcefe2] text-sm font-bold text-emerald-800">
            V
          </div>

          <div className="hidden md:block">

            <p className="text-sm font-semibold">
              Vinodashree
            </p>

            <p className="text-xs text-gray-400">
              EV Owner
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}
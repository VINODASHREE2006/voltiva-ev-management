"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BatteryCharging,
  Car,
  CircleHelp,
  LayoutDashboard,
  MapPin,
  Settings,
  Zap,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "My Vehicle",
    href: "/vehicle",
    icon: Car,
  },
  {
    label: "Charging",
    href: "/charging",
    icon: BatteryCharging,
  },
  {
    label: "Stations",
    href: "/stations",
    icon: MapPin,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: Activity,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#e4e8e4] bg-white px-5 py-6 lg:flex lg:flex-col">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Zap size={21} strokeWidth={2.5} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight">
            Voltiva
          </h1>

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
            EV Management
          </p>
        </div>

      </Link>

      {/* Navigation */}
      <div className="mt-10">

        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </p>

        <nav className="mt-3 space-y-1">

          {navigation.map((item) => {

            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#eaf5ed] text-emerald-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );

          })}

        </nav>

      </div>

      {/* Bottom Section */}
      <div className="mt-auto">

        {/* Help Card */}
        <div className="mb-5 rounded-2xl bg-[#f3f7f3] p-4">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <CircleHelp size={18} />
          </div>

          <p className="mt-3 text-sm font-semibold">
            Need assistance?
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Get help with your vehicle or charging session.
          </p>

          <Link
            href="/support"
            className="mt-3 inline-block text-xs font-semibold text-emerald-700"
          >
            Contact support →
          </Link>

        </div>

        {/* Settings */}
        <Link
          href="/settings"
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            pathname.startsWith("/settings")
              ? "bg-[#eaf5ed] text-emerald-700"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <Settings size={18} />
          Settings
        </Link>

      </div>

    </aside>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Battery,
  BatteryCharging,
  Gauge,
  TrendingUp,
  Zap,
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";

type Vehicle = {
  id: string;
  vehicle_name: string;
  battery_percentage: number;
  battery_capacity_kwh: number | null;
  driving_range_km: number | null;
};

type ChargingSession = {
  id: string;
  energy_kwh: number;
  cost_inr: number;
  duration_minutes: number;
  started_at: string;
  status: string;
};

export default function AnalyticsPage() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      try {
        const supabase = createClient();

        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        if (!authData.user) {
          throw new Error("Please sign in to view your analytics.");
        }

        const userId = authData.user.id;

        // Fetch user's vehicle
        const { data: vehicleData, error: vehicleError } =
          await supabase
            .from("vehicles")
            .select(
              "id, vehicle_name, battery_percentage, battery_capacity_kwh, driving_range_km"
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1);

        if (vehicleError) throw vehicleError;

        // Fetch user's charging sessions
        const { data: sessionData, error: sessionError } =
          await supabase
            .from("charging_sessions")
            .select(
              "id, energy_kwh, cost_inr, duration_minutes, started_at, status"
            )
            .eq("user_id", userId)
            .order("started_at", { ascending: false });

        if (sessionError) throw sessionError;

        if (!isMounted) return;

        setVehicle(
          vehicleData && vehicleData.length > 0
            ? (vehicleData[0] as Vehicle)
            : null
        );

        setSessions((sessionData ?? []) as ChargingSession[]);
        setError("");
      } catch (err) {
        console.error("Analytics loading error:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load analytics."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  // Only completed sessions count toward energy and cost totals.
  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  );

  const totalEnergy = completedSessions.reduce(
    (sum, session) => sum + Number(session.energy_kwh || 0),
    0
  );

  const totalCost = completedSessions.reduce(
    (sum, session) => sum + Number(session.cost_inr || 0),
    0
  );

  const totalMinutes = completedSessions.reduce(
    (sum, session) => sum + Number(session.duration_minutes || 0),
    0
  );

  const averageDuration =
    completedSessions.length > 0
      ? Math.round(totalMinutes / completedSessions.length)
      : null;

  // Estimated vehicle efficiency from vehicle specifications.
  const efficiency =
    vehicle?.driving_range_km != null &&
    vehicle?.battery_capacity_kwh != null &&
    Number(vehicle.battery_capacity_kwh) > 0
      ? (
          Number(vehicle.driving_range_km) /
          Number(vehicle.battery_capacity_kwh)
        ).toFixed(1)
      : null;

  // Build the last seven calendar days.
  const today = new Date();

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - (6 - index));

    return date;
  });

  const chartDays = lastSevenDays.map((date) => {
    const dayEnergy = completedSessions
      .filter((session) => {
        const sessionDate = new Date(session.started_at);

        return (
          sessionDate.getFullYear() === date.getFullYear() &&
          sessionDate.getMonth() === date.getMonth() &&
          sessionDate.getDate() === date.getDate()
        );
      })
      .reduce(
        (sum, session) => sum + Number(session.energy_kwh || 0),
        0
      );

    return {
      day: date.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      date: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      energy: dayEnergy,
    };
  });

  const maxEnergy = Math.max(
    ...chartDays.map((day) => day.energy),
    1
  );

  const weeklyEnergy = chartDays.reduce(
    (sum, day) => sum + day.energy,
    0
  );

  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#17201b]">
      <div className="mx-auto max-w-7xl p-5 md:p-8">

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
            Vehicle Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Analytics
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Understand your vehicle performance and energy usage.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            icon={<TrendingUp size={19} />}
            label="Estimated Efficiency"
            value={
              loading
                ? "..."
                : efficiency
                  ? `${efficiency} km/kWh`
                  : "—"
            }
            change="Vehicle specification"
          />

          <AnalyticsCard
            icon={<Zap size={19} />}
            label="Energy Used"
            value={
              loading
                ? "..."
                : `${totalEnergy.toFixed(1)} kWh`
            }
            change={`${completedSessions.length} completed sessions`}
          />

          <AnalyticsCard
            icon={<Activity size={19} />}
            label="Total Charging Cost"
            value={
              loading
                ? "..."
                : `₹${totalCost.toFixed(2)}`
            }
            change="Recorded sessions"
          />

          <AnalyticsCard
            icon={<Battery size={19} />}
            label="Battery Level"
            value={
              loading
                ? "..."
                : vehicle
                  ? `${vehicle.battery_percentage}%`
                  : "—"
            }
            change={vehicle ? "Last saved reading" : "No vehicle"}
          />
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">

          {/* Energy Chart */}
          <section className="rounded-3xl border border-[#e2e7e2] bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold">
                  Energy consumption
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Energy delivered during the last seven days
                </p>
              </div>

              <span className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500">
                Weekly
              </span>
            </div>

            <div className="mt-8 h-64">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  Loading energy data...
                </div>
              ) : weeklyEnergy > 0 ? (
                <div className="flex h-full items-end gap-4">
                  {chartDays.map((day) => {
                    const height =
                      day.energy > 0
                        ? Math.max(
                            8,
                            Math.round(
                              (day.energy / maxEnergy) * 100
                            )
                          )
                        : 0;

                    return (
                      <div
                        key={day.date}
                        className="flex h-full flex-1 flex-col items-center justify-end"
                      >
                        <p className="mb-2 text-[10px] font-semibold text-gray-500">
                          {day.energy > 0
                            ? `${day.energy.toFixed(1)}`
                            : ""}
                        </p>

                        <div
                          className="w-full max-w-12 rounded-t-xl bg-emerald-500 transition hover:bg-emerald-600"
                          style={{
                            height: `${height}%`,
                            minHeight: day.energy > 0 ? "6px" : "0",
                          }}
                        />

                        <p className="mt-3 text-[10px] font-medium text-gray-400">
                          {day.day}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                  <Zap className="text-gray-300" size={32} />

                  <p className="mt-3 text-sm font-semibold text-gray-600">
                    No weekly charging data
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Complete charging sessions to generate your energy chart.
                  </p>

                  <Link
                    href="/charging"
                    className="mt-4 rounded-xl bg-[#17201b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#26332b]"
                  >
                    Go to Charging
                  </Link>
                </div>
              )}
            </div>

            <p className="mt-3 text-right text-xs text-gray-400">
              Weekly energy: {loading ? "..." : `${weeklyEnergy.toFixed(1)} kWh`}
            </p>
          </section>

          {/* Efficiency Card */}
          <section className="rounded-3xl border border-[#e2e7e2] bg-[#17201b] p-6 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
              <Gauge size={21} />
            </div>

            <h2 className="mt-5 text-lg font-bold">
              Driving efficiency
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              {vehicle
                ? `Estimated using ${vehicle.vehicle_name}'s specified range and battery capacity.`
                : "Add a vehicle with battery capacity and range to estimate efficiency."}
            </p>

            <div className="mt-8">
              <p className="text-5xl font-bold">
                {loading ? "..." : efficiency ?? "—"}
              </p>

              <p className="mt-1 text-xs text-white/40">
                kilometers per kWh
              </p>
            </div>

            <div className="mt-8">
              <p className="text-xs text-white/40">
                Estimated specification-based efficiency
              </p>
            </div>
          </section>
        </div>

        {/* Performance Rows */}
        <section className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6">
          <div>
            <h2 className="font-bold">
              Vehicle performance
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Current indicators from your saved vehicle and charging sessions.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <PerformanceRow
              icon={<BatteryCharging size={19} />}
              label="Battery percentage"
              value={
                loading
                  ? "..."
                  : vehicle
                    ? `${vehicle.battery_percentage}%`
                    : "—"
              }
              description={
                vehicle
                  ? "Last saved battery reading"
                  : "No vehicle available"
              }
            />

            <PerformanceRow
              icon={<Zap size={19} />}
              label="Driving range"
              value={
                loading
                  ? "..."
                  : vehicle?.driving_range_km != null
                    ? `${vehicle.driving_range_km} km`
                    : "—"
              }
              description="Saved vehicle range"
            />

            <PerformanceRow
              icon={<Activity size={19} />}
              label="Average session duration"
              value={
                loading
                  ? "..."
                  : averageDuration !== null
                    ? `${averageDuration} min`
                    : "—"
              }
              description={
                completedSessions.length > 0
                  ? `${completedSessions.length} completed sessions`
                  : "No completed sessions"
              }
            />
          </div>
        </section>

        {/* Session Summary */}
        <section className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6">
          <h2 className="font-bold">
            Charging activity
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Summary of your recorded charging sessions.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#fafbfa] p-5">
              <p className="text-xs text-gray-400">
                Total sessions
              </p>
              <p className="mt-2 text-2xl font-bold">
                {loading ? "..." : completedSessions.length}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fafbfa] p-5">
              <p className="text-xs text-gray-400">
                Total charging duration
              </p>
              <p className="mt-2 text-2xl font-bold">
                {loading
                  ? "..."
                  : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
              </p>
            </div>
          </div>

          <Link
            href="/charging"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17201b] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#26332b]"
          >
            View charging history
          </Link>
        </section>
      </div>
    </main>
  );
}

function AnalyticsCard({
  icon,
  label,
  value,
  change,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e2e7e2] bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
          {icon}
        </div>

        <span className="text-xs font-semibold text-emerald-600">
          {change}
        </span>
      </div>

      <p className="mt-5 text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function PerformanceRow({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-[#fafbfa] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-emerald-600">
        {description}
      </p>
    </div>
  );
}

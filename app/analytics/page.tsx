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

export default function AnalyticsPage() {
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

        {/* KPI Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <AnalyticsCard
            icon={<TrendingUp size={19} />}
            label="Efficiency"
            value="6.4 km/kWh"
            change="+8.2%"
          />

          <AnalyticsCard
            icon={<Zap size={19} />}
            label="Energy Used"
            value="42.8 kWh"
            change="-4.1%"
          />

          <AnalyticsCard
            icon={<Battery size={19} />}
            label="Battery Health"
            value="94%"
            change="+1.4%"
          />

          <AnalyticsCard
            icon={<Activity size={19} />}
            label="Distance"
            value="274 km"
            change="+12.5%"
          />

        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">

          {/* Energy Chart */}
          <div className="rounded-3xl border border-[#e2e7e2] bg-white p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-bold">
                  Energy consumption
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Energy usage over the past 7 days
                </p>
              </div>

              <select className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium outline-none">
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>

            </div>

            <div className="mt-8 h-64">

              <div className="flex h-full items-end gap-4">

                {[
                  ["Mon", 45],
                  ["Tue", 62],
                  ["Wed", 38],
                  ["Thu", 70],
                  ["Fri", 55],
                  ["Sat", 82],
                  ["Sun", 64],
                ].map(([day, height]) => (
                  <div
                    key={day}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >

                    <div
                      className="w-full max-w-12 rounded-t-xl bg-emerald-500 transition hover:bg-emerald-600"
                      style={{ height: `${height}%` }}
                    />

                    <p className="mt-3 text-[10px] font-medium text-gray-400">
                      {day}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* Efficiency */}
          <div className="rounded-3xl border border-[#e2e7e2] bg-[#17201b] p-6 text-white">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
              <Gauge size={21} />
            </div>

            <h2 className="mt-5 text-lg font-bold">
              Driving efficiency
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Your vehicle is currently operating above the average efficiency
              for your recent trips.
            </p>

            <div className="mt-8">

              <p className="text-5xl font-bold">
                6.4
              </p>

              <p className="mt-1 text-xs text-white/40">
                kilometers per kWh
              </p>

            </div>

            <div className="mt-8">

              <div className="flex justify-between text-xs text-white/40">
                <span>Your average</span>
                <span>6.4 km/kWh</span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-emerald-400" />
              </div>

            </div>

          </div>

        </div>

        {/* Performance */}
        <div className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6">

          <div>
            <h2 className="font-bold">
              Vehicle performance
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Current performance indicators.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <PerformanceRow
              icon={<BatteryCharging size={19} />}
              label="Battery health"
              value="94%"
              description="Excellent"
            />

            <PerformanceRow
              icon={<Zap size={19} />}
              label="Charging efficiency"
              value="92%"
              description="Very good"
            />

            <PerformanceRow
              icon={<Activity size={19} />}
              label="Driving score"
              value="87/100"
              description="Good"
            />

          </div>

        </div>

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
  icon: React.ReactNode;
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
  icon: React.ReactNode;
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
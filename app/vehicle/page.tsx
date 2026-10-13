import Link from "next/link";
import {
  ArrowLeft,
  Battery,
  BatteryCharging,
  Car,
  Gauge,
  Navigation,
  Thermometer,
  Zap,
} from "lucide-react";

export default function VehiclePage() {
  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#17201b]">
      <div className="mx-auto max-w-7xl p-5 md:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Vehicle Management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              My Vehicle
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor your vehicle performance and battery health.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Vehicle Connected
          </div>

        </div>

        {/* Vehicle Overview */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">

          {/* Vehicle Card */}
          <div className="overflow-hidden rounded-3xl bg-[#17201b] p-6 text-white shadow-[0_10px_40px_rgba(20,40,25,0.12)] md:p-8">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Connected vehicle
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Tata Nexon EV
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  TN 38 XX 1234
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Car size={23} />
              </div>

            </div>

            {/* Battery */}
            <div className="mt-10 flex flex-col items-center justify-center">

              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[12px] border-white/10">

                <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-l-emerald-400 border-t-emerald-400 border-r-emerald-400 rotate-[35deg]" />

                <div className="text-center">

                  <p className="text-5xl font-bold">
                    78%
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-wider text-white/40">
                    Battery level
                  </p>

                </div>

              </div>

              <p className="mt-5 text-sm text-white/50">
                Estimated range
              </p>

              <p className="mt-1 text-2xl font-bold">
                245 km
              </p>

            </div>

            {/* Vehicle Info */}
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">

              <InfoBox
                label="Drive Mode"
                value="Eco"
              />

              <InfoBox
                label="Battery Health"
                value="94%"
              />

              <InfoBox
                label="Battery Temp"
                value="31°C"
              />

              <InfoBox
                label="Status"
                value="Ready"
              />

            </div>

          </div>

          {/* Battery Summary */}
          <div className="rounded-3xl border border-[#e2e7e2] bg-white p-6 shadow-[0_4px_20px_rgba(20,40,25,0.04)]">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
              <BatteryCharging size={21} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Battery health
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your battery is performing within the expected range.
            </p>

            <div className="mt-7">

              <div className="flex items-end justify-between">

                <p className="text-4xl font-bold">
                  94%
                </p>

                <p className="text-xs font-semibold text-emerald-600">
                  Excellent
                </p>

              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: "94%" }}
                />
              </div>

            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Battery condition
              </p>

              <div className="mt-4 space-y-4">

                <ConditionRow
                  label="Capacity"
                  value="94%"
                />

                <ConditionRow
                  label="Temperature"
                  value="31°C"
                />

                <ConditionRow
                  label="Voltage"
                  value="396 V"
                />

              </div>

            </div>

          </div>

        </div>

        {/* Live Metrics */}
        <div className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6 shadow-[0_4px_20px_rgba(20,40,25,0.04)]">

          <div>
            <h2 className="text-lg font-bold">
              Live vehicle metrics
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Current readings from your connected vehicle.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              icon={<Zap size={20} />}
              label="Voltage"
              value="396 V"
              status="Stable"
            />

            <MetricCard
              icon={<Gauge size={20} />}
              label="Current"
              value="28 A"
              status="Normal"
            />

            <MetricCard
              icon={<Battery size={20} />}
              label="Power"
              value="11.1 kW"
              status="Optimal"
            />

            <MetricCard
              icon={<Thermometer size={20} />}
              label="Temperature"
              value="31°C"
              status="Normal"
            />

          </div>

        </div>

        {/* Range & Charging */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          {/* Range */}
          <div className="rounded-3xl border border-[#e2e7e2] bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
                <Navigation size={20} />
              </div>

              <div>
                <h3 className="font-bold">
                  Estimated range
                </h3>

                <p className="text-xs text-gray-400">
                  Based on current battery level
                </p>
              </div>

            </div>

            <div className="mt-7 flex items-end gap-2">

              <span className="text-4xl font-bold">
                245
              </span>

              <span className="mb-1 text-sm text-gray-400">
                km
              </span>

            </div>

            <p className="mt-2 text-xs font-medium text-emerald-600">
              +12 km compared with yesterday
            </p>

          </div>

          {/* Charging */}
          <div className="rounded-3xl border border-[#e2e7e2] bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
                <BatteryCharging size={20} />
              </div>

              <div>
                <h3 className="font-bold">
                  Charging status
                </h3>

                <p className="text-xs text-gray-400">
                  Current charging information
                </p>
              </div>

            </div>

            <div className="mt-7">

              <p className="text-2xl font-bold">
                Not charging
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Vehicle is ready for your next trip.
              </p>

            </div>

            <Link
              href="/charging"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17201b] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#26332b]"
            >
              Charging details
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}

/* ==================== INFO BOX ==================== */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">

      <p className="text-[10px] uppercase tracking-wider text-white/40">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold">
        {value}
      </p>

    </div>
  );
}

/* ==================== CONDITION ROW ==================== */

function ConditionRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="text-sm font-bold">
        {value}
      </p>

    </div>
  );
}

/* ==================== METRIC CARD ==================== */

function MetricCard({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-[#fafbfa] p-5">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
          {icon}
        </div>

        <span className="text-[10px] font-semibold text-emerald-600">
          {status}
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
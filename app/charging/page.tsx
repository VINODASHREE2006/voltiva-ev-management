import Link from "next/link";
import {
  ArrowLeft,
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Gauge,
  Zap,
} from "lucide-react";

export default function ChargingPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#17201b]">
      <div className="mx-auto max-w-7xl p-5 md:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Charging Management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Charging
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor your charging sessions and energy consumption.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            Not charging
          </div>

        </div>

        {/* Current Charging */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">

          <div className="rounded-3xl bg-[#17201b] p-6 text-white shadow-[0_10px_40px_rgba(20,40,25,0.12)] md:p-8">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Current session
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Ready to charge
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Connect your vehicle to begin a session.
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                <BatteryCharging size={24} />
              </div>

            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">

              <DarkMetric
                label="Battery"
                value="78%"
              />

              <DarkMetric
                label="Power"
                value="11.1 kW"
              />

              <DarkMetric
                label="Voltage"
                value="396 V"
              />

            </div>

            <div className="mt-8">

              <div className="flex justify-between text-xs text-white/40">
                <span>Current battery level</span>
                <span>78%</span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: "78%" }}
                />
              </div>

            </div>

          </div>

          {/* Charging Summary */}
          <div className="rounded-3xl border border-[#e2e7e2] bg-white p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
              <Zap size={21} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Charging summary
            </h3>

            <div className="mt-6 space-y-5">

              <SummaryRow
                label="Last session"
                value="42 min"
              />

              <SummaryRow
                label="Energy delivered"
                value="18.6 kWh"
              />

              <SummaryRow
                label="Estimated cost"
                value="₹148"
              />

              <SummaryRow
                label="Average power"
                value="26.5 kW"
              />

            </div>

          </div>

        </div>

        {/* Charging History */}
        <div className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold">
                Recent charging sessions
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Your latest charging activity.
              </p>
            </div>

            <Clock3 size={20} className="text-gray-400" />

          </div>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full min-w-[650px]">

              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400">

                  <th className="pb-4 font-semibold">
                    Station
                  </th>

                  <th className="pb-4 font-semibold">
                    Date
                  </th>

                  <th className="pb-4 font-semibold">
                    Duration
                  </th>

                  <th className="pb-4 font-semibold">
                    Energy
                  </th>

                  <th className="pb-4 font-semibold">
                    Cost
                  </th>

                  <th className="pb-4 font-semibold">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                <ChargingRow
                  station="GreenCharge Hub"
                  date="Today, 8:42 AM"
                  duration="42 min"
                  energy="18.6 kWh"
                  cost="₹148"
                />

                <ChargingRow
                  station="EV Power Station"
                  date="Yesterday, 6:15 PM"
                  duration="35 min"
                  energy="15.2 kWh"
                  cost="₹121"
                />

                <ChargingRow
                  station="ChargePoint Sathy"
                  date="Sep 28, 7:30 AM"
                  duration="48 min"
                  energy="21.4 kWh"
                  cost="₹171"
                />

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
  );
}

function DarkMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-5">

      <p className="text-xs uppercase tracking-wider text-white/40">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-bold">
        {value}
      </span>

    </div>
  );
}

function ChargingRow({
  station,
  date,
  duration,
  energy,
  cost,
}: {
  station: string;
  date: string;
  duration: string;
  energy: string;
  cost: string;
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0">

      <td className="py-5 text-sm font-semibold">
        {station}
      </td>

      <td className="py-5 text-sm text-gray-500">
        {date}
      </td>

      <td className="py-5 text-sm text-gray-500">
        {duration}
      </td>

      <td className="py-5 text-sm font-medium">
        {energy}
      </td>

      <td className="py-5 text-sm font-medium">
        {cost}
      </td>

      <td className="py-5">

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={13} />
          Completed
        </span>

      </td>

    </tr>
  );
}
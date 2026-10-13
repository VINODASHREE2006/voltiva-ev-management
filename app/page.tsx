import Link from "next/link";
import {
  Activity,
  Battery,
  BatteryCharging,
  Bell,
  Car,
  ChevronRight,
  Gauge,
  MapPin,
  Navigation,
  Search,
  Thermometer,
  Zap,
} from "lucide-react";

const stats = [
  {
    label: "Battery",
    value: "78%",
    detail: "Healthy",
    icon: BatteryCharging,
  },
  {
    label: "Estimated Range",
    value: "245 km",
    detail: "+12 km today",
    icon: Navigation,
  },
  {
    label: "Voltage",
    value: "396 V",
    detail: "Stable",
    icon: Zap,
  },
  {
    label: "Battery Temp",
    value: "31°C",
    detail: "Normal",
    icon: Thermometer,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[1500px] p-5 md:p-8">

      {/* Welcome */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>

          <p className="text-sm font-medium text-emerald-700">
            Good morning 👋
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Your vehicle at a glance.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Monitor your EV performance, battery health and charging status
            from one place.
          </p>

        </div>

        <Link
          href="/vehicle"
          className="flex w-fit items-center gap-2 rounded-xl bg-[#17201b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26332b]"
        >
          <Car size={17} />
          Manage vehicle
        </Link>

      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {

          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#e2e7e2] bg-white p-5 shadow-[0_4px_20px_rgba(20,40,25,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(20,40,25,0.07)]"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs font-medium text-emerald-600">
                    {stat.detail}
                  </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
                  <Icon size={19} />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">

        {/* Battery Chart */}
        <div className="rounded-2xl border border-[#e2e7e2] bg-white p-6 shadow-[0_4px_20px_rgba(20,40,25,0.04)]">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-bold">
                Battery performance
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Battery level over the last 24 hours
              </p>

            </div>

            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500">
              Last 24h
            </button>

          </div>

          <div className="mt-8 h-64">

            <svg
              viewBox="0 0 800 260"
              className="h-full w-full"
              preserveAspectRatio="none"
            >

              <defs>

                <linearGradient
                  id="batteryFill"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >

                  <stop
                    offset="0%"
                    stopColor="#10b981"
                    stopOpacity="0.20"
                  />

                  <stop
                    offset="100%"
                    stopColor="#10b981"
                    stopOpacity="0"
                  />

                </linearGradient>

              </defs>

              <line
                x1="0"
                y1="210"
                x2="800"
                y2="210"
                stroke="#edf0ed"
              />

              <line
                x1="0"
                y1="150"
                x2="800"
                y2="150"
                stroke="#edf0ed"
              />

              <line
                x1="0"
                y1="90"
                x2="800"
                y2="90"
                stroke="#edf0ed"
              />

              <line
                x1="0"
                y1="30"
                x2="800"
                y2="30"
                stroke="#edf0ed"
              />

              <path
                d="M0 170 C70 160 90 180 145 150 C200 120 230 145 280 125 C340 100 360 120 420 105 C475 90 510 110 555 75 C610 40 650 70 700 48 C740 30 770 42 800 25 L800 230 L0 230 Z"
                fill="url(#batteryFill)"
              />

              <path
                d="M0 170 C70 160 90 180 145 150 C200 120 230 145 280 125 C340 100 360 120 420 105 C475 90 510 110 555 75 C610 40 650 70 700 48 C740 30 770 42 800 25"
                fill="none"
                stroke="#10a96f"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <circle
                cx="800"
                cy="25"
                r="6"
                fill="#10a96f"
              />

            </svg>

            <div className="mt-2 flex justify-between text-[11px] text-gray-400">
              <span>12 AM</span>
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>Now</span>
            </div>

          </div>

        </div>

        {/* Vehicle */}
        <div className="rounded-2xl bg-[#17201b] p-6 text-white shadow-[0_8px_30px_rgba(20,40,25,0.12)]">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                Connected vehicle
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Tata Nexon EV
              </h2>

              <p className="mt-1 text-xs text-white/50">
                TN 38 XX 1234
              </p>

            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              Connected

            </div>

          </div>

          <div className="mt-8 flex items-center gap-6">

            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-white/10">

              <div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-l-emerald-400 border-t-emerald-400 border-r-emerald-400 rotate-[35deg]" />

              <div className="text-center">

                <p className="text-3xl font-bold">
                  78%
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                  Battery
                </p>

              </div>

            </div>

            <div className="space-y-4">

              <div>

                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  Battery health
                </p>

                <p className="mt-1 text-sm font-semibold">
                  94% · Excellent
                </p>

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  Drive mode
                </p>

                <p className="mt-1 text-sm font-semibold">
                  Eco
                </p>

              </div>

            </div>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">

            <div className="rounded-xl bg-white/5 p-3">

              <p className="text-[10px] uppercase tracking-wider text-white/40">
                Current
              </p>

              <p className="mt-1 text-sm font-semibold">
                28 A
              </p>

            </div>

            <div className="rounded-xl bg-white/5 p-3">

              <p className="text-[10px] uppercase tracking-wider text-white/40">
                Power
              </p>

              <p className="mt-1 text-sm font-semibold">
                11.1 kW
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

        {/* Station */}
        <div className="rounded-2xl border border-[#e2e7e2] bg-white p-6 shadow-[0_4px_20px_rgba(20,40,25,0.04)]">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-bold">
                Nearest charging station
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Based on your current location
              </p>

            </div>

            <Link
              href="/stations"
              className="text-xs font-semibold text-emerald-700"
            >
              View all
            </Link>

          </div>

          <div className="mt-5 flex flex-col gap-5 md:flex-row">

            <div className="relative min-h-52 flex-1 overflow-hidden rounded-2xl bg-[#edf3ed]">

              <div className="absolute inset-0 opacity-40">

                <div className="absolute left-0 top-16 h-px w-full rotate-6 bg-emerald-900/10" />

                <div className="absolute left-10 top-32 h-px w-full -rotate-12 bg-emerald-900/10" />

                <div className="absolute left-1/3 top-0 h-full w-px rotate-12 bg-emerald-900/10" />

                <div className="absolute left-2/3 top-0 h-full w-px -rotate-12 bg-emerald-900/10" />

              </div>

              <div className="absolute left-[35%] top-[45%] flex h-11 w-11 items-center justify-center rounded-full bg-[#17201b] text-white shadow-lg">
                <Navigation size={18} />
              </div>

              <div className="absolute right-[20%] top-[25%] flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
                <Zap size={16} />
              </div>

              <div className="absolute bottom-[20%] left-[18%] flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg">
                <Zap size={16} />
              </div>

              <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-2 text-[10px] font-medium text-gray-500 backdrop-blur">
                Live location preview
              </div>

            </div>

            <div className="w-full md:max-w-xs">

              <div className="rounded-2xl border border-gray-200 p-5">

                <div className="flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
                    <Zap size={19} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    4 available
                  </span>

                </div>

                <h3 className="mt-4 font-bold">
                  GreenCharge Hub
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-400">
                  Sathyamangalam Main Road
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">

                  <div>
                    <p className="text-gray-400">
                      Distance
                    </p>

                    <p className="mt-1 font-bold">
                      2.4 km
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">
                      Fast charge
                    </p>

                    <p className="mt-1 font-bold">
                      60 kW
                    </p>
                  </div>

                </div>

                <Link
                  href="/stations"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17201b] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#26332b]"
                >
                  View stations
                  <ChevronRight size={15} />
                </Link>

              </div>

            </div>

          </div>

        </div>

        {/* Live Metrics */}
        <div className="rounded-2xl border border-[#e2e7e2] bg-white p-6 shadow-[0_4px_20px_rgba(20,40,25,0.04)]">

          <p className="text-sm font-bold">
            Live vehicle metrics
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Current electrical readings
          </p>

          <div className="mt-6 space-y-5">

            <MetricRow
              icon={<Gauge size={18} />}
              label="Voltage"
              value="396 V"
              status="Stable"
            />

            <MetricRow
              icon={<Zap size={18} />}
              label="Current"
              value="28 A"
              status="Normal"
            />

            <MetricRow
              icon={<Activity size={18} />}
              label="Power output"
              value="11.1 kW"
              status="Optimal"
            />

            <MetricRow
              icon={<Thermometer size={18} />}
              label="Battery temperature"
              value="31°C"
              status="Normal"
            />

            <MetricRow
              icon={<Battery size={18} />}
              label="Battery health"
              value="94%"
              status="Excellent"
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function MetricRow({
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
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f6f1] text-emerald-600">
          {icon}
        </div>

        <div>

          <p className="text-sm font-semibold">
            {label}
          </p>

          <p className="mt-0.5 text-[11px] text-emerald-600">
            {status}
          </p>

        </div>

      </div>

      <p className="text-sm font-bold">
        {value}
      </p>

    </div>
  );
}
import Link from "next/link";
import {
  ArrowLeft,
  BatteryCharging,
  Car,
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  Zap,
} from "lucide-react";

const stations = [
  {
    name: "GreenCharge Hub",
    location: "Sathyamangalam Main Road",
    distance: "2.4 km",
    power: "60 kW",
    available: 4,
    status: "Available",
  },
  {
    name: "EV Power Station",
    location: "Bannari Road",
    distance: "4.8 km",
    power: "120 kW",
    available: 2,
    status: "Available",
  },
  {
    name: "ChargePoint Sathy",
    location: "Coimbatore Main Road",
    distance: "7.2 km",
    power: "50 kW",
    available: 1,
    status: "Limited",
  },
  {
    name: "FastVolt Station",
    location: "Bhavani Road",
    distance: "9.5 km",
    power: "150 kW",
    available: 0,
    status: "Busy",
  },
];

export default function StationsPage() {
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
              Charging Network
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Charging Stations
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Find nearby charging stations and check availability.
            </p>

          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <MapPin size={16} />
            Location enabled
          </div>

        </div>

        {/* Map */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-[#e2e7e2] bg-white">

          <div className="relative h-[350px] bg-[#eaf1ea]">

            {/* Decorative map */}
            <div className="absolute inset-0 opacity-40">

              <div className="absolute left-0 top-[20%] h-px w-full rotate-6 bg-emerald-900/10" />

              <div className="absolute left-0 top-[55%] h-px w-full -rotate-6 bg-emerald-900/10" />

              <div className="absolute left-0 top-[80%] h-px w-full rotate-3 bg-emerald-900/10" />

              <div className="absolute left-[20%] top-0 h-full w-px rotate-12 bg-emerald-900/10" />

              <div className="absolute left-[50%] top-0 h-full w-px -rotate-6 bg-emerald-900/10" />

              <div className="absolute left-[75%] top-0 h-full w-px rotate-6 bg-emerald-900/10" />

            </div>

            {/* Current location */}
            <div className="absolute left-[38%] top-[48%]">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#17201b] text-white shadow-xl">
                <Navigation size={20} />
              </div>

            </div>

            {/* Station markers */}
            <StationMarker
              left="62%"
              top="25%"
              available
            />

            <StationMarker
              left="76%"
              top="58%"
              available
            />

            <StationMarker
              left="24%"
              top="67%"
              available
            />

            <StationMarker
              left="52%"
              top="78%"
              available={false}
            />

            <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur">

              <p className="text-xs font-semibold">
                Your location
              </p>

              <p className="mt-1 text-[11px] text-gray-400">
                Showing nearby charging stations
              </p>

            </div>

          </div>

        </div>

        {/* Station List */}
        <div className="mt-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold">
                Nearby stations
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                4 charging stations found nearby.
              </p>
            </div>

            <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600">
              Filter
            </button>

          </div>

          <div className="mt-5 grid gap-4">

            {stations.map((station) => (
              <StationCard
                key={station.name}
                {...station}
              />
            ))}

          </div>

        </div>

      </div>
    </main>
  );
}

function StationMarker({
  left,
  top,
  available,
}: {
  left: string;
  top: string;
  available: boolean;
}) {
  return (
    <div
      className={`absolute flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg ${
        available ? "bg-emerald-600" : "bg-gray-500"
      }`}
      style={{ left, top }}
    >
      <Zap size={17} />
    </div>
  );
}

function StationCard({
  name,
  location,
  distance,
  power,
  available,
  status,
}: {
  name: string;
  location: string;
  distance: string;
  power: string;
  available: number;
  status: string;
}) {
  const isAvailable = status === "Available";

  return (
    <div className="rounded-2xl border border-[#e2e7e2] bg-white p-5 shadow-[0_4px_20px_rgba(20,40,25,0.04)]">

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
            <BatteryCharging size={21} />
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-bold">
                {name}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : status === "Limited"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {status}
              </span>

            </div>

            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={12} />
              {location}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-3 gap-8">

          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Distance
            </p>

            <p className="mt-1 text-sm font-bold">
              {distance}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Power
            </p>

            <p className="mt-1 text-sm font-bold">
              {power}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Available
            </p>

            <p className="mt-1 text-sm font-bold">
              {available} slots
            </p>
          </div>

        </div>

        <button
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold ${
            isAvailable
              ? "bg-[#17201b] text-white hover:bg-[#26332b]"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <Navigation size={14} />
          Navigate
          <ChevronRight size={14} />
        </button>

      </div>

    </div>
  );
}
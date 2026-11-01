
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BatteryCharging,
  ChevronRight,
  Filter,
  MapPin,
  Navigation,
  Search,
  Zap,
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";

type StationRecord = {
  id: string;
  name: string;
  location: string;
  distance_km: number;
  power_kw: number;
  connector_type: string | null;
  available_ports: number;
  total_ports: number;
  status: string;
  is_sample_data: boolean;
};

export default function StationsPage() {
  const [stations, setStations] = useState<StationRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "available" | "fast">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStations() {
      try {
        const supabase = createClient();

        const { data, error: queryError } = await supabase
          .from("charging_stations")
          .select(
            "id, name, location, distance_km, power_kw, connector_type, available_ports, total_ports, status, is_sample_data"
          )
          .order("distance_km", { ascending: true });

        if (queryError) throw queryError;

        if (isMounted) {
          setStations((data ?? []) as StationRecord[]);
          setError("");
        }
      } catch (err) {
        console.error("Load stations error:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load charging stations."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadStations();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch =
        station.name.toLowerCase().includes(search.toLowerCase()) ||
        station.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "available"
          ? station.status.toLowerCase() === "available" &&
            station.available_ports > 0
          : filter === "fast"
            ? station.power_kw >= 60
            : true;

      return matchesSearch && matchesFilter;
    });
  }, [stations, filter, search]);

  const sampleCount = stations.filter(
    (station) => station.is_sample_data
  ).length;

  const availableCount = stations.filter(
    (station) =>
      station.status.toLowerCase() === "available" &&
      station.available_ports > 0
  ).length;

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
              Find charging stations and check their availability.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <MapPin size={16} />
            Supabase Connected
          </div>
        </div>

        {/* Overview */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <OverviewCard
            label="Total stations"
            value={loading ? "..." : String(stations.length)}
            icon={<BatteryCharging size={20} />}
          />

          <OverviewCard
            label="Available stations"
            value={loading ? "..." : String(availableCount)}
            icon={<CheckIcon />}
          />

          <OverviewCard
            label="Fast charging stations"
            value={
              loading
                ? "..."
                : String(
                    stations.filter((station) => station.power_kw >= 60)
                      .length
                  )
            }
            icon={<Zap size={20} />}
          />
        </div>

        {/* Map Information */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-[#e2e7e2] bg-white">
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Explore charging locations
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Open Google Maps to navigate to a selected station.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <Navigation size={17} />
              Google Maps navigation
            </div>
          </div>

          <div className="flex min-h-[150px] items-center justify-center bg-[#eaf1ea] p-8 text-center">
            <div>
              <MapPin
                size={35}
                className="mx-auto text-emerald-700"
              />
              <p className="mt-3 font-semibold text-[#17201b]">
                Your charging network
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Select Navigate on a station to open its Google Maps directions.
              </p>
            </div>
          </div>
        </section>

        {/* Sample Data Notice */}
        {!loading && sampleCount > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Demonstration mode: {sampleCount} station records contain illustrative sample data. Availability and distances are not verified live information.
          </div>
        )}

        {/* Database Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            Unable to load charging stations: {error}
          </div>
        )}

        {/* Station List */}
        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Nearby stations
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                {loading
                  ? "Loading stations..."
                  : `${filteredStations.length} charging stations found.`}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stations..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 flex items-center gap-1 text-xs text-gray-400">
              <Filter size={13} />
              Filter:
            </span>

            {(["all", "available", "fast"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  filter === item
                    ? "bg-[#17201b] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item === "all"
                  ? "All"
                  : item === "available"
                    ? "Available"
                    : "Fast DC (≥60 kW)"}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-5 grid gap-4">
            {loading ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
                Loading charging stations...
              </div>
            ) : error ? null : filteredStations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <MapPin
                  size={32}
                  className="mx-auto text-gray-400"
                />
                <h3 className="mt-3 font-bold">
                  No stations found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try another search or filter.
                </p>
              </div>
            ) : (
              filteredStations.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function OverviewCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#e2e7e2] bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-700">
        {icon}
      </div>
      <p className="mt-4 text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function CheckIcon() {
  return <BatteryCharging size={20} />;
}

function StationCard({
  station,
}: {
  station: StationRecord;
}) {
  const isAvailable =
    station.status.toLowerCase() === "available" &&
    station.available_ports > 0;

  const isLimited = station.status.toLowerCase() === "limited";

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${station.name}, ${station.location}, Sathyamangalam, Tamil Nadu, India`
  )}`;

  return (
    <article className="rounded-2xl border border-[#e2e7e2] bg-white p-5 shadow-[0_4px_20px_rgba(20,40,25,0.04)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        {/* Station details */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
            <BatteryCharging size={21} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold">{station.name}</h3>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : isLimited
                      ? "bg-amber-50 text-amber-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {station.status}
              </span>
            </div>

            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={12} />
              {station.location}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Connector: {station.connector_type || "Not specified"}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Distance
            </p>
            <p className="mt-1 text-sm font-bold">
              {Number(station.distance_km).toFixed(1)} km
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Power
            </p>
            <p className="mt-1 text-sm font-bold">
              {station.power_kw} kW
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">
              Available
            </p>
            <p className="mt-1 text-sm font-bold">
              {station.available_ports}/{station.total_ports}
            </p>
            <p className="text-[10px] text-gray-400">Ports</p>
          </div>
        </div>

        {/* Navigation */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#17201b] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#26332b]"
        >
          <Navigation size={14} />
          Navigate
          <ChevronRight size={14} />
        </a>
      </div>
    </article>
  );
}


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BatteryCharging,
  CheckCircle2,
  Clock3,
  Loader2,
  Plus,
  Square,
  Zap,
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";

type Vehicle = {
  id: string;
  user_id: string;
  vehicle_name: string;
  battery_percentage: number;
};

type ChargingSession = {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  station_name: string;
  status: "completed" | "in_progress" | "scheduled" | "cancelled";
  energy_kwh: number;
  cost_inr: number;
  duration_minutes: number;
  started_at: string;
  ended_at: string | null;
  created_at: string;
};

export default function ChargingPage() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [stationName, setStationName] = useState("GreenCharge Hub");
  const [energy, setEnergy] = useState("15.5");
  const [cost, setCost] = useState("125");

  const [showStartForm, setShowStartForm] = useState(false);
  const [showStopForm, setShowStopForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const activeSession = sessions.find(
    (session) => session.status === "in_progress"
  ) ?? null;

  async function loadData() {
    setPageError("");

    try {
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        setUserId(null);
        setVehicle(null);
        setSessions([]);
        return;
      }

      const currentUserId = authData.user.id;
      setUserId(currentUserId);

      const { data: vehicleData, error: vehicleError } =
        await supabase
          .from("vehicles")
          .select(
            "id, user_id, vehicle_name, battery_percentage"
          )
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false });

      if (vehicleError) throw vehicleError;

      setVehicle(
        vehicleData && vehicleData.length > 0
          ? (vehicleData[0] as Vehicle)
          : null
      );

      const { data: sessionData, error: sessionError } =
        await supabase
          .from("charging_sessions")
          .select("*")
          .eq("user_id", currentUserId)
          .order("started_at", { ascending: false });

      if (sessionError) throw sessionError;

      setSessions((sessionData ?? []) as ChargingSession[]);
    } catch (err) {
      console.error("Charging data error:", err);

      setPageError(
        err instanceof Error
          ? err.message
          : "Unable to load charging information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleStartCharging(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      if (!stationName.trim()) {
        throw new Error("Please enter a charging station name.");
      }

      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Please sign in before starting a session.");
      }

      if (!vehicle) {
        throw new Error("Please add a vehicle before charging.");
      }

      const { data: existingSessions, error: activeError } =
        await supabase
          .from("charging_sessions")
          .select("id")
          .eq("user_id", authData.user.id)
          .eq("status", "in_progress")
          .limit(1);

      if (activeError) throw activeError;

      if (existingSessions && existingSessions.length > 0) {
        throw new Error(
          "You already have an active charging session. Stop it first."
        );
      }

      const { error: insertError } = await supabase
        .from("charging_sessions")
        .insert({
          user_id: authData.user.id,
          vehicle_id: vehicle.id,
          station_name: stationName.trim(),
          status: "in_progress",
          energy_kwh: 0,
          cost_inr: 0,
          duration_minutes: 0,
        });

      if (insertError) throw insertError;

      setShowStartForm(false);
      setSuccessMessage("Charging session started successfully!");

      await loadData();
    } catch (err) {
      console.error("Start charging error:", err);

      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to start charging."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStopCharging(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setFormError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      if (!activeSession) {
        throw new Error("No active charging session found.");
      }

      const energyValue = Number(energy);
      const costValue = Number(cost);

      if (!Number.isFinite(energyValue) || energyValue < 0) {
        throw new Error("Enter a valid energy value.");
      }

      if (!Number.isFinite(costValue) || costValue < 0) {
        throw new Error("Enter a valid charging cost.");
      }

      const startedAt = new Date(activeSession.started_at);
      const endedAt = new Date();

      if (Number.isNaN(startedAt.getTime())) {
        throw new Error("Invalid charging start time.");
      }

      const durationMinutes = Math.max(
        0,
        Math.floor(
          (endedAt.getTime() - startedAt.getTime()) / 60000
        )
      );

      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Please sign in again.");
      }

      const { error: updateError } = await supabase
        .from("charging_sessions")
        .update({
          status: "completed",
          energy_kwh: energyValue,
          cost_inr: costValue,
          duration_minutes: durationMinutes,
          ended_at: endedAt.toISOString(),
        })
        .eq("id", activeSession.id)
        .eq("user_id", authData.user.id)
        .eq("status", "in_progress");

      if (updateError) throw updateError;

      setShowStopForm(false);
      setEnergy("15.5");
      setCost("125");
      setSuccessMessage("Charging session completed successfully!");

      await loadData();
    } catch (err) {
      console.error("Stop charging error:", err);

      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to stop charging."
      );
    } finally {
      setSubmitting(false);
    }
  }

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

  const avgPower =
    totalMinutes > 0
      ? (totalEnergy / (totalMinutes / 60)).toFixed(1)
      : "—";

  const lastSessionDuration =
    completedSessions.length > 0
      ? `${completedSessions[0].duration_minutes} min`
      : "—";

  const batteryPercent = vehicle?.battery_percentage ?? 0;

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
              Manage your charging sessions and energy consumption.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!activeSession && userId && (
              <button
                type="button"
                onClick={() => {
                  setShowStartForm(!showStartForm);
                  setShowStopForm(false);
                  setFormError("");
                }}
                disabled={!vehicle}
                className="flex items-center gap-1.5 rounded-full bg-[#17201b] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#26332b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={15} />
                Start charging
              </button>
            )}

            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                activeSession
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  activeSession
                    ? "animate-pulse bg-emerald-500"
                    : "bg-gray-400"
                }`}
              />
              {activeSession ? "Charging" : "Not charging"}
            </div>
          </div>
        </div>

        {/* Messages */}
        {pageError && (
          <div
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {pageError}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            {successMessage}
          </div>
        )}

        {!vehicle && !loading && userId && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No vehicle found. Please add a vehicle before starting a charging session.
            <Link
              href="/vehicle"
              className="ml-1 font-bold underline"
            >
              Add vehicle
            </Link>
          </div>
        )}

        {/* Start Charging Form */}
        {showStartForm && (
          <section className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Start a charging session
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Vehicle: {vehicle?.vehicle_name ?? "No vehicle"}
            </p>

            <form
              onSubmit={handleStartCharging}
              className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium">
                  Charging station
                </label>

                <input
                  required
                  value={stationName}
                  onChange={(event) => setStationName(event.target.value)}
                  placeholder="Enter station name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !vehicle}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {submitting && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {submitting ? "Starting..." : "Begin charging"}
              </button>
            </form>

            {formError && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </p>
            )}
          </section>
        )}

        {/* Current Charging */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl bg-[#17201b] p-6 text-white shadow-[0_10px_40px_rgba(20,40,25,0.12)] md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Current session
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {activeSession ? "Charging in progress" : "Ready to charge"}
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  {activeSession
                    ? `Charging at ${activeSession.station_name}`
                    : vehicle
                      ? `Connected vehicle: ${vehicle.vehicle_name}`
                      : "Add a vehicle to begin charging."}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-400">
                <BatteryCharging size={24} />
              </div>
            </div>

            {activeSession && (
              <div className="mt-6 rounded-2xl bg-white/5 p-4">
                <p className="text-xs text-white/40">
                  Started at
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {new Date(activeSession.started_at).toLocaleString()}
                </p>
              </div>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <DarkMetric
                label="Battery"
                value={vehicle ? `${vehicle.battery_percentage}%` : "—"}
              />

              <DarkMetric
                label="Energy delivered"
                value={
                  activeSession
                    ? `${activeSession.energy_kwh} kWh`
                    : "—"
                }
              />

              <DarkMetric
                label="Duration"
                value={
                  activeSession
                    ? `${Math.max(
                        0,
                        Math.floor(
                          (Date.now() -
                            new Date(activeSession.started_at).getTime()) /
                            60000
                        )
                      )} min`
                    : "—"
                }
              />
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-xs text-white/40">
                <span>Current battery level</span>
                <span>
                  {vehicle ? `${batteryPercent}%` : "—"}
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{
                    width: `${Math.min(100, Math.max(0, batteryPercent))}%`,
                  }}
                />
              </div>
            </div>

            {activeSession && (
              <button
                type="button"
                onClick={() => {
                  setShowStopForm(!showStopForm);
                  setShowStartForm(false);
                  setFormError("");
                }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <Square size={16} />
                Stop charging
              </button>
            )}
          </section>

          {/* Charging Summary */}
          <section className="rounded-3xl border border-[#e2e7e2] bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
              <Zap size={21} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Charging summary
            </h3>

            <div className="mt-6 space-y-5">
              <SummaryRow
                label="Last session"
                value={loading ? "..." : lastSessionDuration}
              />

              <SummaryRow
                label="Energy delivered"
                value={
                  loading ? "..." : `${totalEnergy.toFixed(1)} kWh`
                }
              />

              <SummaryRow
                label="Total charging cost"
                value={
                  loading ? "..." : `₹${totalCost.toFixed(2)}`
                }
              />

              <SummaryRow
                label="Average power"
                value={
                  loading
                    ? "..."
                    : avgPower === "—"
                      ? "—"
                      : `${avgPower} kW`
                }
              />
            </div>
          </section>
        </div>

        {/* Stop Charging Form */}
        {showStopForm && activeSession && (
          <section className="mt-6 rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Complete charging session
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the final charging readings. Duration is calculated from the start time.
            </p>

            <form
              onSubmit={handleStopCharging}
              className="mt-5 grid gap-4 sm:grid-cols-3"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Energy delivered (kWh)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  required
                  value={energy}
                  onChange={(event) => setEnergy(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Total cost (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={cost}
                  onChange={(event) => setCost(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {submitting && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {submitting ? "Saving..." : "Complete session"}
                </button>
              </div>
            </form>

            {formError && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                setShowStopForm(false);
                setFormError("");
              }}
              className="mt-3 text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </section>
        )}

        {/* Charging History */}
        <section className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Recent charging sessions
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {sessions.length} recorded session
                {sessions.length === 1 ? "" : "s"}
              </p>
            </div>

            <Clock3 size={20} className="text-gray-400" />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-4 font-semibold">Station</th>
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold">Duration</th>
                  <th className="pb-4 font-semibold">Energy</th>
                  <th className="pb-4 font-semibold">Cost</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                      Loading charging history...
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                      <p className="font-semibold text-gray-600">
                        No charging sessions recorded yet
                      </p>
                      <p className="mt-1 text-xs">
                        Start your first charging session to see it here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <ChargingRow
                      key={session.id}
                      station={session.station_name}
                      date={new Date(session.started_at).toLocaleString()}
                      duration={
                        session.status === "in_progress"
                          ? "In progress"
                          : `${session.duration_minutes} min`
                      }
                      energy={`${Number(session.energy_kwh).toFixed(1)} kWh`}
                      cost={`₹${Number(session.cost_inr).toFixed(2)}`}
                      status={session.status}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => void loadData()}
            className="mt-5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Refresh sessions
          </button>
        </section>

        <p className="mt-6 text-xs leading-5 text-gray-400">
          Charging duration is calculated automatically. Energy and cost are manually entered final readings. Live power, voltage and battery telemetry require a connected vehicle or charging station API.
        </p>
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
      <p className="mt-2 text-2xl font-bold">{value}</p>
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
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function ChargingRow({
  station,
  date,
  duration,
  energy,
  cost,
  status,
}: {
  station: string;
  date: string;
  duration: string;
  energy: string;
  cost: string;
  status: string;
}) {
  const isActive = status === "in_progress";

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-5 text-sm font-semibold">{station}</td>
      <td className="py-5 text-sm text-gray-500">{date}</td>
      <td className="py-5 text-sm text-gray-500">{duration}</td>
      <td className="py-5 text-sm font-medium">{energy}</td>
      <td className="py-5 text-sm font-medium">{cost}</td>
      <td className="py-5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            isActive
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <CheckCircle2 size={13} />
          {status.replace("_", " ")}
        </span>
      </td>
    </tr>
  );
}

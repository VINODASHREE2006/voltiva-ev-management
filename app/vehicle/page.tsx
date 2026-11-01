"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BatteryCharging,
  Car,
  Gauge,
  Pencil,
  Plus,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { createClient } from "../../utils/supabase/client";

type Vehicle = {
  id: string;
  user_id: string;
  vehicle_name: string;
  model: string | null;
  battery_capacity_kwh: number | null;
  battery_percentage: number;
  driving_range_km: number | null;
  created_at: string;
};

type SupabaseErrorLike = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const supabaseError = error as SupabaseErrorLike;

    const parts = [
      supabaseError.message,
      supabaseError.details,
      supabaseError.hint,
      supabaseError.code ? `Code: ${supabaseError.code}` : "",
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(" — ");
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [vehicleName, setVehicleName] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [battery, setBattery] = useState("100");
  const [range, setRange] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        setUserId(null);
        setVehicles([]);
        setError("Please log in before managing your vehicles.");
        return;
      }

      setUserId(authData.user.id);

      const { data, error: queryError } = await supabase
        .from("vehicles")
        .select(
          "id, user_id, vehicle_name, model, battery_capacity_kwh, battery_percentage, driving_range_km, created_at"
        )
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setVehicles((data ?? []) as Vehicle[]);
    } catch (err) {
      console.error("Load vehicles error:", err);
      setError(
        getErrorMessage(err, "Unable to load vehicles.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVehicles();
  }, [loadVehicles]);

  function resetForm() {
    setEditingId(null);
    setVehicleName("");
    setModel("");
    setCapacity("");
    setBattery("100");
    setRange("");
  }

  function handleStartEdit(vehicle: Vehicle) {
    setEditingId(vehicle.id);
    setVehicleName(vehicle.vehicle_name);
    setModel(vehicle.model ?? "");

    setCapacity(
      vehicle.battery_capacity_kwh == null
        ? ""
        : String(vehicle.battery_capacity_kwh)
    );

    setBattery(String(vehicle.battery_percentage));

    setRange(
      vehicle.driving_range_km == null
        ? ""
        : String(vehicle.driving_range_km)
    );

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    resetForm();
    setError("");
    setMessage("");
  }

  async function handleSaveVehicle(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const vehicleNameValue = vehicleName.trim();
      const batteryValue = Number(battery);

      const capacityValue =
        capacity.trim() === "" ? null : Number(capacity);

      const rangeValue =
        range.trim() === "" ? null : Number(range);

      if (!vehicleNameValue) {
        throw new Error("Vehicle name is required.");
      }

      if (
        battery.trim() === "" ||
        !Number.isInteger(batteryValue) ||
        batteryValue < 0 ||
        batteryValue > 100
      ) {
        throw new Error(
          "Battery percentage must be a whole number from 0 to 100."
        );
      }

      if (
        capacityValue !== null &&
        (!Number.isFinite(capacityValue) || capacityValue <= 0)
      ) {
        throw new Error(
          "Battery capacity must be greater than 0."
        );
      }

      if (
        rangeValue !== null &&
        (!Number.isFinite(rangeValue) || rangeValue < 0)
      ) {
        throw new Error(
          "Driving range must be 0 or greater."
        );
      }

      const supabase = createClient();

      // Always retrieve the currently authenticated user.
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const currentUserId = authData.user.id;

      setUserId(currentUserId);

      const vehiclePayload = {
        vehicle_name: vehicleNameValue,
        model: model.trim() || null,
        battery_capacity_kwh: capacityValue,
        battery_percentage: batteryValue,
        driving_range_km: rangeValue,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("vehicles")
          .update(vehiclePayload)
          .eq("id", editingId)
          .eq("user_id", currentUserId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("vehicles")
          .insert({
            ...vehiclePayload,
            user_id: currentUserId,
          });

        if (insertError) throw insertError;
      }

      const successMessage = editingId
        ? "Vehicle updated successfully!"
        : "Vehicle saved successfully!";

      resetForm();

      await loadVehicles();

      setMessage(successMessage);
    } catch (err) {
      console.error("Vehicle save error:", err);

      setError(
        getErrorMessage(err, "Unable to save vehicle.")
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteVehicle(id: string) {
    if (!userId) {
      setError("Please sign in before deleting a vehicle.");
      return;
    }

    if (!window.confirm("Delete this vehicle?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const supabase = createClient();

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const { error: deleteError } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id)
        .eq("user_id", authData.user.id);

      if (deleteError) throw deleteError;

      if (editingId === id) {
        resetForm();
      }

      await loadVehicles();

      setMessage("Vehicle deleted successfully.");
    } catch (err) {
      console.error("Delete vehicle error:", err);

      setError(
        getErrorMessage(err, "Unable to delete vehicle.")
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f5] text-[#17201b]">
      <div className="mx-auto max-w-7xl p-5 md:p-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Vehicle Management
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              My Vehicles
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add vehicles and manage their saved battery information.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Supabase Database
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">

          {/* Add / Edit Vehicle Form */}
          <section className="h-fit rounded-3xl border border-[#e2e7e2] bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  {editingId ? (
                    <Pencil size={20} />
                  ) : (
                    <Plus size={22} />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    {editingId ? "Edit vehicle" : "Add a vehicle"}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {editingId
                      ? "Update saved vehicle details."
                      : "Information will be saved to PostgreSQL."}
                  </p>
                </div>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50"
                >
                  <X size={14} />
                  Cancel
                </button>
              )}
            </div>

            <form
              onSubmit={handleSaveVehicle}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Vehicle name *
                </label>

                <input
                  required
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  placeholder="e.g. Tata Nexon EV"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Model / variant
                </label>

                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Long Range"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Battery capacity (kWh)
                </label>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 40.5"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Battery (%)
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="1"
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Range (km)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {message && (
                <p
                  role="status"
                  className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"
                >
                  {message}
                </p>
              )}

              {error && (
                <p
                  role="alert"
                  className="break-words rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving || loading || !userId}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editingId ? (
                    <Pencil size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Vehicle"
                      : "Save Vehicle"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!userId && !loading && (
                <p className="text-xs text-gray-500">
                  Log in with your Supabase account to save vehicles.
                </p>
              )}
            </form>
          </section>

          {/* Saved Vehicles */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Saved vehicles
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {vehicles.length} vehicle
                  {vehicles.length === 1 ? "" : "s"} in your account
                </p>
              </div>

              <button
                onClick={() => void loadVehicles()}
                type="button"
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                Loading your vehicles...
              </div>
            ) : vehicles.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <Car
                  className="mx-auto text-gray-400"
                  size={36}
                />

                <h3 className="mt-4 font-bold">
                  No vehicles added yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Use the form to save your first vehicle.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <article
                    key={vehicle.id}
                    className={`rounded-3xl border bg-white p-6 shadow-sm transition ${
                      editingId === vehicle.id
                        ? "border-emerald-500 ring-2 ring-emerald-500/10"
                        : "border-[#e2e7e2]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                          <Car size={24} />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold">
                            {vehicle.vehicle_name}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {vehicle.model || "Model not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(vehicle)}
                          aria-label={`Edit ${vehicle.vehicle_name}`}
                          className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => void deleteVehicle(vehicle.id)}
                          aria-label={`Delete ${vehicle.vehicle_name}`}
                          className="rounded-xl p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-[#f6f8f6] p-4">
                        <BatteryCharging
                          size={19}
                          className="text-emerald-700"
                        />

                        <p className="mt-3 text-xs text-gray-500">
                          Battery
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          {vehicle.battery_percentage}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f6f8f6] p-4">
                        <Zap
                          size={19}
                          className="text-emerald-700"
                        />

                        <p className="mt-3 text-xs text-gray-500">
                          Capacity
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          {vehicle.battery_capacity_kwh ?? "—"}
                          <span className="ml-1 text-xs font-medium">
                            kWh
                          </span>
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#f6f8f6] p-4">
                        <Gauge
                          size={19}
                          className="text-emerald-700"
                        />

                        <p className="mt-3 text-xs text-gray-500">
                          Range
                        </p>

                        <p className="mt-1 text-xl font-bold">
                          {vehicle.driving_range_km ?? "—"}
                          <span className="ml-1 text-xs font-medium">
                            km
                          </span>
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-400">
                      Saved on{" "}
                      {new Date(
                        vehicle.created_at
                      ).toLocaleDateString()}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <p className="mt-6 text-xs leading-5 text-gray-400">
          Battery and range values are entered manually. Live voltage,
          current, temperature, and charging telemetry require a vehicle
          data source or hardware integration.
        </p>
      </div>
    </main>
  );
}
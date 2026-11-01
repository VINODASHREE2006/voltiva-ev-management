-- ==============================================================================
-- Voltiva Migration: Charging Sessions & Charging Stations (Final)
-- Tables: public.charging_stations, public.charging_sessions
-- Security: Strict User Isolation RLS, Hardened Database-Level Vehicle Trigger,
--           Explicit Role Grants & Revoked Direct Function Execution
-- ==============================================================================

-- 1. CHARGING STATIONS TABLE
CREATE TABLE IF NOT EXISTS public.charging_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  distance_km numeric(4,1) NOT NULL DEFAULT 0.0 CHECK (distance_km >= 0),
  power_kw integer NOT NULL DEFAULT 50 CHECK (power_kw > 0),
  connector_type text NOT NULL DEFAULT 'CCS2',
  available_ports integer NOT NULL DEFAULT 0 CHECK (available_ports >= 0),
  total_ports integer NOT NULL DEFAULT 4 CHECK (total_ports >= 0),
  status text NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Limited', 'Busy', 'Offline')),
  is_sample_data boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_ports_available_le_total CHECK (available_ports <= total_ports),
  CONSTRAINT uq_charging_stations_name_location UNIQUE (name, location)
);

-- Index for station status filtering
CREATE INDEX IF NOT EXISTS idx_charging_stations_status
  ON public.charging_stations(status);

-- Enable RLS on charging_stations
ALTER TABLE public.charging_stations ENABLE ROW LEVEL SECURITY;

-- Stations RLS: Public read-only access (anyone can view station directory)
DROP POLICY IF EXISTS "Public read access to charging stations" ON public.charging_stations;
CREATE POLICY "Public read access to charging stations"
  ON public.charging_stations FOR SELECT
  USING (true);

-- Explicit Role Grants for charging_stations (subject to RLS)
GRANT SELECT ON public.charging_stations TO anon, authenticated;


-- 2. CHARGING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.charging_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  station_name text NOT NULL,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'scheduled', 'cancelled')),
  energy_kwh numeric(6,2) NOT NULL DEFAULT 0.00 CHECK (energy_kwh >= 0),
  cost_inr numeric(8,2) NOT NULL DEFAULT 0.00 CHECK (cost_inr >= 0),
  duration_minutes integer NOT NULL DEFAULT 0 CHECK (duration_minutes >= 0),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for charging_sessions performance
CREATE INDEX IF NOT EXISTS idx_charging_sessions_user_id
  ON public.charging_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_charging_sessions_vehicle_id
  ON public.charging_sessions(vehicle_id);

CREATE INDEX IF NOT EXISTS idx_charging_sessions_started_at
  ON public.charging_sessions(started_at DESC);

-- Vehicle ownership validation trigger (database-level integrity)
-- Hardened with SECURITY DEFINER and search_path = '' to prevent search path hijacking
CREATE OR REPLACE FUNCTION public.validate_charging_session_vehicle_ownership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.vehicle_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE id = NEW.vehicle_id AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Vehicle does not belong to the authenticated user';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Revoke direct execution privileges from client roles (trigger continues to execute normally)
REVOKE EXECUTE ON FUNCTION public.validate_charging_session_vehicle_ownership() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_validate_charging_session_vehicle ON public.charging_sessions;
CREATE TRIGGER trg_validate_charging_session_vehicle
  BEFORE INSERT OR UPDATE ON public.charging_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_charging_session_vehicle_ownership();

-- Enable RLS on charging_sessions
ALTER TABLE public.charging_sessions ENABLE ROW LEVEL SECURITY;

-- Charging sessions RLS: Strict user isolation + vehicle ownership check
DROP POLICY IF EXISTS "Users can view their own charging sessions" ON public.charging_sessions;
CREATE POLICY "Users can view their own charging sessions"
  ON public.charging_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own charging sessions" ON public.charging_sessions;
CREATE POLICY "Users can insert their own charging sessions"
  ON public.charging_sessions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      vehicle_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.vehicles v
        WHERE v.id = vehicle_id AND v.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can update their own charging sessions" ON public.charging_sessions;
CREATE POLICY "Users can update their own charging sessions"
  ON public.charging_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND (
      vehicle_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.vehicles v
        WHERE v.id = vehicle_id AND v.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can delete their own charging sessions" ON public.charging_sessions;
CREATE POLICY "Users can delete their own charging sessions"
  ON public.charging_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Explicit Role Grants for charging_sessions (strictly subject to RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.charging_sessions TO authenticated;


-- 3. DEMONSTRATION / SAMPLE CHARGING STATIONS DATA
-- NOTE: These 4 stations are inserted as demonstration/sample data only.
-- Their locations, power ratings, and stall counts are illustrative and not verified live readings.
INSERT INTO public.charging_stations (
  name, location, distance_km, power_kw, connector_type, available_ports, total_ports, status, is_sample_data
)
VALUES
  ('GreenCharge Hub', 'Sathyamangalam Main Road', 2.4, 60, 'CCS2 Fast Charger', 4, 4, 'Available', true),
  ('EV Power Station', 'Bannari Road', 4.8, 120, 'CCS2 / Type 2 Dual', 2, 4, 'Available', true),
  ('ChargePoint Sathy', 'Coimbatore Main Road', 7.2, 50, 'Type 2 AC', 1, 2, 'Limited', true),
  ('FastVolt Station', 'Bhavani Road', 9.5, 150, 'Ultra-Fast DC', 0, 4, 'Busy', true)
ON CONFLICT (name, location) DO NOTHING;

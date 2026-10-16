-- Catalog and future private calculation records. No personal data is seeded.
BEGIN;
CREATE TABLE IF NOT EXISTS public.greenstep_carbon_factors (
  id text PRIMARY KEY, dataset_id text NOT NULL, source_row integer NOT NULL,
  source_number integer NOT NULL, sector text NOT NULL, subsector text NOT NULL,
  activity_name text NOT NULL, original_value numeric NOT NULL CHECK (original_value >= 0),
  original_unit text NOT NULL, indicator text NOT NULL, source_citation text NOT NULL,
  source_years text NOT NULL, factor_kg_co2e_per_unit numeric NOT NULL CHECK (factor_kg_co2e_per_unit >= 0),
  quantity_unit text NOT NULL, period_basis text NOT NULL,
  app_status text NOT NULL CHECK (app_status IN ('conditional_mass_estimate','reference_only')),
  review_notes text NOT NULL,
  UNIQUE(dataset_id,source_number),
  CHECK (factor_kg_co2e_per_unit = original_value * 1000)
);
CREATE TABLE IF NOT EXISTS public.greenstep_carbon_activity_mapping (
  activity_key text PRIMARY KEY,
  factor_id text REFERENCES public.greenstep_carbon_factors(id),
  status text NOT NULL CHECK (status IN ('conditional','review_required','no_matching_factor')),
  required_inputs text NOT NULL, reason text NOT NULL,
  CHECK (status <> 'conditional' OR factor_id IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS public.greenstep_carbon_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participation_id text NOT NULL, activity_key text NOT NULL,
  status text NOT NULL CHECK (status IN ('estimated','not_calculated')),
  factor_id text REFERENCES public.greenstep_carbon_factors(id),
  factor_kg_co2e_per_unit numeric,
  baseline_waste_kg numeric CHECK (baseline_waste_kg >= 0),
  actual_waste_kg numeric CHECK (actual_waste_kg >= 0),
  reduced_quantity_kg numeric CHECK (reduced_quantity_kg >= 0),
  estimated_kg_co2e numeric CHECK (estimated_kg_co2e >= 0),
  calculation_version text NOT NULL, evidence_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, participation_id),
  CHECK ((status = 'not_calculated' AND estimated_kg_co2e IS NULL) OR
    (status = 'estimated' AND factor_id IS NOT NULL AND factor_kg_co2e_per_unit IS NOT NULL
      AND baseline_waste_kg IS NOT NULL AND actual_waste_kg IS NOT NULL
      AND reduced_quantity_kg IS NOT NULL AND estimated_kg_co2e IS NOT NULL
      AND baseline_waste_kg >= actual_waste_kg
      AND reduced_quantity_kg = baseline_waste_kg - actual_waste_kg
      AND estimated_kg_co2e = round(reduced_quantity_kg * factor_kg_co2e_per_unit, 6)))
);
ALTER TABLE public.greenstep_carbon_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.greenstep_carbon_activity_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.greenstep_carbon_estimates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read carbon reference" ON public.greenstep_carbon_factors;
CREATE POLICY "Read carbon reference" ON public.greenstep_carbon_factors FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Read carbon mapping" ON public.greenstep_carbon_activity_mapping;
CREATE POLICY "Read carbon mapping" ON public.greenstep_carbon_activity_mapping FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Read own carbon estimates" ON public.greenstep_carbon_estimates;
CREATE POLICY "Read own carbon estimates" ON public.greenstep_carbon_estimates FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
REVOKE ALL ON public.greenstep_carbon_factors, public.greenstep_carbon_activity_mapping, public.greenstep_carbon_estimates FROM anon, authenticated;
GRANT SELECT ON public.greenstep_carbon_factors, public.greenstep_carbon_activity_mapping TO anon, authenticated;
GRANT SELECT ON public.greenstep_carbon_estimates TO authenticated;
GRANT ALL ON public.greenstep_carbon_factors, public.greenstep_carbon_activity_mapping, public.greenstep_carbon_estimates TO service_role;
-- Future trusted server must validate measurements and recompute from the catalog.
-- Do not accept a browser-supplied result or use this table to award points automatically.

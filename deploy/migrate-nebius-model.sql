-- Operator-authorized migration for the November 2026 Nebius retirement.
-- Pause inference and drain active work before applying alongside the new runtime.
-- Historical approvals, usage, revoked policies and other providers stay unchanged.
BEGIN;

UPDATE assistant_scope_policies
SET model = 'nvidia/Nemotron-3.5-Super-VL',
    revision = revision + 1,
    updated_at = clock_timestamp()
WHERE provider_profile = 'nebius-token-factory'
  AND model = 'nvidia/nemotron-3-super-120b-a12b'
  AND enabled = true AND revoked_at IS NULL;

UPDATE assistant_policy_provider_configuration
SET model = 'nvidia/Nemotron-3.5-Super-VL', updated_at = clock_timestamp()
WHERE provider_profile = 'nebius-token-factory'
  AND model = 'nvidia/nemotron-3-super-120b-a12b';

COMMIT;

\set ON_ERROR_STOP on
-- Run in the maintenance database, never against application tables.
CREATE TEMP TABLE assistant_scope_policies (
  id integer PRIMARY KEY, provider_profile text, model text,
  enabled boolean, revoked_at timestamptz, revision bigint, updated_at timestamptz
);
CREATE TEMP TABLE assistant_policy_provider_configuration (
  provider_profile text, model text, updated_at timestamptz
);
INSERT INTO assistant_scope_policies VALUES
  (1, 'nebius-token-factory', 'nvidia/nemotron-3-super-120b-a12b', true, NULL, 1, now()),
  (2, 'nebius-token-factory', 'nvidia/nemotron-3-super-120b-a12b', false, now(), 1, now()),
  (3, 'nvidia-hosted-nim', 'nvidia/nemotron-3-super-120b-a12b', true, NULL, 1, now()),
  (4, 'nebius-token-factory', 'another-model', true, NULL, 1, now());
INSERT INTO assistant_policy_provider_configuration VALUES
  ('nebius-token-factory', 'nvidia/nemotron-3-super-120b-a12b', now());
\ir ../migrate-nebius-model.sql
\ir ../migrate-nebius-model.sql
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM assistant_scope_policies WHERE id = 1
    AND model = 'nvidia/Nemotron-3.5-Super-VL' AND revision = 2) THEN
    RAISE EXCEPTION 'Active policy did not migrate exactly once';
  END IF;
  IF EXISTS (SELECT 1 FROM assistant_scope_policies WHERE id IN (2, 3)
    AND (model <> 'nvidia/nemotron-3-super-120b-a12b' OR revision <> 1)) THEN
    RAISE EXCEPTION 'Revoked or other-provider policy changed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM assistant_scope_policies WHERE id = 4
    AND model = 'another-model' AND revision = 1) THEN
    RAISE EXCEPTION 'Unrelated model changed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM assistant_policy_provider_configuration
    WHERE model = 'nvidia/Nemotron-3.5-Super-VL') THEN
    RAISE EXCEPTION 'Default provider did not migrate';
  END IF;
END $$;

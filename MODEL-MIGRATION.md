# Nebius model migration — November 4, 2026

Threadnest is migrating from **NVIDIA Nemotron 3 Super**
(`nvidia/nemotron-3-super-120b-a12b`) to **NVIDIA Nemotron 3.5 Super VL**
(`nvidia/Nemotron-3.5-Super-VL`) on Nebius Token Factory Serverless.

## Reason

Nebius is removing the old model from its Serverless API and Playground on
**November 9, 2026**, and names Nemotron 3.5 Super VL as its recommended
replacement. Requests are not automatically rerouted. See the
[official deprecation notice](https://docs.tokenfactory.nebius.com/model-deprecations-november-2026).

## Changes

- Updated backend validation, Hermes bridge and sandbox route, frontend defaults,
  API examples, deployment bootstrap, environment example and test fixtures.
- Retained Nebius's OpenAI-compatible endpoint:
  `https://api.tokenfactory.nebius.com/v1`.
- Increased the conservative input credit reservation from 262,144 to 1,048,576
  tokens and versioned the bound. NVIDIA documents a context window of up to
  1,048,576 tokens for the replacement. Serialized bytes do not provide a safe
  token bound. Existing output limits, call limits and spending caps remain.
- Existing stored model disclosures, approvals and usage records retain their
  original model IDs. New approvals must disclose the replacement model.
- The replacement's vision capability does not add image/video support to
  Threadnest; this change retains the existing text and tool workflows.

Nebius's [October 16 announcement](https://nebius.com/blog/posts/three-new-open-weight-models-from-us-companies-give-builders-more-choice)
lists the replacement at **USD 0.30 per million input tokens** and
**USD 0.90 per million output tokens**, matching the prior deployed rates.
The larger reservation can cause low spending caps to deny requests before
inference; actual token usage is still settled after the call. No budgets are
automatically increased. AWS infrastructure continues to consume project credits,
and Nebius inference is billed separately.

Context reference: [NVIDIA NIM model guide](https://docs.nvidia.com/nim/large-language-models/2.0.13/get-started/advanced/get-started-nemotron-3.5-super-vl.html).

## Deployment and verification

Pre-deployment validation:

- Backend: 185 suites and 1,103 tests passed; the final configuration/credit
  regression check passed 58 tests, including rejecting the retired model.
- Frontend unit and preview API tests passed; production frontend/backend build passed.
- Hermes bridge: 93 tests passed and 4 platform/runtime tests skipped.
- Deployment and Compose boundary checks: 34 passed.
- Integration tests: 79 passed; 89 database-dependent tests skipped because a
  dedicated integration database was not configured. Production data was not
  used as a test database.
- Live Nebius smoke: authenticated model availability, forced function calling,
  argument validation, tool-result round trip and final text response passed.
  The two synthetic calls used 408 input and 107 output tokens, approximately
  USD 0.0002199 at the published rates.

The AWS deployment receipt will be added after the host update.
The AWS update uses the existing Sydney host, Compose project, persistent
storage, private credentials and protected Cloudflare origin. No AWS resources
or paid-plan features are added. Retain the previous image and private runtime
configuration for rollback; the retired route is only usable before removal.

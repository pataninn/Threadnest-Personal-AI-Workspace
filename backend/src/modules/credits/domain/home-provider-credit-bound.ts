import { NEBIUS_PROVIDER_PROFILE } from '@/modules/ai-runs/domain/model-provider-profile';

// Reserve the full model context because serialized request bytes do not bound token usage.
// https://docs.nvidia.com/nim/large-language-models/2.0.13/get-started/advanced/get-started-nemotron-3.5-super-vl.html
export const HOME_NEBIUS_NEMOTRON_BOUND = {
  providerProfile: NEBIUS_PROVIDER_PROFILE,
  model: 'nvidia/Nemotron-3.5-Super-VL',
  maxInputTokens: 1_048_576,
  maxOutputTokens: 512,
  version: 'nebius-nemotron-3.5-context-v2'
} as const;

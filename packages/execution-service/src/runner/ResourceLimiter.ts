export interface ResourceLimits {
  memoryMb: number;
  cpuQuota: number;
  cpuPeriod: number;
  pidsLimit: number;
  timeoutMs: number;
  maxOutputBytes: number;
}

export const DEFAULT_LIMITS: ResourceLimits = {
  memoryMb: 256,
  cpuQuota: 50000,
  cpuPeriod: 100000,
  pidsLimit: 64,
  timeoutMs: 10000,
  maxOutputBytes: 65536,
};

export function getLimits(overrides?: Partial<ResourceLimits>): ResourceLimits {
  return { ...DEFAULT_LIMITS, ...overrides };
}

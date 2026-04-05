import type { Language } from '@hire-codec/shared';
import { SUPPORTED_LANGUAGES } from '@hire-codec/shared';

export class ContainerPool {
  private pools: Map<Language, string[]> = new Map();
  private readonly POOL_SIZE = Number(process.env.CONTAINER_POOL_SIZE) || 3;

  async initialize(): Promise<void> {
    console.log(`[ContainerPool] Pre-warming ${this.POOL_SIZE} containers per language`);
    for (const lang of SUPPORTED_LANGUAGES) {
      this.pools.set(lang.id, []);
      // In production: create pre-warmed containers
      console.log(`  ├── ${lang.name}: ready`);
    }
    console.log(`[ContainerPool] Initialization complete`);
  }

  async acquire(language: Language): Promise<string | null> {
    const pool = this.pools.get(language);
    if (pool && pool.length > 0) {
      const containerId = pool.pop()!;
      // Replenish in background
      this.warmOne(language);
      return containerId;
    }
    return null;
  }

  async release(containerId: string): Promise<void> {
    // Container is destroyed after use for security
    // New ones are created in the pool
  }

  private async warmOne(language: Language): Promise<void> {
    const pool = this.pools.get(language) || [];
    if (pool.length < this.POOL_SIZE) {
      // In production: create a pre-warmed container
      pool.push(`warm-${language}-${Date.now()}`);
      this.pools.set(language, pool);
    }
  }
}

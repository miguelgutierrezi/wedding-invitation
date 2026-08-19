/**
 * In-memory sliding-window rate limiter for server actions / RSC.
 *
 * Best-effort on multi-instance hosts (e.g. Vercel): each isolate has its own
 * map. Prefer Cloudflare / edge WAF for global abuse protection; this layer
 * still slows bursty bots on a single instance.
 */

export type RateLimitOptions = {
    /** Max successful consumptions in the window. */
    limit: number;
    /** Window length in milliseconds. */
    windowMs: number;
    /** Optional clock for tests. */
    now?: () => number;
};

export type RateLimitResult = {
    ok: boolean;
    remaining: number;
    retryAfterMs: number;
};

type Bucket = {
    timestamps: number[];
};

const buckets = new Map<string, Bucket>();

const MAX_KEYS = 5_000;

function pruneBucket(bucket: Bucket, windowStart: number): void {
    bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);
}

function evictIfNeeded(): void {
    if (buckets.size <= MAX_KEYS) {
        return;
    }

    const overflow = buckets.size - MAX_KEYS;
    const keys = buckets.keys();
    for (let i = 0; i < overflow; i += 1) {
        const key = keys.next().value;
        if (key === undefined) {
            break;
        }
        buckets.delete(key);
    }
}

/**
 * Records one attempt for `key`. Returns whether it is within the limit.
 */
export function consumeRateLimit(
    key: string,
    options: RateLimitOptions,
): RateLimitResult {
    const now = options.now?.() ?? Date.now();
    const windowStart = now - options.windowMs;
    let bucket = buckets.get(key);

    if (!bucket) {
        bucket = {timestamps: []};
        buckets.set(key, bucket);
        evictIfNeeded();
    }

    pruneBucket(bucket, windowStart);

    if (bucket.timestamps.length >= options.limit) {
        const oldest = bucket.timestamps[0] ?? now;
        return {
            ok: false,
            remaining: 0,
            retryAfterMs: Math.max(0, oldest + options.windowMs - now),
        };
    }

    bucket.timestamps.push(now);

    return {
        ok: true,
        remaining: Math.max(0, options.limit - bucket.timestamps.length),
        retryAfterMs: 0,
    };
}

/** Test helper — clears all buckets. */
export function resetRateLimitBuckets(): void {
    buckets.clear();
}

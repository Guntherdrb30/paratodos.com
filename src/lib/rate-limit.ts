type RateLimitEntry = {
    count: number
    resetAt: number
}

type ConsumeRateLimitOptions = {
    scope: string
    key: string
    limit: number
    windowMs: number
}

type RateLimitResult = {
    allowed: boolean
    remaining: number
    retryAfterSeconds: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

function getBucketKey(scope: string, key: string) {
    return `${scope}:${key}`
}

function getRetryAfterSeconds(resetAt: number) {
    return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
}

function cleanupExpiredEntries() {
    const now = Date.now()

    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt <= now) {
            rateLimitStore.delete(key)
        }
    }
}

export function consumeRateLimit({
    scope,
    key,
    limit,
    windowMs,
}: ConsumeRateLimitOptions): RateLimitResult {
    cleanupExpiredEntries()

    const now = Date.now()
    const bucketKey = getBucketKey(scope, key)
    const existing = rateLimitStore.get(bucketKey)

    if (!existing || existing.resetAt <= now) {
        rateLimitStore.set(bucketKey, {
            count: 1,
            resetAt: now + windowMs,
        })

        return {
            allowed: true,
            remaining: Math.max(0, limit - 1),
            retryAfterSeconds: Math.ceil(windowMs / 1000),
        }
    }

    if (existing.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: getRetryAfterSeconds(existing.resetAt),
        }
    }

    existing.count += 1
    rateLimitStore.set(bucketKey, existing)

    return {
        allowed: true,
        remaining: Math.max(0, limit - existing.count),
        retryAfterSeconds: getRetryAfterSeconds(existing.resetAt),
    }
}

export function resetRateLimit(scope: string, key: string) {
    rateLimitStore.delete(getBucketKey(scope, key))
}

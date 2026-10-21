import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IdempotentRequestOptions extends AxiosRequestConfig {
    /**
     * Optional custom idempotency key (UUID v4).
     * If not provided, a new random UUID v4 will be generated.
     */
    idempotencyKey?: string;
    /**
     * Maximum retry attempts for transient network issues or 409 in-progress lock.
     * Defaults to 3.
     */
    maxRetries?: number;
    /**
     * Milliseconds to wait before retrying when backend returns 409 in-progress.
     * Defaults to 1500ms.
     */
    inProgressDelayMs?: number;
    /**
     * Milliseconds to wait before retrying when network drops or timeout occurs.
     * Defaults to 1000ms.
     */
    networkRetryDelayMs?: number;
    /**
     * Callback invoked before each retry attempt.
     */
    onRetry?: (attempt: number, reason: 'network_timeout' | 'in_progress', key: string) => void;
}

/**
 * Generate a cryptographically secure UUID v4 string.
 * Falls back to an RFC4122-compliant generator if crypto.randomUUID is not present.
 */
export const generateIdempotencyKey = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes an HTTP mutation request with Idempotency-Key and automated retries
 * for network drops, timeouts, 504 gateways, and 409 "in-progress" locking.
 */
export async function executeIdempotentRequest<T>(
    requestFn: (config: AxiosRequestConfig) => Promise<AxiosResponse<T>>,
    options: IdempotentRequestOptions = {}
): Promise<AxiosResponse<T>> {
    const {
        idempotencyKey = generateIdempotencyKey(),
        maxRetries = 3,
        timeout = 10000,
        inProgressDelayMs = 1500,
        networkRetryDelayMs = 1000,
        onRetry,
        headers,
        ...restConfig
    } = options;

    let attempt = 0;

    while (true) {
        attempt++;
        const requestConfig: AxiosRequestConfig = {
            ...restConfig,
            timeout,
            headers: {
                ...headers,
                'Idempotency-Key': idempotencyKey,
            },
        };

        try {
            const response = await requestFn(requestConfig);
            const isCachedReplay = response.headers?.['x-cache-lookup'] === 'HIT';
            if (isCachedReplay) {
                console.info(`[Idempotency] Request replayed from cache (HIT) with key: ${idempotencyKey}`);
            }
            return response;
        } catch (error: any) {
            const axiosError = error as AxiosError<any>;
            const hasResponse = Boolean(axiosError.response);
            const status = axiosError.response?.status;
            const data = axiosError.response?.data;

            // 1. Network Error, Connection Timeout (ECONNABORTED), or 504 Gateway Timeout
            const isNetworkOrTimeout =
                !hasResponse ||
                axiosError.code === 'ECONNABORTED' ||
                axiosError.message?.toLowerCase().includes('timeout') ||
                axiosError.message?.toLowerCase().includes('network error') ||
                status === 504;

            if (isNetworkOrTimeout) {
                if (attempt <= maxRetries) {
                    console.warn(
                        `[Idempotency] Network error / timeout detected. Retrying request with same Idempotency-Key (${idempotencyKey}) - attempt ${attempt}/${maxRetries}...`
                    );
                    onRetry?.(attempt, 'network_timeout', idempotencyKey);
                    await sleep(networkRetryDelayMs);
                    continue;
                }
                throw error;
            }

            // 2. 409 Conflict: Check if it's "in-progress" vs resource contention
            if (status === 409) {
                const detailStr = String(data?.detail || data?.message || '');
                const isInProgress =
                    detailStr.includes('đang được xử lý') ||
                    detailStr.toLowerCase().includes('in progress') ||
                    detailStr.toLowerCase().includes('is being processed') ||
                    detailStr.toLowerCase().includes('processing');

                if (isInProgress) {
                    if (attempt <= maxRetries) {
                        console.warn(
                            `[Idempotency] Request is currently being processed. Waiting ${inProgressDelayMs}ms before retrying with key ${idempotencyKey} - attempt ${attempt}/${maxRetries}...`
                        );
                        onRetry?.(attempt, 'in_progress', idempotencyKey);
                        await sleep(inProgressDelayMs);
                        continue;
                    }
                }
                // If not in-progress (e.g. table already booked) or retries exhausted, rethrow
                throw error;
            }

            // 3. 422 Payload Mismatch or Validation Error: Do not retry
            if (status === 422) {
                console.error(
                    `[Idempotency] 422 Payload Mismatch or validation error encountered for key: ${idempotencyKey}`,
                    data
                );
                throw error;
            }

            // 4. Any other HTTP error (400, 401, 403, 500, etc.): Do not retry
            throw error;
        }
    }
}
